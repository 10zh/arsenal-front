import { defineStore } from 'pinia';
// 点击返回时详情对话框数据保留
const useConfigParamsStore = defineStore('configParams', {
  state: () => ({
    configId: '',
    pagination: {
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    },
    isShowDialog: false,
  }),
  actions: {
    setConfignParams(configId: string, pagination: any) {
      this.configId = configId;
      this.pagination = JSON.parse(JSON.stringify(pagination));
    },
    setDialog(isShowDialog: boolean) {
      this.isShowDialog = isShowDialog;
    },
  },
});
export default useConfigParamsStore;
