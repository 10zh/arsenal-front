<template>
  <div ref="header">
    <a-row>
      <a-col :flex="1">
        <!-- 搜索条件start -->
        <a-form :model="pagination" label-align="left" auto-label-width>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item
                field="status"
                :label="$t('host.scan.config.configName')"
              >
                <a-input
                  v-model="pagination.configName"
                  :placeholder="t('host.scan.config.configName.input')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="status"
                :label="$t('host.scan.config.engineName')"
              >
                <a-input
                  v-model="pagination.engineName"
                  :placeholder="t('host.scan.config.engineName.input')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="status"
                :label="$t('host.scan.config.templateName')"
              >
                <a-input
                  v-model="pagination.templateName"
                  :placeholder="t('host.scan.config.templateName.input')"
                ></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item
                field="status"
                :label="$t('host.scan.config.target')"
              >
                <a-input
                  v-model="pagination.target"
                  :placeholder="t('host.scan.config.target.input')"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="status"
                :label="$t('host.scan.config.scanStatus')"
              >
                <a-select
                  v-model="pagination.scanStatus"
                  :placeholder="t('host.scan.config.scanStatus.input')"
                  allow-clear
                  :options="scanStatusOptions"
                >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <!-- 搜索条件end -->
      </a-col>
      <!-- 查询&重置按钮start -->
      <a-divider style="height: 84px" direction="vertical"></a-divider>
      <a-col :flex="'86px'" style="text-align: right">
        <a-space direction="vertical" :size="18">
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
        </a-space>
      </a-col>
    </a-row>
    <!--查询&重置按钮 end-->
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
  </div>
  <!--主机扫描配置数据表格 start-->
  <a-table
    row-key="id"
    :columns="columns"
    :style="{ height: tableHeight + 'px' }"
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
            record.lastScanStatic.scanStatus === 6 ? 100 : record.progressNums
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
        formatDate(record.lastScanStatic.scanStartTime, 'YYYY-MM-DD hh:mm:ss')
      }}
    </template>
    <template #scanEndTime="{ record }">
      {{ formatDate(record.lastScanStatic.scanEndTime, 'YYYY-MM-DD hh:mm:ss') }}
    </template>
    <template #operations="{ record }">
      <a-popconfirm
        v-if="[0, 4, 5, 6].includes(record.lastScanStatic.scanStatus)"
        :content="t('host.scan.config.operator.scan.ack')"
        @ok="startHostScan(record)"
      >
        <a-button type="text" size="small" style="padding: 0px">
          {{ $t('button.scan') }}
        </a-button>
      </a-popconfirm>
      <a-popconfirm
        v-if="[2].includes(record.lastScanStatic.scanStatus)"
        :content="t('host.scan.config.operator.scan.suspend.ack')"
        @ok="suspendHostScanEvent(record)"
      >
        <a-button
          type="text"
          size="small"
          style="padding: 0px; color: rgb(119, 117, 67)"
        >
          {{ $t('button.suspend') }}
        </a-button>
      </a-popconfirm>
      <a-popconfirm
        v-if="[3].includes(record.lastScanStatic.scanStatus)"
        :content="t('host.scan.config.operator.scan.resume.ack')"
        @ok="resumeHostScanEvent(record)"
      >
        <a-button type="text" size="small" style="padding: 10px">
          {{ $t('button.continue') }}
        </a-button>
      </a-popconfirm>
      <a-popconfirm
        v-if="[2, 3].includes(record.lastScanStatic.scanStatus)"
        :content="t('host.scan.config.operator.scan.stop.ack')"
        @ok="stopHostScanEvent(record)"
      >
        <a-button
          type="text"
          size="small"
          style="padding: 10px; color: #db0ac2"
        >
          {{ $t('button.stop') }}
        </a-button>
      </a-popconfirm>
      <a-button
        type="text"
        size="small"
        style="padding: 0px"
        @click="handleListener('edit', record)"
      >
        {{ $t('button.edit') }}
      </a-button>
      <a-popconfirm
        :content="
          t('host.scan.config.operator.delete.ack') + record.configName + '?'
        "
        @ok="deleteSingleHostScanConfig(record)"
      >
        <a-button type="text" size="small" style="padding: 10px; color: red">
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
  />
  <!--主机扫描配置数据表格 end-->
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
    getHostScanConfigPageList,
    deleteHostScanConfig,
    hostScan,
  } from '@/api/scan/scan-config';
  import {
    suspendHostScan,
    stopHostScan,
    resumeHostScan,
  } from '@/api/scan/scan-record';

  const router = useRouter();
  const { t } = useI18n();

  // ==========================数据定义模块==========================
  // 配置模板表格数据
  const tableData = ref<any>([]);
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
  // 扫描状态下拉框选项
  const scanStatusOptions = [
    {
      value: '0',
      label: t('scan.status.not.start'),
    },
    {
      value: '1',
      label: t('scan.status.prepare'),
    },
    {
      value: '2',
      label: t('scan.status.progress'),
    },
    {
      value: '3',
      label: t('scan.status.suspend'),
    },
    {
      value: '4',
      label: t('scan.status.stop'),
    },
    {
      value: '5',
      label: t('scan.status.fail'),
    },
    {
      value: '6',
      label: t('scan.status.finish'),
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
    target: '',
    scanStatus: '',
  });
  // 头部实例用来动态计算高度
  const header = ref();
  // 表格高度
  const tableHeight = ref(0);
  // ==========================数据操纵模块==========================
  // 初始化主机扫描配置列表
  const initConfigList = async () => {
    const response: any = await getHostScanConfigPageList(pagination.value);
    tableData.value = response.data;
    // 分页参数赋值
    pagination.value.total = response.totalCount;
    pagination.value.pageIndex = response.pageIndex;
    pagination.value.pageSize = response.pageSize;
  };

  // 设置页面加载定时器
  const initListTimer = ref();

  // 当页面加载时，显示数据
  onMounted(() => {
    // 动态计算表格的高度并进行分页
    const height =
      document.documentElement.clientHeight - header.value.offsetHeight - 350;
    tableHeight.value = height;
    pagination.value.pageSize = Math.floor(height / 50);
    // 初始化主机扫描配置页面表格数据
    initConfigList();
    // 每10s刷新数据
    initListTimer.value = setInterval(() => {
      initConfigList();
    }, 10000);
  });
  // 当页面卸载时
  onBeforeUnmount(() => {
    clearInterval(initListTimer.value);
    initListTimer.value = null;
  });

  // ==========================事件响应模块==========================
  // 过滤后端排序字段
  function filterSortedField(field: string) {
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
  const sortedChangeEvent = (field: string, direction: string) => {
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
    pagination.value.target = '';
    pagination.value.scanStatus = '';
    initConfigList();
  };

  // 新增事件
  const addHostScanConfig = () => {
    router.push({
      name: 'addHostScanConfig',
    });
  };
  // 删除单个扫描配置事件
  const deleteSingleHostScanConfig = async (record: any) => {
    const response: any = await deleteHostScanConfig(record.id);
    if (!response.success) {
      return;
    }
    Message.success(t('host.scan.config.delete.success'));
    // 重新刷新列表
    initConfigList();
  };
  // 开始主机扫描配置
  const startHostScan = async (record: any) => {
    const response: any = await hostScan(record.id);
    if (!response.success) {
      return;
    }
    // 重新刷新列表
    initConfigList();
    // 前往扫描记录页面
    console.log('goto host scan reocrd page');
  };
  // 去扫描配置详情界面
  const gotoScanConfigDetail = (record: any) => {
    router.push({
      path: '/hostscan/hostScanConfigDetail',
      query: {
        configId: record.id,
      },
    });
  };
  // 暂停扫描
  const suspendHostScanEvent = async (record: any) => {
    const response: any = await suspendHostScan(record.lastScanStatic.scanId);
    if (!response.data.operation) {
      Message.error(t('host.scan.suspend.fail') + response.data.failCause);
      console.log('suspend response: ', response.data);
      return;
    }
    Message.success(t('host.scan.suspend.success'));
  };
  // 停止扫描
  const stopHostScanEvent = async (record: any) => {
    const response: any = await stopHostScan(record.lastScanStatic.scanId);
    if (!response.data.operation) {
      Message.error(t('host.scan.stop.fail') + response.data.failCause);
      console.log('suspend response: ', response.data);
      return;
    }
    Message.success(t('host.scan.stop.success'));
  };
  // 继续主机扫描
  const resumeHostScanEvent = async (record: any) => {
    const response: any = await resumeHostScan(record.lastScanStatic.scanId);
    if (!response.data.operation) {
      Message.error(t('host.scan.resume.fail') + response.data.failCause);
      console.log('suspend response: ', response.data);
      return;
    }
    Message.success(t('host.scan.resume.success'));
  };
</script>

<style lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .general-card {
    /deep/ .arco-card-header-title {
      // font-weight: 700;
      font-size: 20px;
    }
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
    margin-top: 20px;
  }

  .progress-wrap {
    display: flex;
    align-items: center;
  }
</style>
