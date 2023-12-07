<template>
  <a-modal v-model:visible="visible" width="30%" :title="t('cerManage.list.edit')" @cancel="handleEditCertVisible(false)"
    @before-ok="handleSubmit">
    <a-form auto-label-width ref="formRef" :model="formModel" style="height: 100%">
      <!-- 固定表单填写start -->
      <a-form-item field="name" :label="t('cerManage.list.name')" :rules="[
        { required: true, message: $t('form.name.validate') },
      ]">
        <a-input v-model="formModel.name" :placeholder="t('cerManage.list.name.placeHolder')" />
      </a-form-item>

      <a-form-item field="authType" :rules="[
        { required: true, message: $t('form.authType.validate') }]" :label="t('cerManage.list.authType')">
        <a-select v-model="formModel.authType" @change="changeAuthType"
          :placeholder="t('cerManage.list.authType.placeHolder')" :options="authTypeOptions" />

      </a-form-item>
      <a-form-item field="target" :rules="[
        { required: true, message: $t('form.target.validate') }]" :label="t('cerManage.list.target')">
        <a-input v-model="formModel.target" :placeholder="t('cerManage.list.target.placeHolder')" />
      </a-form-item>
      <a-form-item field="port" :rules="[
        { required: true, message: $t('form.port.validate') }]" :label="t('cerManage.list.port')">
        <a-input v-model="formModel.port" :placeholder="t('cerManage.list.port.placeHolder')" />
      </a-form-item>
      <!-- 固定表单end -->
      <!-- 动态表单start -->
      <a-form-item v-for="item in dynamicForms" :key="item.label" :field="'credentialInfo.' + item.key"
        :label="language === 'zh-CN' ? item.i18n.label[item.key].zh_cn : item.i18n[item.key].en_us" :rules="[
          { required: item.extra.require, message: $t('form.normal.validate') }]
          ">
        <a-input :type="item.inputType" v-model="formModel.credentialInfo[item.key]"
          :placeholder="t('cerManage.list.password.placeHolder')" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
// ==========================声明模块==========================
import { ref, reactive, computed, defineExpose, defineEmits, watch, onMounted } from 'vue';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import { useI18n } from 'vue-i18n';
import {
  addCertRequest,
  addCert,
  getFormByAuthType,
  getSingleCert
} from '@/api/certmanage/index';
import { HttpResponse } from '@/api/interceptor/axios';
import { Message } from '@arco-design/web-vue';

const { t } = useI18n();
// 国际化语言格式
const language = useI18n().locale.value;
// 编辑的数据id
const certId = ref();
// 表单填写数据
const formData = {
  name: '',
  target: "",
  port: "",
  authType: '',
  credentialInfo: {}


};
// 表单数据项
const formModel = reactive({ ...formData });
const formRef = ref();
// 对话框控制
const visible = ref(false)
// 动态表单数据
const dynamicForms = ref([])
// 子组件调用父组件的方法
const emits = defineEmits(['initData']);
// ===================数据定义=======================
// 认证类型下拉框
const authTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: 'SSH_PASSWORD',
    value: 'SSH_PASSWORD',
  }
]);
// ===================事件=======================
// 提交
const handleSubmit = () => {
  formRef.value.validate().then(async (res: any) => {
    if (!res) {
      try {
        const data: HttpResponse | any = await addCert(formModel);
        if (data.success) {
          Message.success(t('cert.add.success'));
          visible.value = false;
          emits('initData')
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
};
// 根据凭证类型获取表单数据
const getFormData = async () => {
  const res = await getFormByAuthType(formModel.authType);
  dynamicForms.value = res.data;

}
// change凭证类型
const changeAuthType = () => {
  getFormData()
}
// 重置默认
const handleReset = () => {
  Object.assign(formModel, formData);
  dynamicForms.value = [];
};
// 取消事件
const handleEditCertVisible = (flag, id = null) => {
  visible.value = flag;
  handleReset()
  if (id) {
    certId.value = id;
  }
};
// ==========================父子组件通信模块==========================
defineExpose({
  handleEditCertVisible,
});
// ==========================数据初始化==========================
// 初始化数据
const initData = async () => {
  try {
    const res = await getSingleCert(certId.value)
    if (res.success) {
      const { name, target, port, authType, ...credentialInfo } = res.data;
      formModel.credentialInfo = credentialInfo;
      formModel.name = name;
      formModel.target = target;
      formModel.port = port;
      formModel.authType = authType;
    }
  } catch (error) {
    console.log(error);
  }


  // Object.assign(formModel, res.data);

}
// 监听对话框的显示
watch(visible, async (newValue, oldValue) => {
  if (newValue === true) {
    console.log("111")
    await initData()
    console.log("222")
    getFormData()
  }
})
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  height: calc(100vh - 150px);
}

.general-card {
  height: 100%;

  /deep/ .arco-card-header-title {
    // font-weight: 700;
    font-size: 18px;
  }

  /deep/ .arco-card-body {
    height: calc(100% - 150px);
  }


  .content-container {
    margin-left: 10px;
    // width: 50%;
    // margin: auto 50px;
  }

}
</style>
