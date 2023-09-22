<template>
  <div>
    <a-modal v-model:visible="visible" width="800px" :footer="false" title="扫描记录" title-align="start"
      @before-close="beforeClose">
      <div class="header-info">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item field="templateName" :label="t('host.scan.config.configName')">
              <a-input v-model="info.configName" readonly />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="templateName" :label="t('host.scan.config.engineName')">
              <a-input v-model="info.engineName" readonly/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item field="templateName" :label="t('host.scan.config.templateName')">
          <a-input v-model="info.templateName" readonly />
        </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="templateName" :label="t('host.scan.config.target')">
          <a-input v-model="info.target"  readonly/>
        </a-form-item>
          </a-col>
        </a-row>
      </div>
      <a-table row-key="id" :columns="columns" :bordered="false" :data="tableData" :pagination=false>
        <template #status="{ record }">
          <a-tag size="small" :color="getStatusColor(record.scanStatus)">{{ getStatusText(record.scanStatus) }} </a-tag>
        </template>

        <template #scanPress="{ record }">
          <a-progress status='warning' :show-text="false" :percent="record.scanStatus === 0 ? 0 : 0.2" />
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" style="padding: 10px" @click="handleDetail(record)">
            <template #icon>
              <icon-menu />
            </template>
            {{ $t('button.detail') }}
          </a-button>
        </template>
      </a-table>
      <a-pagination class="pagination-style" :total="pagination.total" :current="pagination.pageIndex"
        :page-size="pagination.pageSize" show-total show-jumper show-page-size @change="handleIndex" @page-size-change="handleSize" />
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { ref, defineExpose, defineProps, defineEmits, watch, reactive, onMounted } from 'vue'
import { getScanDetail, HostScanDetailRes, getScanDetailInfo } from '@/api/scan/scan-config'
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import {
  HostScanConfigRes,
} from '@/api/scan/scan-config';
import { getStatusColor, getStatusText } from '@/hooks/status-options'
import { useConfigParamsStore } from '@/store'

const { t } = useI18n();
const tableData = ref<HostScanDetailRes[]>([])
// 分页对象参数
const pagination = ref({
  total: 0,
  pageIndex: 1,
  pageSize: 5
})
const props = defineProps({
  configId: { type: String, required: true },
});
const configIds = ref<string>('')
const columns = [
  {
    title: t('host.scan.config.engineName'),
    dataIndex: 'engineName',
  },
  {
    title: t('host.scan.config.scanCostTime'),
    dataIndex: 'scanCostTime',
  },
  {
    title: t('host.scan.config.scanStatus'),
    dataIndex: 'lastScanStatic.scanStatus',
    slotName: 'status'
  },
  {
    title: t('host.scan.config.templateName'),
    dataIndex: 'templateName',
  },
  // {
  //   title: t('host.scan.config.scanPress'),
  //   dataIndex: 'scanPress',
  //   slotName:'scanPress'
  // },

  {
    title: t('searchTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
]
interface detailInfo {
  configName: string
  engineId: string
  engineName: string
  excludeTarget: string
  id: string
  target: string
  templateId: string
  templateName: string
}
const info = ref({})
const getDetailInfo = async () => {
  const data = await getScanDetailInfo(configIds.value);
  info.value = data.data;

}

const getTableData = async () => {
console.log(pagination.value)
  const response = await getScanDetail(configIds.value, pagination.value);
  tableData.value = response.data;
  const pageInfo = {
    total: response.totalCount,
    pageIndex: response.pageIndex,
    pageSize: response.pageSize,
  }
  pagination.value = pageInfo;

}
onMounted(() => {

})


const visible = ref<boolean>(false);

// 父组件传递表单类型以及对话框开关参数
defineExpose({
  setVisibleData(res: boolean) {
    visible.value = res;
    //   if (props.dialogType === 'add') {
    //     formRef.value.resetFields();
    //   }
  },
});
const route = useRoute()
const useConfigParams = useConfigParamsStore();
const isClick = ref(false);
// 监听visible以及dialogType参数，进行数据回显
watch(
  [() => visible, route],
  ([newName, newNums]) => {
    if (newName.value === true && isClick.value === false) {
      configIds.value = props.configId;
      getTableData()
      getDetailInfo()
    } else if (useConfigParams.isShowDialog) {
      configIds.value = useConfigParams.configId
      pagination.value = useConfigParams.pagination;
      getTableData()
      getDetailInfo()
    }
  },
  { immediate: true }
);
// 详情
const router = useRouter();

const handleDetail = (record) => {
  console.log(record)
  isClick.value = true;
  useConfigParams.setConfignParams(configIds.value, pagination.value);
  useConfigParams.setDialog(true);
  router.push({
    name: 'scanConfigDetail',
    query: {
      scanId: record.scanId
    }
  });

}
const beforeClose = () => {
  useConfigParams.setDialog(false);
}
// 页码切换
const handleIndex = (val:number)=>{
  pagination.value.pageIndex = val
  getTableData()

}
// 页数切换
const handleSize = (val:number)=>{
  pagination.value.pageSize = val
  getTableData()

}

</script>
<style scoped lang="less">
.pagination-style {
  justify-content: end;
  margin-top: 15px;
}

.header-info {
  margin-bottom: 10px;
  padding: 0px 10px;

  >p {
    width: 240px;
    display: inline-block;
  }
}
</style>

