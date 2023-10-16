import { defineStore } from 'pinia';



// 扫描配置中的扫描记录兄弟组件通信
const useScanIdStore = defineStore('scanId', {
  state:() => ({
    scanId:'',
  }),
  actions: {
    getScanId(scanId:string) {
      this.scanId = scanId;
    },
  }
})
export default useScanIdStore;