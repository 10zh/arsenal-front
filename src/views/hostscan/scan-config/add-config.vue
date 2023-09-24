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
      <a-tabs default-active-key="1" lazy-load size="large">
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
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #title>
            <icon-user /> {{ t('host.scan.config.engine') }}
          </template>
          扫描引擎
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #title>
            <icon-clock-circle /> {{ t('host.scan.config.template') }}</template
          >
          扫描模板
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  // ===========================数据模块===========================
  const form = reactive({
    configName: '',
    target: '',
    excludeTarget: '',
  });
  const handleSubmit = (data) => {
    console.log(data);
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
