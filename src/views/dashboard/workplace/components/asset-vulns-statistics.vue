<template>
  <a-spin :loading="loading" style="width: 100%;height:100%">
    <a-card class="general-card" :header-style="{ paddingBottom: '0', paddingTop: '10px' }" :body-style="{
      padding: '0px', height: '100%'
    }" style="height:100%">
      <!-- 标题 -->
      <template #title>
        {{ $t('asset.vulns.tend') }}
      </template>
      <!-- 日期类型选择框 -->
      <template #extra>
        <a-radio-group default-value="week" @change="initTendData" v-model="unitType">
          <a-radio value="week">
            <template #radio="{ checked }">
              <a-tag :checked="checked" :color="checked ? 'arcoblue' : ''" checkable>周</a-tag>
            </template>
          </a-radio>
          <a-radio value="month">
            <template #radio="{ checked }">
              <a-tag :checked="checked" :color="checked ? 'arcoblue' : ''" checkable>月</a-tag>
            </template>
          </a-radio>
          <a-radio value="day">
            <template #radio="{ checked }">
              <a-tag :checked="checked" :color="checked ? 'arcoblue' : ''" checkable>天</a-tag>
            </template>
          </a-radio>
        </a-radio-group>
      </template>
      <!-- 趋势图表 -->
      <Chart height="100%" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
// ==========================声明==========================
import useLoading from '@/hooks/loading';
import useChartOption from '@/hooks/chart-option';
import { useI18n } from 'vue-i18n';
import { computed, defineProps, onMounted, ref } from 'vue';
import { queryTend } from '@/api/dashboard'

const { t } = useI18n();

const { loading } = useLoading();
// 时间单位格式
const unitType = ref('week');
// X轴日期
const date = ref([])
// Y轴资产
const assetData = ref([])
// Y轴漏洞
const vulnsData = ref([])
// ==========================初始化表格==========================
const { chartOption } = useChartOption((isDark) => {
  return {
    legend: {
      data: [t('asset'), t('vulns')],
      left: 'center',
      top: 0,
      icon: 'circle',
      itemWidth: 8,
      textStyle: {
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',

      },
      itemStyle: {
        borderWidth: 0,
      },
    },

    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: date.value,
    },
    yAxis: {
      type: 'value',
    },

    series: [
      {
        data: assetData.value,
        type: 'line',
        stack: 'x',
        smooth: true,
        name: t('asset'),
        lineStyle: {
          color: '#3c70ba',
          width: 2,
          type: 'solid',
        },
        itemStyle: {
          color: '#3c70ba'
        },
        areaStyle: {
          color: '#c3e7ff'
        },
      },
      {
        data: vulnsData.value,
        type: 'line',
        stack: 'x',

        smooth: true,
        name: t('vulns'),
        lineStyle:
        {
          color: '#e78d7a',
          width: 2,
          type: 'solid',
        },

        itemStyle: {
          color: '#e78d7a'
        },
        areaStyle: {
          color: '#f0e7e8'
        },
      }
    ],
  };
});
// ==========================初始化数据==========================
// 获取趋势数据
const initTendData = async () => {
  date.value = [];
  assetData.value = [];
  vulnsData.value = []
  const res = await queryTend(unitType.value);
  res.data.forEach(item => {
    date.value.push(item.trendDate);
    assetData.value.push(item.assetNumber);
    vulnsData.value.push(item.vulnerabilityNumber)
  })
}
onMounted(() => {
  initTendData()

})
</script>

<style scoped lang="less"></style>
