<template>
  <div class="container">
    <a-card class="general-card" style="height:100%" :title="$t('menu.asset.clusterAnalysis')" @tab-click="handleClick">
      <!-- 返回按钮 -->
      <div class="back-btn">
        <a-button @click="goBack">{{ t('scan.add.config.goback') }}</a-button>
      </div>
      <!-- 搜索容器start -->
      <div class="search">
        <!-- 搜索框start -->
        <div class="search-wrap">
          <a-auto-complete :data="autoCompleteData" allow-clear size="large" :style="{ width: '90%' }"
            placeholder="please enter something" @focus="handleSearch('focus')" @change="handleSearch('change')"
            v-model="searchText">
          </a-auto-complete>
          <icon-search class="icon" @click="getInitData" />
          <p style="margin-left:10px">语法说明</p>
        </div>
        <!-- 搜索结果start -->
        <div class="search-result">
          <p>找到约{{ resultCount }}条结果</p>
          <a-button type="primary" @click="exportChart" size="small">导出</a-button>
        </div>
        <!-- 搜索下拉框&前n条数据 -->
        <div class="filter-container">
          <!-- 搜索下拉框 -->
          <div class="search-select">
            <span>聚合字段：</span>
            <a-select v-model="search.type" :style="{ width: '320px' }" @change="handleSelect"
              placeholder="Please select ...">
              <a-option value="components">组件</a-option>
              <a-option value="os">系统</a-option>
              <a-option value="title">标题</a-option>
            </a-select>
          </div>
          <!-- 选择n数据 -->
          <div style="display:flex;align-items:center">
            <span>查看前</span>
            <a-select v-model="search.size" @change="handleSelect" :style="{ width: '70px', margin: '0 10px' }">
              <a-option value="10">10</a-option>
              <a-option value="20">20</a-option>
              <a-option value="30">30</a-option>
            </a-select>
            <span>条数据</span>
          </div>
        </div>
        <!-- 树状图 -->
        <Chart width="80%" height="100%" :option="chartOption" id="echarts" ref="barMyChart" />
      </div>
    </a-card>
  </div>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, onMounted, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import { addScanEngine } from '@/api/scan/scan-engine';
import { Message } from '@arco-design/web-vue';
import { useRouter, useRoute } from 'vue-router'
import { getSearchList, getSearchAutoComplete, getSearchInfo, getBarChartList } from '@/api/asset/search'
import { graphic } from 'echarts';
import useChartOption from '@/hooks/chart-option';
import html2canvas from "html2canvas"
import axios from 'axios';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// 自动补全
const autoCompleteData = ref(['']);
// 对搜索参数进行分割用于自动补全接口参数
const splitSearchText = ref('');
// 搜索框数据，来自父组件
const searchText = ref('');
searchText.value = route.query.q.trim()
// 树状图横坐标数据
const xAxis = ref([]);
// 树状图纵坐标数据
const chartsData = ref([]);
// 改变获取自动补充数据搜索条件的定时器
const timers = ref(null)
// 搜索条件
const search = reactive({
  type: route.query.type,
  size: '10',
})
// 搜索结果数
const resultCount = ref(0);
// 柱状图图表实例
const barMyChart = ref();

// ==========================事件响应模块ss==========================


// 获取图表数据
const getBarChartData = async () => {
  xAxis.value = [];
  chartsData.value = [];
  const response = await getBarChartList({ ...search, q: searchText.value })
  if (response.data.length > 0) {
    response.data.forEach(item => {
      xAxis.value.push(item.name);
      chartsData.value.push(item.count)
    })
  }
}
getBarChartData()
// ==========================初始化数据==========================
// 图表初始化
const { chartOption } = useChartOption(() => {
  return {
    grid: {
      left: '0',
      right: '10',
      top: '20',
      bottom: '50',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLine: {
        show: true,
      },

    },
    yAxis: {
      type: 'category',
      data: xAxis.value,
    },

    tooltip: {
      trigger: 'axis',

    },
    series: [
      {
        data: chartsData.value,
        type: 'bar',
        barWidth: '20',
      },
    ],
  };
});

// 下拉框搜索
const handleSelect = () => {
  getBarChartData()
}
// 查询你自动补全数据
const getAutoData = async () => {
  const response = await getSearchAutoComplete(splitSearchText.value.trim());
  autoCompleteData.value = [];
  if (response.data.length > 0) {
    response.data.forEach(item => {
      autoCompleteData.value.push(`${item.title} | ${item.component} | ${item.query}`)
    })
    resultCount.value = response.data.length;
  }
}
// 搜索框获取自动补全数据
const handleSearch = async (type) => {
  // 当获取焦点时获取自动补全数据
  if (type === 'focus') {
    // 改变值使用防抖函数获取自动补全数据
    splitSearchText.value = searchText.value.indexOf('=') !== -1 ? searchText.value.split('=')[1].replace("\"", "").replace("\"", "") : route.query.q;
    getAutoData()
  } else {
    // 当改变值或者选中值时调用补全接口和数据列表接口
    searchText.value = searchText.value.indexOf('|') !== -1 ? searchText.value.split("|")[2] : searchText.value
    splitSearchText.value = searchText.value;
    clearTimeout(timers.value);
    timers.value = setTimeout(() => {
      getAutoData()
      getBarChartData()
    }, 500)
  }

}
// 返回
const goBack = () => {
  router.go(-1)

}
// 图表导出
const exportChart = () => {
  // 转换成canvas
  html2canvas(document.getElementById("echarts")).then(function (canvas) {
    const img = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const createIMg = document.createElement("a");
    createIMg.download = "图表.png";
    createIMg.href = img;
    document.body.appendChild(createIMg);
    createIMg.click();
    createIMg.remove();
  });


}
// onMounted(async () => {
//   await getBarChartData()
// })

</script>
<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  height: calc(100vh - 60px);

}

/deep/ .general-card>.arco-card-body {
  height: 100%;
}

.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;


  .search-result {
    display: flex;
    width: 80%;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
  }

  .filter-container {
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin-bottom: 10px;
  }

  .search-select {
    width: 80%;
  }
}

.search-wrap {
  position: relative;
  width: 80%;
  display: flex;
  justify-content: space-between;
}

.icon {
  position: absolute;
  right: 11%;
  top: 10px;
  z-index: 999;
}


.arco-icon-search {
  font-size: 24px;
}


// .icon {
//   position: absolute;
//   right: 5px;
//   top: 5px;
//   z-index: 999;
// }

.back-btn {
  text-align: right;
  padding-top: 20px;
  position: absolute;
  top: -12px;
  right: 20px;
  z-index: 99;
}
</style>