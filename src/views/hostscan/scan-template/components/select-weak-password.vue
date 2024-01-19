<template>
  <div ref="header">
    <p style="background:#f1f4ec;padding:10px;font-size:16px;">基本配置</p>
    <a-form :model="emitValue" label-align="left" auto-label-width>
      <a-row :gutter="12">
        <a-col :span="4">
          <a-form-item field="hasScanInsideDict" :label="t('scan.template.hasScanInsideDict')">
            <a-switch v-model="emitValue.hasScanInsideDict" :default-checked="true" type="round" @change="changeItem" />
          </a-form-item>
        </a-col>
        <a-col :span="4">
          <a-form-item field="wkpSingleDictTimeout" :label="t('scan.template.wkpSingleDictTimeout')">
            <a-input-number hide-button v-model="emitValue.wkpSingleDictTimeout">
              <template #append>
                ms
              </template>
            </a-input-number>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 筛选条件 -->
    <p style="background:#e8f3ff;padding:10px;font-size:16px;">筛选条件</p>
    <!--数据搜索模块 start-->
    <a-row style="margin-left:10px">
      <a-col :flex="1">
        <a-form :model="pagination" label-align="left" auto-label-width>
          <a-row :gutter="24">
            <a-col :span="4">
              <a-form-item field="dbName" :label="t('scan.template.form.dbName')">
                <a-select v-model="pagination.dbName" :options="autoCompleteData"
                  :placeholder="t('scan.template.form.dbName')" :max-tag-count="1"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'db_name', pagination.dbName)"
                  @change="selectItem('dbName', pagination.dbName)"
                  @focus="searchSingleField('host.host_wkp_dict', 'db_name', pagination.dbName)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'db_name')" :loading="loading" multiple />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item field="domain" :label="t('scan.template.form.domain')">
                <a-select v-model="pagination.domain" :options="autoCompleteData"
                  :placeholder="t('scan.template.form.domain')" :max-tag-count="1"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'domain', pagination.domain)"
                  @change="selectItem('domain', pagination.domain)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'domain')" :loading="loading"
                  @focus="searchSingleField('host.host_wkp_dict', 'domain', pagination.domain)" multiple />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item field="password" :label="t('scan.template.form.password')">
                <a-select v-model="pagination.password" :options="autoCompleteData" :placeholder="t('scan.template.form.password')
                  " :max-tag-count="1"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'password', pagination.password)"
                  @change="selectItem('password', pagination.password)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'password')" :loading="loading"
                  @focus="searchSingleField('host.host_wkp_dict', 'password', pagination.password)" multiple />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item field="serviceId" :label="t('scan.template.form.serviceId')">
                <a-select v-model="pagination.serviceId" :options="autoCompleteData" :placeholder="t('scan.template.form.serviceId')
                  " :max-tag-count="1"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'service_id', pagination.serviceId)"
                  @change="selectItem('serviceId', pagination.serviceId)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'service_id')" :loading="loading"
                  @focus="searchSingleField('host.host_wkp_dict', 'service_id', pagination.serviceId)" multiple />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item field="username" :label="t('scan.template.form.username')">
                <a-select v-model="pagination.username" :options="autoCompleteData" :placeholder="t('scan.template.form.username')
                  " :max-tag-count="1"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'username', pagination.username)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'username')" :loading="loading"
                  @change="selectItem('username', pagination.username)"
                  @focus="searchSingleField('host.host_wkp_dict', 'username', pagination.username)" multiple />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-space :size="18">
                <a-button type="primary" default-checked style="margin: 0 10px" @click="initWeakPasswordList">
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
          </a-row>
          <!-- <a-divider></a-divider> -->

        </a-form>
      </a-col>
      <!-- 查询&重置按钮start -->
      <a-divider style="height: 84px" direction="vertical"></a-divider>

      <!-- 查询&重置按钮end -->
    </a-row>

  </div>
  <!--数据搜索模块 end-->
  <!--主机扫描模板数据表格 start-->
  <!-- 数据加载动画 -->
  <div v-if="dataLoading" :style="{ height: tableHeight + 'px' }" class="loading">
    <a-spin :size="32" />
  </div>
  <a-table v-else row-key="vulnId" :columns="columns" :loading="dataLoading" :data="tableData" :bordered="false"
    :pagination="false" :style="{
      marginBottom: '20px',
      marginLeft: '15px',
      height: tableHeight + 'px',
    }
      " @sorter-change="sortedChangeEvent">
    <template #riskGrade="{ record }">
      <a-tag :color="setRiskGradeColor(record.riskGrade)" size="small">{{ setRiskGradeText(record.riskGrade)
      }}</a-tag>
    </template>
    <template #isInside="{ record }">
      {{ record.isInside === 1 ? '是' : '否' }}
    </template>
    <template #severity="{ record }">
      <a-tag :color="setSeverityRatingColor(record.severity)" size="small">{{ getSeverityRatingText(record.severity)
      }}</a-tag>
    </template>

  </a-table>
  <a-pagination class="paginationStyle" :total="pagination.total" :current="pagination.pageIndex" @change="changeIndex"
    :page-size="pagination.pageSize" show-total />
  <!--主机扫描模板数据表格 end-->
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  FieldSortedEnum,
  getVulnerabilityList
} from '@/api/scan/scan-template';
import { getWeakPasswordList } from '@/api/sourcedata/weak-password'
import { aotuCompleteByTableField } from '@/api/common/common';
import { setRiskGradeText, setRiskGradeColor, getSeverityRatingText, setSeverityRatingColor } from '@/hooks/status-options'
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute()
// 编辑时，父组件传递过来的回显数据
const props = defineProps({
  vulnsData: {
    type: Object
  },
  activeName: {
    type: String,
    default: '1',
  }
})

