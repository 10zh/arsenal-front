<template>
  <div>
    <a-modal
      v-model:visible="visible"
      width="615px"
      :title="dialogType === 'edit' ? '编辑配置' : '新建配置'"
      title-align="start"
      @before-ok="handleBeforeOk"
    >
      <a-form ref="formRef" :model="form">
        <a-form-item
          field="configName"
          :label="$t('host.scan.config.configName')"
          :rules="[
            { required: true, message: $t('host.scan.config.configName') },
          ]"
        >
          <a-input v-model="form.configName" />
        </a-form-item>
        <a-form-item
          field="engineId"
          :label="$t('host.scan.config.engineName')"
          :rules="[
            { required: true, message: $t('host.scan.config.engineName') },
          ]"
        >
          <a-select v-model="form.engineId" :options="engineArpOptions" />
        </a-form-item>
        <a-form-item
          field="templateId"
          :label="$t('host.scan.config.templateName')"
          :rules="[
            { required: true, message: $t('host.scan.config.templateName') },
          ]"
        >
          <a-select v-model="form.templateId" :options="templateArpOptions" />
        </a-form-item>
        <a-form-item
          field="excludeTarget"
          :label="$t('host.scan.config.excludeTarget')"
        >
          <a-input v-model="form.excludeTarget" />
        </a-form-item>
        <a-form-item
          field="target"
          :label="$t('host.scan.config.target')"
          :rules="[{ required: true, message: $t('host.scan.config.target') }]"
        >
          <a-input v-model="form.target" />
        </a-form-item>
        <a-form-item
          field="hostCredentials"
          :label="$t('host.scan.config.hostCredentials')"
        >
          <a-input v-model="form.hostCredentials" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import {
    ref,
    defineExpose,
    defineProps,
    defineEmits,
    watch,
    reactive,
    onMounted,
  } from 'vue';
  import {
    HostScanConfigRes,
    editScanConfig,
    addScanConfig,
    HttpResponse,
  } from '@/api/scan/scan-config';
  import {
    PolicyRecord,
    PolicyParams,
    getScanEngines,
  } from '@/api/scan/scan-engine';

  import {
    HostScanTemplateRes,
    getScanTemplates,
  } from '@/api/scan/scan-template';
  import { Message } from '@arco-design/web-vue';

  const visible = ref<boolean>(false);
  const formRef = ref();
  const props = defineProps({
    dialogType: { type: String, required: true },
    tableRow: { type: Object },
  });
  const form = reactive<HostScanConfigRes>({
    engineId: '',
    configName: '',
    excludeTarget: '',
    hostCredentials: [1, 2],
    target: '',
    templateId: '',
  });
  const engineArpOptions = ref<PolicyRecord[]>([]);
  const templateArpOptions = ref<HostScanTemplateRes[]>([]);
  const emit = defineEmits(['refreshList']);

  // 分页对象参数
  const pagination = ref({
    pageIndex: 1,
    pageSize: 10,
  });
  // 监听visible以及dialogType参数，进行数据回显
  watch(
    [() => visible, props],
    ([newName, newNums]) => {
      console.log(newName.value, newNums.tableRow);
      if (newName.value === true && newNums.dialogType === 'edit') {
        form.configName = newNums.tableRow.configName;
        form.engineId = newNums.tableRow.engine.engineId;
        form.excludeTarget = newNums.tableRow.lastScanStatic.excludeTarget;
        form.hostCredentials = newNums.tableRow.lastScanStatic.hostCredentials;
        form.target = newNums.tableRow.target;
        form.templateId = newNums.tableRow.template.templateId;
      } else {
        form.configName = '';
        form.engineId = '';
        form.excludeTarget = '';
        form.hostCredentials = [1, 2];
        form.target = '';
        form.templateId = '';
      }
    },
    { deep: true, immediate: true }
  );
  const handleBeforeOk = (done: (closed: boolean) => void) => {
    formRef.value.validate().then(async (res: any) => {
      if (!res) {
        try {
          // 新增配置提交
          if (props.dialogType === 'add') {
            const data: HttpResponse = await addScanConfig(form);
            if (data.success) {
              Message.success('新增成功');
              emit('refreshList');
            } else {
              Message.error(data.errMessage);
            }
          } else {
            // 编辑配置提交
            const data: HttpResponse = await editScanConfig(
              form,
              props.tableRow.configId
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
  // 获取扫描引擎列表
  const fetchData = async (
    params: PolicyParams = { current: 1, pageSize: 20 }
  ) => {
    try {
      const data = await getScanEngines(params);
      engineArpOptions.value = data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  //   获取扫描模板列表
  const getTemplateOptions = async (
    params: PolicyParams = { current: 1, pageSize: 20 }
  ) => {
    const response = await getScanTemplates({
      pageIndex: pagination.value.pageIndex,
      pageSize: pagination.value.pageSize,
    });
    templateArpOptions.value = response.data.map((item) => {
      return {
        value: item.id,
        label: item.templateName,
      };
    });
  };
  // 父组件传递表单类型以及对话框开关参数
  defineExpose({
    setVisibleData(res: boolean) {
      visible.value = res;
      if (props.dialogType === 'add') {
        formRef.value.resetFields();
      }
    },
  });
  onMounted(() => {
    fetchData();
    getTemplateOptions();
  });
</script>

<style scoped lang="less"></style>
