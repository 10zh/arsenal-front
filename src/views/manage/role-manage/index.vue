<template>
  <div class="container">
    <Breadcrumb :items="['menu.manage', 'manage.role.list']" />
    <a-card class="general-card" :title="$t('manage.role.list')">
      <tableList></tableList>

    </a-card>
  </div>
</template>
<script setup lang="ts">

// ==========================声明模块==========================
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import tableList from './components/role-table-list.vue'

const { t } = useI18n();
// 卡片数据
const cardList = ref();

// ==========================事件响应模块==========================
// 获取数据列表
const getInitData = () => {

}

// 切换tab栏
const handleClick = () => {

}
// 搜索
const search = () => {

}

</script>
<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.general-card {
  position: relative;

  /deep/ .arco-card-header-title {
    // font-weight: 700;
    font-size: 20px;
  }
}

.search {
  position: absolute;
  right: 10px;
  z-index: 999;
}
</style>