<template>
  <div class="container">
    <!-- <Breadcrumb :items="['menu.hostscan', 'menu.list.scan.template']" /> -->
    <a-tabs type="rounded" style="margin-top:10px">
      <!-- 系统扫描模板 -->
      <a-tab-pane key="1" :title="$t('scan.template.system')">
        <a-card>
          <TemplateTable />
        </a-card>
      </a-tab-pane>
      <!-- 弱口令扫描模板 -->
      <a-tab-pane key="2" :title="$t('scan.template.weak')">
        <a-card>
          <WeakTemplate />
        </a-card>
      </a-tab-pane>
    </a-tabs>

  </div>
</template>

<script lang="ts" setup name="scanTemplate">
// ==========================声明模块==========================
import { onMounted, onUnmounted, ref } from 'vue'
import TemplateTable from '@/views/hostscan/scan-template/components/host-scan-template-table-list.vue';
import WeakTemplate from './components/weak-password-table-list.vue'

</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  // height: calc(100vh - 100px);
}

.general-card {

  // height: calc(100% - 50px);
  overflow:hidden /deep/ .arco-card-header-title {
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
