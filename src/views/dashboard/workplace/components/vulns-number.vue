<template>
  <a-card :header-style="{ paddingBottom: '0' }" style="height:100%">
    <span class="title">{{ $t('vulns.number') }}</span>
    <div class="card-container">
      <div v-for="(index, item ) in vulnsObj" :key="index" class="item-row">
        <div class="item" :style="{ background: EnumColor(item) }">
          <span>{{ vulnsObj[item] }}</span>
        </div>
        <span>{{ vulnsLevel(item) }}</span>
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
  vulnsObj: {
    type: Object
  }
})
// ==========================数据定义==========================
// 枚举漏洞
const vulnsLevel = ((item) => {
  const levelMap = {
    'highTotal': `${t('vulns.highTotal')}`,
    'lowTotal': `${t('vulns.lowTotal')}`,
    'mediumTotal': `${t('vulns.mediumTotal')}`,
    'tipTotal': `${t('vulns.tipTotal')}`,
    'total': `${t('vulns.total')}`
  }
  return levelMap[item]
})
// 枚举漏洞颜色
const EnumColor = (item => {
  const levelColor = {
    'highTotal': 'red',
    'lowTotal': 'green',
    'mediumTotal': 'orange',
    'tipTotal': 'gray',
    'total': 'blue'
  }
  return levelColor[item]
})
</script>

<style scoped lang="less">
.card-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex: auto;

}

.card {
  width: 250px;
  height: 150px;

  .card-content {
    display: flex;
    align-items: center;
  }
}

.vulns-nums {
  font-size: 18px;

  span {
    font-weight: 700;
  }
}

.title {
  font-size: 16px;
  font-weight: 700;
}

.color1 {
  border: 2px solid #f4d135
}

.color2 {
  border: 2px solid #88c89e
}

.color3 {
  border: 2px solid #50a5db
}

.col-avatar {
  margin: 0 10px;
  width: 65px !important;
  height: 60px !important;
}

/deep/ .arco-avatar-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}

.title {
  font-size: 16px;
  font-weight: 700;
}

.general-card {
  display: flex;
  flex-wrap: wrap;
}

.item-row {
  display: flex;
  align-items: center;
  width: 200px;
}

.item {
  min-height: 35px;
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
