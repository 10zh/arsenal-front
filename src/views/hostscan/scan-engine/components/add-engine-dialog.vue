<template>
  <a-modal
    v-model:visible="visible"
    :title="$props.dialogType == 'add' ? '新增引擎' : '编辑引擎'"
    title-align="start"
    @before-ok="handleBeforeOk"
  >
    <a-form ref="formRef" :model="form">
      <a-form-item
        field="address"
        :label="$t('scanengine.add.address')"
        :rules="[
          { required: true, message: $t('scanengine.add.addressPlaceholder') },
        ]"
      >
        <a-input v-model="form.address" />
      </a-form-item>
      <a-form-item
        field="engineName"
        :label="$t('scanengine.add.engineName')"
        :rules="[
          {
            required: true,
            message: $t('scanengine.add.engineNamePlaceholder'),
          },
        ]"
      >
        <a-input v-model="form.engineName" />
      </a-form-item>
      <a-form-item
        field="port"
        :label="$t('scanengine.add.port')"
        :rules="[
          { required: true, message: $t('scanengine.add.portPlaceholder') },
        ]"
      >
        <a-input v-model="form.port" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, defineExpose, defineProps, defineEmits, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    addScanEngines,
    editScanEngines,
    listRes,
  } from '@/api/scan/scan-engine';
  import { Message } from '@arco-design/web-vue';


  const { t } = useI18n();
  const props = defineProps({
    dialogType: { type: String, required: true },
    tableRow: { type: Object },
  });
  const visible = ref<boolean>(false);
  interface formData {
    id?: string;
    address: string;
    engineName: string;
    port: string;
  }
  const form = ref<formData>({
    address: '',
    engineName: '',
    port: '',
  });
  const formRef = ref();
  const emit = defineEmits(['refreshList']);
  const handleBeforeOk = (done: (closed: boolean) => void) => {
    formRef.value.validate().then(async (res: any) => {
      if (!res) {
        try {
          // 新增引擎提交
          if (props.dialogType === 'add') {
            const data: listRes | any = await addScanEngines(form.value);
            if (data.success) {
              Message.success('新增成功');
              emit('refreshList');
            } else {
              Message.error(data.errMessage);
            }
          } else {
            // 编辑引擎提交
            const data: listRes | any = await editScanEngines(
              form.value,
              props.tableRow.id
            );
            if (data.success) {
              Message.success('修改成功');
              emit('refreshList');
            } else {
              Message.error(data.errMessage);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
      if (!res) {
        done(true);
      } else {
        done(false);
      }
    });
  };
  // 监听visible以及dialogType参数，进行数据回显
  watch(
    [() => visible, props],
    ([newName, newNums]) => {
      if (newName.value === true && newNums.dialogType === 'edit') {
        form.value.address = newNums.tableRow.address;
        form.value.engineName = newNums.tableRow.name;
        form.value.port = newNums.tableRow.port;
      } else {
        form.value.address = '';
        form.value.engineName = '';
        form.value.port = '';
      }
    },
    { deep: true, immediate: true }
  );
  // 父组件传递表单类型以及对话框开关参数
  defineExpose({
    setVisibleData(res: boolean) {
      visible.value = res;
      if (props.dialogType === 'add') {
        formRef.value.resetFields();
      }
    },
  });
</script>
