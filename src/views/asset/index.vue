<template>
  <div class="container">
    <div class="panel">
      <div class="search" style="width:70%">
        <!-- logo标题 start-->
        <div class="title">
          <img src="../../assets/images/logo.png">
          <span style="font-size:20px;font-weight:700;margin-top:10px">arsenal | 安森纳</span>
        </div>
        <!-- 搜索框start -->
        <div class="search-wrap">
          <a-auto-complete :data="autoCompleteData" size="large" virtual-list-props placeholder="please enter something"
            @focus="handleSearch" @change="handleSearch" @select="handleClick" v-model="queryFactor">
          </a-auto-complete>
          <icon-search class="icon" @click="handleClick('click')" />
          <a-button type="primary" size="mini" @click="handleClick('click')"> 搜索</a-button>
        </div>
        <!-- 搜索框end -->
        <!-- 历史搜索&搜索引导 -->
        <div class="search-notice">
          <!-- 历史搜索 -->
          <div class="history">
            <a-list>
              <template #header>
                <div style="display:flex;justify-content: space-between">
                  <span class="history-text">{{ t('asset.search.history') }}</span>
                  <div class="change-btn" @click="queryHistoryList">
                    <icon-sync style="color:#868181;margin-right:5px" />
                    <span style="font-size:14px;color:#a29e9e">换一批</span>

                  </div>
                </div>
              </template>
              <a-list-item style="cursor: pointer;" v-for="(item, index) in  historyList" :key="index">
                <a-link :status="linkColor(index)" @click="searchHistory(item.query)">{{ index + 1 }}、{{
                  item.query
                }}</a-link>
              </a-list-item>

            </a-list>
          </div>
          <!-- 检索引导 -->
          <div class="teach">
            <a-tabs>
              <a-tab-pane key="1" :title="t('asset.search.bootstrapping')">
                <a-table :columns="columns" :data="data" :scroll="scroll" :pagination="false">
                  <template #paradigm="{ record }">
                    <a-tag color="green" v-for="item in record.paradigm" :key="item.name">
                      {{ item.name }}
                    </a-tag>
                  </template>
                </a-table>
              </a-tab-pane>
            </a-tabs>


          </div>
        </div>
        <!-- 统计数值start -->
        <div class="static-wrap">
          <!-- 服务 -->
          <div class="static">
            <i class="iconfont icon-zhujifangbingdu"></i>
            <div class="static-item">
              <span>{{ t('asset.mapping.host') }}</span>
              <span class="nums">{{ staticCount.serviceNumber }}</span>
            </div>

          </div>
          <!-- 主机 -->
          <div class="static">
            <i class="iconfont icon-fuwu"></i>
            <div class="static-item">
              <span>{{ t('asset.mapping.host') }}</span>
              <span class="nums">{{ staticCount.hostNumber }}</span>
            </div>

          </div>
          <!-- 漏洞 -->
          <div class="static">
            <i class="iconfont icon-loudongku"></i>
            <div class="static-item">
              <span>{{ t('asset.mapping.vulnerabilities') }}</span>
              <span class="nums">{{ staticCount.vulnerabilityNumber }}</span>
            </div>

          </div>
          <!-- 组件 -->
          <div class="static">
            <i class="iconfont icon-zujian-"></i>
            <div class="static-item">
              <span>{{ t('asset.mapping.components') }}</span>
              <span class="nums">{{ staticCount.componentNumber }}</span>
            </div>

          </div>
        </div>
        <!-- 搜索框end-->

      </div>

    </div>
  </div>
</template>
<script setup lang="ts">

// ==========================声明模块==========================
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { getSearchAutoComplete, getSearchHistoryList, getDiscoveryCount, staticCounteReq } from '@/api/asset/search'

const router = useRouter();
const { t } = useI18n()
// 查询字段
const queryFactor = ref('');
// 自动补全
const autoCompleteData = ref(['数据加载中...'])
// 搜索历史列表
const historyList = ref([])
// 统计数据
const staticCount = reactive<staticCounteReq>({
  componentNumber: 0,
  hostNumber: 0,
  serviceNumber: 0,
  vulnerabilityNumber: 0,
})

// ==========================数据定义模块==========================
const scroll = {
  x: '100%',
  y: 200
}
// 搜索历史列表颜色
const linkColor = (key: number) => {
  const colorMap = {
    0: 'success',
    1: 'warning',
    2: 'danger',
  }
  return colorMap[key]<string>

}
// 检索引导表头
const columns = [
  {
    title: t('asset.teach.syntax'),
    dataIndex: 'syntax',
  }, {
    title: t('asset.teach.explain'),
    dataIndex: 'explain',
  }, {
    title: t('asset.teach.paradigm'),
    dataIndex: 'paradigm',
    slotName: 'paradigm'
  }]
