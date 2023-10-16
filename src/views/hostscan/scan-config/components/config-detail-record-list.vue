<template>
  <!-- 扫描记录列表 -->
  <a-card v-for="(item, index) in configRecordData" :key="item.scanId" :bordered="false"
    :title="t('host.scan.config.scanGoal') + ': ' + item.scanGoal"
    :class="[{ 'select': selected === index }, 'inner-card']" @click="handleClickRecordCard(item, index)">
    <template #extra>
      <a-tag :color="getStatusColor(item.scanStatus)">{{
        t(getStatusText(item.scanStatus)) }}</a-tag>

    </template>
    <p>{{ formatDate(item.createTime, 'YYYY-MM-DD hh:mm:ss') }}</p>

    <a-space>
      <a-typography-text>
        <span class="label"> {{ t('host.scan.config.scanCostTime') + ':' }}</span>
        <span class="value"> {{
          formatSeconds(item.scanCostTime) }}</span>

      </a-typography-text>


    </a-space>
    <a-space>
      <a-typography-text>
        <span class="label"> {{ t('host.scan.config.engine') + ':' }}</span>
        <span class="value"> {{ item.engineName }}</span>
      </a-typography-text>

    </a-space>
    <a-space>
      <a-typography-text>
        <span class="label"> {{ t('host.scan.config.template') + ':' }}</span>
        <span class="value">{{ item.templateName }}</span>
      </a-typography-text>
    </a-space>


  </a-card>
  <a-empty v-if="configRecordData.length == 0" />
  <a-pagination :style="{ position: 'absolute', bottom: '0px', right: '0px' }" :total="pagination.total"
    @change="changePageIndex" />
</template>
<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { formatSeconds } from '@/utils/times';
import formatDate from '@/utils/times';
import { getStatusColor, getStatusText } from '@/hooks/status-options';
import {
  getHostScanRecordList,
} from '@/api/scan/scan-record';
import { useScanIdStore } from '@/store/index'


// ==========================数据定义模块==========================
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const scanIdStore = useScanIdStore()

// 扫描配置ID
const id = route.query.configId;
// 扫描配置记录
const configRecordData = ref([]);
// 选中的记录
const selected = ref(0);
// 选中记录的scanId 
const selectedScanId = ref('');
// 分页对象参数
const pagination = ref({
  total: 0,
  pageIndex: 1,
  pageSize: 5,
  order: 'desc',
  sort: 'scanStartTime',
});
// 初始化当前扫描配置的所有列表
const initScanConfigRecordData = async () => {
  const recordData = await getHostScanRecordList(id, pagination.value);
  configRecordData.value = recordData.data;
  if (recordData.data.length > 0) {
    selectedScanId.value = recordData.data[0].scanId;
  }
  // 分页参数赋值
  pagination.value.total = recordData.totalCount;
  pagination.value.pageIndex = recordData.pageIndex;
  pagination.value.pageSize = recordData.pageSize;
};
// ==========================事件响应模块==========================
const handleClickRecordCard = (item, index) => {
  selected.value = index;
  selectedScanId.value = item.scanId;
  // 将选择的scanId进行store缓存
  scanIdStore.getScanId(selectedScanId.value)
};
// 页数发生改变
const changePageIndex = (index) => {
  pagination.value.pageIndex = index;
  // 刷新扫描配置记录列表
  initScanConfigRecordData();
};
onMounted(async () => {
  // 当前扫描配置详情的扫描记录列表
  await initScanConfigRecordData();
  // 将选择的scanId进行store缓存
  scanIdStore.getScanId(selectedScanId.value)
})
</script>
<style scoped lang="less">
.inner-card {
  padding: 5px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  margin-top: 10px;

  /deep/ .arco-card-body {
    padding: 5px;
  }

  /deep/ .arco-card-header {
    height: 38px;
  }


}


.select {
  // border: 1px solid red;
}

.label {
  display: inline-block;
  padding: 3px 0;
  padding-right: 5px;

  font-size: 14px;
  color: #86909c;
}
</style>