<template>
  <div>
    <a-card>
      <a-tabs type="rounded" @change="changeTabs">
        <!-- 端口服务start -->
        <a-tab-pane key="1" :title="$t('asset.searchListDetail.postServices')">
          <!-- 端口start -->
          <div class="tags">
            <a-anchor line-less v-for="(tag, index) in portServices" :key="index">
              <a-anchor-link :href="'#' + tag.port">
                <a-tag color="blue" style="margin-right:10px" bordered>{{
                  tag.port }} / {{ tag.transportProtocol }}</a-tag>
              </a-anchor-link>
            </a-anchor>
          </div>
          <!-- 列表项start -->
          <a-list>
            <a-list-item v-for="(item, index) in portServices" :key="index" :id="item.port">
              <div class="list-container">
                <!-- 左侧信息展示start -->
                <div class="left">
                  <a-descriptions style="margin-top: 20px" :column="1">
                    <a-descriptions-item>
                      {{ item.port }} /{{ item.transportProtocol }}

                    </a-descriptions-item>
                    <a-descriptions-item v-if="item.components">
                      {{ t('asset.searchListDetail.postServices.name') }}
                      <span v-for="name in item.components" :key="name.name">{{ name.name }}</span>
                    </a-descriptions-item>
                    <a-descriptions-item v-if="item.supportSslVersion">
                      {{ t('asset.searchListDetail.postServices.supportSslVersion') }}{{ item.supportSslVersion }}

                    </a-descriptions-item>
                    <a-descriptions-item v-if="item.transportProtocol">
                      {{ t('asset.searchListDetail.postServices.transportProtocol') }}{{ item.transportProtocol }}

                    </a-descriptions-item>
                    <a-descriptions-item v-if="item.applicationProtocol">
                      {{ t('asset.searchListDetail.postServices.applicationProtocol') }}{{ item.applicationProtocol }}

                    </a-descriptions-item>
                  </a-descriptions>
                </div>
                <!-- 右侧信息展示start -->
                <div class="right">
                  <a-tabs type="rounded" border>
                    <!-- 搜索结果start -->
                    <a-tab-pane key="1" :title="$t('asset.searchListDetail.postServices.banner')">
                      <div class="banner-container">
                        <!-- banner有数据 -->
                        <a-typography v-if="item.banner">
                          <a-typography-paragraph copyable :copy-tooltip-props="{ top }">
                            {{ item.banner }}
                          </a-typography-paragraph>
                        </a-typography>
                        <!-- banner无数据 -->
                        <a-empty v-else />
                      </div>

                    </a-tab-pane>
                    <a-tab-pane key="2" :title="$t('asset.searchListDetail.postServices.certificate')">
                      <a-typography v-if="item.certificate">
                        <a-typography-paragraph copyable>
                          {{ item.certificate }}
                        </a-typography-paragraph>
                      </a-typography>
                      <a-empty v-else />
                    </a-tab-pane>
                  </a-tabs>

                </div>
              </div>
            </a-list-item>
          </a-list>
        </a-tab-pane>
        <!-- 漏洞列表start -->
        <a-tab-pane key="2" :title="$t('asset.searchListDetail.bugList')">
          <!-- 漏洞表格start -->
          <a-table :columns="columns" :pagination="false" :data="vulnsList">
            <template #vulnId="{ record }">
              <a-link @click="handleDetail(record.id)">{{ record.vulnId }}</a-link>

            </template>
            <template #riskGrade="{ record }">
              <span :style="{ 'color': setRiskGradeColor(record.riskGrade) }">{{ setRiskGradeText(record.riskGrade)
              }}</span>
            </template>
            <template #severity="{ record }">
              <span :style="{ 'color': setSeverityRatingColor(record.severity) }">{{
                getSeverityRatingText(record.severity)
              }}</span>
            </template>
            <template #createTime="{ record }">
              {{ formatDate(record.createTime, 'YYYY-MM-DD') }}
            </template>
          </a-table>
          <a-pagination class="paginationStyle" :total="pagination.total" :page-size="pagination.pageSize"
            @change="changePageIndex" show-total />
        </a-tab-pane>
        <!-- 用户组列表start -->
        <a-tab-pane key="3" :title="$t('asset.search.detail.users')">
          <UserGroup></UserGroup>
        </a-tab-pane>
        <!-- Windows补丁列表start -->
        <a-tab-pane key="4" :title="$t('asset.search.detail.patch')">
          <WindowsPatch></WindowsPatch>
        </a-tab-pane>
        <!-- 单个主机进程列表start -->
        <a-tab-pane key="5" :title="$t('asset.search.detail.process')">
          <HostProcess></HostProcess>
        </a-tab-pane>
        <!-- 单主机安装软件列表start -->
        <a-tab-pane key="6" :title="$t('asset.search.detail.softWare')">
          <InstallSoft></InstallSoft>
        </a-tab-pane>
      </a-tabs>

    </a-card>
  </div>
