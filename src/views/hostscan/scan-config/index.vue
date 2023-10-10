<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', 'menu.list.scan.config']" />
    <a-card :title="$t('menu.list.scan.config')">
      <!--搜索条件 start-->
      <a-row>
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
                    :placeholder="t('host.scan.config.configName.input')"
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
                    :placeholder="t('host.scan.config.engineName.input')"
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
                    :placeholder="t('host.scan.config.templateName.input')"
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
                  {{ $t('global.search') }}
                </a-button>
                <a-button style="margin: 0 10px" @click="reset">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  {{ $t('global.reset') }}
                </a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <!--搜索条件 end-->
      <!--分割线 start-->
      <a-divider style="margin-top: 0" />
      <!--分割线 end-->
      <!--添加主机扫描配置 start-->
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
            <a-button type="primary" @click="addHostScanConfig">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.scanConfig.create') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <!--添加主机扫描配置 end-->
      <!--主机扫描配置数据表格 start-->
      <a-table
        row-key="id"
        :columns="columns"
        :bordered="false"
        :data="tableData"
        :pagination="false"
        @sorter-change="sortedChangeEvent"
      >
        <template #configName="{ record }">
          <a-link @click="gotoScanConfigDetail(record)">{{
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
        <template #scanStartTime="{ record }">
          {{
            formatDate(
              record.lastScanStatic.scanStartTime,
              'YYYY-MM-DD hh:mm:ss'
            )
          }}
        </template>
        <template #scanEndTime="{ record }">
          {{
            formatDate(record.lastScanStatic.scanEndTime, 'YYYY-MM-DD hh:mm:ss')
          }}
        </template>
        <template #operations="{ record }">
          <a-popconfirm
            :content="t('host.scan.config.operator.scan.ack')"
            @ok="startHostScan(record)"
          >
            <a-button type="text" size="small" style="padding: 0px">
              <template #icon>
                <icon-fullscreen />
              </template>
              {{ $t('button.scan') }}
            </a-button>
          </a-popconfirm>
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
          <a-popconfirm
            :content="
              t('host.scan.config.operator.delete.ack') +
              record.configName +
              '?'
            "
            @ok="deleteSingleHostScanConfig(record)"
          >
            <a-button
              type="text"
              status="danger"
              size="small"
              style="padding: 10px"
            >
              <template #icon>
                <icon-delete />
              </template>
              {{ $t('button.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-pagination
        class="paginationStyle"
        :total="pagination.total"
        :current="pagination.pageIndex"
        :page-size="pagination.pageSize"
        show-total
        show-jumper
        show-page-size
      />
      <!--主机扫描配置数据表格 end-->
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import formatDate from '@/utils/times';
  import { getStatusColor, getStatusText } from '@/hooks/status-options';
  import { Message } from '@arco-design/web-vue';
  import {
    HostScanConfigRes,
    getHostScanConfigPageList,
    deleteHostScanConfig,
    hostScan,
  } from '@/api/scan/scan-config';
  import { aotuCompleteByTableField } from '@/api/common/common';

  const router = useRouter();
  const { t } = useI18n();

  // ==========================数据定义模块==========================
  // 配置模板表格数据
  const tableData = ref<HostScanConfigRes>([]);
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
      slotName: 'scanStartTime',
    },
    {
      title: t('host.scan.config.scanEndTime'),
      dataIndex: 'lastScanStatic.scanEndTime',
      sortable: {
        sorter: true,
        sortDirections: ['descend'],
      },
      slotName: 'scanEndTime',
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
      title: t('global.operations'),
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
  // 单个参数检索 同输入框自动补全联动
  const singleFieldPagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 15,
    table: '',
    field: '',
    value: '',
  });
  // 输入框自动补全
  const autoCompleteData = ref([]);

  // ==========================数据操纵模块==========================
  // 初始化主机扫描配置列表
  const initConfigList = async () => {
    const response = await getHostScanConfigPageList(pagination.value);
    tableData.value = response.data;
    // 分页参数赋值
    pagination.value.total = response.totalCount;
    pagination.value.pageIndex = response.pageIndex;
    pagination.value.pageSize = response.pageSize;
  };

  // 设置页面加载定时器
  let initListTimer;

  // 当页面加载时，显示数据
  onMounted(() => {
    // 初始化主机扫描配置页面表格数据
    initConfigList();
    // 每10s刷新数据
    initListTimer = setInterval(() => {
      initConfigList();
    }, 10000);
  });

  // 当页面卸载时
  onBeforeUnmount(() => {
    clearInterval(initListTimer);
    initListTimer = null;
  });

  // ==========================事件响应模块==========================
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
  // 新增事件
  const addHostScanConfig = () => {
    router.push({
      name: 'addHostScanConfig',
    });
  };
  // 删除单个扫描配置事件
  const deleteSingleHostScanConfig = async (record) => {
    const response = await deleteHostScanConfig(record.id);
    if (!response.success) {
      return;
    }
    Message.success(t('host.scan.config.delete.success'));
    // 重新刷新列表
    initConfigList();
  };
  // 开始主机扫描配置
  const startHostScan = async (record) => {
    const response = await hostScan(record.id);
    if (!response.success) {
      return;
    }
    // 重新刷新列表
    initConfigList();
    // 前往扫描记录页面
    console.log('goto host scan reocrd page');
  };
  // 去扫描配置详情界面
  const gotoScanConfigDetail = (record) => {
    router.push({
      path: '/hostscan/hostScanConfigDetail',
      query: {
        configId: record.id,
      },
    });
  };
</script>

<style lang="less">
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

  .paginationStyle {
    justify-content: end;
  }

  .progress-wrap {
    display: flex;
    align-items: center;
  }
</style>
