<template>
  <div class="container">
    <Breadcrumb :items="['menu.manage', 'menu.manage.userList']" />
    <a-card class="general-card" :style="{ height: tableHeight + 'px' }" :title="$t('menu.manage.userList')"
      @tab-click="handleClick">
      <!-- 搜索框&新增按钮 -->
      <div class="search">
        <a-space>
          <a-input-search v-model="page.keyword" :style="{ width: '250px' }" placeholder="Please enter something"
            @search="search" />
          <a-button type="primary" @click="handleAdd">{{ t('manage.user.add') }}</a-button>
        </a-space>
      </div>
      <!-- tabs栏 -->
      <a-tabs type="rounded" :style="{ height: (tableHeight - 150) + 'px' }" @tab-click="handleClick">
        <!-- 全部用户 -->
        <a-tab-pane key="3" :title="$t('manage.user.all')">
          <userTableList :card-data="cardList" @init-data="initData"></userTableList>
        </a-tab-pane>
        <!-- 正常用户 -->
        <a-tab-pane key="0" :title="$t('manage.user.normal')">
          <userTableList :card-data="cardList" @init-data="initData"></userTableList>
        </a-tab-pane>
        <!-- 锁定用户 -->
        <a-tab-pane key="1" :title="$t('manage.user.lock')">
          <userTableList :card-data="cardList" @init-data="initData"></userTableList>
        </a-tab-pane>
      </a-tabs>
      <a-pagination class="pagination" :total="page.total" :current="page.pageIndex" :page-size="page.pageSize" show-total
        @change="changePageEvent" />


    </a-card>

    <!-- 新增用户对话框 -->
    <addDialog ref="addUserRef" @init-data="initData"></addDialog>
  </div>
</template>
<script setup lang="ts">

// ==========================声明模块==========================
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { getUserPageList } from '@/api/manage/user';
import userTableList from './components/user-table-list.vue'
import addDialog from './components/add-dialog.vue'


const { t } = useI18n();
// 卡片数据
const cardList = ref();
const addUserRef = ref()
const page = reactive({
  pageSize: 10,
  pageIndex: 1,
  total: 10,
  keyword: '',
  status: '',
})
// 列表的高度
const tableHeight = ref()
// ==========================事件响应模块==========================
const initData = async (status) => {
  const data = await getUserPageList(page);
  cardList.value = data.data;
  page.total = data.totalCount;
}
// 切换tab栏
const handleClick = (e) => {
  if (e === '3') {
    page.status = null
  } else {
    page.status = e;
  }
  initData()

}

// 分页
const changeSizeEvent = () => {

}
const changePageEvent = (val) => {
  page.pageIndex = val;
  initData()

}
// 新增用户
const handleAdd = () => {
  addUserRef.value.handleAddRoleVisible(true);

}
onMounted(() => {
  // 动态计算表格的高度并进行分页
  const height =
    document.documentElement.clientHeight - 150;
  tableHeight.value = height;
  page.pageSize = Math.floor((height / 250)) * Math.floor((document.documentElement.clientWidth / 340));
  // 初始化数据
  initData()
})

</script>
<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
}

.general-card {
  position: relative;
  min-height: 150px;

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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>