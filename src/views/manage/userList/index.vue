<template>
  <div class="container">
    <Breadcrumb :items="['menu.manage', 'menu.manage.userList']" />
    <a-card class="general-card" :title="$t('menu.manage.userList')" @tab-click="handleClick">
      <div class="search">
        <a-input-search :style="{ width: '250px' }" placeholder="Please enter something" @search="search" />
      </div>
      <a-tabs type="rounded">

        <a-tab-pane key="1" :title="$t('manage.user.all')">
          <userTableList></userTableList>
        </a-tab-pane>
        <a-tab-pane key="2" :title="$t('manage.user.normal')">
          <userTableList></userTableList>
        </a-tab-pane>
        <a-tab-pane key="3" :title="$t('manage.user.lock')">
          <userTableList></userTableList>
        </a-tab-pane>
      </a-tabs>

    </a-card>
  </div>
</template>
<script setup>

// ==========================声明模块==========================
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import userTableList from './components/user-table-list.vue'

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