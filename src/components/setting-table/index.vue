<template>
  <div class="setting-pop">
    <a-popover
      trigger="click"
      position="br"
      @popup-visible-change="popupVisibleChange"
    >
      <a-button>
        <icon-settings size="18" />
        设置列表
      </a-button>
      <!-- <div class="action-icon"><icon-settings size="18" /></div> -->
      <template #content>
        <div id="tableSetting">
          <div
            v-for="(item, index) in showColumns"
            :key="item.dataIndex"
            class="setting"
          >
            <!-- <div style="margin-right: 4px; cursor: move">
              <icon-drag-arrow />
            </div> -->
            <div>
              <a-checkbox
                v-model="item.checked"
                @change="handleChange($event, item, index)"
              >
              </a-checkbox>
            </div>
            <div class="title">
              {{ item.title === '#' ? '序列号' : item.title }}
            </div>
          </div>
        </div>
      </template>
    </a-popover>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  defineExpose,
  defineProps,
  defineEmits,
  watch,
  reactive,
  nextTick,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { number } from 'echarts/core';
import Sortable, { mount } from 'sortablejs';
import cloneDeep from 'lodash/cloneDeep';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

const { t } = useI18n();
const props = defineProps({
  popColumns: { type: Array, required: true },
  columns: { type: Array, required: true },
  tabsKey: { type: String, required: true },
});

type Column = TableColumnData & { checked?: true };
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
// const showColumns = ref<Column[]>([]);
const exchangeArray = <T extends Array<any>>(
  array: T,
  beforeIdx: number,
  newIdx: number,
  isDeep = false
): T => {
  const newArray = isDeep ? cloneDeep(array) : array;
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(
      beforeIdx,
      1,
      newArray.splice(newIdx, 1, newArray[beforeIdx]).pop()
    );
  }
  return newArray;
};
const popupVisibleChange = (val: boolean) => {
  if (val) {
    nextTick(() => {
      const el = document.getElementById('tableSetting') as HTMLElement;
      const sortable = new Sortable(el, {
        onEnd(e: any) {
          const { oldIndex, newIndex } = e;
          exchangeArray(cloneColumns.value, oldIndex, newIndex);
          exchangeArray(showColumns.value, oldIndex, newIndex);
        },
      });
    });
  }
};
watch(
  () => props.tabsKey,
  (val) => {
    cloneColumns.value = cloneDeep(props.columns);
    console.log(props.popColumns);
    cloneColumns.value.forEach((item, index) => {
      props.popColumns.forEach((item2, index2) => {
        if (item.dataIndex === item2.dataIndex) {
          item2.checked = true;
        }
      });
    });
    showColumns.value = cloneDeep(props.popColumns);
  },
  { deep: true, immediate: true }
);
const emit = defineEmits(['handleChange2']);
const handleChange = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  emit('handleChange2', checked, column, index);
};
</script>
<style scoped lang="less">
.setting {
  &-pop {
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 9999;
  }
}
.setting {
  display: flex;
  align-items: center;
  width: 200px;
  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
