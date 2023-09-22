<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', 'menu.list.scan.config']" />
    <a-card class="general-card" :title="$t('menu.list.scan.config')">
      <a-row ref="searchRef">
        <a-col :flex="1">
          <a-form :model="searchParams" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }"
            label-align="left">
            <a-row :gutter="24">
              <a-col :span="6">
                <a-form-item field="status" :label="$t('host.scan.config.configName')">
                  <a-input v-model="searchParams.configName" />
                </a-form-item>

              </a-col>
              <a-col :span="6">
                <a-form-item field="status" :label="$t('host.scan.config.engineName')">
                  <a-input v-model="searchParams.engineName" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="status" :label="$t('host.scan.config.templateName')">
                  <a-input v-model="searchParams.templateName" />
                </a-form-item>
              </a-col>
              <a-col :span="6">

                <a-button type="primary" default-checked @click="getConfigList" style="margin:0 10px">
                  <template #icon>
                    <icon-search />
                  </template>
                  {{ $t('searchTable.form.search') }}
                </a-button>
                <a-button style="margin:0 10px" @click="reset">
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
        <a-col :span="24" style="display:flex;justify-content:space-between;align-items:center">
          <a-space>
            <a-button type="primary" @click="handleAdd('add')">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.scanConfig.create') }}
            </a-button>
          </a-space>
          <a-switch type="round" size="large" :checked-value="'asc'" :unchecked-value="'desc'"
            @change="changeOrder($event)" checked-text="升序" unchecked-text="降序" :model-value="searchParams.order" />
        </a-col>

      </a-row>
      <a-table row-key="id" :columns="columns" :bordered="false" :data="tableData" :row-selection="rowSelection"
        :style="'height:' + cardHeight + 'px'" :pagination=false>
        <template #configName="{ record }">
          <a-link href="#" @click="handleConfigDialog(record)">{{ record.configName }}</a-link>
        </template>
        <template #status="{ record }">
          <a-tag size="small" :color="getStatusColor(record.lastScanStatic.scanStatus)">{{
            getStatusText(record.lastScanStatic.scanStatus) }}
          </a-tag>
        </template>
        <template #scanPress="{ record }">
          <div class="progress-wrap">
            <a-progress status='success' style="margin-right:2px" :show-text="false"
              :percent="record.lastScanStatic.scanStatus === 6 ? 100 : record.progressNums" />
            <icon-check-circle-fill style="color: green;" v-if="record.lastScanStatic.scanStatus === 6" />
            <icon-exclamation-circle-fill v-else style="color: #ff7d00;" />
          </div>
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" style="padding: 0px" @click="handleScan(record)">
            <template #icon>
              <icon-fullscreen />
            </template>
            {{ $t('button.scan') }}
          </a-button>
          <a-button type="text" size="small" style="padding: 10px" @click="handleListener('edit', record)">
            <template #icon>
              <icon-edit />
            </template>
            {{ $t('button.edit') }}
          </a-button>
        </template>
      </a-table>
      <a-pagination class="pagination-style" :total="pagination.total" :current="pagination.pageIndex"
        :page-size="pagination.pageSize" show-total show-jumper show-page-size />
    </a-card>
    <!-- 新增引擎对话框 -->
    <AddConfigDialog ref="addConfigRef" @refreshList="getConfigList" :dialog-type="dialogType" :tableRow="tableRow" />
    <!-- 新增引擎对话框 -->
    <ShowConfigListDialog ref="showConfigRef" :config-id="configId" />

  </div>
</template>
  
<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import {
  HostScanConfigRes,
  getScanConfig,
  scanConfig,
  getScanProgress
} from '@/api/scan/scan-config';
import { Message } from '@arco-design/web-vue';


import { getStatusColor, getStatusText, searchOptions } from '@/hooks/status-options'
import { useConfigParamsStore } from '@/store';
import AddConfigDialog from './components/add-config-dialog.vue'
import ShowConfigListDialog from './components/show-config-list-dialog.vue'


