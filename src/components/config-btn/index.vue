<template>
  <a-tooltip :content="$t('searchTable.actions.columnSetting')">
    <a-popover trigger="click" position="lt" @popup-visible-change="popupVisibleChange">
      <div class="action-icon">
        <a-button>配置</a-button>
      </div>
      <template #content>
        <div id="tableSetting">
          <div v-for="item in showColumns" :key="item.dataIndex" class="setting">
            <div>
              <a-checkbox v-model="item.checked" @change="
                handleChange($event, item as TableColumnData, index)
                ">
              </a-checkbox>
            </div>
            <div class="title">
              {{ item.title === '#' ? '序列号' : item.title }}
            </div>
          </div>
        </div>
      </template>
    </a-popover>
  </a-tooltip>
</template>
<script lang="ts" setup>
import { watch, computed, nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import cloneDeep from 'lodash/cloneDeep';
import Sortable, { mount } from 'sortablejs';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

const { t } = useI18n();
type Column = TableColumnData & { checked?: true };
const cloneColumns = ref<Column[]>([]);
const props = defineProps({
  columns: {
    type: Array
  }
})
const emits = defineEmits(['changeTableColumn'])
// 配置展开的表各项
const showColumns = ref<Column[]>([]);
// 自定义配置展示的表单项
const handleChange = (
  checked: boolean | (string | boolean | number)[],
  column: Column,
  index: number
) => {
  if (!checked) {
    cloneColumns.value = cloneColumns.value.filter(
      (item) => item.dataIndex !== column.dataIndex
    );
  } else {
    cloneColumns.value.splice(index, 0, column);
  }
  emits('changeTableColumn', cloneColumns.value)

};
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
  () => props.columns,
  (val) => {
    val.forEach((item, index) => {
      if (item.checked) {
        cloneColumns.value.push(item)
      }
    });
    showColumns.value = cloneDeep(val);
  },
  { deep: true, immediate: true }
);
</script>
<style scoped lang="less">
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