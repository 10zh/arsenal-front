<template>
  <!--添加引擎表单对话层 start-->
  <a-modal v-model:visible="visible" width="700" :title="t('organization.list.add')"
    @cancel="handleAddOrganizationVisible(false)" @before-ok="handleBeforeOk">
    <a-form ref="formRef" auto-label-width :model="form">
      <a-form-item field="companyAddress" :label="t('organization.form.companyAddress')"
        :rules="[{ required: true, message: t('organization.form.companyAddress.placeholder') }]">
        <a-input v-model="form.companyAddress" :placeholder="t('organization.form.companyAddress.placeholder')" />
      </a-form-item>
      <a-form-item field="companyName" :label="t('organization.form.companyName')"
        :rules="[{ required: true, message: t('organization.form.companyName.placeholder') }]">
        <a-input v-model="form.companyName" :placeholder="t('organization.form.companyName.placeholder')" />
      </a-form-item>
      <a-form-item field="sort" :label="t('organization.form.sort')"
        :rules="[{ required: true, message: t('organization.form.sort.placeholder') }]">
        <a-input-number v-model="form.sort" :placeholder="t('organization.form.sort.placeholder')" />
      </a-form-item>
      <a-form-item field="sort" :label="t('organization.form.useIds')"
        :rules="[{ required: true, message: t('organization.form.useIds.placeholder') }]">
        <a-select :default-value="['Beijing', 'Shanghai']" :style="{
          width: '100%'
        }" :placeholder="t('organization.form.useIds.placeholder')" v-model="form.useIds" multiple :limit="2">
          <a-option>Beijing</a-option>
          <a-option :tag-props="{ color: 'red' }">Shanghai</a-option>
          <a-option>Guangzhou</a-option>
          <a-option disabled>Disabled</a-option>
          <a-option>Shenzhen</a-option>
          <a-option>Wuhan</a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
  <!--添加引擎表单对话层 end-->
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
// import { addScanEngine } from '@/api/scan/scan-engine';
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();
// 表单参数
const form = reactive({
  companyAddress: '',
  companyName: '',
  sort: '',
  useIds: [],
});
// 是否可见
const visible = ref(false);
// 表单引用
const formRef = ref();

// ==========================事件响应模块==========================
// 点击确认事件
const handleBeforeOk = (done) => {
  // 表单参数校验
  // formRef.value.validate(async (valid) => {
  //   if (valid) {
  //     done(false);
  //   } else {
  //     // 添加引擎
  //     const res = await addScanEngine(form);
  //     if (res.success) {
  //       Message.success(t('global.insert.success'));
  //     }
  //     done();
  //   }
  // });
};
// 取消事件
const handleAddOrganizationVisible = (flag) => {
  visible.value = flag;
};

// ==========================父子组件通信模块==========================
defineExpose({
  handleAddOrganizationVisible,
});
</script>

<style scoped lang="less"></style>
