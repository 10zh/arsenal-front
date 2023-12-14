<template>
  <div class="container">
    <Breadcrumb :items="['menu.manage', 'menu.manage.userList']" />
    <a-card class="general-card" :title="$t('menu.manage.userList')" @tab-click="handleClick">
      <!-- 搜索框&新增按钮 -->
      <div class="search">
        <a-space>
          <a-input-search :style="{ width: '250px' }" placeholder="Please enter something" @search="search" />
          <a-button type="primary" @click="handleAdd">{{ t('manage.user.add') }}</a-button>
        </a-space>
      </div>
      <!-- tabs栏 -->
      <a-tabs type="rounded">
        <!-- 全部用户 -->
        <a-tab-pane key="1" :title="$t('manage.user.all')">
          <userTableList></userTableList>
        </a-tab-pane>
        <!-- 正常用户 -->
        <a-tab-pane key="2" :title="$t('manage.user.normal')">
          <userTableList></userTableList>
        </a-tab-pane>
        <!-- 锁定用户 -->
        <a-tab-pane key="3" :title="$t('manage.user.lock')">
          <userTableList></userTableList>
        </a-tab-pane>
      </a-tabs>

    </a-card>
    <!-- 新增用户对话框 -->
    <addDialog ref="addUserRef"></addDialog>
  </div>
</template>
<script setup>

// ==========================声明模块==========================
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import userTableList from './components/user-table-list.vue'
import addDialog from './components/add-dialog.vue'

const { t } = useI18n();
// 卡片数据
const cardList = ref();
const addUserRef = ref()

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
// 新增用户
const handleAdd = () => {
  addUserRef.value.handleAddRoleVisible(true);

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