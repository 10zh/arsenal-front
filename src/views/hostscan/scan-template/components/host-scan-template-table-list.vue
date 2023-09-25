<template>
  <!--数据搜索模块 start-->
  <a-row>
    <a-form :model="form" label-align="left" auto-label-width>
      <a-row :gutter="24">
        <a-col :span="4">
          <a-form-item
            field="templateName"
            :label="t('scan.template.templateName')"
          >
            <a-auto-complete
              v-model="pagination.templateName"
              :data="autoCompleteData"
              :placeholder="t('scan.template.name.input')"
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
            @click="initHostScanTemplateList"
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
            <a-button type="primary" @click="addScanEngine">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('scan.engine.add') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </a-row>
  <!--数据搜索模块 end-->
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
  import { aotuCompleteByTableField } from '@/api/common/common';

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
  .paginationStyle {
    justify-content: end;
    margin-top: 50px;
  }
</style>
