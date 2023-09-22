<template>
  <div :style="'height:' + (cardHeight - 150) + 'px'" class="container-type">
    <div class="auto-height">
      <a-row>
        <a-col>
          <a-form-item field="hostType" :label="t('host.scan.config.hostType')">
            <a-input v-model="hostInfo1.hostType" readonly />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-form-item field="domain" :label="t('host.scan.config.domain')">
            <a-input v-model="hostInfo1.domain" readonly />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-form-item field="isp" :label="t('host.scan.config.isp')">
            <a-input v-model="hostInfo1.isp" readonly />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-form-item field="fqdn" :label="t('host.scan.config.fqdn')">
            <a-input v-model="hostInfo1.fqdn" readonly />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-form-item field="ipv4" :label="t('host.scan.hostConfig.IPV4')">
            <a-input :value="hostInfo1.ipv4" readonly />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-form-item field="ipv6" :label="t('host.scan.hostConfig.IPV6')">
            <a-input :value="hostInfo1.ipv6" readonly />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-form-item field="osName" :label="t('host.scan.hostConfig.osName')">
            <a-input :value="hostInfo1.osName" readonly />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col>
          <a-form-item field="macAddress" :label="t('host.scan.hostConfig.macAddress')">
            <a-input :value="hostInfo1.macAddress" readonly />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  defineExpose,
  defineProps,
  defineEmits,
  watch,
  reactive,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { number } from 'echarts/core';

const { t } = useI18n();
const props = defineProps({
  hostInfo: { type: Object, required: true },
  cardHeight: { type: Number, require: true },
});
const hostInfo1 = ref({});
hostInfo1.value = JSON.parse(JSON.stringify(props.hostInfo));
</script>
<style scoped lang="less">
.container-type {
  container-type: inline-size;
  container-name: card;
  padding: 0 10px;
}

@container card (max-width: 900px) {

  /* Horizontal style. */
  .auto-height {
    display: flex;
    flex-wrap: wrap;

    >div {
      margin: 0 10px;
      width: 400px;
    }
  }
}

@container card (max-width: 850px) {

  /* Horizontal style. */
  .auto-height {
    display: flex;
    flex-wrap: wrap;

    >div {
      margin: 0 10px;
      width: 320px;
    }
  }
}
</style>