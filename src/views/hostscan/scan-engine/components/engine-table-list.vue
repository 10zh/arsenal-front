<template>
  <!--数据搜索模块 start-->
  <a-row :style="{ marginBottom: '20px' }">
    <a-col :flex="1">
      <a-form :model="form" label-align="left" auto-label-width>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item field="engineName" :label="t('scan.engine.name')">
              <a-input v-model="pagination.engineName" :placeholder="t('scan.engine.name.input')"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="address" :label="t('scan.engine.address')">
              <a-input v-model="pagination.address" :placeholder="t('scan.engine.address.input')"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="port" :label="t('scan.engine.port')">
              <a-input v-model="pagination.port" :placeholder="t('scan.engine.port.input')"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item field="status" :label="t('scan.engine.status')">
              <a-select v-model="pagination.status" :placeholder="t('scan.engine.status.input')" allow-clear
                :options="statusOptions">
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="createTime" :label="t('scan.engine.createTime')">
              <a-range-picker v-model="pagination.createTime" :style="{ width: '100%' }" />
            </a-form-item>
          </a-col>
          <a-col :span="8">

            <a-form-item field="version" :label="t('scan.engine.version')">
              <a-input v-model="pagination.engineVersion" :placeholder="t('scan.engine.version.input')"></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>

    </a-col>
    <!-- 查询&重置按钮start -->
    <a-divider style="height:84px" direction="vertical"></a-divider>
    <a-col :flex="'86px'" style="text-align:right">
      <a-space direction="vertical" :size="18">
        <a-button type="primary" default-checked style="margin: 0 10px" @click="initEngineList">
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
    <!-- 查询&重置按钮start -->
  </a-row>
  <a-divider></a-divider>
   <!--数据搜索模块 end-->
  <!-- 新增按钮start -->
  <a-row style="margin-bottom: 16px">
    <a-col :span="24" style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
      <a-space>
        <a-button type="primary" @click="addScanEngine">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('scan.engine.add') }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <!-- 新增按钮end -->
 
  <!--引擎数据表格 start-->
  <a-table row-key="id" :columns="columns" :data="tableData" :bordered="false" :pagination="false"
    @sorter-change="sortedChangeEvent">
    <template #status="{ record }">
      <span v-if="record.status == '0'" style="color: green">
        <a-badge status="success" style="margin-right: 5px" />{{
          t('scan.engine.status.online')
        }}</span>
      <span v-else style="color: red">
        <a-badge status="danger" style="margin-right: 5px" />{{
          t('scan.engine.status.offline')
        }}</span>
    </template>
    <template #isLocal="{ record }">
      <span v-if="record.isLocal == false">{{ t('global.false') }}</span>
      <span v-else>{{ t('global.true') }}</span>
    </template>
    <template #createTime="{ record }">
      {{ formatDate(record.createTime, 'YYYY-MM-DD hh:mm:ss') }}
    </template>
    <template #updateTime="{ record }">
      {{ formatDate(record.updateTime, 'YYYY-MM-DD hh:mm:ss') }}
    </template>
    <template #operations="{ record }">
      <a-button type="text" size="small" style="padding: 0px" @click="editEngine(record)">
        <template #icon>
          <icon-edit />
        </template>
        {{ $t('scan.engine.operator.edit') }}
      </a-button>
      <a-popconfirm :content="t('scan.engine.operator.refresh.question')" @ok="refreshEngine(record)">
        <a-button type="text" size="small">
          <template #icon>
            <icon-refresh />
          </template>
          {{ $t('scan.engine.operator.refresh') }}
        </a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-pagination class="paginationStyle" :total="pagination.total" :current="pagination.current"
    :page-size="pagination.pageSize" show-total show-jumper show-page-size />
  <!--引擎数据表格 end-->
  <!--添加引擎对话层 start-->
  <AddEngienModel ref="addEngineRef" />
  <!--添加引擎对话层 end-->
  <!--编辑引擎对话层 start-->
  <EditEngienModel ref="editEngineRef" />
  <!--编辑引擎对话层 end-->
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import formatDate from '@/utils/times';
import { aotuCompleteByTableField } from '@/api/common/common';
import AddEngienModel from '@/views/hostscan/scan-engine/components/add-engine.vue';
import EditEngienModel from '@/views/hostscan/scan-engine/components/edit-engine.vue';
import {
  HostScanEngineRes,
  getScanEngines,
  refreshScanEngine,
} from '@/api/scan/scan-engine';

