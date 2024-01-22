<template>
  <div class="container" style="position:relative">
    <Breadcrumb :items="['menu.asset', 'menu.asset.detail']" />

    <div id="basic-demo" style="height:calc(100vh - 150px);overflow:auto">

      <a-card class=" general-card" :title="$t('menu.asset.detail')" @tab-click="handleClick">
        <!-- 返回按钮 -->
        <div class="back-btn">
          <a-button @click="goBack">{{ t('scan.add.config.goback') }}</a-button>
        </div>
        <!-- 搜索框start -->
        <div class="search">
          <div class="search-wrap">
            <a-auto-complete :data="autoCompleteData" size="large" :style="{ width: '900px' }"
              placeholder="please enter something" @focus="handleSearch" @select="handleSelect"
              @change="handleInput(getAutoData, 500)" v-model="searchText">
            </a-auto-complete>
            <icon-search class="icon" @click="getInitData('search')" />
          </div>
          <span style="display:inline-block;margin-left:20px">{{ $t('asset.searchList.syntax') }} /
            {{ $t('asset.searchList.searchSample') }}</span>
        </div>
        <!-- 搜索框end -->
      </a-card>
      <!-- 基本信息tabs -->
      <detailMessage :detail-info='detailMessages'></detailMessage>
      <!-- 主机服务信息 -->
      <detailList :port-services="detailMessages.portServices"></detailList>
    </div>
    <a-back-top target-container="#basic-demo" :style="{ position: 'absolute' }" />


  </div>
</template>
<script setup lang="ts">
// ==========================声明模块==========================
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { getSearchDetail, getSearchAutoComplete } from '@/api/asset/search'
import detailMessage from './components/detail-message.vue'
import detailList from './components/detail-list.vue'



const { t } = useI18n();
const route = useRoute();
const router = useRouter();
// 搜索条件
const searchText = ref('');
// 搜索条件默认为路由参数
searchText.value = route.query.q.trim();
// 切割之后的搜索条件用于获取自动补全数据
const splitSearchText = ref('');
// 详情信息
const detailMessages = reactive({
  basic: {
    ipv4: ""
  },
  components: {},
  portServices: []
});
// 自动补全
const autoCompleteData = ref([])
// 获取补全数据的防抖定时器
const timers = ref(null);
// ==========================事件响应模块ss==========================
// 初始化数据
const initData = async () => {
  const response = await getSearchDetail(route.query.id);
  detailMessages.basic = response.data.basic;
  detailMessages.components = response.data.components;
  detailMessages.portServices = response.data.portServices;
}
// 获取补全数据
const getAutoData = async () => {
  const response = await getSearchAutoComplete(splitSearchText.value.toString().trim());
  autoCompleteData.value = [];
  if (response.data.length > 0) {
    response.data.forEach(item => {
      autoCompleteData.value.push(`${item.title} | ${item.component} | ${item.query}`)
    })
  }

}
// 搜索框数值改变时，获取自动补全数据以及获取列表
const handleSearch = async (type) => {
  // 当获取焦点时获取自动补全数据
  // 改变值使用防抖函数获取自动补全数据（获取app=后的值）
  splitSearchText.value = searchText.value.indexOf('=') !== -1 ? searchText.value.split('=')[1].replace("\"", "").replace("\"", "") : route.query.q;
  getAutoData()

}
// 当输入框发生改变时
const handleInput = (fn, delay) => {
  searchText.value = searchText.value.indexOf('|') !== -1 ? searchText.value.split("|")[2] : searchText.value
  splitSearchText.value = searchText.value;
  clearTimeout(timers.value);
  timers.value = setTimeout(() => {
    fn()
  }, 1000)
}
// 切换搜索条件
const handleSelect = () => {
  if (searchText.value !== route.query.q.trim() && searchText.value !== '') {
    router.go(-1);
  }
}
// 返回
const goBack = () => {
  router.go(-1);
};
// 初始化数据
initData()
</script>
<style lang="less" scoped>
.container {
  padding: 0 20px 20px 20px;
  margin: 0 50px;
}

.general-card {
  position: relative;

  /deep/ .arco-card-header-title {
    // font-weight: 700;
    font-size: 16px;
  }

  /deep/ .arco-card-header {
    padding: 5px 10px 0px 10px;
  }

  /deep/ .arco-tabs-content {
    padding: 0;
  }

  /deep/ .arco-card-body {
    padding: 0 10px 10px 10px;
  }


}

.arco-scrollbar {
  height: calc(100% - 50px);
}

/deep/ .arco-card-body {
  height: 100%;
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20px;
}

.search-wrap {
  position: relative;
}

.arco-icon-search {
  font-size: 24px;
}


.icon {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 999;
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