<template>
  <div class="container">
    <Breadcrumb
      :items="[
        'menu.hostscan',
        'menu.hostscan.config',
        'menu.hostscan.config.detail',
      ]"
    />
    <a-card :title="$t('host.scan.config.detail')">
      <a-layout class="config-detail-layuout">
        <a-layout-header>
          <a-space direction="vertical" size="large" fill>
            <a-descriptions
              :data="cofigDetailData"
              layout="vertical"
              bordered
            />
          </a-space>
        </a-layout-header>
        <a-layout>
          <a-layout-sider class="side-layout">
            <a-card
              v-for="(item, index) in configRecordData"
              :key="item.scanId"
              :bordered="false"
              class="card-record"
              :class="{ select: selected === index }"
              :title="formatSeconds(item.scanCostTime)"
              @click="handleClickRecordCard(item, index)"
            >
              <template #extra>
                <a-tag :color="ScanStatusColor[item.scanStatus]">{{
                  t(ScanStatus[item.scanStatus])
                }}</a-tag>
              </template>
              <a-row>
                <a-space>
                  <a-typography-text>
                    {{ t('engine') + ': ' + item.engineName }}
                  </a-typography-text>
                  <a-typography-text>
                    {{ t('template') + ': ' + item.templateName }}
                  </a-typography-text>
                </a-space>
              </a-row>
            </a-card>
            <a-pagination
              :style="{ marginTop: '10px', marginBottom: '10px' }"
              :total="pagination.total"
              simple
              @change="changePageIndex"
            />
          </a-layout-sider>
          <a-layout-content>
            <a-card class="record-detail-header">
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
            <a-card>
              <a-tabs>
                <a-tab-pane key="1">
                  <template #title>
                    <icon-calendar /> {{ t('scan.record.host.list') }}
                  </template>
                  <a-table
                    :columns="hostTableColumns"
                    :data="hostData"
                    :bordered="{ cell: true }"
                    :pagination="hostPagination"
                    @page-change="handleHostTablePageChange"
                  >
                    <template #ipv4="{ record }">
                      <a-link @click="gotoHostDetail(record)">{{
                        record.ipv4
                      }}</a-link>
                    </template>
                    <template #ipv6="{ record }">
                      <a-link @click="gotoHostDetail(record)">{{
                        record.ipv6
                      }}</a-link>
                    </template>
                  </a-table>
                </a-tab-pane>
                <a-tab-pane key="2">
                  <template #title>
                    <icon-clock-circle />
                    {{ t('scan.record.host.vulnerability.list') }}
                  </template>
                  <a-table
                    :columns="vulnerabilityTableColumns"
                    :data="vulnerabilityData"
                    column-resize
                    :bordered="{ cell: true }"
                    :pagination="vulnerabilityPagination"
                    @page-change="handleHostVulnerabilityTablePageChange"
                  >
                    <template #potential="{ record }">
                      {{
                        record.potential ? t('global.true') : t('global.false')
                      }}
                    </template>
                    <template #safe="{ record }">
                      {{ record.safe ? t('global.true') : t('global.false') }}
                    </template>
                  </a-table>
                </a-tab-pane>
              </a-tabs>
            </a-card>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter } from 'vue-router';
  import { formatSeconds } from '@/utils/times';
  import { getHostScanConfigDetail } from '@/api/scan/scan-config';
  import {
    getHostScanRecordList,
    ScanStatus,
    ScanStatusColor,
    getHostScanRecordDetail,
    getHostListRecordByScanId,
    getHostVulnerabilityListRecordByScanId,
  } from '@/api/scan/scan-record';

  // ==========================数据定义模块==========================
  const { t } = useI18n();
  const route = useRoute();
  const router = useRouter();
  // 扫描配置ID
  const id = route.query.configId;
  // 扫描配置详情
  const cofigDetailData = ref([]);
  // 扫描配置记录
  const configRecordData = ref([]);
  // 当前选中的扫描记录
  const selected = ref(0);
  // 进度条文本展示
  const progressTextData = ref({});
  // 分页对象参数
  const pagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 5,
    order: 'desc',
    sort: 'scanStartTime',
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
  // 主机列表分页参数
  const hostPagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  // 主机列表数据
  const hostData = ref([]);
  // 漏洞列表表头
  const vulnerabilityTableColumns = reactive([
    {
      title: t('scan.record.vulnName'),
      dataIndex: 'vulnName',
      width: '300',
    },
    {
      title: t('scan.record.ipv4'),
      dataIndex: 'ipv4',
      width: '150',
    },
    {
      title: t('scan.record.ipv6'),
      dataIndex: 'ipv6',
      width: '300',
    },
    {
      title: t('scan.record.port'),
      dataIndex: 'port',
    },
    {
      title: t('scan.record.componentName'),
      dataIndex: 'componentName',
      width: '150',
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
  // 漏洞列表分页参数
  const vulnerabilityPagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  });
  // 漏洞列表数据
  const vulnerabilityData = ref([]);
  // ==========================数据操纵模块==========================
  // 初始化扫描配置详情
  const initScanConfigDetail = async () => {
    const configDetail = await getHostScanConfigDetail(id);
    cofigDetailData.value.push({
      label: t('host.scan.config.configName'),
      value: configDetail.data.configName,
    });
    cofigDetailData.value.push({
      label: t('host.scan.config.engineName'),
      value: configDetail.data.engineName,
    });
    cofigDetailData.value.push({
      label: t('host.scan.config.templateName'),
      value: configDetail.data.templateName,
    });
    cofigDetailData.value.push({
      label: t('host.scan.config.target'),
      value: configDetail.data.target,
    });
    cofigDetailData.value.push({
      label: t('host.scan.config.excludeTarget'),
      value: configDetail.data.excludeTarget,
    });
  };
  // 初始化当前扫描配置的所有列表
  const initScanConfigRecordData = async () => {
    const recordData = await getHostScanRecordList(id, pagination.value);
    configRecordData.value = recordData.data;
    // 分页参数赋值
    pagination.value.total = recordData.totalCount;
    pagination.value.pageIndex = recordData.pageIndex;
    pagination.value.pageSize = recordData.pageSize;
  };
  // 初始化进度条文本数据
  const initProgressTextData = async () => {
    const response = await getHostScanRecordDetail(
      configRecordData.value[selected.value].scanId
    );
    progressTextData.value = response.data;
    console.log(progressTextData.value);
  };
  // 初始化主机列表数据
  const initHostData = async () => {
    const response = await getHostListRecordByScanId(
      configRecordData.value[selected.value].scanId,
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
    const response = await getHostVulnerabilityListRecordByScanId(
      configRecordData.value[selected.value].scanId,
      vulnerabilityPagination.value
    );
    vulnerabilityData.value = response.data;
    console.log('host vulnerability info', response);
    vulnerabilityPagination.value.total = response.totalCount;
    vulnerabilityPagination.value.pageIndex = response.pageIndex;
    vulnerabilityPagination.value.pageSize = response.pageSize;
  };
  // 当页面加载时，显示数据
  onMounted(async () => {
    // 当前扫描配置详情的扫描记录列表
    await initScanConfigRecordData();
    // 扫描配置详情
    initScanConfigDetail();
    // 当前选中的扫描记录详情
    initProgressTextData();
    // 初始化主机列表数据
    initHostData();
    // 初始化主机漏洞列表数据
    initHostVulnerabilityData();
  });
  // ==========================事件响应模块==========================
  const handleClickRecordCard = (item, index) => {
    selected.value = index;
    // 当前选中的扫描记录详情
    initProgressTextData();
    // 当前选中的扫描记录主机列表
    initHostData();
    // 当前选中的漏洞列表
    initHostVulnerabilityData();
  };
  // 页数发生改变
  const changePageIndex = (index) => {
    pagination.value.pageIndex = index;
    // 刷新扫描配置记录列表
    initScanConfigRecordData();
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
        scanId: configRecordData.value[selected.value].scanId,
        hostId: record.id,
      },
    });
  };
</script>

<style>
  .container {
    padding: 0 20px 20px 20px;
  }

  .side-layout {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border: 1px solid #f3f5f6;
    height: 100%;
  }

  .arco-layout-sider-children {
    overflow: hidden;
  }

  .card-record {
    background-color: #ffffff;
    margin-top: 10px;
    border: 2px solid #f3f5f6;
    border-left: none;
    border-right: none;
  }

  .select {
    background-color: rgb(237, 244, 251);
  }

  .record-detail-header {
    margin-top: 12px;
    position: relative;
  }

  .arco-progress-line {
    opacity: 0.5;
    border-radius: 0px;
  }

  .arco-progress-line-bar {
    border-radius: 0px;
  }

  #record-detail-progress-text {
    position: absolute;
    width: 100%;
    height: 100px;
    top: 16px;
    left: 36px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .arco-statistic-extra {
    font-weight: 500;
    font-size: 26px;
    color: var(--color-text-1);
  }
</style>
