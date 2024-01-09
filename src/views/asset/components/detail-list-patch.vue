<template>
  <a-row ref="header">
    <a-col :flex="1">
      <!-- 查询条件start -->
      <a-form :model="pagination" auto-label-width :label-col-props="{ span: 4 }" :wrapper-col-props="{ span: 18 }"
        label-align="left">
        <a-row :gutter="24">
          <a-col :span="6">
            <a-form-item>
              <a-input-search allow-clear="true" v-model="pagination.hotfixId" @search="initTableData"
                :placeholder="t('scan.record.host.patch.hotfixId')" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
  </a-row>
  <!-- 查询条件end -->
  <a-table :columns="tableColumns" style="min-height:300px" :data="tableData" column-resize :pagination="false"
    @sorter-change="sortedChangeEvent">
  </a-table>
  <a-pagination class="paginationStyle" :total="pagination.total" :current="pagination.pageIndex"
    :page-size="pagination.pageSize" show-total show-page-size @change="handleVulnerabilityPageIndexChange"
    @page-size-change="handleVulnerabilityPageSizeChange" />
</template>

<script setup>
// ==========================声明模块==========================
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { getAssetHotfixList } from '@/api/asset/search';
import { getSeverityRatingText } from '@/hooks/status-options'



// ==========================数据定义模块==========================
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
// 列表表头
const tableColumns = reactive([
  {
    title: t('scan.record.host.patch.caption'),
    dataIndex: 'caption',
    slotName: 'caption'
  },
  {
    title: t('scan.record.host.patch.csName'),
    dataIndex: 'csName',
  },
  {
    title: t('scan.record.host.patch.description'),
    dataIndex: 'description',
  },
  {
    title: t('scan.record.host.patch.fixComment'),
    dataIndex: 'fixComment',

  },
  {
    title: t('scan.record.host.patch.installDate'),
    dataIndex: 'installDate',
    sortable: {
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },

  },
  {
    title: t('scan.record.host.patch.installedBy'),
    dataIndex: 'installedBy',
    ellipsis: true,
    tooltip: { position: 'top' },

  },
  {
    title: t('scan.record.host.patch.installedOn'),
    dataIndex: 'installedOn',
    slotName: 'installedOn',

    sortable: {
      sorter: true,
      sortDirections: ['descend', 'ascend'],
    },
  },
  {
    title: t('scan.record.host.patch.name'),
    dataIndex: 'name',
    slotName: 'name',

  },
  {
    title: t('scan.record.host.patch.servicePackInEffect'),
    dataIndex: 'servicePackInEffect',


  },
  {
    title: t('scan.record.host.patch.status'),
    dataIndex: 'status',
    slotName: 'status',

  },
]);
// 扫描配置ID
const { id } = route.query;
// 列表分页参数
const pagination = ref({
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  order: 'desc',
  sort: 'severity',
  hotfixId: '',
});
// 列表数据
const tableData = ref([]);
// ==========================数据操纵模块==========================
// 初始化列表数据
const initTableData = async () => {
  const response = await getAssetHotfixList(
    id,
    pagination.value
  );
  tableData.value = response.data;
  pagination.value.total = response.totalCount;
  pagination.value.pageIndex = response.pageIndex;
  pagination.value.pageSize = response.pageSize;
};
// 重置列表事件
const resetVulnerabilityList = () => {
  pagination.value.hotfixId = '';
  initTableData();
};
// 漏洞列表分页事件
const handleVulnerabilityPageIndexChange = (pageIndex) => {
  pagination.value.pageIndex = pageIndex;
  initTableData();
};
// 漏洞分页事件
const handleVulnerabilityPageSizeChange = (pageSize) => {
  pagination.value.pageSize = pageSize;
  initTableData();
};
// 排序事件
const sortedChangeEvent = (field, direction) => {
  direction = direction === 'descend' ? 'desc' : 'asc';
  pagination.value.sort = field;
  pagination.value.order = direction;
  // 重新刷新列表
  initTableData();
};
onMounted(() => {
  initTableData();
});
</script>
<style scoped lang="less">
/deep/ .arco-row-justify-start {
  justify-content: flex-end;
}

.paginationStyle {
  justify-content: end;
  margin-top: 20px;
}
</style>