const { t } = useI18n();
const cardHeight = ref<number>();
const searchRef = ref();
interface formData {
  templateName: string,
  assetConcurrency: string,
}
const formModel = reactive<HostScanConfigRes>(
  {
    engineId: '',
    configName: '',
    excludeTarget: '',
    hostCredentials: [1, 2],
    target: '',
    templateId: '',

  }
)
// 查询参数
const searchParams = reactive({
  configNameOp: 'ct',
  configName: '',
  engineName: '',
  engineNameOp: 'ct',
  order: 'asc',
  sort: "id",
  templateName: '',

})
// 重置
const reset = () => {
  searchParams.configName = '';
  searchParams.configNameOpt = 'ct';
  searchParams.engineName = ''
  searchParams.engineNameOpt = 'ct';
  searchParams.order = 'asc';
  searchParams.templateName = ''
}

const dialogType = ref<string>('');
// 当行数据
const tableRow = ref<HostScanConfigRes>()
// 配置模板表格数据
const tableData = ref<HostScanConfigRes[]>([])
const addConfigRef = ref<InstanceType<typeof AddConfigDialog> | null>(null);
// 扫描配置表头
const columns = [
  {
    title: t('host.scan.config.target'),
    dataIndex: 'target',
  },
  {
    title: t('host.scan.config.configName'),
    dataIndex: 'configName',
    slotName: 'configName'
  },
  {
    title: t('host.scan.config.engineName'),
    dataIndex: 'engine.engineName',
  },
  // {
  //   title: t('host.scan.config.excludeTarget'),
  //   dataIndex: 'excludeTarget',
  // },
  {
    title: t('host.scan.config.liveHostNumber'),
    dataIndex: 'lastScanStatic.liveHostNumber',
  },

  // {
  //   title: t('host.scan.config.scanEndTime'),
  //   dataIndex: 'lastScanStatic.liveHostNumber',
  // },
  // {
  //   title: t('host.scan.config.scanStartTime'),
  //   dataIndex: 'lastScanStatic.liveHostNumber',
  // },
  {
    title: t('host.scan.config.templateName'),
    dataIndex: 'template.templateName',
  },
  // {
  //   title: t('host.scan.config.vulnerabilityNumber'),
  //   dataIndex: 'lastScanStatic.vulnerabilityNumber',
  // },
  {
    title: t('host.scan.config.scanPress'),
    dataIndex: 'scanPress',
    slotName: 'scanPress'
  },

  {
    title: t('host.scan.config.scanStatus'),
    dataIndex: 'lastScanStatic.scanStatus',
    slotName: 'status'
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
  pageSize: 10
})
// 列表
const getConfigList = async () => {
  const response = await getScanConfig(pagination.value, searchParams);
  tableData.value = response.data;
  const pageInfo = {
    total: response.totalCount,
    pageIndex: response.pageIndex,
    pageSize: response.pageSize,
  }
  pagination.value = pageInfo;
}
// 顺序排序
const changeOrder = (key: string) => {
  searchParams.order = key;
  getConfigList()
}
// 新增配置
const handleAdd = (type: string, row?: HostScanConfigRes) => {
  dialogType.value = type;
  // tableRow.value = row;
  addConfigRef.value?.setVisibleData(true);
};
const configId = ref<string>('')
const showConfigRef = ref();
// 查看扫描配置的扫描记录
const handleConfigDialog = (record: HostScanConfigRes) => {
  console.log(record)
  configId.value = record.id;
  showConfigRef.value?.setVisibleData(true);


}
const route = useRoute()
const useConfigParams = useConfigParamsStore()
// 当页面加载时，显示数据
onMounted(() => {
  getConfigList()// 从页面详情返回之后回显弹框内容
  if (useConfigParams.isShowDialog) {
    showConfigRef.value?.setVisibleData(true)

  }
  cardHeight.value = document.documentElement.clientHeight - searchRef.value.$el.clientHeight - 370;
  pagination.value.pageSize = Math.floor(cardHeight.value / 43)

});

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
const timer = ref<any>(null)
// 扫描进度
const getScanProcessTimes = async (row: HostScanConfigRes) => {
  const data = await getScanProgress(row.scanId);
  row.progressNums = data.data.processBar;
  if (data.data.scanStatus !== 2) {
    // 如果状态不是扫描中则清除定时器
    clearInterval(timer.value)
  }
}
// 扫描
const handleScan = async (row: HostScanConfigRes) => {
  const data = await scanConfig(row.id);
  if (data.success) {
    row.scanId = data.data.scanId;
    getConfigList();
    // Message.success('新增成功');
    // 每秒进行刷新进度数据
    timer.value = setInterval(() => {
      getScanProcessTimes(row);
      getConfigList();
    }, 1000)
  } else {
    Message.error(data.errMessage);
  }
}


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