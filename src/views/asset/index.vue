<template>
  <div class="container">
    <div class="panel">
      <!-- 搜索框start -->
      <div class="search-wrap">
        <a-auto-complete :data="autoCompleteData" size="large" :style="{ width: '600px' }"
          placeholder="please enter something" @focus="handleSearch" @change="handleSearch" @select="handleClick"
          v-model="queryFactor">
        </a-auto-complete>
        <icon-search class="icon" @click="handleClick('click')" />
      </div>
      <!-- 搜索框end-->
    </div>
  </div>
</template>
<script setup>

// ==========================声明模块==========================
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { getSearchAutoComplete } from '@/api/asset/search'

const router = useRouter();
// 查询字段
const queryFactor = ref('');
// 自动补全
const autoCompleteData = ref([''])
// ==========================事件响应模块ss==========================
// 搜索框获取自动补全数据
const handleSearch = async () => {
  const response = await getSearchAutoComplete(queryFactor.value);
  autoCompleteData.value = [];
  if (response.data.length > 0) {
    response.data.forEach(item => {
      autoCompleteData.value.push(item.title.toString() + ' | '.toString() + item.query.toString())
    })
  }
}
// 点击搜索按钮
const handleClick = (value) => {
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

</script>
<style scoped lang="less">
.container {
  position: relative;
  width: 100vw;
  height: calc(100vh - 60px);
}

.panel {
  background-image: url(../../assets/images/asset-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/deep/ .arco-input-wrapper {
  background: #0d3d56;
  border: 1px solid #218aa3;
}

/deep/ .arco-input {
  color: #fff;
}

.search-wrap {
  position: relative;
}

.arco-icon-search {
  color: #fff;
  font-size: 24px;
}

.icon {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 999;
}
</style>