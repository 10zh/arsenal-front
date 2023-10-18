<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', 'menu.list.scan.config']" />
    <a-card class="general-card" :title="$t('menu.list.scan.configList')">
      <ConfigTable />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import ConfigTable from '@/views/hostscan/scan-config/components/host-scan-config-table-list.vue';
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .general-card {
    /deep/ .arco-card-header-title {
      // font-weight: 700;
      font-size: 20px;
    }
  }
</style>