const { t } = useI18n();

// ==========================数据定义模块==========================
// 扫描引擎表头
const columns = [
  {
    title: t('scan.engine.name'),
    dataIndex: 'engineName',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('scan.engine.address'),
    dataIndex: 'address',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('scan.engine.port'),
    dataIndex: 'port',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('scan.engine.version'),
    dataIndex: 'engineVersion',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('scan.engine.version.assignedTaskNumber'),
    dataIndex: 'assignedTaskNumber',
    slotName: 'assignedTaskNumber',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('scan.engine.version.isLocal'),
    dataIndex: 'isLocal',
    slotName: 'isLocal',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('scan.engine.version.createTime'),
    dataIndex: 'createTime',
    slotName: 'createTime',
    sortable: {
      sorter: true,
      sortDirections: ['descend'],
    },
  },
  {
    title: t('scan.engine.version.updateTime'),
    dataIndex: 'updateTime',
    slotName: 'updateTime',
    sortable: {
      sorter: true,
      sortDirections: ['descend'],
    },
  },
  {
    title: t('scan.engine.version.status'),
    dataIndex: 'status',
    slotName: 'status',
  },
  {
    title: t('scan.engine.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
  },
];
// 扫描引擎状态下拉框数据
const statusOptions = [{
  value: '0',
  label: '在线',
}, {
  value: '1',
  label: '离线',
}];
// 扫描引擎表格数据
const tableData = ref<HostScanEngineRes>([]);
// 分页对象参数
const pagination = ref({
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  order: 'desc',
  sort: 'createTime',
  engineName: '',
  address: '',
  port: '',
  engineVersion: '',
  status: '',
  createTime: [],
});
// 搜索表单
const form = reactive({});
// 添加引擎子组件
const addEngineRef = ref<any>({});
// 编辑引擎子组件
const editEngineRef = ref<any>({});

// ==========================数据操纵模块==========================
// 初始化引擎列表
const initEngineList = async () => {
  const response = await getScanEngines(pagination.value);
  tableData.value = response.data;
  // 分页参数赋值
  pagination.value.total = response.totalCount;
  pagination.value.pageIndex = response.pageIndex;
  pagination.value.pageSize = response.pageSize;
};
// 当页面加载时，显示数据
onMounted(() => {
  // 初始化页面表格数据
  initEngineList();

});

// ==========================事件响应模块==========================
// 引擎刷新事件
const refreshEngine = async (record) => {
  console.log(record);
  const response = await refreshScanEngine(record.id);
  if (response.data.hasRefreshSuccess) {
    Message.success(t('scan.engie.refresh.success'));
  } else {
    Message.error(response.data.failCause);
  }
  // 重新加载数据
  initEngineList();
};
// 排序事件
const sortedChangeEvent = (field, direction) => {
  direction = direction === 'descend' ? 'desc' : 'asc';
  pagination.value.sort = field;
  pagination.value.order = direction;
  // 重新刷新列表
  initEngineList();
};
// 重置事件
const reset = () => {
  pagination.value.order = 'desc';
  pagination.value.sort = 'createTime';
  pagination.value.engineName = '';
  pagination.value.address = '';
  pagination.value.port = '';
  pagination.value.engineVersion = '';
  pagination.value.status = '';
  pagination.value.createTime = [];
  initEngineList();
};
// 新增引擎
const addScanEngine = () => {
  addEngineRef.value.handleAddEngineVisible(true);
};
// 编辑引擎
const editEngine = (row) => {
  editEngineRef.value.handleEditEngineVisible(true);
  editEngineRef.value.editRowValue(row);
};
</script>

<style scoped lang="less">
.paginationStyle {
  justify-content: end;
  margin-top: 50px;
}
</style>
