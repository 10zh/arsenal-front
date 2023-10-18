<template>
  <a-card style="record-message">
    <!-- 单个扫描记录信息start -->
    <a-row>
      <a-progress
        :percent="progressTextData.processBar / 100"
        :stroke-width="100"
        :style="{ width: '100%' }"
        :show-text="false"
        :color="{
          '0%': 'rgb(var(--primary-6))',
          '100%': 'rgb(var(--success-6))',
        }"
      />
    </a-row>
    <a-row id="record-detail-progress-text" :gutter="24">
      <a-col :span="7">
        <a-statistic
          :title="t('host.scan.config.target')"
          :extra="progressTextData.scanGoal"
        />
      </a-col>
      <a-col :span="7">
        <a-statistic
          :title="t('host.scan.config.excludeTarget')"
          :extra="progressTextData.excludeScanGoal"
        />
      </a-col>
      <a-col :span="3">
        <a-statistic
          :title="t('host.scan.config.hostNumber')"
          :value="progressTextData.hostNumber"
        />
      </a-col>
      <a-col :span="3">
        <a-statistic
          :title="t('host.scan.config.vulnerabilityNumber')"
          :value="progressTextData.vulnerabilityNumber"
        />
      </a-col>
      <a-col :span="4">
        <a-statistic
          :title="t('scan.progress')"
          :value="progressTextData.processBar"
        >
          <template #suffix>%</template>
        </a-statistic>
      </a-col>
    </a-row>
  </a-card>
  <!-- 单个扫描记录信息end -->
  <a-card :style="{ height: props.tableHeight - 132 + 'px' }">
    <a-tabs type="rounded" @tab-click="changeClick">
      <a-tab-pane key="1">
        <template #title>
          <icon-calendar /> {{ t('scan.record.host.list') }}
        </template>
        <!-- 主机列表start -->
        <a-table
          :columns="hostTableColumns"
          :data="hostData"
          :bordered="{ cell: true }"
          :pagination="hostPagination"
          @page-change="handleHostTablePageChange"
        >
          <template #ipv4="{ record }">
            <a-link @click="gotoHostDetail(record)">{{ record.ipv4 }}</a-link>
          </template>
          <template #ipv6="{ record }">
            <a-link @click="gotoHostDetail(record)">{{ record.ipv6 }}</a-link>
          </template>
        </a-table>
        <!-- 主机列表end -->
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #title>
          <icon-clock-circle />
          {{ t('scan.record.host.vulnerability.list') }}
        </template>
        <!-- 漏洞列表start -->
        <a-table
          :columns="vulnerabilityTableColumns"
          :data="vulnerabilityData"
          column-resize
          :bordered="{ cell: true }"
          :pagination="vulnerabilityPagination"
          @page-change="handleHostVulnerabilityTablePageChange"
        >
          <template #potential="{ record }">
            {{ record.potential ? t('global.true') : t('global.false') }}
          </template>
          <template #safe="{ record }">
            {{ record.safe ? t('global.true') : t('global.false') }}
          </template>
        </a-table>
        <!-- 漏洞列表end-->
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, reactive, onMounted, defineProps, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import {
    getHostScanRecordDetail,
    getHostListRecordByScanId,
    getHostVulnerabilityListRecordByScanId,
  } from '@/api/scan/scan-record';
  import { useScanIdStore } from '@/store/index';

  // ==========================数据定义模块==========================
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();

  // 接收来自父组件的值
  const props = defineProps({
    tableHeight: {
      type: Number,
      default: () => {},
    },
  });
  // 主机列表表头
  const hostTableColumns = reactive([
    {
      title: t('scan.record.hostname'),
      dataIndex: 'hostname',
    },
    {
      title: t('scan.record.ipv4'),
      dataIndex: 'ipv4',
      slotName: 'ipv4',
    },
    {
      title: t('scan.record.ipv6'),
      dataIndex: 'ipv6',
      slotName: 'ipv6',
    },
    {
      title: t('scan.record.macAddress'),
      dataIndex: 'osName',
    },
    {
      title: t('scan.record.osName'),
      dataIndex: 'macAddress',
    },
  ]);

  // 漏洞列表表头
  const vulnerabilityTableColumns = reactive([
    {
      title: t('scan.record.vulnName'),
      dataIndex: 'vulnName',
    },
    {
      title: t('scan.record.ipv4'),
      dataIndex: 'ipv4',
    },
    {
      title: t('scan.record.ipv6'),
      dataIndex: 'ipv6',
    },
    {
      title: t('scan.record.port'),
      dataIndex: 'port',
    },
    {
      title: t('scan.record.componentName'),
      dataIndex: 'componentName',
    },
    {
      title: t('scan.record.proof'),
      dataIndex: 'proof',
      ellipsis: true,
      tooltip: { position: 'top' },
    },
    {
      title: t('scan.record.safe'),
      dataIndex: 'safe',
      slotName: 'safe',
    },
    {
      title: t('scan.record.potential'),
      dataIndex: 'potential',
      slotName: 'potential',
    },
    {
      title: t('scan.record.accuracy'),
      dataIndex: 'accuracy',
    },
    {
      title: t('scan.record.severity'),
      dataIndex: 'severity',
    },
  ]);

  const scanIdStore = useScanIdStore();
  // 扫描配置ID
  const id = route.query.configId;
  // 进度条文本展示
  const progressTextData = ref({});
  // 主机列表分页参数
  const hostPagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  // 主机列表数据
  const hostData = ref([]);
  // 漏洞列表分页参数
  const vulnerabilityPagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  // 漏洞列表数据
  const vulnerabilityData = ref([]);
  // 初始化进度条文本数据
  const initProgressTextData = async () => {
    const response = await getHostScanRecordDetail(scanIdStore.scanId);
    progressTextData.value = response.data;
    console.log(progressTextData.value);
  };
  // 初始化主机列表数据
  const initHostData = async () => {
    // 主机列表分页数
    hostPagination.value.pageSize = Math.floor((props.tableHeight - 255) / 50);
    const response = await getHostListRecordByScanId(
      scanIdStore.scanId,
      hostPagination.value
    );
    hostData.value = response.data;
    // 分页参数赋值
    hostPagination.value.total = response.totalCount;
    hostPagination.value.pageIndex = response.pageIndex;
    hostPagination.value.pageSize = response.pageSize;
  };
  // 初始化漏洞列表数据
  const initHostVulnerabilityData = async () => {
    // 漏洞列表分页数
    vulnerabilityPagination.value.pageSize = Math.floor(
      (props.tableHeight - 255) / 50
    );
    const response = await getHostVulnerabilityListRecordByScanId(
      scanIdStore.scanId,
      vulnerabilityPagination.value
    );
    vulnerabilityData.value = response.data;
    vulnerabilityPagination.value.total = response.totalCount;
    vulnerabilityPagination.value.pageIndex = response.pageIndex;
    vulnerabilityPagination.value.pageSize = response.pageSize;
  };
  // 主机列表分页
  const handleHostTablePageChange = (index) => {
    hostPagination.value.pageIndex = index;
    initHostData();
  };
  // 漏洞列表分页
  const handleHostVulnerabilityTablePageChange = (index) => {
    vulnerabilityPagination.value.pageIndex = index;
    initHostVulnerabilityData();
  };
  // 跳转主机详情界面
  const gotoHostDetail = (record) => {
    router.push({
      path: '/hostscan/hostScanRecordDetail',
      query: {
        scanId: scanIdStore.scanId,
        hostId: record.id,
      },
    });
  };
  // 切换tabs栏
  const changeClick = (key) => {
    if (key === 1) {
      // 初始化主机列表
      initHostData();
    } else {
      // 初始化漏洞列表
      initHostVulnerabilityData();
    }
  };
  // 监听兄弟组件扫描记录的scanId
  watch(
    () => scanIdStore.scanId,
    (newValue, oldValue) => {
      // 初始化进度条数据
      initProgressTextData();
      // 初始化主机列表
      initHostData();
      // 初始化漏洞列表
      initHostVulnerabilityData();
    }
  );
  onMounted(() => {
    if (scanIdStore.scanId) {
      // 初始化进度条数据
      initProgressTextData();
      // 初始化主机列表
      initHostData();
      // 初始化漏洞列表
      initHostVulnerabilityData();
    }
  });
</script>

<style scoped lang="less"></style>
