<template>
  <div ref="header">
    <!--数据搜索模块 start-->
    <a-row style="margin-left:10px">
      <a-col :flex="1">
        <a-form :model="pagination" label-align="left" auto-label-width>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="dbName" :label="t('weak.password.form.dbName')">
                <a-select v-model="pagination.dbName" :options="autoCompleteData"
                  :placeholder="t('weak.password.form.dbName')" :max-tag-count="1"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'db_name', pagination.dbName)"
                  @focus="searchSingleField('host.host_wkp_dict', 'db_name', pagination.dbName)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'db_name')" :loading="loading" multiple />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="domain" :label="t('weak.password.form.domain')">
                <a-select v-model="pagination.domain" :options="autoCompleteData"
                  :placeholder="t('weak.password.form.domain')" :max-tag-count="1"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'domain', pagination.domain)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'domain')" :loading="loading"
                  @focus="searchSingleField('host.host_wkp_dict', 'domain', pagination.domain)" multiple />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="password" :label="t('weak.password.form.password')">
                <a-select v-model="pagination.password" :options="autoCompleteData" :placeholder="t('weak.password.form.password')
                  " :max-tag-count="4"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'password', pagination.password)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'password')" :loading="loading"
                  @focus="searchSingleField('host.host_wkp_dict', 'password', pagination.password)" multiple />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item field="serviceId" :label="t('weak.password.form.serviceId')">
                <a-select v-model="pagination.serviceId" :options="autoCompleteData" :placeholder="t('weak.password.form.serviceId')
                  " :max-tag-count="4"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'service_id', pagination.serviceId)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'service_id')" :loading="loading"
                  @focus="searchSingleField('host.host_wkp_dict', 'service_id', pagination.serviceId)" multiple />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="username" :label="t('weak.password.form.username')">
                <a-select v-model="pagination.username" :options="autoCompleteData" :placeholder="t('weak.password.form.username')
                  " :max-tag-count="4"
                  @dropdown-reach-bottom="loadMore('host.host_wkp_dict', 'username', pagination.username)"
                  @search="handleSearch($event, 'host.host_wkp_dict', 'username')" :loading="loading"
                  @focus="searchSingleField('host.host_wkp_dict', 'username', pagination.username)" multiple />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <!--数据搜索模块 end-->
      </a-col>
      <!-- 查询&重置按钮start -->
      <a-divider style="height: 84px" direction="vertical"></a-divider>
      <a-col :flex="'86px'" style="text-align: right">
        <a-space :size="18" direction="vertical">
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
      <!-- 查询&重置按钮end -->
    </a-row>
  </div>
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
import { aotuCompleteByTableField } from '@/api/common/common';
import { getWeakPasswordList } from '@/api/sourcedata/weak-password'
import { setRiskGradeText, setRiskGradeColor, getSeverityRatingText, setSeverityRatingColor } from '@/hooks/status-options'
import { useRoute } from 'vue-router';

const { t } = useI18n();
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
const route = useRoute()
// ==========================数据定义模块==========================
// 扫描引擎表头
const columns = [
  {
    title: t('weak.password.form.dbName'),
    dataIndex: 'dbName',
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
    title: t('weak.password.form.password'),
    dataIndex: 'password',
  },
  {
    title: t('weak.password.form.serviceId'),
    dataIndex: 'serviceId',
  },
  {
    title: t('weak.password.form.username'),
    dataIndex: 'username',
  },
  {
    title: t('weak.password.list.isInside'),
    dataIndex: 'isInside',
    slotName: 'isInside',
  },
];

// 主机扫描模板表格数据
const tableData = ref([]);
// 分页对象参数
const pagination = ref({
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  order: 'desc',
  sort: 'createTime',
  dbName: [],
  domain: [],
  password: [],
  serviceId: [],
  username: [],
});

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
// 自动补全数据的总和
const totalCount = ref(0);

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

// 当页面加载时，显示数据
onMounted(() => {
  // 动态计算表格的高度并进行分页
  const height =
    document.documentElement.clientHeight - header.value.offsetHeight - 340;
  tableHeight.value = height;
  pagination.value.pageSize = Math.floor(height / 45);
  // 初始化页面表格数据
  initWeakPasswordList();

});

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
  pagination.value.vulnerabilityName = [];
  pagination.value.riskGrade = [];
  pagination.value.tag = [];
  pagination.value.extraValue = [];
  initWeakPasswordList();
};
// 获取自动补全数据
const loading = ref(false);
const searchSingleField = async (table, field, value, flag = null) => {
  // 如果是新的下拉框则重置数据
  if (!flag) {
    autoCompleteData.value = [];
    singleFieldPagination.value.pageIndex = 1;
  }
  loading.value = true;
  singleFieldPagination.value.table = table;
  singleFieldPagination.value.field = field;
  singleFieldPagination.value.value = value;
  const res = await aotuCompleteByTableField(singleFieldPagination.value);
  totalCount.value = res.totalCount

  loading.value = false;
  autoCompleteData.value = autoCompleteData.value.concat(res.data)
}
// 下拉框加载更多
const loadMore = (table, field, value) => {
  console.log(pagination.value.pageIndex * pagination.value.pageSize)
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
