<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', 'menu.list.scan.config']" />
    <a-tabs type="rounded" style="margin-top:10px">
      <!-- 系统扫描模板 -->
      <a-tab-pane key="1" :title="$t('menu.list.scan.configList')">
        <a-card>
          <ConfigTable />
        </a-card>
      </a-tab-pane>
      <!-- 弱口令扫描模板 -->
      <a-tab-pane key="2" :title="$t('menu.list.scan.weak')">
        <a-card>
          <WeakTable />
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import ConfigTable from './system-scan/components/host-scan-config-table-list.vue';
import WeakTable from './weak-scan/components/host-scan-weak-table-list.vue'
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

/deep/ .arco-tabs-tab-active {
  background: #fff;
}

/deep/ .arco-tabs-tab-active:hover {
  background: #fff;
}
</style>
