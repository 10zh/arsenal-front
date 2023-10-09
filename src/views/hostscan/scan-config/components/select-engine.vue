<template>
  <!--数据搜索模块 start-->
  <a-row :style="{ marginBottom: '20px', marginLeft: '15px' }">
    <a-form :model="form" label-align="left" auto-label-width>
      <a-row :gutter="24">
        <a-col :span="4">
          <a-form-item field="engineName" :label="t('scan.engine.name')">
            <a-auto-complete
              v-model="pagination.engineName"
              :data="autoCompleteData"
              :placeholder="t('scan.engine.name.input')"
              @focus="
                searchSingleField('scan_se', 'scan_en', pagination.engineName)
              "
              @change="
                searchSingleField('scan_se', 'scan_en', pagination.engineName)
              "
            />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item field="address" :label="t('scan.engine.address')">
            <a-auto-complete
              v-model="pagination.address"
              :data="autoCompleteData"
              :placeholder="t('scan.engine.address.input')"
              @focus="
                searchSingleField('scan_se', 'scan_se_as', pagination.address)
              "
              @change="
                searchSingleField('scan_se', 'scan_se_as', pagination.address)
              "
            />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item field="port" :label="t('scan.engine.port')">
            <a-auto-complete
              v-model="pagination.port"
              :data="autoCompleteData"
              :placeholder="t('scan.engine.port.input')"
              @focus="
                searchSingleField('scan_se', 'scan_se_pt', pagination.port)
              "
              @change="
                searchSingleField('scan_se', 'scan_se_pt', pagination.port)
              "
            />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item field="version" :label="t('scan.engine.version')">
            <a-auto-complete
              v-model="pagination.engineVersion"
              :data="autoCompleteData"
              :placeholder="t('scan.engine.version.input')"
              @focus="
                searchSingleField(
                  'scan_se',
                  'scan_se_ev',
                  pagination.engineVersion
                )
              "
              @change="
                searchSingleField(
                  'scan_se',
                  'scan_se_ev',
                  pagination.engineVersion
                )
              "
            />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-button
            type="primary"
            default-checked
            style="margin: 0 10px"
            @click="initEngineList"
          >
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
        </a-col>
      </a-row>
    </a-form>
  </a-row>
  <!--数据搜索模块 end-->
  <!--引擎数据表格 start-->
  <a-table
    row-key="id"
    :columns="columns"
    :data="tableData"
    :bordered="false"
    :pagination="false"
    :row-selection="rowSelection"
    :style="{ marginBottom: '20px', marginLeft: '15px' }"
    @select="selectRowKey"
    @sorter-change="sortedChangeEvent"
  >
    <template #status="{ record }">
      <span v-if="record.status == '0'" style="color: green">
        <a-badge status="success" style="margin-right: 5px" />{{
          t('scan.engine.status.online')
        }}</span
      >
      <span v-else style="color: red">
        <a-badge status="danger" style="margin-right: 5px" />{{
          t('scan.engine.status.offline')
        }}</span
      >
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
      <a-button
        type="text"
        size="small"
        style="padding: 0px"
        @click="editEngine(record)"
      >
        <template #icon>
          <icon-edit />
        </template>
        {{ $t('scan.engine.operator.edit') }}
      </a-button>
      <a-popconfirm
        :content="t('scan.engine.operator.refresh.question')"
        @ok="refreshEngine(record)"
      >
        <a-button type="text" size="small">
          <template #icon>
            <icon-refresh />
          </template>
          {{ $t('scan.engine.operator.refresh') }}
        </a-button>
      </a-popconfirm>
    </template>
  </a-table>
  <a-pagination
    class="paginationStyle"
    :total="pagination.total"
    :current="pagination.current"
    :page-size="pagination.pageSize"
    show-total
    show-jumper
    show-page-size
  />
  <!--引擎数据表格 end-->
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, reactive, onMounted, defineEmits } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import formatDate from '@/utils/times';
  import { aotuCompleteByTableField } from '@/api/common/common';
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
  });
  // 搜索表单
  const form = reactive({});
  // 单个参数检索 同输入框自动补全联动
  const singleFieldPagination = ref({
    total: 0,
    pageIndex: 1,
    pageSize: 15,
    table: '',
    field: '',
    value: '',
  });
  // 输入框自动补全
  const autoCompleteData = ref([]);
  // 当前选择的引擎key
  const currentSelectRowKey = ref();
  // 行选择器
  const rowSelection = {
    type: 'radio',
    defaultSelectedRowKeys: [],
  };
  // 定义子组件传值
  const emits = defineEmits(['receiveSelect']);
  // ==========================数据操纵模块==========================
  // 将选择内容传递给父组件
  const sendParentComponentSelectRowKey = () => {
    emits('receiveSelect', currentSelectRowKey);
  };
  // 初始化引擎列表
  const initEngineList = async () => {
    const response = await getScanEngines(pagination.value);
    tableData.value = response.data;
    // 默认选中为第一个引擎
    currentSelectRowKey.value = tableData.value[0].id;
    rowSelection.defaultSelectedRowKeys[0] = currentSelectRowKey.value;
    sendParentComponentSelectRowKey();
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
  // 单个字段搜索事件
  const searchSingleField = async (table, field, value) => {
    autoCompleteData.value = [];
    singleFieldPagination.value.table = table;
    singleFieldPagination.value.field = field;
    singleFieldPagination.value.value = value;
    const response = await aotuCompleteByTableField(
      singleFieldPagination.value
    );
    autoCompleteData.value = response.data;
  };
  // 重置事件
  const reset = () => {
    pagination.value.order = 'desc';
    pagination.value.sort = 'createTime';
    pagination.value.engineName = '';
    pagination.value.address = '';
    pagination.value.port = '';
    pagination.value.engineVersion = '';
    initEngineList();
  };
  // 单选事件 默认选择和将选择内容传递给父组件
  const selectRowKey = (key) => {
    if (key instanceof Array) {
      const [item] = key;
      key = item;
    }
    currentSelectRowKey.value = key;
    sendParentComponentSelectRowKey();
  };
</script>

<style scoped lang="less">
  .paginationStyle {
    justify-content: end;
    margin-top: 50px;
  }
</style>
