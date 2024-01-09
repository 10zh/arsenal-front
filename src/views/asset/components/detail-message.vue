<template>
  <div>
    <!-- 基本信息el-tabs -->
    <a-card style="margin:10px 0px;min-height:200px">
      <a-tabs type="rounded">
        <!-- 搜索结果start -->
        <a-tab-pane key="1" :title="$t('asset.searchListDetail.baseMessage')">
          <a-descriptions :align="{ label: 'right' }">
            <a-descriptions-item v-if="detailInfo.basic.ipv4" label="IPV4：">
              {{ detailInfo.basic.ipv4 }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.osName" :label="t('asset.searchListDetail.basic.osName') + '：'">
              {{ detailInfo.basic.osName }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.macVendor"
              :label="t('asset.searchListDetail.basic.macVendor') + '：'">
              {{ detailInfo.basic.macVendor }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.city" :label="t('asset.searchListDetail.basic.city') + '：'">
              {{ detailInfo.basic.city }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.ipv6" label="IPV6：">
              {{ detailInfo.basic.ipv6 }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.device" :label="t('asset.searchListDetail.basic.device') + '：'">
              {{ detailInfo.basic.device }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.country" :label="t('asset.searchListDetail.basic.country') + '：'">
              {{ detailInfo.basic.country }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.region" :label="t('asset.searchListDetail.basic.region') + '：'">
              {{ detailInfo.basic.region }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.hostname"
              :label="t('asset.searchListDetail.basic.hostname') + '：'">
              {{ detailInfo.basic.hostname }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.macAddress"
              :label="t('asset.searchListDetail.basic.macAddress') + '：'">
              {{ detailInfo.basic.macAddress }}
            </a-descriptions-item>
            <a-descriptions-item v-if="detailInfo.basic.province"
              :label="t('asset.searchListDetail.basic.province') + '：'">
              {{ detailInfo.basic.province }}
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
        <!-- 相关漏洞start -->
        <a-tab-pane key="2" :title="$t('asset.searchListDetail.componentsDetail')">
          <a-table :pagination="false" :data="detailInfo.components" :columns="columns">
            <template #hierarchical="{ record }">
              {{ getLevelText(record.hierarchical) }}
            </template>
          </a-table>
        </a-tab-pane>

      </a-tabs>

    </a-card>
  </div>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { getLevelText } from '@/hooks/status-options'
import { useRoute, useRouter } from 'vue-router';


const { t } = useI18n();
const router = useRouter()
// 接收来自父组件的值
const props = defineProps({
  detailInfo: {
    type: Object,
    default: () => { }
  }
});
// const baseData = computed(() => {
//   return [{
//     label: 'IPV4',
//     value: props.detailInfo.basic.ipv4,
//   }, {
//     label: t('asset.searchListDetail.basic.osName'),
//     value: props.detailInfo.basic.osName,
//   }, {
//     label: t('asset.searchListDetail.basic.macVendor'),
//     value: props.detailInfo.basic.macVendor
//   }, {
//     label: t('asset.searchListDetail.basic.city'),
//     value: props.detailInfo.basic.city
//   }, {
//     label: 'IPV6',
//     value: props.detailInfo.basic.ipv6
//   }, {
//     label: t('asset.searchListDetail.basic.device'),
//     value: props.detailInfo.basic.device
//   }, {
//     label: t('asset.searchListDetail.basic.country'),
//     value: props.detailInfo.basic.country
//   }, {
//     label: t('asset.searchListDetail.basic.region'),
//     value: props.detailInfo.basic.region
//   }, {
//     label: t('asset.searchListDetail.basic.hostname'),
//     value: props.detailInfo.basic.hostname
//   }, {
//     label: t('asset.searchListDetail.basic.macAddress'),
//     value: props.detailInfo.basic.macAddress
//   }, {
//     label: t('asset.searchListDetail.basic.province'),
//     value: props.detailInfo.basic.province
//   }]
// })
const columns = [{
  title: t('asset.searchListDetail.components.hierarchical'),
  dataIndex: 'hierarchical',
  slotName: 'hierarchical'
}, {
  title: t('asset.searchListDetail.components.name'),
  dataIndex: 'name'
}, {
  title: t('asset.searchListDetail.components.version'),
  dataIndex: 'version'
}]
// ==========================事件响应模块ss==========================
// 返回
const goBack = () => {
  router.go(-1);
};


</script>
<style lang="less" scoped>
.general-card {
  position: relative;

  /deep/ .arco-card-header-title {
    // font-weight: 700;
    font-size: 20px;
  }

  /deep/ .arco-card-header {
    padding: 10px;
  }

  /deep/ .arco-tabs-content {
    padding: 5px;
  }


}

/deep/ .arco-descriptions-body {
  padding: 0 20px;
}

.arco-scrollbar {
  height: calc(100% - 50px);
}

/deep/ .arco-card-body {
  height: 100%;
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-wrap {
  position: relative;
}

.arco-icon-search {
  font-size: 24px;
}


.icon {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 999;
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