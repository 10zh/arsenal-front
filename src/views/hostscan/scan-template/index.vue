<template>
  <div class="container">
    <Breadcrumb :items="['menu.hostscan', 'menu.list.scan.template']" />
    <a-tabs type="rounded" @change="changeTab" style="margin-top:10px" :active-key="activeName">
      <!-- 系统扫描模板 -->
      <a-tab-pane key="1" :title="$t('scan.template.system')">
        <a-card>
          <TemplateTable :active-key="activeName" />
        </a-card>
      </a-tab-pane>
      <!-- 弱口令扫描模板 -->
      <a-tab-pane key="2" :title="$t('scan.template.weak')">
        <a-card>
          <WeakTemplate :active-key="activeName" />
        </a-card>
      </a-tab-pane>
    </a-tabs>

  </div>
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { onMounted, onUnmounted, ref } from 'vue'
import TemplateTable from '@/views/hostscan/scan-template/components/host-scan-template-table-list.vue';
import WeakTemplate from './components/weak-password-table-list.vue'


const activeName = ref('1');

const changeTab = (key) => {
  activeName.value = key;
  // 只要进行切换则清除缓存中的activeTab和pageIndex
  if (localStorage.getItem('activeTab')) {
    localStorage.removeItem('activeTab')
  }
  if (localStorage.getItem('pageIndex')) {
    localStorage.removeItem('pageIndex')
  }

}
onMounted(() => {
  if (localStorage.getItem('activeTab')) {
    activeName.value = localStorage.getItem('activeTab')
  }

})
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
