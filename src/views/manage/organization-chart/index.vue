<template>
  <div class="container">
    <Breadcrumb :items="['menu.manage', 'menu.manage.organization']" />
    <a-card class="general-card" :title="$t('menu.manage.organization.list')">
      <!-- 组织架构列表组件 -->
      <tableList></tableList>
    </a-card>
  </div>
</template>
<script setup lang="ts">

// ==========================声明模块==========================
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import tableList from './components/organization-table-list.vue'

const { t } = useI18n();
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