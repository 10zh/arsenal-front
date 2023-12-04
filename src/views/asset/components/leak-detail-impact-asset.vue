<template>
  <div>
    <a-descriptions style="margin-top: 20px" :title="t('asset.leak.detail.impactAsset')" :data="impactAssetData"
      :column="1">
    </a-descriptions>
  </div>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';

// 接收来自父组件的值
const props = defineProps({
  impactAsset: {
    type: Object,
    default: () => { }
  }
});
const { t } = useI18n();
// 影响资产描述信息
const impactAssetData = computed(() => {
  return [{
    label: t('asset.leak.detail.device'),
    value: props.impactAsset.device,
  }, {
    label: t('asset.leak.detail.hostType'),
    value: props.impactAsset.hostType,
  }, {
    label: t('asset.leak.detail.hostName'),
    value: props.impactAsset.hostName,
  }, {
    label: t('asset.leak.detail.ipv4'),
    value: props.impactAsset.ipv4,
  }, {
    label: t('asset.leak.detail.ipv6'),
    value: props.impactAsset.ipv6,
  }, {
    label: t('asset.leak.detail.macAddress'),
    value: props.impactAsset.macAddress,
  }, {
    label: t('asset.leak.detail.macVendor'),
    value: props.impactAsset.macVendor,
  }, {
    label: t('asset.leak.detail.osName'),
    value: props.impactAsset.osName,
  }, {
    label: t('asset.leak.detail.osVersion'),
    value: props.impactAsset.osVersion,
  }]
})
</script>
<style lang="less" scoped></style>