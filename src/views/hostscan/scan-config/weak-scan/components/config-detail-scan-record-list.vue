<template>
  <a-card class="record-message">
    <!-- 单个扫描记录信息start -->
    <a-row v-if="progressTextData.scanGoal">
      <a-progress :percent="progressTextData.processBar / 100" :stroke-width="100"
        :style="{ width: '100%', height: processHeight + 'px' }" :show-text="false" :color="{
          '0%': 'rgb(var(--primary-6))',
          '100%': 'rgb(var(--success-6))',
        }" />
    </a-row>
    <a-row id="record-detail-progress-text" ref="process" :gutter="24">
      <a-col :span="7">
        <a-statistic :title="t('host.scan.config.target')" :extra="progressTextData.scanGoal" />
      </a-col>
      <a-col :span="7">
        <a-statistic :title="t('host.scan.config.excludeTarget')" :extra="progressTextData.excludeScanGoal || '-'" />
      </a-col>
      <a-col :span="3">
        <a-statistic :title="t('host.scan.config.hostNumber')" :value="progressTextData.hostNumber" />
      </a-col>
      <a-col :span="3">
        <a-statistic :title="t('host.scan.config.wkpNumber')" :value="progressTextData.wkpNumber" />
      </a-col>
      <a-col :span="4">
        <a-statistic :title="t('scan.progress')" :value="progressTextData.processBar">
          <template #suffix>%</template>
        </a-statistic>
      </a-col>
    </a-row>
  </a-card>
  <!-- 单个扫描记录信息end -->
  <a-card :style="{ height: props.tableHeight - 132 + 'px' }">
    <a-tabs type="rounded">
      <a-tab-pane key="1">
        <template #title>
          <icon-calendar /> {{ t('weak.scan.record.host.list') }}
        </template>
        <!-- 弱口令列表start -->
        <a-table style="height:100%" :columns="hostTableColumns" :data="hostData" :bordered="{ cell: true }"
          :pagination="false" show-total show-jumper show-page-size>
          <template #ipv4="{ record }">
            <a-link @click="gotoHostDetail(record)">{{ record.ipv4 }}</a-link>
          </template>
          <template #ipv6="{ record }">
            <a-link @click="gotoHostDetail(record)">{{ record.ipv6 }}</a-link>
          </template>
        </a-table>
        <!-- 主机列表end -->
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, onMounted, defineProps, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import {
  getWeakHostScanRecordDetail,
  getHostListRecordByScanId,
  getHostVulnerabilityListRecordByScanId,
} from '@/api/scan/scan-record';
import { useScanIdStore } from '@/store/index';

// ==========================数据定义模块==========================
const { t } = useI18n();
const router = useRouter();

// 接收来自父组件的值
const props = defineProps({
  tableHeight: {
    type: Number,
    default: () => { },
  },
});
// 进度条
const process = ref();
// 进度条动态高度
const processHeight = ref();
// 主机列表表头
const hostTableColumns: any = reactive([
  {
    title: t('scan.weak.record.dbName'),
    dataIndex: 'dbName',
  },
  {
    title: t('scan.weak.record.ipv4'),
    dataIndex: 'ipv4',
    slotName: 'ipv4',
  },
  {
    title: t('scan.weak.record.ipv6'),
    dataIndex: 'ipv6',
    slotName: 'ipv6',
  },
  {
    title: t('scan.weak.record.domain'),
    dataIndex: 'domain',
  },
  {
    title: t('scan.weak.record.password'),
    dataIndex: 'password',
  },
  {
    title: t('scan.weak.record.serviceId'),
    dataIndex: 'serviceId',
  },
  {
    title: t('scan.weak.record.port'),
    dataIndex: 'port',
  },
  {
    title: t('scan.weak.record.transportProtocol'),
    dataIndex: 'transportProtocol',
  },
  {
    title: t('scan.weak.record.username'),
    dataIndex: 'username',

  }
]);
const scanIdStore = useScanIdStore();
// 进度条文本展示
const progressTextData: any = ref({});
// 弱口令列表数据
const hostData = ref([]);

// 初始化进度条文本数据&弱口令列表数据
const initProAndList = async () => {
  const response = await getWeakHostScanRecordDetail(scanIdStore.scanId);
  progressTextData.value = response.data;
  hostData.value = response.data.wkpList;
  nextTick(() => {
    processHeight.value = process.value.$el.clientHeight;
  })
};

// 跳转主机详情界面
const gotoHostDetail = (record: any) => {
  router.push({
    path: '/hostscan/hostWeakScanRecordDetail',
    query: {
      scanId: scanIdStore.scanId,
      hostId: record.hostId,
    },
  });
};
// 监听兄弟组件扫描记录的scanId
watch(
  () => scanIdStore.scanId,
  (newValue, oldValue) => {
    // 初始化进度条和列表数据
    initProAndList();
  }
);
onMounted(() => {
  if (scanIdStore.scanId) {
    // 初始化进度条和列表数据
    initProAndList();
  }
});

</script>

<style scoped lang="less">
/deep/.arco-statistic-extra {
  white-space: normal;
  word-break: break-all;
}
</style>
