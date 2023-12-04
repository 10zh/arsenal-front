<template>
  <div>
    <!-- 头部漏洞描述信息start -->
    <a-descriptions style="margin-top: 20px;max-height:150px;">
      <a-descriptions-item v-for="item in detailMessageData" :key="item.label" :label="item.label">
        <span v-if="item.slot === 'desc'" v-html="item.value"></span>
        <span v-else>{{ item.value }}</span>
      </a-descriptions-item>
    </a-descriptions>
    <a-divider></a-divider>
    <!-- 扩展信息&解决方案start -->
    <a-tabs type="rounded">
      <!-- 扩展信息start -->
      <a-tab-pane key="1" :title="t('asset.leak.detail.extras')">
        <a-scrollbar style="height:calc(100vh - 550px);overflow:auto">
          <a-table :columns="columns" :data="detailMessage.extras" :pagination="false" />
        </a-scrollbar>
      </a-tab-pane>
      <!-- 解决方案start -->
      <a-tab-pane key="2" :title="t('asset.leak.detail.solutions')">
        <a-scrollbar style="height:calc(100vh - 550px);overflow:auto">
          <a-table :columns="solutionColumns" :data="detailMessage.solutions" :pagination="false">

            <template #additionalInfo="{ record }">
              <span v-html="record.additionalInfo"></span>
            </template>
            <template #rollUp="{ record }">
              <span v-html="record.rollUp"></span>
            </template>
            <template #workaround="{ record }">
              <span v-html="record.workaround"></span>
            </template>
          </a-table>
        </a-scrollbar>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import formatDate from '@/utils/times'
import { setRiskGradeText, setRiskGradeColor, getSeverityRatingText } from '@/hooks/status-options'

// 接收来自父组件的值
const props = defineProps({
  detailMessage: {
    type: Object,
    default: () => { }
  }
});
const { t } = useI18n();
// 头部漏洞信息声明
const detailMessageData = computed(() => {
  return [{
    label: t('asset.search.detail.vulns.vulnName'),
    value: props.detailMessage.vulnName,
  }, {
    label: t('asset.search.detail.vulns.riskGrade'),
    value: setRiskGradeText(props.detailMessage.riskGrade),
  }, {
    label: t('asset.search.detail.vulns.cvss2'),
    value: props.detailMessage.cvss2,
  }, {
    label: t('asset.search.detail.vulns.cvss3'),
    value: props.detailMessage.cvss3,
  }, {
    label: t('asset.search.detail.vulns.severity'),
    value: getSeverityRatingText(props.detailMessage.severity),
  }, {
    label: t('asset.search.detail.vulns.createTime'),
    value: formatDate(props.detailMessage.createTime, 'YYYY-MM-DD'),
  }, {
    label: t('asset.search.detail.vulns.description'),
    value: `${props.detailMessage.description}`,
    slot: 'desc'
  }]
})
// =========================表格定义==========================
// 扩展信息表格头信息
const columns = [
  {
    title: t('asset.leak.detail.extras.name'),
    dataIndex: 'name',
  }, {
    title: t('asset.leak.detail.extras.value'),
    dataIndex: 'value',
  }]
// 解决方案表格头信息
const solutionColumns = [
  {
    title: t('asset.leak.detail.solutions.title'),
    dataIndex: 'title',
  }, {
    title: t('asset.leak.detail.solutions.additionalInfo'),
    dataIndex: 'additionalInfo',
    slotName: 'additionalInfo',
    width: 400,
  }, {
    title: t('asset.leak.detail.solutions.patch'),
    dataIndex: 'patch',
  }, {
    title: t('asset.leak.detail.solutions.rollUp'),
    dataIndex: 'rollUp',
    slotName: 'rollUp',

  }, {
    title: t('asset.leak.detail.solutions.superCedeList'),
    dataIndex: 'superCedeList',
  }, {
    title: t('asset.leak.detail.solutions.workaround'),
    dataIndex: 'workaround',
    width: 300,
    slotName: 'workaround'
  },]

</script>
<style lang="less" scoped>
/deep/ .arco-descriptions-item-value {
  white-space: normal;
}
</style>