<template>
  <div class="container-card">
    <!-- 左侧容器 -->
    <div class="left-container">
      <div class="general-card" v-for="cardItem in cardList" :key="cardItem.id">
        <!-- 左侧容器中的主机信息start -->
        <div class="card-left">
          <a-typography>
            <a-typography-paragraph copyable>
              <a-link @click="handleDetail(cardItem.id)"> <span style="font-size:20px">{{ cardItem.ipv4 }}</span></a-link>

            </a-typography-paragraph>
            <a-typography-paragraph>
              <a-tag color="green">445/SMB</a-tag>
            </a-typography-paragraph>
            <a-typography-paragraph>
              {{ cardItem.position.country || '-' }},{{ cardItem.position.region || '-' }} ,{{ cardItem.position.province
                ||
                '-'
              }},{{ cardItem.position.city || '-' }}
            </a-typography-paragraph>
            <a-typography-paragraph>
              hostname:{{ cardItem.hostname }}
            </a-typography-paragraph>
            <a-typography-paragraph>
              macAddress:{{ cardItem.hardware.macAddress }}
            </a-typography-paragraph>
            <a-typography-paragraph>
              osName:{{ cardItem.os.osName }}
            </a-typography-paragraph>
            <a-typography-paragraph>
              supportSslVersion:{{ cardItem.supportSslVersion }}
            </a-typography-paragraph>
            <a-typography-paragraph>
              ISP:{{ cardItem.position.isp }}
            </a-typography-paragraph>
          </a-typography>
        </div>
        <!-- 左侧容器中间的banner信息 -->
        <div class="card-center">
          <a-tabs type="rounded">
            <!-- banner -->
            <a-tab-pane key="1" :title="$t('asset.list.banner')">
              <a-typography style="padding-left: 10px;">
                <a-typography-paragraph copyable>
                  {{ cardItem.service.banner }}
                </a-typography-paragraph>
              </a-typography>
            </a-tab-pane>
            <!-- 证书 -->
            <a-tab-pane key="2" :title="$t('asset.list.certify')">
              <a-typography style="padding-left: 10px;">
                <a-typography-paragraph :copyable="cardItem.service.certificate ? true : false">
                  {{ cardItem.service.certificate }}
                </a-typography-paragraph>
              </a-typography>
            </a-tab-pane>
          </a-tabs>
        </div>

      </div>
    </div>
    <!-- 右侧聚合搜索信息start -->
    <div class="card-right">
      <!-- 主机类型start -->
      <a-space direction="vertical" size="large" class="space-item">
        <a-descriptions :title="$t('asset.list.hostType')" align="left" :column="1">
          <a-descriptions-item label="IPV4:">
            {{ rightInfo.ipv4Number }}
          </a-descriptions-item>
          <a-descriptions-item label="IPV6:">
            {{ rightInfo.ipv6Number }}
          </a-descriptions-item>
        </a-descriptions>
      </a-space>
      <a-divider />
      <!-- 组件信息start -->
      <a-space direction="vertical" size="large" class="space-item">
        <a-descriptions :title="$t('asset.list.components')" align="left" :column="1">
          <template v-for="(item, index) in rightInfo.components" :key="index">
            <a-descriptions-item :label="item.name">
              {{ item.count }}
            </a-descriptions-item>
          </template>
        </a-descriptions>

      </a-space>
      <div style="text-align:right;padding:10px">
        <a-link @click="handleMore('components')">{{ t('asset.searchList.more') }}</a-link>
      </div>
      <a-divider />
      <!-- Web标题信息start -->
      <a-space direction="vertical" size="large" class="space-item">
        <a-descriptions :title="$t('asset.list.webTitles')" align="left" :column="1">
          <template v-for="item in rightInfo.webTitles" :key="item">
            <a-descriptions-item :label="item.name">
              {{ item.count }}
            </a-descriptions-item>
          </template>
        </a-descriptions>
      </a-space>
      <!-- 查看更多 -->
      <div style="text-align:right;padding:10px">
        <a-link @click="handleMore('title')">{{ t('asset.searchList.more') }}</a-link>
      </div>

    </div>
  </div>
</template>
<script setup>
// ==========================声明模块==========================
import { ref, reactive, onMounted, defineProps } from 'vue';
import { useI18n } from 'vue-i18n';
import { addScanEngine } from '@/api/scan/scan-engine';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router'


const { t } = useI18n();
const router = useRouter()

// 接收来自父组件的值
const props = defineProps({
  cardList: {
    type: Array,
    default: () => { },
  },
  rightInfo: {
    type: Object,
    default: () => { }
  },
  // 搜索参数
  searchText: {
    type: String,
    default: () => { }
  },
});

// ==========================事件响应==========================
// 更多（type:更多按钮的类型，q:搜索参数（来自父组件的传值即路由参数的q））
const handleMore = (type) => {
  router.push({
    path: '/asset/clusterAnalysisChart',
    query: {
      type,
      q: props.searchText
    }
  })

}
// 单个资产详情页面
const handleDetail = (id) => {
  router.push({
    path: '/asset/assetDetail',
    query: {
      q: props.searchText,
      id,
    }
  })
}
onMounted(() => {

})

</script>
<style scoped lang="less">
.container-card {
  width: 100%;
  display: flex;

  .left-container {
    flex: 5;
  }

  .card-right {
    flex: 1;
    display: flex;
    flex-direction: column;



    margin: 20px;
    border: 1px solid var(--color-neutral-3);

    .space-item {
      padding: 10px;
      flex: 1;
      min-height: 100px;
    }
  }
}

.general-card {
  display: flex;
  flex: 2;
  position: relative;
  margin: 20px;
  min-height: 300px;

  .card-left {
    padding: 10px 10px;

    border: 1px solid var(--color-neutral-3);
    flex: 1;
  }

  .card-center {
    padding: 10px 0px;
    border-top: 1px solid var(--color-neutral-3);
    border-bottom: 1px solid var(--color-neutral-3);
    border-right: 1px solid var(--color-neutral-3);
    flex: 2;

  }


}

/deep/ .arco-tabs-nav {
  border-bottom: 1px solid var(--color-neutral-3);
  padding-bottom: 10px;
}

/deep/ .arco-icon-copy {
  font-size: 24px;
}
</style>