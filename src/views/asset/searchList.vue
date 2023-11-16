<template>
  <div class="container">
    <Breadcrumb :items="['menu.asset', 'asset.list']" />

    <a-card class="general-card" :title="$t('asset.list')" @tab-click="handleClick">
      <!-- 返回按钮 -->
      <div class="back-btn">
        <a-button @click="goBack">{{ t('scan.add.config.goback') }}</a-button>
      </div>
      <!-- 搜索框start -->
      <div class="search">
        <a-input-search :style="{ width: '70%' }" v-model="searchText" placeholder="Please enter something" size="large"
          @search="search" />
        <span style="display:inline-block;margin-left:20px">语法说明 / 搜索样例</span>
      </div>
      <!-- 搜索框end -->
    </a-card>
    <!-- 卡片列表 -->
    <a-card style="margin:10px 50px;">

      <a-tabs type="rounded">
        <!-- 搜索结果start -->
        <a-tab-pane key="1" :title="$t('asset.tabs.result')">
          <searchList :card-list="cardList"></searchList>
        </a-tab-pane>
        <!-- 相关漏洞start -->
        <a-tab-pane key="2" :title="$t('asset.tabs.bug')">
        </a-tab-pane>
      </a-tabs>
      <!-- 底部分页栏 -->
      <a-pagination class="pagination" :total="page.total" :current="page.pageIndex" :page-size="page.pageSize" show-total
        show-jumper show-page-size @change="changePageEvent" @page-size-change="changeSizeEvent" />

    </a-card>

  </div>
</template>
<script setup>

// ==========================声明模块==========================
import { ref, reactive, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { getSearchList } from '@/api/asset/search'
import searchList from './components/search-table-list.vue'


const { t } = useI18n();
const route = useRoute();
const router = useRouter()
// 搜索条件
const searchText = ref('');
// 判断来自父组件的路由参数
searchText.value = route.query.q.indexOf('|') !== -1 ? route.query.q.split('|')[1] : route.query.q;
// 分页参数
const page = reactive({
  pageSize: 10,
  pageIndex: 1,
  total: 10
})
// 卡片数据列表
const cardList = ref([]);

// ==========================事件响应模块==========================
// 获取数据列表
const getInitData = async () => {
  const params = {
    ...page,
    q: searchText.value
  }
  const response = await getSearchList(params);
  cardList.value = response.data

}
// 切换tab栏
const handleClick = () => {

}
// 搜索
const search = () => {
  getInitData()
}
// 分页
const changeSizeEvent = () => {

}
const changePageEvent = () => {

}
// 返回
const goBack = () => {
  router.go(-1);
};
// 页面加载时初始化页面列表数据
onMounted(() => {
  getInitData();
})


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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  widows: 100%;
}
</style>