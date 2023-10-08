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
                <a-link>{{ t(ScanStatus[item.scanStatus]) }}</a-link>
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
          </a-layout-sider>
          <a-layout-content>Content</a-layout-content>
        </a-layout>
      </a-layout>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute } from 'vue-router';
  import { formatSeconds } from '@/utils/times';
  import { getHostScanConfigDetail } from '@/api/scan/scan-config';
  import { getHostScanRecordList, ScanStatus } from '@/api/scan/scan-record';

  const { t } = useI18n();
  const route = useRoute();
  // 当前选中的扫描记录
  const selected = ref(0);

  // ==========================数据定义模块==========================
  const id = route.query.configId;
  // 扫描配置详情数据
  const cofigDetailData = ref([]);
  const configRecordData = ref([]);
  // 分页对象参数
  const pagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 5,
  });

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
    const recordData = await getHostScanRecordList(id, pagination);
    configRecordData.value = recordData.data;
  };
  // 当页面加载时，显示数据
  onMounted(() => {
    // 扫描配置详情
    initScanConfigDetail();
    // 当前扫描配置详情的扫描记录列表
    initScanConfigRecordData();
    // 当前选中的扫描记录详情
  });
  // ==========================事件响应模块==========================
  const handleClickRecordCard = (item, index) => {
    selected.value = index;
  };
</script>

<style scoped>
  .container {
    padding: 0 20px 20px 20px;
  }

  .side-layout {
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border: 1px solid #f3f5f6;
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
</style>