// 检索引导静态数据
const data = [{
  syntax: 'ip',
  explain: '支持检索单个ip',
  paradigm: [{
    name: 'ip="1.1.1'
  }]
}, {
  syntax: 'ip',
  explain: '支持检索单个ip',
  paradigm: [{
    name: 'ip="1.1.1'
  }]
}, {
  syntax: 'ip',
  explain: '支持检索单个ip',
  paradigm: [{
    name: 'ip="1.1.1'
  }]
}, {
  syntax: 'ip',
  explain: '支持检索单个ip',
  paradigm: [{
    name: 'ip="1.1.1'
  }]
}, {
  syntax: 'ip',
  explain: '支持检索单个ip',
  paradigm: [{
    name: 'ip="1.1.1'
  }]
}]
// ==========================事件响应模块ss==========================
// 搜索框获取自动补全数据
const handleSearch = async () => {
  const response = await getSearchAutoComplete(queryFactor.value.trim());
  autoCompleteData.value = [];
  if (response.data.length > 0) {
    response.data.forEach(item => {
      autoCompleteData.value.push(`${item.title} | ${item.component} | ${item.query}`)
    })
  }
}
// 获取搜索历史列表
const queryHistoryList = async () => {
  const res = await getSearchHistoryList();
  historyList.value = res.data;
}
// 获取统计数据
const initCount = async () => {
  const res = await getDiscoveryCount();
  Object.assign(staticCount, res.data)
}
// 点击搜索历史
const searchHistory = (key: string) => {
  queryFactor.value = key

}
// 点击搜索按钮
const handleClick = (value: string) => {
  if (value === 'click') {
    router.push({
      path: '/asset/searchList',
      query: {
        q: queryFactor.value,
      },
    });
  } else {
    router.push({
      path: '/asset/searchList',
      query: {
        q: value,
      },
    });
  }
}
// 初始化搜索列表
onMounted(() => {
  queryHistoryList()
  initCount()
})


</script>
<style scoped lang="less">
.container {
  position: relative;
  width: 100vw;
  height: calc(100vh - 100px);

}

.panel {
  background-image: url(../../assets/images/asset-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  // margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  .title {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;


    img {
      width: 120px;
      height: 120px;
      border: 1px solid #ccc;
      border-radius: 100%;
      padding: 10px;
      background: #fff;
    }

  }
}

.search-notice {
  display: flex;
  margin-top: 20px;

  .history {
    max-height: 300px;
    flex: 1;
    border: 1px solid var(--color-neutral-4);
    border-radius: 3px;
    background: #fff;

    .history-text {
      font-size: 14px;
      // font-weight: 700;

    }

    .change-btn {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

  }

  .teach {
    min-height: 250px;
    flex: 2;
    border: 1px solid var(--color-neutral-4);
    margin-left: 20px;
    border-radius: 3px;

  }

}

/deep/ .arco-list-item {
  padding: 8px 10px;
  font-size: 12px;
}

/deep/ .arco-tabs-content {
  padding-top: 0px;
}

/deep/ .arco-list-header {
  padding: 8px 10px !important;
}

.static-wrap {
  display: flex;
  margin-top: 30px;
  justify-content: space-between;


  .static {
    display: flex;
    align-items: center;

    .iconfont {
      font-size: 40px;
      color: #00ab7a;
      margin-right: 10px;
    }

    .static-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      font-family: '微软正黑体';

      .nums {
        font-size: 18px;
        font-family: 'Microsoft Yahei';
        display: inline-block;
        margin-top: 5px;
        font-weight: 700;
      }
    }

  }

}

/deep/ .arco-input-wrapper {

  border: 1px solid var(--color-neutral-4);
  border-radius: 5px;
}

.search-wrap {
  position: relative;


}

/deep/ .arco-icon-search {
  color: #ccc;
  font-size: 20px;
  position: absolute;
  left: 10px;
  top: 8px;
  margin-right: 20px;


}

/deep/ .arco-btn {
  position: absolute;
  right: 10px;
  top: 6px;

  background: #00ab7a;
}

/deep/ .arco-input-wrapper {
  padding-left: 40px;
  background: #fff;
}

.icon {
  position: absolute;
  right: 5px;
  top: 8px;
  z-index: 999;
}
</style>