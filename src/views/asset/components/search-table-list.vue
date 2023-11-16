<template>
  <div style="width:100%;height:500px">
    <div class="general-card" v-for="cardItem in cardList" :key="cardItem.id">
      <div class="card-left">
        <a-typography>
          <a-typography-paragraph copyable>
            <span style="color:#333;font-size:20px">{{ cardItem.ipv4 }}</span>
          </a-typography-paragraph>
          <a-typography-paragraph>
            <a-tag color="green">445/SMB</a-tag>
          </a-typography-paragraph>
          <a-typography-paragraph>
            {{ cardItem.position.country || '-' }},{{ cardItem.position.region || '-' }} ,{{ cardItem.position.province ||
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
      <div class="card-center">
        <a-tabs type="rounded">

          <a-tab-pane key="1" :title="$t('asset.list.banner')">
            <a-typography style="padding-left: 10px;">
              <a-typography-paragraph copyable>
                {{ cardItem.service.banner }}
              </a-typography-paragraph>
            </a-typography>
          </a-tab-pane>
          <a-tab-pane key="2" :title="$t('asset.list.certify')">
            <a-typography style="padding-left: 10px;">
              <a-typography-paragraph :copyable="cardItem.service.certificate ? true : false">
                {{ cardItem.service.certificate }}
              </a-typography-paragraph>
            </a-typography>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="card-right">


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


const { t } = useI18n();

// 接收来自父组件的值
const props = defineProps({
  cardList: {
    type: Array,
    default: () => { },
  },
});

// ==========================事件响应==========================

onMounted(() => {

})

</script>
<style scoped lang="less">
.general-card {


  position: relative;
  margin: 10px 20px;
  display: flex;


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

  .card-right {
    flex: 1;
    margin-left: 20px;
    border: 1px solid red;
  }
}

/deep/ .arco-tabs-nav {
  border-bottom: 1px solid var(--color-neutral-3);
  padding-bottom: 10px;
}
</style>