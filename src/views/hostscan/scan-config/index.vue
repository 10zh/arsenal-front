<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', 'menu.list.scan.config']" />
    <a-card class="general-card" :title="$t('menu.list.scan.config')">
      <a-row ref="searchRef">
        <a-col :flex="1">
          <a-form
            :model="pagination"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item
                  field="status"
                  :label="$t('host.scan.config.configName')"
                >
                  <a-auto-complete
                    v-model="pagination.configName"
                    :data="autoCompleteData"
                    placeholder="please enter name"
                    @focus="
                      searchSingleField(
                        'host_hsc',
                        'host_hsc_cn',
                        pagination.configName
                      )
                    "
                    @change="
                      searchSingleField(
                        'host_hsc',
                        'host_hsc_cn',
                        pagination.configName
                      )
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="status"
                  :label="$t('host.scan.config.engineName')"
                >
                  <a-auto-complete
                    v-model="pagination.engineName"
                    :data="autoCompleteData"
                    placeholder="please enter engine name"
                    @focus="
                      searchSingleField(
                        'scan_se',
                        'scan_en',
                        pagination.engineName
                      )
                    "
                    @change="
                      searchSingleField(
                        'scan_se',
                        'scan_en',
                        pagination.engineName
                      )
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item
                  field="status"
                  :label="$t('host.scan.config.templateName')"
                >
                  <a-auto-complete
                    v-model="pagination.templateName"
                    :data="autoCompleteData"
                    placeholder="please enter template name"
                    @focus="
                      searchSingleField(
                        'host_hst',
                        'host_hst_tn',
                        pagination.templateName
                      )
                    "
                    @change="
                      searchSingleField(
                        'host_hst',
                        'host_hst_tn',
                        pagination.templateName
                      )
                    "
                  />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-button
                  type="primary"
                  default-checked
                  style="margin: 0 10px"
                  @click="initConfigList"
                >
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ $t('searchTable.form.search') }}
                </a-button>
                <a-button style="margin: 0 10px" @click="reset">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  {{ $t('searchTable.form.reset') }}
                </a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>

      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col
          :span="24"
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <a-space>
            <a-button type="primary" @click="handleAdd('add')">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.scanConfig.create') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <!--主机扫描配置数据表格-->
      <a-table
        row-key="id"
        :columns="columns"
        :bordered="false"
        :data="tableData"
        :row-selection="rowSelection"
        :style="'height:' + cardHeight + 'px'"
        :pagination="false"
        @sorter-change="sortedChangeEvent"
      >
        <template #configName="{ record }">
          <a-link href="#" @click="handleConfigDialog(record)">{{
            record.configName
          }}</a-link>
        </template>
        <template #status="{ record }">
          <a-tag
            size="small"
            :color="getStatusColor(record.lastScanStatic.scanStatus)"
            >{{ getStatusText(record.lastScanStatic.scanStatus) }}
          </a-tag>
        </template>
        <template #scanPress="{ record }">
          <div class="progress-wrap">
            <a-progress
              status="success"
              style="margin-right: 2px"
              :show-text="false"
              :percent="
                record.lastScanStatic.scanStatus === 6
                  ? 100
                  : record.progressNums
              "
            />
            <icon-check-circle-fill
              v-if="record.lastScanStatic.scanStatus === 6"
              style="color: green"
            />
            <icon-exclamation-circle-fill v-else style="color: #ff7d00" />
          </div>
        </template>
        <template #operations="{ record }">
          <a-button
            type="text"
            size="small"
            style="padding: 0px"
            @click="handleScan(record)"
          >
            <template #icon>
              <icon-fullscreen />
            </template>
            {{ $t('button.scan') }}
          </a-button>
          <a-button
            type="text"
            size="small"
            style="padding: 10px"
            @click="handleListener('edit', record)"
          >
            <template #icon>
              <icon-edit />
            </template>
            {{ $t('button.edit') }}
          </a-button>
        </template>
      </a-table>
      <a-pagination
        class="pagination-style"
        :total="pagination.total"
        :current="pagination.pageIndex"
        :page-size="pagination.pageSize"
        show-total
        show-jumper
        show-page-size
      />
    </a-card>
    <!-- 新增引擎对话框 -->
    <AddConfigDialog
      ref="addConfigRef"
      :dialog-type="dialogType"
      :table-row="tableRow"
      @refreshList="initConfigList"
    />
    <!-- 新增引擎对话框 -->
    <ShowConfigListDialog ref="showConfigRef" :config-id="configId" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import formatDate from '@/utils/times';
  import { Message } from '@arco-design/web-vue';
  import { getStatusColor, getStatusText } from '@/hooks/status-options';
  import { useConfigParamsStore } from '@/store';
  // 远程接口调用
  import {
    HostScanConfigRes,
    getHostScanConfigPageList,
    scanConfig,
    getScanProgress,
  } from '@/api/scan/scan-config';
  import { aotuCompleteByTableField } from '@/api/common/common';
  import AddConfigDialog from './components/add-config-dialog.vue';
  import ShowConfigListDialog from './components/show-config-list-dialog.vue';

  const { t } = useI18n();
  const cardHeight = ref<number>([]);
  const searchRef = ref();

  const dialogType = ref<string>('');
  // 当行数据
  const tableRow = ref<HostScanConfigRes>([]);
  // 配置模板表格数据
  const tableData = ref<HostScanConfigRes>([]);
  const addConfigRef = ref<InstanceType<typeof AddConfigDialog>>(null);

  // ==========================数据模块==========================
  // 扫描主机扫描配置表头
  const columns = [
    {
      title: t('host.scan.config.configName'),
      dataIndex: 'configName',
      slotName: 'configName',
    },
    {
      title: t('host.scan.config.engineName'),
      dataIndex: 'engine.engineName',
    },
    {
      title: t('host.scan.config.templateName'),
      dataIndex: 'template.templateName',
    },
    {
      title: t('host.scan.config.target'),
      dataIndex: 'target',
    },
    {
      title: t('host.scan.config.excludeTarget'),
      dataIndex: 'excludeTarget',
    },
    {
      title: t('host.scan.config.liveHostNumber'),
      dataIndex: 'lastScanStatic.liveHostNumber',
      sortable: {
        sorter: true,
        sortDirections: ['descend'],
      },
    },
    {
      title: t('host.scan.config.vulnerabilityNumber'),
      dataIndex: 'lastScanStatic.vulnerabilityNumber',
      sortable: {
        sorter: true,
        sortDirections: ['descend'],
      },
    },
    {
      title: t('host.scan.config.scanStartTime'),
      dataIndex: 'lastScanStatic.scanStartTime',
      sortable: {
        sorter: true,
        sortDirections: ['descend'],
      },
    },
    {
      title: t('host.scan.config.scanEndTime'),
      dataIndex: 'lastScanStatic.scanEndTime',
      sortable: {
        sorter: true,
        sortDirections: ['descend'],
      },
    },
    {
      title: t('host.scan.config.scanStatus'),
      dataIndex: 'lastScanStatic.scanStatus',
      slotName: 'status',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ];

  // 分页对象参数
  const pagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    order: 'desc',
    sort: 'scanStartTime',
    configName: '',
    engineName: '',
    templateName: '',
  });

  // 单个参数检索
  const singleFieldPagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 15,
    table: '',
    field: '',
    value: '',
  });

  // 配置参数存储
  const useConfigParams = useConfigParamsStore();

  // 是否展示扫描配置界面
  const showConfigRef = ref();

  // 输入框自动补全
  const autoCompleteData = ref([]);

  // ==========================数据初始化模块==========================
  // 初始化主机扫描配置列表
  const initConfigList = async () => {
    console.log(pagination.value);
    const response = await getHostScanConfigPageList(pagination.value);
    // 日期函数转换
    response.data.forEach((item) => {
      item.lastScanStatic.scanStartTime = formatDate(
        item.lastScanStatic.scanStartTime,
        'YYYY-MM-DD hh:mm:ss'
      );
      item.lastScanStatic.scanEndTime = formatDate(
        item.lastScanStatic.scanEndTime,
        'YYYY-MM-DD hh:mm:ss'
      );
    });
    tableData.value = response.data;
    // 分页参数赋值
    pagination.value.total = response.totalCount;
    pagination.value.pageIndex = response.pageIndex;
    pagination.value.pageSize = response.pageSize;
  };

  // 当页面加载时，显示数据
  onMounted(() => {
    // 初始化页面表格数据
    initConfigList();
    if (useConfigParams.isShowDialog) {
      showConfigRef.value?.setVisibleData(true);
    }
    cardHeight.value =
      document.documentElement.clientHeight -
      searchRef.value.$el.clientHeight -
      370;
    pagination.value.pageSize = Math.floor(cardHeight.value / 43);
  });

  // 新增配置
  const handleAdd = (type: string, row?: HostScanConfigRes) => {
    dialogType.value = type;
    // tableRow.value = row;
    addConfigRef.value?.setVisibleData(true);
  };
  const configId = ref<string>('');

  // 查看扫描配置的扫描记录
  const handleConfigDialog = (record: HostScanConfigRes) => {
    console.log(record);
    configId.value = record.id;
    showConfigRef.value?.setVisibleData(true);
  };

  // 行选择器
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });

  // 表格事件触发
  function handleListener(event: string, record: HostScanConfigRes) {
    dialogType.value = event;
    if (dialogType.value !== 'detail') {
      tableRow.value = record;
      addConfigRef.value?.setVisibleData(true);
    }
  }
  const timer = ref<any>(null);
  // 扫描进度
  const getScanProcessTimes = async (row: HostScanConfigRes) => {
    const data = await getScanProgress(row.scanId);
    row.progressNums = data.data.processBar;
    if (data.data.scanStatus !== 2) {
      // 如果状态不是扫描中则清除定时器
      clearInterval(timer.value);
    }
  };
  // 扫描
  const handleScan = async (row: HostScanConfigRes) => {
    const data = await scanConfig(row.id);
    if (data.success) {
      row.scanId = data.data.scanId;
      initConfigList();
      // Message.success('新增成功');
      // 每秒进行刷新进度数据
      timer.value = setInterval(() => {
        getScanProcessTimes(row);
        initConfigList();
      }, 1000);
    } else {
      Message.error(data.errMessage);
    }
  };

  // -----------------------事件触发模块-----------------------
  // 过滤后端排序字段
  function filterSortedField(field) {
    if (field === 'lastScanStatic.liveHostNumber') {
      return 'liveHostNumber';
    }
    if (field === 'lastScanStatic.vulnerabilityNumber') {
      return 'vulnerabilityNumber';
    }
    if (field === 'lastScanStatic.scanStartTime') {
      return 'scanStartTime';
    }
    if (field === 'lastScanStatic.scanEndTime') {
      return 'scanEndTime';
    }
    if (field === 'lastScanStatic.scanStatus') {
      return 'scanStatus';
    }
    return field;
  }
  // 排序事件触发 后端排序
  const sortedChangeEvent = (field, direction) => {
    direction = direction === 'descend' ? 'desc' : 'asc';
    // 过滤得到后端支持的排序字段
    field = filterSortedField(field);
    pagination.value.sort = field;
    pagination.value.order = direction;
    console.log('field: ', field, 'order: ', direction);
    // 重新刷新列表
    initConfigList();
  };
  // 重置事件
  const reset = () => {
    pagination.value.order = 'desc';
    pagination.value.sort = 'scanStartTime';
    pagination.value.configName = '';
    pagination.value.engineName = '';
    pagination.value.templateName = '';
    // 重新刷新列表
    initConfigList();
  };
  // 单个字段搜索事件
  const searchSingleField = async (table, field, value) => {
    autoCompleteData.value = [];
    singleFieldPagination.value.table = table;
    singleFieldPagination.value.field = field;
    singleFieldPagination.value.value = value;
    const response = await aotuCompleteByTableField(
      singleFieldPagination.value
    );
    autoCompleteData.value = response.data;
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }

  .pagination-style {
    justify-content: end;
  }

  .progress-wrap {
    display: flex;
    align-items: center;
  }

  .search-rows {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    .search-label {
      display: inline-block;
      width: 200px;
    }
  }
</style>
