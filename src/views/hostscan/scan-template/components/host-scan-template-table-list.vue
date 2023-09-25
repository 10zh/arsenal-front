<template>
  <!--主机扫描模板数据表格 start-->
  <a-table
    row-key="id"
    :columns="columns"
    :data="tableData"
    :bordered="false"
    :pagination="false"
    @sorter-change="sortedChangeEvent"
  >
    <template #portScanSpeed="{ record }">
      {{ t(PortScanSpeedEnum[record.performance.portScanSpeed]) }}
    </template>
    <template #enableIcmp="{ record }">
      {{ t(BoolEnum[record.hostDiscovery.enableIcmp]) }}
    </template>
    <template #enableArp="{ record }">
      {{ t(BoolEnum[record.hostDiscovery.enableArp]) }}
    </template>
    <template #enableSyn="{ record }">
      {{ t(BoolEnum[record.hostDiscovery.enableSyn]) }}
    </template>
    <template #enablePu="{ record }">
      {{ t(BoolEnum[record.hostDiscovery.enablePu]) }}
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
  <!--主机扫描模板数据表格 end-->
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    getScanTemplates,
    HostScanTemplateRes,
    PortScanSpeedEnum,
    FieldSortedEnum,
  } from '@/api/scan/scan-template';
  import BoolEnum from '@/api/common/enums';

  const { t } = useI18n();

  // ==========================数据定义模块==========================
  // 扫描引擎表头
  const columns = [
    {
      title: t('scan.template.templateName'),
      dataIndex: 'templateName',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.template.performance.assetConcurrency'),
      dataIndex: 'performance.assetConcurrency',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.template.performance.singleAssetThread'),
      dataIndex: 'performance.singleAssetThread',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.template.performance.portScanSpeed'),
      dataIndex: 'performance.portScanSpeed',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
      slotName: 'portScanSpeed',
    },
    {
      title: t('scan.template.hostDiscovery.enableIcmp'),
      dataIndex: 'hostDiscovery.enableIcmp',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
      slotName: 'enableIcmp',
    },
    {
      title: t('scan.template.hostDiscovery.enableArp'),
      dataIndex: 'hostDiscovery.enableArp',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
      slotName: 'enableArp',
    },
    {
      title: t('scan.template.hostDiscovery.enableSyn'),
      dataIndex: 'hostDiscovery.enableSyn',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
      slotName: 'enableSyn',
    },
    {
      title: t('scan.template.hostDiscovery.synPort'),
      dataIndex: 'hostDiscovery.synPort',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.template.hostDiscovery.enablePu'),
      dataIndex: 'hostDiscovery.enablePu',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
      slotName: 'enablePu',
    },
    {
      title: t('scan.template.hostDiscovery.puPort'),
      dataIndex: 'hostDiscovery.puPort',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.template.hostDiscovery.maxRetries'),
      dataIndex: 'hostDiscovery.maxRetries',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.template.serviceDiscovery.tcpPort'),
      dataIndex: 'serviceDiscovery.tcpPort',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
    {
      title: t('scan.template.serviceDiscovery.udpPort'),
      dataIndex: 'serviceDiscovery.tcpPort',
      sortable: {
        sorter: true,
        sortDirections: ['ascend', 'descend'],
      },
    },
  ];
  // 主机扫描模板表格数据
  const tableData = ref<HostScanTemplateRes>([]);
  // 分页对象参数
  const pagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
    order: 'desc',
    sort: 'createTime',
  });

  // ==========================数据操纵模块==========================
  // 初始化引擎列表
  const initHostScanTemplateList = async () => {
    const response = await getScanTemplates(pagination.value);
    tableData.value = response.data;
    // 分页参数赋值
    pagination.value.total = response.totalCount;
    pagination.value.pageIndex = response.pageIndex;
    pagination.value.pageSize = response.pageSize;
  };

  // 当页面加载时，显示数据
  onMounted(() => {
    // 初始化页面表格数据
    initHostScanTemplateList();
  });

  // ==========================事件响应模块==========================
  // 过滤后端排序字段
  function filterSortedField(field) {
    const filterField = FieldSortedEnum[field];
    if (filterField) {
      field = filterField;
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
    initHostScanTemplateList();
  };
</script>

<style scoped lang="less">
  .paginationStyle {
    justify-content: end;
    margin-top: 50px;
  }
</style>