</template>
<script setup lang="ts">
// ==========================声明模块==========================
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { Message } from '@arco-design/web-vue';
import { useRoute, useRouter } from 'vue-router';
import formatDate from '@/utils/times'
import { setRiskGradeText, setRiskGradeColor, getSeverityRatingText, setSeverityRatingColor } from '@/hooks/status-options'
import { getSearchDetailVulns } from '@/api/asset/search'
import UserGroup from './detail-list-users.vue'
import WindowsPatch from './detail-list-patch.vue'
import HostProcess from './detail-list-process.vue'
import InstallSoft from './detail-list-software.vue'

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
// 接收来自父组件的值
const props = defineProps({
  portServices: {
    type: Array,
    default: () => { }
  }
});
// 从路由中获取资产Id
const rowId = route.query.id;
// 漏洞list
const vulnsList = ref([]);
// 分页参数
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 10,
})
// ==========================漏洞表格定义==========================
const columns = [
  {
    title: t('asset.search.detail.vulns.vulnId'),
    dataIndex: 'vulnId',
    slotName: 'vulnId'
  },
  {
    title: t('asset.search.detail.vulns.vulnName'),
    dataIndex: 'vulnName',
  },
  {
    title: t('asset.search.detail.vulns.riskGrade'),
    dataIndex: 'riskGrade',
    slotName: 'riskGrade'
  },
  {
    title: t('asset.search.detail.vulns.cvss2'),
    dataIndex: 'cvss2',
  },
  {
    title: t('asset.search.detail.vulns.cvss3'),
    dataIndex: 'cvss3',
  },
  {
    title: t('asset.search.detail.vulns.severity'),
    dataIndex: 'severity',
    slotName: 'severity'
  },
  {
    title: t('asset.search.detail.vulns.createTime'),
    dataIndex: 'createTime',
    slotName: 'createTime'
  },
];
// ==========================事件响应模块ss==========================
// 获取漏洞页面数据
const getInitList = async () => {
  const response = await getSearchDetailVulns(rowId, pagination);
  vulnsList.value = response.data;
  pagination.total = response.totalCount;
}
// 切换tabs栏
const changeTabs = async (key) => {
  // 切换至漏洞列表请求接口
  if (key === '2') {
    getInitList()
  }
}

// 分页
const changePageIndex = (val) => {
  pagination.pageIndex = val;
  getInitList()


}
// 漏洞详情
const handleDetail = (id) => {
  router.push({
    path: '/hostscan/leakDetail',
    query: {
      id,
    }
  })

}
onMounted(() => {
})


</script>
<style lang="less" scoped>
.general-card {
  position: relative;

  /deep/ .arco-card-header-title {
    // font-weight: 700;
    font-size: 20px;
  }

  /deep/ .arco-card-header {
    padding: 10px;
  }

  /deep/ .arco-tabs-content {
    padding: 0 10px;
  }


}

/deep/ .arco-typography {
  position: relative;
  white-space: pre-wrap;
}

/deep/ .arco-typography-operation-copy {
  position: absolute;
  top: 0px;
  right: 0px;
}

/deep/ .arco-anchor {
  background: none;
  width: auto;
}

/deep/ .arco-anchor-link {
  background: none;
}

/deep/ .arco-anchor-link-item .arco-anchor-link {
  width: 100%;
}

.tags {
  margin-left: 10px;
  margin-bottom: 10px;
  display: flex;
}

.list-container {
  display: flex;

  .left {
    flex: 1;
  }

  .right {

    flex: 3;
    margin-top: 15px;
    padding: 0px 10px 10px 10px;

    .banner-container {
      min-height: 100px;
      border: 1px solid var(--color-neutral-3);
      padding: 5px;
    }
  }
}

.paginationStyle {
  justify-content: end;
  margin-top: 20px;
}
</style>