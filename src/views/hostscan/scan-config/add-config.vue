<template>
  <div class="container">
    <Breadcrumb :items="[
      'menu.hostscan',
      'menu.hostscan.config',
      'menu.hostscan.config.add',
    ]" />
    <a-card class="general-card">
      <!-- 返回按钮 -->
      <div class="back-btn">
        <a-button @click="goBack">{{ t('scan.add.config.goback') }}</a-button>
      </div>
      <a-tabs default-active-key="1" size="large">
        <!-- 扫描配置start -->
        <a-tab-pane key="1">
          <template #title><icon-calendar /> {{ t('host.scan.config.basic.info') }}
          </template>
          <a-form :model="form" ref="formRef" :style="{ width: '700px', marginLeft: '15px' }" auto-label-width
            label-align="left" size="large" @submit="handleSubmit">
            <a-form-item field="configName" :tooltip="t('host.scan.config.configName.input')"
              :label="t('host.scan.config.configName')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.configName.input'),
                },
              ]">
              <a-input v-model="form.configName" :placeholder="t('host.scan.config.configName.input')" />
            </a-form-item>
            <a-form-item field="target" :tooltip="t('host.scan.config.target.tooltip')"
              :label="t('host.scan.config.target')" :rules="[
                {
                  required: true,
                  message: t('host.scan.config.target.tooltip'),
                },
              ]">
              <a-input v-model="form.target" :placeholder="t('host.scan.config.target.input')" />
            </a-form-item>
            <a-form-item field="excludeTarget" :tooltip="t('host.scan.config.excludeTarget.tooltip')"
              :label="t('host.scan.config.excludeTarget')">
              <a-input v-model="form.excludeTarget" :placeholder="t('host.scan.config.excludeTarget.input')" />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" size="small" html-type="submit">
                  <template #icon>
                    <icon-send />
                  </template>
                  <template #default>{{ t('golbal.submit') }}</template>
                </a-button>
                <a-button type="outline" size="small" @click="handleReset">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  <template #default>{{ t('golbal.reset') }}</template>
                </a-button>

              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <!-- 扫描配置end -->
        <!-- 扫描引擎start -->
        <a-tab-pane key="2">
          <template #title>
            <icon-user /> {{ t('host.scan.config.engine') }}
          </template>
          <SelectEngineTable @receive-select="receiveSelectEngineRowKey" />
        </a-tab-pane>
        <!-- 扫描引擎end -->
        <!-- 扫描模板start -->
        <a-tab-pane key="3">
          <template #title>
            <icon-clock-circle /> {{ t('host.scan.config.template') }}</template>
          <SelectTemplateTable @receive-select="receiveSelectTemplateRowKey" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import SelectEngineTable from '@/views/hostscan/scan-config/components/select-engine.vue';
import SelectTemplateTable from '@/views/hostscan/scan-config/components/select-template.vue';
import { Message } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { insertHostScanConfig } from '@/api/scan/scan-config';
import { useRouter } from 'vue-router';

const router = useRouter();

const { t } = useI18n();

// ===========================数据模块===========================
const form = reactive({
  configName: '',
  target: '',
  excludeTarget: '',
  engineId: '',
  templateId: '',
});
// 表单实例
const formRef = ref();
// 表单提交事件
const handleSubmit = async (data) => {
  if (data.errors) {
    console.log('errors ', data.errors);
    return;
  }
  const response = await insertHostScanConfig(data.values);
  // 调用新增扫描配置接口
  if (!response.success) {
    return;
  }
  Message.success(t('host.scan.config.add.success'));
  router.push({
    name: 'scanConfig',
  });
};

// ==========================事件响应模块==========================
// 收到引擎组件选择key
const receiveSelectEngineRowKey = (key) => {
  console.log('receive engine key: ', key.value);
  form.engineId = key.value;
};
// 收到模板组件选择key
const receiveSelectTemplateRowKey = (key) => {
  console.log('receive template key: ', key.value);
  form.templateId = key.value;
};
// 返回
const goBack = () => {
  router.go(-1)

}
// 重置
const handleReset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  height: calc(100vh - 100px);
}

.general-card {
  position: relative;
}

.back-btn {
  text-align: right;
  padding-top: 20px;
  position: absolute;
  top: -12px;
  right: 20px;
  z-index: 99;
}


/deep/ .arco-tabs-nav-size-large.arco-tabs-nav-type-line .arco-tabs-tab {
  padding: 5px 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 0px;
  margin-right: 30px;

}

/deep/ .arco-tabs-tab {
  border: 1px solid #f3f5f7;
  border-radius: 20px;
  background: #f3f5f7;

}

/deep/ .arco-tabs-nav-ink {
  width: 0px !important;
}
</style>
