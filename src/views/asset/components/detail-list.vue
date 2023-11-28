<template>
  <div>
    <!-- 基本信息el-tabs -->
    <a-card style="margin:0px 50px;">
      <a-tabs type="rounded">
        <!-- 主机服务start -->
        <a-tab-pane key="1" :title="$t('asset.searchListDetail.postServices')">
          <!-- 端口start -->
          <div class="tags">
            <a-tag color="blue" v-for="(tag, index) in portServices" :key="index" bordered>{{ tag.port }} / SSH</a-tag>
          </div>
          <!-- 列表项start -->
          <a-list>
            <a-list-item v-for="(item, index) in portServices" :key="index">
              <div class="list-container">
                <!-- 左侧信息展示start -->
                <div class="left">
                  <a-descriptions style="margin-top: 20px" :column="1">
                    <a-descriptions-item>
                      {{ item.port }} /SSH

                    </a-descriptions-item>
                    <a-descriptions-item>
                      {{ t('asset.searchListDetail.postServices.name') }}
                      <span v-for="name in item.components" :key="name.name">{{ name.name }}</span>
                    </a-descriptions-item>
                    <a-descriptions-item>
                      {{ t('asset.searchListDetail.postServices.supportSslVersion') }}{{ item.supportSslVersion }}

                    </a-descriptions-item>
                    <a-descriptions-item>
                      {{ t('asset.searchListDetail.postServices.transportProtocol') }}{{ item.transportProtocol }}

                    </a-descriptions-item>
                    <a-descriptions-item>
                      {{ t('asset.searchListDetail.postServices.applicationProtocol') }}{{ item.applicationProtocol }}

                    </a-descriptions-item>
                  </a-descriptions>
                </div>
                <!-- 右侧信息展示start -->
                <div class="right">
                  <a-tabs type="rounded" border>
                    <!-- 搜索结果start -->
                    <a-tab-pane key="1" :title="$t('asset.searchListDetail.postServices.banner')">
                      <div class="banner-container">
                        <a-typography>
                          <a-typography-paragraph copyable>
                            {{ item.banner }}
                          </a-typography-paragraph>
                        </a-typography>
                      </div>

                    </a-tab-pane>
                    <a-tab-pane key="2" :title="$t('asset.searchListDetail.postServices.certificate')">
                      <a-typography>
                        <a-typography-paragraph copyable>
                          {{ item.certificate }}
                        </a-typography-paragraph>
                      </a-typography>
                    </a-tab-pane>
                  </a-tabs>

                </div>
              </div>
            </a-list-item>
          </a-list>
        </a-tab-pane>
        <!-- 相关漏洞start -->
        <a-tab-pane key="2" :title="$t('asset.searchListDetail.bugList')">
        </a-tab-pane>
      </a-tabs>

    </a-card>
  </div>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();
const route = useRoute();
const router = useRouter()
// 接收来自父组件的值
const props = defineProps({
  portServices: {
    type: Array,
    default: () => { }
  }
});

</script>
<style lang="less" scoped>
.general-card {
  position: relative;

  /deep/ .arco-card-header-title {
    // font-weight: 700;
    font-size: 20px;
  }

  /deep/ .arco-card-header {
    padding: 10px;
  }

  /deep/ .arco-tabs-content {
    padding: 0;
  }


}

.tags {
  margin-left: 10px;
  margin-bottom: 10px;
}

.list-container {
  display: flex;

  .left {

    flex: 1;
  }

  .right {

    flex: 3;
    margin-top: 15px;
    padding: 0px 10px 10px 10px;

    .banner-container {
      min-height: 100px;
      border: 1px solid var(--color-neutral-3);
      padding: 5px;
    }
  }
}

// /deep/ .arco-list-bordered {
//   border: none;
//   border-top: 1px solid var(--color-neutral-3);
// }


/deep/ .arco-card-body {
  height: 100%;
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
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