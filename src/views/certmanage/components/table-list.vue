<template>
  <!--数据搜索模块 start-->
  <div ref="header">
    <a-row>
      <a-col :flex="1">
        <a-form :model="pagination" label-align="left" auto-label-width>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="authType" :label="t('cerManage.list.authType')">
                <a-select v-model="pagination.authType" :placeholder="t('cerManage.list.authType.placeHolder')"
                  :options="authTypeOptions" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="name" :label="t('cerManage.list.name')">
                <a-input v-model="pagination.name" :placeholder="t('cerManage.list.name.placeHolder')
                  "></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="port" :label="t('cerManage.list.port')">
                <a-input v-model="pagination.port" :placeholder="t('cerManage.list.port.placeHolder')
                  "></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="target" :label="t('cerManage.list.target')">
                <a-input v-model="pagination.target" :placeholder="t('cerManage.list.target.placeHolder')
                  "></a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <!-- 查询&重置按钮start -->
      <a-divider style="height: 84px" direction="vertical"></a-divider>
      <a-col :flex="'86px'" style="text-align: right">
        <a-space direction="vertical" :size="18">
          <a-button type="primary" default-checked style="margin: 0 10px" @click="initCertList">
            <template #icon>
              <icon-search />
            </template>
            {{ $t('global.search') }}
          </a-button>
          <a-button style="margin: 0 10px" @click="reset">
            <template #icon>
              <icon-refresh />
            </template>
            {{ $t('global.reset') }}
          </a-button>
        </a-space>
      </a-col>
      <!-- 查询&重置按钮end -->
    </a-row>
    <!--数据搜索模块 end-->
    <a-divider style="margin-top: 0"></a-divider>
    <!-- 新增按钮start -->
    <a-row style="margin-bottom: 16px" :gutter="24">
      <a-col :span="12" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('cerManage.list.add') }}
          </a-button>
          <a-button type="primary" status="warning" @click="handleBatchDel">
            <template #icon>
              <icon-delete />
            </template>
            {{ $t('cerManage.list.batch.delete') }}
          </a-button>
        </a-space>
      </a-col>
      <a-col :span="12" style="display: flex;justify-content: end;">
        <!-- 配置表单的按钮 -->
        <ConfigBtn :columns="columns" @changeTableColumn="changeColumn"></ConfigBtn>
      </a-col>
    </a-row>
  </div>
  <!--凭证数据表格 start-->
  <a-table :columns="(cloneColumns as TableColumnData[])" :style="{ height: tableHeight + 'px' }" :data="tableData"
    :bordered="false" :row-selection="rowSelection" row-key="id" v-model:selectedKeys="selectedKeys" :pagination="false"
    @sorter-change="sortedChangeEvent">
    <template #updateTime="{ record }">
      {{ formatDate(record.updateTime, 'YYYY-MM-DD hh:mm:ss') }}
    </template>
    <template #createTime="{ record }">
      {{ formatDate(record.createTime, 'YYYY-MM-DD hh:mm:ss') }}
    </template>

    <template #operations="{ record }">
      <a-button type="text" size="small" style="padding: 0px" @click="handleEditCert(record)">
        {{ $t('scan.template.operator.edit') }}
      </a-button>
      <a-popconfirm :content="t('cert.operator.delete.question')" @ok="handleDelete(record)">
        <a-button type="text" size="small" style="color: red">
          {{ $t('scan.template.operator.delete') }}
        </a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-pagination class="paginationStyle" :total="pagination.total" :current="pagination.pageIndex"
    :page-size="pagination.pageSize" show-total @change="changePageIndex" />
  <!--主机扫描模板数据表格 end-->
  <!-- 新增 -->
  <AddCertModal ref="addCertInstance" @init-data="initCertList"></AddCertModal>
  <!-- 编辑 -->
  <EditCertModal ref="editCertInstance" @init-data="initCertList"></EditCertModal>
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, onMounted, reactive, computed, watch } from 'vue';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import formatDate from '@/utils/times';
import cloneDeep from 'lodash/cloneDeep';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import {
  getCertList,
  deleteCert,
  batchDeleteCert
} from '@/api/certmanage/index';
import ConfigBtn from '@/components/config-btn/index.vue'
import AddCertModal from './add-cert.vue'
import EditCertModal from './edit-cert.vue'



const { t } = useI18n();
type Column = TableColumnData & { checked?: true };
const cloneColumns = ref<Column[]>([]);

