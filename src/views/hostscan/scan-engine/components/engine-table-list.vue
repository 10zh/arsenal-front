<template>
  <!--引擎数据表格 start-->
  <a-table
    row-key="id"
    :columns="columns"
    :data="tableData"
    :bordered="false"
    :pagination="false"
    @sorter-change="sortedChangeEvent"
  >
    <template #status="{ record }">
      <span v-if="record.status == '0'" style="color: green">
        <a-badge status="success" style="margin-right: 5px" />{{
          t('scan.engine.status.online')
        }}</span
      >
      <span v-else style="color: red">
        <a-badge status="danger" style="margin-right: 5px" />{{
          t('scan.engine.status.offline')
        }}</span
      >
    </template>
    <template #isLocal="{ record }">
      <span v-if="record.isLocal == false">{{ t('global.false') }}</span>
      <span v-else>{{ t('global.true') }}</span>
    </template>
    <template #createTime="{ record }">
      {{ formatDate(record.createTime, 'YYYY-MM-DD hh:mm:ss') }}
    </template>
    <template #updateTime="{ record }">
      {{ formatDate(record.updateTime, 'YYYY-MM-DD hh:mm:ss') }}
    </template>
    <template #operations="{ record }">
      <a-button type="text" size="small" style="padding: 0px">
        <template #icon>
          <icon-edit />
        </template>
        {{ $t('scan.engine.operator.edit') }}
      </a-button>
      <a-popconfirm
        :content="t('scan.engine.operator.refresh.question')"
        @ok="refreshEngine(record)"
      >
        <a-button type="text" size="small">
          <template #icon>
            <icon-refresh />
          </template>
          {{ $t('scan.engine.operator.refresh') }}
        </a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-pagination
    class="paginationStyle"
    :total="pagination.total"
    :current="pagination.current"
    :page-size="pagination.pageSize"
    show-total
    show-jumper
    show-page-size
  />
  <!--引擎数据表格 end-->
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import formatDate from '@/utils/times';
  import {
    HostScanEngineRes,
    getScanEngines,
    refreshScanEngine,
  } from '@/api/scan/scan-engine';

  const { t } = useI18n();

  // ==========================数据定义模块==========================
  // 扫描引擎表头
  const columns = [
    {
      title: t('scan.engine.name'),
      dataIndex: 'engineName',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.engine.address'),
      dataIndex: 'address',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.engine.port'),
      dataIndex: 'port',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.engine.version'),
      dataIndex: 'engineVersion',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.engine.version.assignedTaskNumber'),
      dataIndex: 'assignedTaskNumber',
      slotName: 'assignedTaskNumber',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.engine.version.isLocal'),
      dataIndex: 'isLocal',
      slotName: 'isLocal',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.engine.version.createTime'),
      dataIndex: 'createTime',
      slotName: 'createTime',
      sortable: {
        sorter: true,
        sortDirections: ['descend'],
      },
    },
    {
      title: t('scan.engine.version.updateTime'),
      dataIndex: 'updateTime',
      slotName: 'updateTime',
      sortable: {
        sorter: true,
        sortDirections: ['descend'],
      },
    },
    {
      title: t('scan.engine.version.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('scan.engine.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ];
  // 扫描引擎表格数据
  const tableData = ref<HostScanEngineRes>([]);
  // 分页对象参数
  const pagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    order: 'desc',
    sort: 'createTime',
  });

  // 初始化引擎列表
  const initEngineList = async () => {
    const response = await getScanEngines(pagination.value);
    tableData.value = response.data;
    // 分页参数赋值
    pagination.value.total = response.totalCount;
    pagination.value.pageIndex = response.pageIndex;
    pagination.value.pageSize = response.pageSize;
  };

  // 当页面加载时，显示数据
  onMounted(() => {
    // 初始化页面表格数据
    initEngineList();
  });

  // ==========================事件响应模块==========================
  // 引擎刷新事件
  const refreshEngine = async (record) => {
    console.log(record);
    const response = await refreshScanEngine(record.id);
    if (response.data.hasRefreshSuccess) {
      Message.success(t('scan.engie.refresh.success'));
    } else {
      Message.error(response.data.failCause);
    }
    // 重新加载数据
    initEngineList();
  };
  // 排序事件
  const sortedChangeEvent = (field, direction) => {
    direction = direction === 'descend' ? 'desc' : 'asc';
    pagination.value.sort = field;
    pagination.value.order = direction;
    // 重新刷新列表
    initEngineList();
  };
</script>

<style scoped lang="less">
  .paginationStyle {
    justify-content: end;
    margin-top: 50px;
  }
</style>
