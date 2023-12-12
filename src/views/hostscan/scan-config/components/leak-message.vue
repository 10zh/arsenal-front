<template>
  <div>
    <!-- 基本信息el-tabs -->
    <a-descriptions :column="1" :title="t('single.vulns.message')" :align="{ label: 'right' }">
      <a-descriptions-item v-if="detailMessage.vulnName" :label="t('host.scan.hostConfig.vulnName') + '：'">
        <span v-html="detailMessage.vulnName"></span>
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.ipv4" label="IPV4：">
        {{ detailMessage.ipv4 }}
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.ipv6" label="ipv6：">
        {{ detailMessage.ipv6 }}
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.cvss2" label="cvss2：">
        {{ detailMessage.cvss2 }}
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.cvss2Score" :label="t('single.vulns.cvss2Score') + '：'">
        {{ detailMessage.cvssSore }}
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.cvss3" label="cvss3">
        {{ detailMessage.cvss3 }}
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.cvss3Score" :label="t('single.vulns.cvss3Score') + '：'">
        {{ detailMessage.cvss3Score }}
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.description" :label="t('single.vulns.description') + '：'">
        <span v-html="detailMessage.description"></span>
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.port" :label="t('scan.record.port') + '：'">
        {{ detailMessage.port }}
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.safe" :label="t('scan.record.safe') + '：'">
        {{ detailMessage.safe === true ? t('scan.record.safe.true') : t('scan.record.safe.false') }}
      </a-descriptions-item>
      <a-descriptions-item v-if="detailMessage.severity" :label="t('scan.record.severity') + '：'">
        <a-tag :color="setSeverityRatingColor(detailMessage.severity)">{{ getSeverityRatingText(detailMessage.severity)
        }}</a-tag>
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { getSeverityRatingText, setSeverityRatingColor } from '@/hooks/status-options'

const { t } = useI18n();
const router = useRouter()
// 接收来自父组件的值
const props = defineProps({
  detailMessage: {
    type: Object,
    default: () => { }
  }
});
// const baseData = computed(() => {
//   return [{
//     label: 'IPV4',
//     value: props.detailMessage.basic.ipv4,
//   }, {
//     label: t('asset.searchListDetail.basic.osName'),
//     value: props.detailMessage.basic.osName,
//   }, {
//     label: t('asset.searchListDetail.basic.macVendor'),
//     value: props.detailMessage.basic.macVendor
//   }, {
//     label: t('asset.searchListDetail.basic.city'),
//     value: props.detailMessage.basic.city
//   }, {
//     label: 'IPV6',
//     value: props.detailMessage.basic.ipv6
//   }, {
//     label: t('asset.searchListDetail.basic.device'),
//     value: props.detailMessage.basic.device
//   }, {
//     label: t('asset.searchListDetail.basic.country'),
//     value: props.detailMessage.basic.country
//   }, {
//     label: t('asset.searchListDetail.basic.region'),
//     value: props.detailMessage.basic.region
//   }, {
//     label: t('asset.searchListDetail.basic.hostname'),
//     value: props.detailMessage.basic.hostname
//   }, {
//     label: t('asset.searchListDetail.basic.macAddress'),
//     value: props.detailMessage.basic.macAddress
//   }, {
//     label: t('asset.searchListDetail.basic.province'),
//     value: props.detailMessage.basic.province
//   }]
// })
const columns = [{
  title: t('asset.searchListDetail.components.hierarchical'),
  dataIndex: 'hierarchical'
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