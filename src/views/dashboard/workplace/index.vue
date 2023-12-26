<template>
  <div class="container">
    <!-- 左侧卡片 -->
    <div class="left-side">
      <div class="panel">
        <!-- 系统参数 -->
        <systemParams :params-obj="sysParamsObj"></systemParams>
      </div>
      <div class="panel" style="margin-top:20px">
        <!-- 资产漏洞统计 -->
        <assetVulnsStatistics></assetVulnsStatistics>
      </div>
      <a-grid :cols="24" :col-gap="16" :row-gap="16" style="margin-top: 16px">
        <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }">
          <!-- 漏洞类别统计 -->
          <vulnsCategoryStatistics :x-axis="categoryAxis" :y-axis="categoryData"></vulnsCategoryStatistics>
        </a-grid-item>
        <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }">
          <!-- 风险维度统计 -->
          <riskDimensionStatistics :x-axis="sysAxis" :y-axis="sysData"></riskDimensionStatistics>
        </a-grid-item>
      </a-grid>
    </div>
    <!-- 右侧卡片 -->
    <div class="right-side">
      <a-grid :cols="24" :row-gap="24">
        <a-grid-item :span="24">
          <!-- 资产数量统计 -->
          <assetNumber :asset-obj="assetNumberObj"></assetNumber>
        </a-grid-item>
        <a-grid-item :span="24">
          <!-- 漏洞数量统计 -->
          <vulnsNumber :vulns-obj="vulnsNums"></vulnsNumber>
        </a-grid-item>
        <a-grid-item :span="24">
          <!-- 漏洞TOP统计 -->
          <vulnsStatistics></vulnsStatistics>

        </a-grid-item>


      </a-grid>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue';
import { querySysParams, querySysVulns, queryVulnsByCategory, queryVulnsBySys, queryAssetNumber } from '@/api/dashboard'

import systemParams from './components/system-params.vue';
import vulnsNumber from './components/vulns-number.vue';
import vulnsCategoryStatistics from './components/vulns-category-statistics.vue'
import riskDimensionStatistics from './components/vulns-system-statistics.vue';
import assetVulnsStatistics from './components/asset-vulns-statistics.vue';
import assetNumber from './components/asset-number.vue'
import vulnsStatistics from './components/vulns-statistics.vue';


const sysParamsObj = reactive({
  disk: {
    total: '',
    free: '',
  },
  cpu: {
    cpuModel: '',
    sys: '',
    used: '',
    cpuNum: ''
  },
  memory: {
    free: '',
    total: '',
    usage: "",
    used: ''
  }
});
const vulnsNums = ref();
// 漏洞类别维度的数据
// X数据
const categoryAxis = ref([]);
// Y数据
const categoryData = ref([]);
const vulnsBySys = ref();
// 风险维度数据
const sysAxis = ref([]);
const sysData = ref([])
// 资产数据
const assetNumberObj = ref();


// 获取系统参数
const initSysParam = async () => {
  const res = await querySysParams();
  sysParamsObj.disk = res.data.disk;
  sysParamsObj.cpu = res.data.cpu;
  sysParamsObj.memory = res.data.memory
}
// 获取漏洞数量
const initVulnsNumber = async () => {
  const res = await querySysVulns()
  vulnsNums.value = res.data;

}
// 获取类别维度统计数据图表
const initVulnsByCategory = async () => {
  const res = await queryVulnsByCategory();
  console.log(res.data)
  res.data.forEach(item => {
    categoryAxis.value.push(item.category);
    categoryData.value.push(item.vulnerabilityNumber)
  })
}
// 获取风险维度统计数据图表
const initVulnsBySys = async () => {
  const res = await queryVulnsBySys();
  res.data.forEach(item => {
    sysAxis.value.push(item.osName);
    sysData.value.push(item.vulnerabilityNumber)
  })

}
// 查询资产统计
const initAssetNumber = async () => {
  const res = await queryAssetNumber();
  assetNumberObj.value = res.data;
}

initVulnsNumber()
initSysParam()
initVulnsByCategory()
initVulnsBySys()
initAssetNumber()
// initVulnsTop()
</script>

<script lang="ts">
export default {
  name: 'Dashboard',

};
</script>

<style lang="less" scoped>
.container {
  background-color: var(--color-fill-2);
  padding: 16px 20px;
  padding-bottom: 0;
  display: flex;
}

.bottom {
  width: 100%;
  background-color: var(--color-fill-2);
  padding: 16px 20px;
  height: 200px;
}

.left-side {
  flex: 1;
  overflow: auto;
}

.right-side {
  width: 450px;

  margin-left: 16px;
}

.panel {
  // background-color: var(--color-bg-2);
  border-radius: 4px;
  overflow: auto;
}

:deep(.panel-border) {
  margin-bottom: 0;
  border-bottom: 1px solid rgb(var(--gray-2));
}

.moduler-wrap {
  border-radius: 4px;
  background-color: var(--color-bg-2);

  :deep(.text) {
    font-size: 12px;
    text-align: center;
    color: rgb(var(--gray-8));
  }

  :deep(.wrapper) {
    margin-bottom: 8px;
    text-align: center;
    cursor: pointer;

    &:last-child {
      .text {
        margin-bottom: 0;
      }
    }

    &:hover {
      .icon {
        color: rgb(var(--arcoblue-6));
        background-color: #e8f3ff;
      }

      .text {
        color: rgb(var(--arcoblue-6));
      }
    }
  }

  :deep(.icon) {
    display: inline-block;
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
    color: rgb(var(--dark-gray-1));
    line-height: 32px;
    font-size: 16px;
    text-align: center;
    background-color: rgb(var(--gray-1));
    border-radius: 4px;
  }
}
</style>

<style lang="less" scoped>
// responsive
.mobile {
  .container {
    display: block;
  }

  .right-side {
    // display: none;
    width: 100%;
    margin-left: 0;
    margin-top: 16px;
  }
}
</style>
