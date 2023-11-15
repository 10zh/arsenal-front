<template>
  <div class="container">
    <Breadcrumb :items="['menu.asset', 'asset.list']" />

    <a-card class="general-card" :title="$t('asset.list')" @tab-click="handleClick">
      <!-- 返回按钮 -->
      <div class="back-btn">
        <a-button @click="goBack">{{ t('scan.add.config.goback') }}</a-button>
      </div>
      <div class="search">
        <a-input-search :style="{ width: '70%' }" v-model="searchText" placeholder="Please enter something" size="large"
          @search="search" />
        <span style="display:inline-block;margin-left:20px">语法说明 / 搜索样例</span>
      </div>


    </a-card>
    <a-card style="margin:10px 50px;">
      <a-tabs type="rounded">

        <a-tab-pane key="1" :title="$t('asset.tabs.result')">
          <searchList></searchList>
        </a-tab-pane>
        <a-tab-pane key="2" :title="$t('asset.tabs.bug')">
        </a-tab-pane>

      </a-tabs>
    </a-card>
  </div>
</template>
<script setup>

// ==========================声明模块==========================
import { ref, reactive, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import searchList from './components/search-table-list.vue'


const { t } = useI18n();
const route = useRoute();
const router = useRouter()
// 搜索条件
const searchText = ref('');
searchText.value = route.query.q;

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
// 返回
const goBack = () => {
  router.go(-1);
};

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
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-btn {
  text-align: right;
  padding-top: 20px;
  position: absolute;
  top: -12px;
  right: 20px;
  z-index: 99;
}
</style>