<template>
  <div class="container">
    <Breadcrumb :items="['menu.asset', 'menu.asset.leak.detail']" />

    <a-card class="general-card" :title="$t('menu.asset.leak.detail')" @tab-click="handleClick">
      <!-- 返回按钮 -->
      <div class="back-btn">
        <a-button @click="goBack">{{ t('scan.add.config.goback') }}</a-button>
      </div>
    </a-card>
    <!-- 内容区域start -->
    <div class="content">
      <!-- 右侧影响资产card start -->
      <a-card style="flex:1">
        <impactAsset :impact-asset="impactAssetInfo"></impactAsset>
      </a-card>
      <!-- 左侧描述信息&tabs信息 -->
      <a-card style="flex:3;margin-left:20px">
        <detailMessage :detail-message="detailMessageInfo"></detailMessage>
      </a-card>
    </div>

  </div>
</template>
<script setup lang="ts">
// ==========================声明模块==========================
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { getLeakDetail } from '@/api/asset/search'
import impactAsset from './components/leak-detail-impact-asset.vue'
import detailMessage from './components/leak-detail-message.vue'



const { t } = useI18n();
const route = useRoute();
const router = useRouter();
// 路由参数上的id(漏洞Id)
const leakId = ref();
// 左侧详情数据
const detailMessageInfo = reactive({
})
// 右侧影响资产信息
const impactAssetInfo = ref({});
// 路由传递的资产id
leakId.value = route.query.id;
// ==========================事件响应==========================
// 初始化数据
const initInfo = async () => {
  const response = await getLeakDetail(leakId.value)
  impactAssetInfo.value = response.data.impactAsset;
  Object.assign(detailMessageInfo, response.data)
}
// 返回
const goBack = () => {
  router.go(-1);
};
// 初始化数据
initInfo()
</script>
<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
}

.general-card {
  position: relative;

  /deep/ .arco-card-header-title {
    // font-weight: 700;
    font-size: 16px;
  }

  /deep/ .arco-card-header {
    padding: 10px;
  }

  /deep/ .arco-card-body {
    padding: 0 10px 10px 10px;
  }




}

.content {
  display: flex;
  height: calc(100vh - 250px);
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