// ==========================数据定义模块==========================
// 配置展开的表各项
const showColumns = ref<Column[]>([]);
// 表头
const columns = computed<TableColumnData[]>(() => [

  {
    title: t('cerManage.list.authType'),
    dataIndex: 'authType',
    checked: true,
  },
  {
    title: t('cerManage.list.createBy'),
    dataIndex: 'createBy',
  },
  {
    title: t('cerManage.list.createTime'),
    dataIndex: 'createTime',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
    slotName: 'createTime',
  },
  {
    title: t('cerManage.list.name'),
    dataIndex: 'name',
    checked: true,

  },
  {
    title: t('cerManage.list.password'),
    dataIndex: 'password',
    checked: true,

  },
  {
    title: t('cerManage.list.proPassword'),
    dataIndex: 'proPassword',

  },
  {
    title: t('cerManage.list.target'),
    dataIndex: 'target',
    checked: true,
  },
  {
    title: t('cerManage.list.updateTime'),
    dataIndex: 'updateTime',
    slotName: 'updateTime',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },

  },
  {
    title: t('cerManage.list.username'),
    dataIndex: 'username',
    checked: true,
  },
  {
    title: t('cerManage.list.port'),
    dataIndex: 'port',
    checked: true,
  },
  {
    title: t('scan.engine.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
    checked: true,
  },
]);
// 表单下拉框选项定义
// 认证类型下拉框
const authTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'SSH_PASSWORD',
    value: 'SSH_PASSWORD',
  }
]);
// 头部实例用来动态计算高度
const header = ref();
// 表格高度
const tableHeight = ref(0);
// 凭证表格数据
const tableData = ref([]);
// 分页对象参数
const pagination = ref({
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  order: 'desc',
  sort: 'createTime',
  authType: '',
  port: '',
  name: '',
  target: '',
});
// 新增凭证对话框实例
const addCertInstance = ref()
// 编辑凭证对话框实例
const editCertInstance = ref()
// 表格多选
const selectedKeys = ref([]);
const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});
// 引入路由方法
const router = useRouter();

// ==========================数据操纵模块==========================
// 初始化引擎列表
const initCertList = async () => {
  const response = await getCertList(pagination.value);
  tableData.value = response.data;
  // 分页参数赋值
  pagination.value.total = response.totalCount;
  pagination.value.pageIndex = response.pageIndex;
  pagination.value.pageSize = response.pageSize;
};

// 当页面加载时，显示数据
onMounted(() => {
  // 动态计算表格的高度并进行分页
  const height =
    document.documentElement.clientHeight - header.value.offsetHeight - 300;
  tableHeight.value = height;
  pagination.value.pageSize = Math.floor(height / 50);
  // 初始化页面表格数据
  initCertList();
});

// ==========================事件响应模块==========================
// 过滤后端排序字段
function filterSortedField(field) {
  const filterField = field;
  if (filterField) {
    field = filterField;
  }
  return field;
}
// 排序事件触发 后端排序
const sortedChangeEvent = (field, direction) => {
  console.log(field)
  direction = direction === 'descend' ? 'desc' : 'asc';
  // 过滤得到后端支持的排序字段
  field = filterSortedField(field);
  pagination.value.sort = field;
  pagination.value.order = direction;
  // 重新刷新列表
  initCertList();
};
// 重置事件
const reset = () => {
  pagination.value.order = 'desc';
  pagination.value.sort = 'createTime';
  pagination.value.name = '';
  pagination.value.port = '';
  pagination.value.target = '';
  pagination.value.authType = '';
  initCertList()
};
// 批量删除
const handleBatchDel = async () => {
  try {
    const response = await batchDeleteCert(selectedKeys.value);
    if (response.success) {
      Message.success(t('cert.delete.success'));
      initCertList();
    }
  } catch (error) {
    console.log(error);
  }

}
// 编辑
const handleEditCert = (record) => {
  editCertInstance.value.handleEditCertVisible(true, record.id)
};
// 删除
const handleDelete = async (record) => {
  try {
    const data = await deleteCert(record.id);
    if (data.success) {
      Message.success(t('cert.delete.success'));
      initCertList();
    }
  } catch (error) {
    console.log(error);
  }
};
// 新增
const handleAdd = () => {
  addCertInstance.value.handleAddCertVisible(true)

};
// 改变页码
const changePageIndex = (val) => {
  pagination.value.pageIndex = val;
  initCertList();
};
// 自定义配置展示的表单项
const changeColumn = (colums) => {
  cloneColumns.value = colums
}
watch(
  () => columns.value,
  (val) => {

    // cloneColumns.value = cloneDeep(val);
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
.paginationStyle {
  justify-content: end;
  margin-top: 20px;
}
</style>
