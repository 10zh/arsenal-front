<template>
  <div ref="header">
    <p style="background:#f1f4ec;padding:10px;font-size:16px;">基本配置</p>
    <a-form :model="emitValue" label-align="left" auto-label-width>
      <a-row :gutter="12">
        <a-col :span="4">
          <a-form-item field="enableVulnerabilityScan" :label="t('scan.template.enableVulnerabilityScan')">
            <a-switch v-model="emitValue.enableVulnerabilityScan" :default-checked="true" type="round"
              @change="changeItem" />
          </a-form-item>
        </a-col>
        <template v-if="emitValue.enableVulnerabilityScan">
          <a-col :span="4">
            <a-form-item field="isSafe" :label="t('scan.template.isSafe')">
              <a-radio-group v-model="emitValue.isSafe" @change="changeItem">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>

          <a-col :span="4">
            <a-form-item field="isPotential" :label="t('scan.template.isPotential')">
              <a-radio-group v-model="emitValue.isPotential" @change="changeItem">
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>

            </a-form-item>
          </a-col>
        </template>
      </a-row>

    </a-form>
    <template v-if="emitValue.enableVulnerabilityScan">
      <!-- 筛选条件 -->
      <p style="background:#e8f3ff;padding:10px;font-size:16px;">筛选条件</p>
      <!--数据搜索模块 start-->
      <a-row style="margin-left:10px">
        <a-col :flex="1">
          <a-form :model="pagination" label-align="left" auto-label-width>
            <a-row :gutter="24">
              <a-col :span="4">
                <a-form-item field="vulnerabilityName" :label="t('scan.template.vulnerabilityName')">
                  <a-select v-model="pagination.vulnerabilityName" :options="autoCompleteData"
                    :placeholder="t('scan.template.vulnerabilityName')" :max-tag-count="1"
                    @dropdown-reach-bottom="loadMore('vulnerability.vuln', 'name', pagination.vulnerabilityName)"
                    @focus="searchSingleField('vulnerability.vuln', 'name', pagination.vulnerabilityName)"
                    @change="selectItem('vulnerabilityName', pagination.vulnerabilityName)" multiple />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item field="riskGrade" :label="t('scan.template.riskGrade')">
                  <a-select v-model="pagination.riskGrade" multiple :placeholder="t('scan.template.riskGrade')
                    " allow-clear :options="riskGradeOptions" @change="selectItem('riskGrade', pagination.riskGrade)">
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item field="extraValue" :label="t('scan.template.extraValue')">
                  <a-select v-model="pagination.extraValue" :options="autoCompleteData"
                    :placeholder="t('scan.template.extraValue')" :max-tag-count="1"
                    @dropdown-reach-bottom="loadMore('vulnerability.vuln_extra', 'value', pagination.vulnerabilityName)"
                    @change="selectItem('extraValue', pagination.extraValue)"
                    @focus="searchSingleField('vulnerability.vuln_extra', 'value', pagination.extraValue)" multiple />
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item field="tag" :label="t('scan.template.tag')">
                  <a-select v-model="pagination.tag" :options="autoCompleteData" :placeholder="t('scan.template.tag')
                    " :max-tag-count="1"
                    @dropdown-reach-bottom="loadMore('vulnerability.vuln_tag', 'id', pagination.vulnerabilityName)"
                    @change="selectItem('tag', pagination.tag)"
                    @focus="searchSingleField('vulnerability.vuln_tag', 'id', pagination.tag)" multiple />

                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-space :size="18">
                  <a-button type="primary" default-checked style="margin: 0 10px" @click="initVulnerabilityList">
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
    </template>

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
    title: t('scan.template.vulnerabilityName'),
    dataIndex: 'vulnName',
  },
  {
    title: t('scan.template.cvss2'),
    dataIndex: 'cvss2',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('scan.template.cvss2Score'),
    dataIndex: 'cvss2Score',
    sortable: {
      sorter: true,
      sortDirections: ['ascend', 'descend'],
    },
  },
  {
    title: t('scan.template.cvss3'),
    dataIndex: 'cvss3',
  },
  {
    title: t('scan.template.cvss3Score'),
    dataIndex: 'cvss3Score',
  },
  {
    title: t('scan.template.riskGrade'),
    dataIndex: 'riskGrade',
    slotName: 'riskGrade',
  },
  {
    title: t('scan.template.severity'),
    dataIndex: 'severity',
    slotName: 'severity',
  },
];
const templateId = route.query.templateId || '';


// 主机扫描模板表格数据
const tableData = ref([]);
// 分页对象参数
const pagination = ref({
  total: 0,
  pageIndex: 1,
  pageSize: 10,
  order: 'desc',
  sort: 'createTime',
  vulnerabilityName: [],
  riskGrade: [],
  tag: [],
  extraValue: [],
});

