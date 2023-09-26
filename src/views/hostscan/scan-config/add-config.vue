<template>
  <div class="container">
    <Breadcrumb
      :items="[
        'menu.hostscan',
        'menu.list.scan.config',
        'menu.list.scan.config.add',
      ]"
    />
    <a-card class="general-card">
      <a-tabs default-active-key="1" animation size="large">
        <a-tab-pane key="1">
          <template #title
            ><icon-calendar /> {{ t('host.scan.config.basic.info') }}
          </template>
          <a-form
            :model="form"
            :style="{ width: '700px', marginLeft: '15px' }"
            auto-label-width
            label-align="left"
            size="large"
            @submit="handleSubmit"
          >
            <a-form-item
              field="configName"
              :tooltip="t('host.scan.config.configName.input')"
              :label="t('host.scan.config.configName')"
              :rules="[
                {
                  required: true,
                  message: t('host.scan.config.configName.input'),
                },
              ]"
            >
              <a-input
                v-model="form.configName"
                :placeholder="t('host.scan.config.configName.input')"
              />
            </a-form-item>
            <a-form-item
              field="target"
              :tooltip="t('host.scan.config.target.tooltip')"
              :label="t('host.scan.config.target')"
              :rules="[
                {
                  required: true,
                  message: t('host.scan.config.target.tooltip'),
                },
              ]"
            >
              <a-input
                v-model="form.target"
                :placeholder="t('host.scan.config.target.input')"
              />
            </a-form-item>
            <a-form-item
              field="excludeTarget"
              :tooltip="t('host.scan.config.excludeTarget.tooltip')"
              :label="t('host.scan.config.excludeTarget')"
            >
              <a-input
                v-model="form.excludeTarget"
                :placeholder="t('host.scan.config.excludeTarget.input')"
              />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button html-type="submit">{{ t('golbal.submit') }}</a-button>
                <a-button @click="$refs.formRef.resetFields()">{{
                  t('golbal.reset')
                }}</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #title>
            <icon-user /> {{ t('host.scan.config.engine') }}
          </template>
          <SelectEngineTable @receive-select="receiveSelectEngineRowKey" />
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #title>
            <icon-clock-circle /> {{ t('host.scan.config.template') }}</template
          >
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
  import { reactive } from 'vue';
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
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
