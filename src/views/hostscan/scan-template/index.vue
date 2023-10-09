<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', 'menu.list.scan.template']" />
    <a-card class="general-card" :title="$t('menu.list.scan.template')">
      <TemplateTable />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import TemplateTable from '@/views/hostscan/scan-template/components/host-scan-template-table-list.vue';
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
