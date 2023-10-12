<template>
  <!--添加引擎表单对话层 start-->
  <a-modal
    v-model:visible="visible"
    width="700"
    :title="t('scan.engine.add')"
    @cancel="handleAddEngineVisible(false)"
    @before-ok="handleBeforeOk"
  >
    <a-form ref="formRef" auto-label-width :model="form">
      <a-form-item
        field="engineName"
        :label="t('scan.engine.name')"
        :rules="[{ required: true, message: t('scan.engine.name.input') }]"
      >
        <a-input
          v-model="form.engineName"
          :placeholder="t('scan.engine.name.input')"
        />
      </a-form-item>
      <a-form-item
        field="address"
        :label="t('scan.engine.address')"
        :rules="[{ required: true, message: t('scan.engine.address.input') }]"
      >
        <a-input
          v-model="form.address"
          :placeholder="t('scan.engine.address.input')"
        />
      </a-form-item>
      <a-form-item
        field="port"
        :label="t('scan.engine.port')"
        :rules="[{ required: true, message: t('scan.engine.port.input') }]"
      >
        <a-input-number
          v-model="form.port"
          :placeholder="t('scan.engine.port.input')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <!--添加引擎表单对话层 end-->
</template>

<script lang="ts" setup>
  // ==========================声明模块==========================
  import { ref, reactive } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { addScanEngine } from '@/api/scan/scan-engine';
  import { Message } from '@arco-design/web-vue';

  const { t } = useI18n();
  // 表单参数
  const form = reactive({
    engineName: '',
    address: '',
    port: '',
  });
  // 是否可见
  const visible = ref(false);
  // 表单引用
  const formRef = ref();

  // ==========================事件响应模块==========================
  // 点击确认事件
  const handleBeforeOk = (done) => {
    // 表单参数校验
    formRef.value.validate(async (valid) => {
      if (valid) {
        done(false);
      } else {
        // 添加引擎
        const res = await addScanEngine(form);
        if (res.success) {
          Message.success(t('global.insert.success'));
        }
        done();
      }
    });
  };
  // 取消事件
  const handleAddEngineVisible = (flag) => {
    visible.value = flag;
  };

  // ==========================父子组件通信模块==========================
  defineExpose({
    handleAddEngineVisible,
  });
</script>

<style scoped lang="less"></style>
