<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', 'menu.list.searchTable']" />
    <a-card class="general-card" :title="$t('menu.list.searchTable')" :style="'height:'+cardHeight+'px'">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item
                  field="name"
                  :label="$t('searchTable.form.name')"
                >
                  <a-input
                    v-model="formModel.name"
                    :placeholder="$t('searchTable.form.name.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="address" :label="$t('searchTable.form.address')">
                  <a-input
                    v-model="formModel.address"
                    :placeholder="$t('searchTable.form.address.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="port" :label="$t('searchTable.form.port')">
                  <a-input
                    v-model="formModel.port"
                    :placeholder="$t('searchTable.form.port.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="status"
                  :label="$t('searchTable.form.status')"
                >
                  <a-select
                    v-model="formModel.status"
                    :options="contentTypeOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
             
              <a-col :span="8">
                <a-form-item
                  field="updateTime"
                  :label="$t('searchTable.form.updateTime')"
                >
                  <a-range-picker
                    v-model="formModel.updateTime"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item
                  field="isLocal"
                  :label="$t('searchTable.form.isLocal')"
                >
                  <a-select
                    v-model="formModel.isLocal"
                    :options="statusOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleAdd('add')">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <!-- <a-upload action="/">
              <template #upload-button>
                <a-button>
                  {{ $t('searchTable.operation.import') }}
                </a-button>
              </template>
            </a-upload> -->
          </a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: end"
        >
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <a-tooltip :content="$t('searchTable.actions.columnSetting')">
            <a-popover
              trigger="click"
              position="bl"
              @popup-visible-change="popupVisibleChange"
            >
              <div class="action-icon"><icon-settings size="18" /></div>
              <template #content>
                <div id="tableSetting">
                  <div
                    v-for="(item, index) in showColumns"
                    :key="item.dataIndex"
                    class="setting"
                  >
                    <div style="margin-right: 4px; cursor: move">
                      <icon-drag-arrow />
                    </div>
                    <div>
                      <a-checkbox
                        v-model="item.checked"
                        @change="
                          handleChange($event, item as TableColumnData, index)
                        "
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
          </a-tooltip>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="false"
        :style="'height:'+(cardHeight - 280)+'px'"
        :size="size"
        align="center"
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #filterType="{ record }">
          {{ $t(`searchTable.form.filterType.${record.filterType}`) }}
        </template>
        <template #status="{ record }">
          <span v-if="record.status == '0'" style="color:red">下线</span>
          <span v-else style="color: green;">在线</span>
          <!-- {{ $t(`searchTable.form.status.${record.status}`) }} -->
        </template>
        <template #isLocal="{ record }">
          <span v-if="record.isLocal == false" >否</span>
          <span v-else>是</span>
          <!-- {{ $t(`searchTable.form.status.${record.status}`) }} -->
        </template>
        <template #updateTime="{ record }">
          {{formatDate(record.updateTime,'YYYY-MM-DD hh:mm:ss') }}
        </template>
        <template #operations="{ record }">
          <!-- v-permission="['admin']"  -->
          <a-button type="text" size="small"  @click="handleAdd('edit',record)" style="padding:0px">
            {{ $t('searchTable.columns.operations.edit') }}
          </a-button>
          <a-popconfirm content="刷新该引擎" @ok="refresh(record)">
              <a-button type="text" size="small">
              {{ $t('searchTable.columns.operations.refresh') }}
            </a-button>
          </a-popconfirm>
         
        </template>
      </a-table>
    </a-card>
    <!-- 新增引擎对话框 -->
    <AddEngineDialog ref="addEngineRef" :dialogType = "dialogType" :tableRow = "tableRow"  @refreshList="fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick, onMounted } from 'vue';
  import formatDate from '@/utils/times'
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import {  PolicyRecord, PolicyParams, getScanEngines,refreshScanEngines} from '@/api/list';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable, { mount } from 'sortablejs';
  import { Message } from '@arco-design/web-vue';
  import AddEngineDialog from './components/add-engine-dialog.vue'


  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const generateFormModel = () => {
    return {
      address: '',
      name: '',
      port:'',
      isLoal:'',
      updateTime:'',
      // contentType: '',
      // filterType: '',
      // createdTime: [],
      status: '',
    };
  };
  const { loading, setLoading } = useLoading(true);
  const { t } = useI18n();
  const renderData = ref<PolicyRecord[]>([]);
  const formModel = ref(generateFormModel());
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const addEngineRef = ref<InstanceType<typeof AddEngineDialog> | null>(null)

  const size = ref<SizeProps>('medium');
  const dialogType = ref<string>('')
  const tableRow = ref<PolicyRecord>()
  const cardHeight = ref<number>();
  cardHeight.value = document.documentElement.clientHeight - 180;
  const basePagination: Pagination = {
    current: 1,
    pageSize: Math.floor((cardHeight.value - 300) / 43),
  };
  const pagination = reactive({
    ...basePagination,
  });
  const densityList = computed(() => [
    {
      name: t('searchTable.size.mini'),
      value: 'mini',
    },
    {
      name: t('searchTable.size.small'),
      value: 'small',
    },
    {
      name: t('searchTable.size.medium'),
      value: 'medium',
    },
    {
      name: t('searchTable.size.large'),
      value: 'large',
    },
  ]);
  const columns = computed<TableColumnData[]>(() => [
    {
      title: t('searchTable.columns.index'),
      dataIndex: 'index',
      slotName: 'index',
    },
    {
      title: t('searchTable.columns.address'),
      dataIndex: 'address',
    },
    {
      title: t('searchTable.columns.name'),
      dataIndex: 'name',
    },
    {
      title: t('searchTable.columns.assignedTaskNumber'),
      dataIndex: 'assignedTaskNumber',
      // slotName: 'contentType',
    },
    {
      title: t('searchTable.columns.isLocal'),
      dataIndex: 'isLocal',
       slotName: 'isLocal',
    },
    {
      title: t('searchTable.columns.port'),
      dataIndex: 'port',
    },
    {
      title: t('searchTable.columns.updateTime'),
      dataIndex: 'updateTime',
      slotName:'updateTime',
    },
    {
      title: t('searchTable.columns.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('searchTable.columns.operations'),
      dataIndex: 'operations',
      slotName: 'operations',
    },
  ]);
  const contentTypeOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.contentType.outline'),
      value: '0',
    },
    {
      label: t('searchTable.form.contentType.online'),
      value: '1',
    }
  ]);
  const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: t('searchTable.form.status.false'),
      value: 'false',
    },
    {
      label: t('searchTable.form.status.true'),
      value: 'true',
    },
  ]);
  const fetchData = async (
    params: PolicyParams = { current: 1, pageSize: 20 }
  ) => {
    setLoading(true);
    try {
      const data = await getScanEngines(params);
      renderData.value = data.data;
      pagination.current = data.totalCount;
      pagination.total = data.totalPages;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      ...basePagination,
      ...formModel.value,
    } as unknown as PolicyParams);
  };
  const onPageChange = (current: number) => {
    fetchData({ ...basePagination, current });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };

  const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const handleChange = (
    checked: boolean | (string | boolean | number)[],
    column: Column,
    index: number
  ) => {
    if (!checked) {
      cloneColumns.value = showColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      cloneColumns.value.splice(index, 0, column);
    }
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
  
const handleAdd = (type : string,row ?: PolicyRecord) => {
  dialogType.value = type;
  tableRow.value = row;
  addEngineRef.value?.setVisibleData(true);
}
const refresh = async (record:PolicyRecord)=>{
  const data = await refreshScanEngines(record.id);
    if(data.success){
      Message.success("刷新成功");
    }else{
    Message.error(data.errMessage);
    }


}
  watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    { deep: true, immediate: true }
  );
  
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
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
  /deep/ .arco-table-container {
    height: 100%;

  }
</style>