// ==========================数据定义模块==========================
// 扫描引擎表头
const columns = [
  {
    title: t('weak.password.form.serviceId'),
    dataIndex: 'serviceId',
  },
  {
    title: t('weak.password.form.username'),
    dataIndex: 'username',
  },
  {
    title: t('weak.password.form.password'),
    dataIndex: 'password',
  },
  {
    title: t('weak.password.form.domain'),
    dataIndex: 'domain',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('weak.password.form.dbName'),
    dataIndex: 'dbName',
  },

  {
    title: t('weak.password.list.isInside'),
    dataIndex: 'isInside',
    slotName: 'isInside',
  },
];
const templateId = route.query.templateId || '';


// 主机扫描模板表格数据
const tableData = ref([]);
// 分页对象参数
const pagination = ref({
  total: 0,
  pageIndex: 1,
  pageSize: 4,
  order: 'desc',
  sort: 'createTime',
  dbName: [],
  domain: [],
  password: [],
  serviceId: [],
  username: [],
});

// 传递给父组件的参数值
const emitValue = ref({
  hasScanInsideDict: true,
  wkpSingleDictTimeout: 5000,
  wkpFilterCondition: ''
})
// 单个参数检索 同输入框自动补全联动
const singleFieldPagination = ref({
  total: 0,
  pageIndex: 1,
  pageSize: 15,
  table: '',
  field: '',
  value: '',
});
// 自动补全数据
const autoCompleteData = ref([])
// 头部实例用来动态计算高度
const header = ref();
// 表格高度
const tableHeight = ref(0);
// 表格加载中
const dataLoading = ref(false)
// 自动补全数据的数据总和
const totalCount = ref(0)

// ==========================数据定义模块==========================
// ==========================数据操纵模块==========================

// 初始化引擎列表
const initWeakPasswordList = async () => {
  dataLoading.value = true
  const response = await getWeakPasswordList(pagination.value);
  tableData.value = response.data;
  dataLoading.value = false;

  // 分页参数赋值
  pagination.value.total = response.totalCount;
  pagination.value.pageIndex = response.pageIndex;
  pagination.value.pageSize = response.pageSize;
};

// 动态计算表格高度
const getTableHeight = () => {
  // 动态计算表格的高度并进行分页
  nextTick(() => {
    const height =
      document.documentElement.clientHeight - header.value.offsetHeight - 350;
    tableHeight.value = height;
    pagination.value.pageSize = Math.floor(height / 50);
    // 获取列表
    initWeakPasswordList()
  })
}

// ==========================事件响应模块==========================
// 分页
const changeIndex = (value) => {
  pagination.value.pageIndex = value;
  initWeakPasswordList()

}
// 过滤后端排序字段
function filterSortedField(field) {
  const filterField = FieldSortedEnum[field];
  if (filterField) {
    field = filterField;
  }
  return field;
}
// 排序事件触发 后端排序
const sortedChangeEvent = (field, direction) => {
  direction = direction === 'descend' ? 'desc' : 'asc';
  // 过滤得到后端支持的排序字段
  field = filterSortedField(field);
  pagination.value.sort = field;
  pagination.value.order = direction;
  // 重新刷新列表
  initWeakPasswordList();
};

