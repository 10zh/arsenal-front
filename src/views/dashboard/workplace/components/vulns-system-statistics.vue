<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card class="general-card" :header-style="{ paddingBottom: '0' }" :body-style="{
      padding: '20px',
    }">
      <template #title>
        {{ $t('vulns.system.statistics') }}
      </template>
      <Chart height="310px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
// ==========================声明==========================
import useLoading from '@/hooks/loading';
import useChartOption from '@/hooks/chart-option';
import { useI18n } from 'vue-i18n';
import { computed, defineProps } from 'vue';

const { t } = useI18n();
// ==========================父组件传值==========================
const props = defineProps({
  xAxis: {
    type: Array
  },
  yAxis: {
    type: Array,
  }
})

const { loading } = useLoading();
// ==========================初始化图表==========================
const { chartOption } = useChartOption((isDark) => {
  return {
    legend: {
      left: 'center',
      bottom: 0,
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
      show: true,
      trigger: 'item',
      formatter(params) {
        console.log(params)

        return `<div>
            
            ${params.name} 漏洞${params.data
          }个
          </div>`;
      },
    },
    xAxis: {
      type: 'category',
      data: props.xAxis,
      axisLabel: {
        show: true,
        interval: 0,
        rotate: 30,
      }
    },
    yAxis: {
      type: 'value',
    },

    series: [
      {
        type: 'bar',
        label: {
          formatter: '{d}%',
          fontSize: 14,
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderColor: isDark ? '#232324' : '#fff',
          borderWidth: 1,
          normal: {
            color: '#88C89E'
          }
        },
        data: props.yAxis
      },
    ],
  };
});
</script>

<style scoped lang="less"></style>
