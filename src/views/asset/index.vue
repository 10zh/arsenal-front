<template>
  <div class="container">
    <div class="panel">
      <div class="search-wrap">
        <a-auto-complete :data="aotoCompleteData" size="large" :style="{ width: '600px' }"
          placeholder="please enter something" strict v-model="q" />
        <icon-search class="icon" @click="handleSearch" />
      </div>

    </div>
  </div>
</template>
<script setup>

// ==========================声明模块==========================
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const aotoCompleteData = ref(["1", "2"])
// 查询条件
const q = ref('')

// ==========================事件响应模块ss==========================
// 搜索
const handleSearch = () => {
  router.push({
    path: '/asset/searchList',
    query: {
      q: q.value,
    },
  });

}

const { t } = useI18n();
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