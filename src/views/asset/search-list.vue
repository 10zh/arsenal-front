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
        <div class="search-wrap">
          <a-auto-complete :data="autoCompleteData" size="large" :style="{ width: '900px' }"
            placeholder="please enter something" @focus="handleSearch('focus')" @change="handleSearch('change')" loading
            v-model="searchText">
          </a-auto-complete>
          <icon-search class="icon" @click="getInitData('search')" />
        </div>
        <span style="display:inline-block;margin-left:20px">{{ $t('asset.searchList.syntax') }} /
          {{ $t('asset.searchList.searchSample') }}</span>
      </div>
      <!-- 搜索框end -->
    </a-card>
    <!-- 卡片列表 -->
    <a-card style="margin:10px 50px;height:90%">
      <a-scrollbar class="scrollbar" style="overflow:auto;height:calc(100% - 10px)">
        <a-tabs type="rounded" @change="changeTabs">
          <!-- 搜索结果start -->
          <a-tab-pane key="1" :title="$t('asset.tabs.result')">
            <searchList :card-list="cardList" :rightInfo="rightInfo" :searchText="searchText"></searchList>
          </a-tab-pane>
          <!-- 相关漏洞start -->
          <a-tab-pane key="2" :title="$t('asset.tabs.bug')">
            <div style="padding:0 20px" v-for="item in rightInfo.vulns" :key="item.componentName">
              <!-- 漏洞标题start -->
              <a-typography>
                <a-typography-title :heading="5">
                  {{ item.componentName }}
                </a-typography-title>
              </a-typography>
              <!-- 漏洞项的列表start -->
              <a-list>
                <a-list-item class="list-row" v-for="row in item.list" :key="row.vulnId">
                  <span>{{ row.vulnId }}</span>
                  <span class="risk-width">{{ formatDate(row.createTime, 'YYYY-MM-DD') }}</span>
                  <span class="risk-width" :style="{ 'color': setRiskGradeColor(row.riskGrade) }">{{
                    setRiskGradeText(row.riskGrade)
                  }}</span>
                  <span>{{ row.vulnName }}</span>
                </a-list-item>
              </a-list>
            </div>
          </a-tab-pane>

        </a-tabs>
      </a-scrollbar>


      <!-- 底部分页栏 -->
      <a-pagination v-if="activeTab === '1'" class="pagination" :total="pagination.total" :current="pagination.pageIndex"
        :page-size="pagination.pageSize" show-total show-jumper show-page-size @change="changePageEvent" />

    </a-card>


  </div>
</template>
<script setup>

// ==========================声明模块==========================
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import { getSearchList, getSearchAutoComplete, getSearchInfo } from '@/api/asset/search'
import formatDate from '@/utils/times'
import { setRiskGradeText, setRiskGradeColor } from '@/hooks/status-options'
import searchList from './components/search-table-list.vue'


const { t } = useI18n();
const route = useRoute();
const router = useRouter()
// 搜索条件
const searchText = ref('');
// 判断来自父组件的路由参数,列表传的是例如（app="RESP"）
searchText.value = route.query.q.indexOf('|') !== -1 ? route.query.q.split('|')[2] : route.query.q;
// 对搜索参数进行分割用于，自动补全接口参数app="RESP"中的RESP）
const splitSearchText = ref('');
// 分页参数
const pagination = reactive({
  pageSize: 10,
  pageIndex: 1,
  total: 10
})
// 卡片数据列表
const cardList = ref([]);
// 右侧聚合信息
const rightInfo = reactive({
  components: [],
  ipv4Number: '',
  ipv6Number: '',
  webTitles: [],
  vulns: []
})
// 自动补全
const autoCompleteData = ref([''])
// 防抖定时器
const timers = ref(null)
// 选中激活的tab项
const activeTab = ref("1")
// ==========================事件响应模块ss==========================
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
// 获取数据列表
const getInitData = async () => {
  const params = {
    ...pagination,
    q: searchText.value
  }
  const response = await getSearchList(params);
  cardList.value = response.data;
  pagination.total = response.totalCount;
}
// 搜索框数值改变时，获取自动补全数据以及获取列表
const handleSearch = async (type) => {
  // 当获取焦点时获取自动补全数据
  if (type === 'focus') {
    // 改变值使用防抖函数获取自动补全数据（获取app=后的值）
    splitSearchText.value = searchText.value.indexOf('=') !== -1 ? searchText.value.split('=')[1].replace("\"", "").replace("\"", "") : route.query.q;
    getAutoData()
  } else {
    searchText.value = searchText.value.indexOf('|') !== -1 ? searchText.value.split("|")[2] : searchText.value
    splitSearchText.value = searchText.value;
    timers.value = setTimeout(() => {
      getAutoData()
      getInitData('select')
    }, 500)

  }

}

// 获取右侧聚合搜索信息
const getInitInfo = async () => {
  const params = {
    q: searchText.value
  }
  const response = await getSearchInfo(params);
  Object.assign(rightInfo, response.data)
}

// 切换tab栏
const handleClick = () => {

}
// 搜索
const search = () => {
  getInitData()
  getInitInfo()
}
// 分页
const changePageEvent = (val) => {
  pagination.pageIndex = val;
  getInitData();
  getInitInfo();
}
// 返回
const goBack = () => {
  router.go(-1);
};
// 切换tab栏
const changeTabs = (key) => {
  activeTab.value = key
}
// 页面加载时初始化页面列表数据
onMounted(() => {
  getInitInfo()
  // 动态计算表格的高度并进行分页
  const height =
    document.documentElement.clientHeight - 350;
  pagination.pageSize = Math.floor(height / 300);
  getInitData();

})
onUnmounted(() => {
  clearTimeout(timers.value)
})


</script>
<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  height: calc(100vh - 150px);
}

.general-card {
  position: relative;

  /deep/ .arco-card-header-title {
    // font-weight: 700;
    font-size: 16px;
  }

  /deep/ .arco-card-header {
    padding: 0 10px;
  }

  /deep/ .arco-tabs-content {
    padding: 0;
  }

  .back-btn {
    text-align: right;
    padding-top: 20px;
    position: absolute;
    top: -12px;
    right: 20px;
    z-index: 99;
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

  .search-wrap {
    position: relative;

    .arco-icon-search {
      font-size: 24px;
    }

    .icon {
      position: absolute;
      right: 5px;
      top: 5px;
      z-index: 999;
    }

  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 80%;
}

/deep/ .scrollbar {
  overflow: auto;

  .list-row {
    span {
      display: inline-block;
      width: 400px;
      margin-right: 20px;
      color: var(--color-text-2);
    }

    .risk-width {
      width: 150px;
    }
  }

}
</style>