// 重置事件
const reset = () => {
  pagination.value.order = 'desc';
  pagination.value.sort = 'createTime';
  pagination.value.password = [];
  pagination.value.username = [];
  pagination.value.serviceId = [];
  pagination.value.domain = [];
  pagination.value.dbName = [];
  emitValue.value.hasScanInsideDict = true;
  emitValue.value.wkpSingleDictTimeout = 5000;
  emitValue.value.wkpFilterCondition = '';
  initWeakPasswordList();
};
// 获取自动补全数据
const loading = ref(false);
const searchSingleField = async (table, field, value, flag = null) => {
  if (!flag) {
    autoCompleteData.value = [];
    singleFieldPagination.value.pageIndex = 1;
  }
  loading.value = true;
  singleFieldPagination.value.table = table;
  singleFieldPagination.value.field = field;
  singleFieldPagination.value.value = value;
  const res = await aotuCompleteByTableField(singleFieldPagination.value);
  loading.value = false;
  autoCompleteData.value = autoCompleteData.value.concat(res.data)
  totalCount.value = res.totalCount;
}
// 下拉框加载更多
const loadMore = (table, field, value) => {
  if (totalCount.value > autoCompleteData.value.length) {
    singleFieldPagination.value.pageIndex += 1;
    searchSingleField(table, field, value, 'more')
  }
}
// 实时搜索(注意防抖节流)

const handleSearch = (value, table, field) => {
  singleFieldPagination.value.pageIndex = 1;
  if (value) {
    window.setTimeout(() => {
      searchSingleField(table, field, value)
    }, 1000)
  } else {
    autoCompleteData.value = [];
  }

}
// 将筛选条件全部传递给父组件
const emits = defineEmits(['receiveFilter'])
const sendFilterCondition = () => {
  emits('receiveFilter', emitValue);
}
// 使用Map存放多个筛选条件
const maps = new Map();
// 选择对应的项
const selectItem = (field, value) => {
  // 删除某个项时，值会变成undefined因此要删除该项，避免拼接的时候出现问题
  if (value[value.length - 1] || value.length > 0) {
    maps.set(field, value);
  } else {
    maps.delete(field)
  }
  let mergeValue = '';
  // 对于Map数据结构中的值进行字符串拼接
  maps.forEach((item, key) => {
    if (key === 'riskGrade') {
      mergeValue += `${key}=${encodeURI(JSON.stringify(item))}&riskGrade-op=il${maps.size > 1 ? "&" : ''}`
    } else {
      mergeValue += `${key}=${encodeURI(JSON.stringify(item))}&${key}-op=il&${key}-ic=true${maps.size > 1 ? "&" : ''}`
    }
  })
  // 用于删除拼接字符串的最后一个&符号
  if (maps.size > 1) {
    mergeValue = mergeValue.slice(0, -1)
  }
  emitValue.value.wkpFilterCondition = mergeValue
  sendFilterCondition();

}
const changeItem = () => {
  sendFilterCondition();
}
// 监听是否存在templateId并且是漏洞库tab栏
watch(() => props.activeName, (curVal, preVal) => {
  // 将筛选条件URL转化为对象形式，用于回显
  if (curVal === '2' && templateId) {
    const { dbName = '', domain = '', password, serviceId, username = '' } = props.vulnsData.wkpConfig;
    console.log(props.vulnsData)
    // 回显搜索条件以及筛选条件的值
    emitValue.value.hasScanInsideDict = props.vulnsData.wkpConfig
      .hasScanInsideDict;
    emitValue.value.wkpSingleDictTimeout = props.vulnsData.wkpConfig
      .wkpSingleDictTimeout;
    if (dbName) {
      pagination.value.dbName = dbName.indexOf(',') !== -1 ? dbName.split(',') : [dbName];
    }
    if (domain) {
      pagination.value.domain = domain.indexOf(',') !== -1 ? domain.split(',') : [domain];
    }
    if (password) {
      pagination.value.password = password.indexOf(',') !== -1 ? password.split(',') : [password];
    }
    if (serviceId) {
      pagination.value.serviceId = serviceId.indexOf(',') !== -1 ? serviceId.split(',') : [serviceId];
    }
    if (username) {
      pagination.value.username = username.indexOf(',') !== -1 ? username.split(',') : [username];
    }
    console.log(password)
    // 用于设置全局Map的值，回显筛选条件
    if (domain) {
      maps.set('domain', pagination.value.domain);
    }
    if (dbName) {
      maps.set('dbName', pagination.value.dbName);
    }
    if (password) {
      maps.set('password', pagination.value.password);
    }
    if (serviceId) {
      maps.set('serviceId', pagination.value.serviceId);
    }
    if (username) {
      maps.set('username', pagination.value.username);
    }
    // 必须在此刻调用，筛选条件以及回显完毕之后
    getTableHeight()

  } else if (!templateId) {
    // 新增模板时，需要调用漏洞库列表
    getTableHeight()

  }
}, { immediate: true, deep: true })
</script>

<style scoped lang="less">
.paginationStyle {
  justify-content: end;
  margin-top: 20px;
}

.loading {
  text-align: center;
  height: 200px;
  line-height: 200px
}
</style>
