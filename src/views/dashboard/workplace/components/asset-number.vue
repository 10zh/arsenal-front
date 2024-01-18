<template>
  <!-- 标题 -->

  <a-card style="height:100%">
    <span class="title">{{ $t('asset.number') }}</span>
    <div class="card-container">
      <div v-for="(index, item ) in assetObj" :key="index" class="item-row">
        <!-- 字段名称 -->
        <div class="item" :style="{ background: EnumColor(item) }">
          <span>{{ assetObj[item] }}</span>
        </div>
        <!-- 字段值 -->
        <span>{{ assetLevel(item) }}</span>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
// ==========================声明==========================
import { useI18n } from 'vue-i18n';
import { computed, defineProps } from 'vue';

const { t } = useI18n();
// ==========================父组件传值==========================
const props = defineProps({
  assetObj: {
    type: Object
  }
})
// ==========================数据定义==========================
// 枚举资产
const assetLevel = ((item) => {
  const levelMap = {
    'highTotal': `${t('asset.highTotal')}`,
    'lowTotal': `${t('asset.lowTotal')}`,
    'mediumTotal': `${t('asset.mediumTotal')}`,
    'tipTotal': `${t('asset.tipTotal')}`,
    'safeTotal': `${t('asset.safeTotal')}`,
    'total': `${t('asset.total')}`
  }
  return levelMap[item]
})
// 枚举资产颜色
const EnumColor = (item => {
  const levelColor = {
    'highTotal': 'red',
    'lowTotal': '#d6e8aa',
    'mediumTotal': 'orange',
    'tipTotal': 'gray',
    'total': 'blue',
    'safeTotal': 'green',
  }
  return levelColor[item]
})
</script>

<style scoped lang="less">
.general-card {
  display: flex;
  flex-wrap: wrap;
}

.title {
  font-size: 16px;
  font-weight: 700;
}

.item-row {
  display: flex;
  align-items: center;
  width: 200px;

}

.card-container {
  display: flex;
  flex-wrap: wrap;
  flex: auto;
}

.item {
  height: 35px;
  text-align: center;
  line-height: 35px;
  width: 50px;
  margin: 8px;
  font-size: 18px;
  color: #fff;
}

/deep/ .arco-card-body {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
