<template>
  <div style="position: relative; height: 100%">
    <!-- 扫描记录列表 -->
    <a-card v-for="(item, index) in configRecordData" :key="item.scanId"
      :class="[{ select: selected === index }, 'inner-card']" @click="handleClickRecordCard(item, index)">
      <template #title>
        <div class="card-header">
          <div class="card-header-title">
            <span> {{ t('host.scan.config.scanGoal') + ': ' + item.scanGoal }}</span>
            <a-tag :color="getStatusColorInDetail(item.scanStatus)">{{
              t(getStatusText(item.scanStatus))
            }}</a-tag>
          </div>
          <span style="font-size: 12px; color: #ccc">{{
            formatDate(item.scanStartTime, 'YYYY-MM-DD hh:mm:ss')
          }}</span>
        </div>

      </template>

      <template #description>

      </template>
      <a-row>
        <a-col>
          <span class="label">
            {{ t('host.scan.config.scanCostTime') + ':' }}</span>
          <span class="value"> {{ formatSecondsToText(item.scanCostTime) }}</span>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <span class="label"> {{ t('host.scan.config.engine') + ':' }}</span>
          <span class="value"> {{ item.engineName }}</span>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <span class="label"> {{ t('host.scan.config.template') + ':' }}</span>
          <span class="value">{{ item.templateName }}</span>
        </a-col>
      </a-row>
    </a-card>

    <a-empty v-if="configRecordData.length == 0" />
    <a-pagination :style="{
      position: 'absolute',
      width: 'auto',
      bottom: '-50px',
      right: '-15px',
    }" :current="pagination.pageIndex" :page-size="pagination.pageSize" :total="pagination.total" size="mini"
      :buffer-size="1" @change="changePageIndex" />
  </div>
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, defineProps, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import formatDate, { formatSecondsToText } from '@/utils/times';
import { getStatusColorInDetail, getStatusText } from '@/hooks/status-options';
import { getHostScanRecordList } from '@/api/scan/scan-record';
import { useScanIdStore } from '@/store/index';
// ==========================数据定义模块==========================
const { t } = useI18n();
const route = useRoute();
const scanIdStore = useScanIdStore();

// 接收来自父组件的值
const props = defineProps({
  tableHeight: {
    type: Number,
    default: () => { },
  },
});

// 扫描配置ID
const id = route.query.configId;
// 扫描配置记录
const configRecordData: any = ref([]);
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
  // 动态计算表格的高度并进行分页
  pagination.value.pageSize = Math.floor(props.tableHeight / 150);
  const recordData = await getHostScanRecordList(id, pagination.value);
  configRecordData.value = recordData.data;
  if (recordData.data.length > 0) {
    selectedScanId.value = recordData.data[0].scanId;
    // 将选择的scanId进行store缓存
    scanIdStore.getScanId(selectedScanId.value);
  }
  // 分页参数赋值
  pagination.value.total = recordData.totalCount;
  pagination.value.pageIndex = recordData.pageIndex;
  pagination.value.pageSize = recordData.pageSize;
};
// ==========================事件响应模块==========================
const handleClickRecordCard = (item: any, index: number) => {
  selected.value = index;
  selectedScanId.value = item.scanId;
  // 将选择的scanId进行store缓存
  scanIdStore.getScanId(selectedScanId.value);
};
// 页数发生改变
const changePageIndex = (index: number) => {
  pagination.value.pageIndex = index;
  // 刷新扫描配置记录列表
  initScanConfigRecordData();
};
// 监听兄弟组件扫描记录的scanId
watch(
  () => props.tableHeight,
  (newValue, oldValue) => {
    // 当前扫描配置详情的扫描记录列表
    initScanConfigRecordData();
  }
);
</script>

<style scoped lang="less">
.inner-card {
  padding: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  margin-top: 10px;
  position: relative;

  /deep/ .arco-card-body {
    padding: 0px;
  }

  /deep/ .arco-card-header {
    height: 50px;
    padding: 0px;
    border: none;
  }
}

.select {
  // border: 1px solid red;
}

.label {
  display: inline-block;
  padding: 5px 0;
  padding-right: 5px;

  font-size: 14px;
  color: #86909c;
}

.card-header {
  display: flex;
  flex-direction: column;

  .card-header-title {
    display: flex;
    justify-content: space-between;
  }
}
</style>
