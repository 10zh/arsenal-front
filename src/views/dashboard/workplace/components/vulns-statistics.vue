<template>
  <a-card class="general-card" style="height:100%" :title="$t('vulns.statistics') + number"
    :header-style="{ paddingBottom: '0', paddingTop: '5px' }"
    :body-style="{ padding: '0px 20px 0px 20px', height: '100%' }">
    <!-- 数量下拉框 -->
    <template #extra>
      <a-select v-model="number" @change="initVulnsTop" :style="{ width: '80px' }">
        <a-option :value="10">10</a-option>
        <a-option :value="15">15</a-option>
        <a-option :value="20">20</a-option>
      </a-select>
    </template>
    <div style="height:100%">
      <!-- 列表展示 -->
      <a-scrollbar style="height:250px;overflow: auto;">
        <div v-for="(item, idx) in vulnsTop" :key="idx" class="item">
          <a-tag :color="setRiskGradeColor(item.grade)" size="small">{{ setRiskGradeText(item.grade)
          }}</a-tag>
          <span class="item-content">
            {{ item.name
            }}:{{ item.assetNumber }}
          </span>
        </div>
      </a-scrollbar>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
// ==========================声明==========================
import { useI18n } from 'vue-i18n';
import { computed, defineProps, onMounted, ref } from 'vue';
import { queryVulnsTop } from '@/api/dashboard'
import { setRiskGradeColor, setRiskGradeText } from '@/hooks/status-options'

const number = ref(10);
const vulnsTop = ref();
// ==========================初始化数据==========================
// 查询漏洞top
const initVulnsTop = async () => {
  const res = await queryVulnsTop(number.value);
  vulnsTop.value = res.data;
}
onMounted(() => {
  initVulnsTop()
})
</script>

<style scoped lang="less">
.item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  margin: 4px 0;

  .item-content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 4px;
    color: var(--color-text-2);
    text-decoration: none;
    font-size: 13px;
    cursor: pointer;
  }
}
</style>
