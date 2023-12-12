<template>
  <div class="container">
    <Breadcrumb :items="[
      'menu.hostscan',
      'menu.hostscan.config',
      'menu.hostscan.config.record.host.detail',
    ]" />
    <div class="back-btn">
      <a-button @click="goBack">{{ t('scan.add.config.goback') }}</a-button>
    </div>
    <a-tabs type="rounded" :active-key="activeKey" @tab-click="tabChange" style="padding: 0 10px">

      <!--网络资产空间测绘 start-->
      <a-tab-pane key="1">
        <template #title>
          <icon-calendar /> {{ t('scan.record.network.discovery') }}
        </template>
        <SpaceMap :tab-detail="tabDetail" :service-detail="serviceDetail" :host-detail="hostDetail"
          @changeTabDetail="changeTabDetail">
        </SpaceMap>
      </a-tab-pane>
      <!--网络资产空间测绘 end-->
      <!--主机漏洞列表 start-->
      <a-tab-pane key="2">
        <template #title>
          <icon-clock-circle /> {{ t('scan.record.host.risk') }}
        </template>
        <a-card>
          <HostRisk></HostRisk>
        </a-card>
      </a-tab-pane>
      <!--主机漏洞列表 end-->
    </a-tabs>
  </div>
</template>

<script setup>
// ==========================声明模块==========================
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import {
  getHostRecordDetailByScanHostId,
  getHostServiceRecordDetailByScanHostId,
} from '@/api/scan/scan-record';
import SpaceMap from './components/record-detail-space-map.vue';
import HostRisk from './components/record-detail-host-risk.vue';

// ==========================数据定义模块==========================
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// 扫描配置ID
const { scanId, hostId } = route.query;

// 主机详情数据
const hostDetail = ref({});

// 服务详情数据
const serviceDetail = ref([]);
// 对应端口详情数据
const tabDetail = ref({});
// 激活的tab - key
const activeKey = ref();

// ==========================数据操纵模块==========================
// 初始化主机详情
const initHostScanRecordDetail = async () => {
  const response = await getHostRecordDetailByScanHostId(scanId, hostId);
  hostDetail.value = response.data;
};
// 初始化服务详情
const initHostScanServiceRecordDetail = async () => {
  const response = await getHostServiceRecordDetailByScanHostId(
    scanId,
    hostId
  );
  serviceDetail.value = response.data;
  const data = response.data[0];
  // 初始化右侧数据详情（默认显示第一个）
  tabDetail.value = data;
};
// 返回
const goBack = () => {
  router.go(-1);
};
// 当页面加载时，显示数据
onMounted(() => {
  if (localStorage.getItem('tabsInfo')) {
    activeKey.value = localStorage.getItem('tabsInfo')
  }
  initHostScanRecordDetail();
  initHostScanServiceRecordDetail();
});
// ==========================事件响应模块==========================
// 空间测绘子组件改变tabDetail值
const changeTabDetail = (row) => {
  tabDetail.value = row;
};
// 切换tabs标签(将activeKey存放到localStorage中便于放回当前tab)
const tabChange = (key) => {
  activeKey.value = key;
  if (key === '2') {
    localStorage.setItem('tabsInfo', key)
  } else {
    localStorage.removeItem('tabsInfo')
  }
}
</script>

<style lang="less">
.left-card {
  border-top: 2px solid #f2a20e;
}

.right-card {
  border-top: 2px solid #41a4db;
}

.arco-anchor-link-item .arco-anchor-link {
  padding: 0px;
  width: 50px;
}

.arco-anchor {
  width: auto;
  margin-right: 20px;
}

.wrap-text {
  position: relative;
  white-space: pre-wrap;
}

.arco-typography-operation-copy {
  position: absolute;
  right: 0px;
  top: -2px;
}

.arco-typography-operation-copied {
  position: absolute;
  right: 0px;
  top: -2px;
}

.ellip-text {
  white-space: nowrap;
  cursor: pointer;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100px;
}

.paginationStyle {
  margin-top: 10px;
  justify-content: end;
}

.label {
  display: inline-block;
  padding-right: 10px;
  padding-bottom: 10px;
}

.value {
  color: #333;
}

.back-btn {
  position: absolute;
  right: 35px;
  z-index: 99;
}
</style>
