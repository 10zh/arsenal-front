<template>
  <div class="container">
    <Breadcrumb :items="[
      'menu.hostscan',
      'menu.hostscan.config',
      'menu.hostscan.config.detail',
    ]" />
    <a-layout>
      <!-- 头部信息块start -->
      <a-card ref="header" :title="t('menu.list.configDetail')" :bordered="false">
        <!-- 返回按钮 -->
        <div class="back-btn">
          <a-button @click="goBack">{{ t('scan.add.config.goback') }}</a-button>
        </div>
        <a-layout-header>
          <div style="background: #f2f3f5; padding: 10px 20px">
            <a-space direction="vertical" size="large" fill>
              <a-descriptions :data="configDetailData" :align="{ label: 'right' }">
                <a-descriptions-item v-for="item in configDetailData" :key="item.label" :label="item.label + ' :'">
                  <a-tag v-if="item.slotName" :color="getStatusColor(item.value)">{{ getStatusText(item.value) }}</a-tag>
                  <span v-else>{{ item.value }}</span>
                </a-descriptions-item>
              </a-descriptions>
            </a-space>
          </div>
        </a-layout-header>
      </a-card>
      <!-- 头部信息块end -->
      <a-layout class="content-container">
        <a-layout-sider class="side-layout">
          <!-- 右侧扫描记录列表 -->
          <a-card class="out-card" :style="{ height: tableHeight + 'px' }">
            <configDetailRecordList :table-height="tableHeight">
            </configDetailRecordList>
          </a-card>
        </a-layout-sider>
        <!-- 左侧主机列表&单个扫描记录的详情 -->
        <a-layout-content>
          <configScanDetailRecordList :table-height="tableHeight"></configScanDetailRecordList>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import formatDate from '@/utils/times';
import { getHostScanConfigDetail } from '@/api/scan/scan-config';
import { getStatusColor, getStatusText } from '@/hooks/status-options';
// 引入组件
import configDetailRecordList from './components/config-detail-record-list.vue';
import configScanDetailRecordList from './components/config-detail-scan-record-list.vue';

// ==========================数据定义模块==========================
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
// 扫描配置ID
const id: any = route.query.configId;
// 扫描配置详情
const configDetailData: any = ref([]);
// 头部实例用来动态计算高度
const header = ref();
// 表格高度
const tableHeight = ref(0);

// ==========================数据操纵模块==========================
// 初始化扫描配置详情
const initScanConfigDetail = async () => {
  const configDetail: any = await getHostScanConfigDetail(id);
  const configDetailDataList = [];
  configDetailDataList.push({
    label: t('host.scan.config.configName'),
    value: configDetail.data.configName,
  });
  configDetailDataList.push({
    label: t('host.scan.config.engineName'),
    value: configDetail.data.engineName,
  });
  configDetailDataList.push({
    label: t('host.scan.config.templateName'),
    value: configDetail.data.templateName,
  });
  configDetailDataList.push({
    label: t('host.scan.config.target'),
    value: configDetail.data.target,
  });
  if (configDetail.data.excludeTarget) {
    configDetailDataList.push({
      label: t('host.scan.config.excludeTarget'),
      value: configDetail.data.excludeTarget,
    });
  }

  configDetailDataList.push({
    label: t('host.scan.config.createTime'),
    value: formatDate(configDetail.data.createTime, 'YYYY-MM-DD hh:mm:ss'),
  });
  configDetailDataList.push({
    label: t('host.scan.config.updateTime'),
    value: formatDate(configDetail.data.updateTime, 'YYYY-MM-DD hh:mm:ss'),
  });
  configDetailDataList.push({
    label: t('host.scan.config.lastScanStatus'),
    value: configDetail.data.lastScanStatus,
    slotName: 'lastScanStatus',
  });
  configDetailData.value = configDetailDataList;
};
// 当页面加载时，显示数据
onMounted(async () => {
  console.log(header.value.$el.offsetHeight);
  const height =
    document.documentElement.clientHeight -
    header.value.$el.offsetHeight -
    260;
  tableHeight.value = height;
  // 扫描配置详情
  initScanConfigDetail();
});
// ==========================事件响应模块==========================
// 返回
const goBack = () => {
  router.go(-1);
};
</script>

<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

.out-card {
  /deep/ .arco-card-body {
    height: calc(100% - 50px);
  }
}

.side-layout {
  display: flex;
  flex-direction: column;
  background-color: #f2f3f5;
  /* border: 1px solid #f3f5f6; */
  height: 100%;
  margin-right: 20px;
  width: 300px !important;
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



.content-container {
  margin-top: 20px;
}

.back-btn {
  text-align: right;
  padding-top: 20px;
  position: absolute;
  top: -12px;
  right: 20px;
  z-index: 99;
}
</style>
<style>
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
</style>
