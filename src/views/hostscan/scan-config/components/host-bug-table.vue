<template>
  <div>
    <a-table
      row-key="id"
      :columns="(cloneColumns as TableColumnData[])"
      :style="'height:' + (cardHeight - 150) + 'px'"
      :bordered="false"
      :data="hostBugData"
      :row-selection="rowSelection"
      :pagination="false"
    >
      <template #potential="{ record }">
        <a-tag :color="record.potential === false ? 'green' : 'red'">{{
          record.potential === true ? '存在漏洞' : '安全'
        }}</a-tag>
      </template>
      <template #severity="{ record }">
        {{ record.severity }}
        <a-tag :color="setSeverityRatingColor(record.severity)">{{
          getSeverityRatingText(record.severity)
        }}</a-tag>
      </template>
      <template #proof="{ record }">
        <a-tooltip
          content-class="popStyle"
          position="top"
          background-color="#fff"
        >
          <p class="text-over">{{ record.proof }}</p>
          <template #content>
            <p style="width: 200px; color: #333">{{ record.proof }}</p>
          </template>
        </a-tooltip>
      </template>
    </a-table>
    <a-pagination
      class="pagination-style"
      :total="paginationBug.total"
      :current="paginationBug.pageIndex"
      :page-size="paginationBug.pageSize"
      show-total
      show-jumper
      show-page-size
    />
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  defineExpose,
  defineProps,
  defineEmits,
  watch,
  reactive,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { number } from 'echarts/core';
import {
  getSeverityRatingText,
  setSeverityRatingColor,
} from '@/hooks/status-options';

const { t } = useI18n();
const props = defineProps({
  cloneColumns: { type: Array, required: true },
  cardHeight: { type: Number, require: true },
  hostBugData: { type: Array, required: true },
  paginationBug: { type: Object, required: true },
});
</script>
<style scoped lang="less">
.pagination-style {
  justify-content: end;
}
</style>