// 传递给父组件的参数值
const emitValue = ref({
  isSafe: true,
  isPotential: false,
  enableVulnerabilityScan: true,
  vulnerabilityFilterCondition: '',
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

// ==========================数据定义模块==========================
const riskGradeOptions = [{
  label: t('scan.template.low'),
  value: 1

}, {
  label: t('scan.template.mid'),
  value: 2

}, {
  label: t('scan.template.hight'),
  value: 3

}, {
  label: t('scan.template.show'),
  value: 4

}]
// ==========================数据操纵模块==========================

// 初始化引擎列表
const initVulnerabilityList = async () => {
  dataLoading.value = true
  const response = await getVulnerabilityList(pagination.value);
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
  pagination.value.pageSize = Math.floor(height / 50);
  // 初始化页面表格数据
  // initVulnerabilityList();

});

// ==========================事件响应模块==========================
// 分页
const changeIndex = (value) => {
  pagination.value.pageIndex = value;
  initVulnerabilityList()

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
  initVulnerabilityList();
};

// 重置事件
const reset = () => {
  pagination.value.order = 'desc';
  pagination.value.sort = 'createTime';
  pagination.value.vulnerabilityName = [];
  pagination.value.riskGrade = [];
  pagination.value.tag = [];
  pagination.value.extraValue = [];
  emitValue.value.isSafe = true;
  emitValue.value.isPotential = false;
  emitValue.value.enableVulnerabilityScan = true;
  emitValue.value.vulnerabilityFilterCondition = '';
  initVulnerabilityList();
};
// 获取自动补全数据
const searchSingleField = async (table, field, value) => {
  singleFieldPagination.value.table = table;
  singleFieldPagination.value.field = field;
  singleFieldPagination.value.value = value;
  const res = await aotuCompleteByTableField(singleFieldPagination.value);
  autoCompleteData.value = autoCompleteData.value.concat(res.data)
}
// 下拉框加载更多
const loadMore = (table, field, value) => {
  singleFieldPagination.value.pageIndex += 1;
  searchSingleField(table, field, value)
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
      mergeValue += `${key}=${item.length > 1 ? item.join(',') : item[0]}&riskGrade-op=il${maps.size > 1 ? "&" : ''}`
    } else {
      mergeValue += `${key}=${item.length > 1 ? item.join(',') : item[0]}&${key}-op=il&${key}-ic=true${maps.size > 1 ? "&" : ''}`
    }
  })
  // 用于删除拼接字符串的最后一个&符号
  if (maps.size > 1) {
    mergeValue = mergeValue.slice(0, -1)
  }
  emitValue.value.vulnerabilityFilterCondition = mergeValue
  sendFilterCondition();

}
const changeItem = () => {
  sendFilterCondition();
}
// 监听是否存在templateId并且是漏洞库tab栏
watch(() => props.activeName, (curVal, preVal) => {
  // 将筛选条件URL转化为对象形式，用于回显
  if (curVal === '2' && templateId) {
    const { vulnerabilityName = '', riskGrade = '', tag = [], extraValue = '' } = props.vulnsData;
    // 回显搜索条件以及筛选条件的值
    emitValue.value.isSafe = props.vulnsData.isSafe;
    emitValue.value.isPotential = props.vulnsData.isPotential;
    emitValue.value.enableVulnerabilityScan = props.vulnsData.enableVulnerabilityScan;
    emitValue.value.vulnerabilityFilterCondition = props.vulnsData.vulnerabilityFilterCondition;
    if (vulnerabilityName) {
      pagination.value.vulnerabilityName = vulnerabilityName.indexOf(',') !== -1 ? vulnerabilityName.split(',') : [vulnerabilityName];
    }
    if (riskGrade) {
      pagination.value.riskGrade = riskGrade.indexOf(',') !== -1 ? riskGrade.split(',').map(Number) : riskGrade.map(Number);
    }
    if (tag) {
      pagination.value.tag = tag.indexOf(',') !== -1 ? tag.split(',').map(Number) : tag.map(Number);
    }
    if (extraValue) {
      pagination.value.extraValue = extraValue.indexOf(',') !== -1 ? extraValue.split(',') : [extraValue];
    }
    // 用于设置全局Map的值，回显筛选条件
    if (vulnerabilityName.length > 0) {
      maps.set('vulnerabilityName', pagination.value.vulnerabilityName);
    }
    if (riskGrade.length > 0) {
      maps.set('riskGrade', pagination.value.riskGrade);
    }
    if (extraValue.length > 0) {
      maps.set('extraValue', pagination.value.extraValue);
    }
    if (tag.length > 0) {
      maps.set('tag', pagination.value.tag);
    }
    // 必须在此刻调用，筛选条件以及回显完毕之后
    initVulnerabilityList()

  } else if (!templateId) {
    // 新增模板时，需要调用漏洞库列表
    initVulnerabilityList()
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
