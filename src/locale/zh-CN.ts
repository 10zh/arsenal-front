import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeMonitor from '@/views/dashboard/monitor/locale/zh-CN';
// 扫描引入
import localeSearchTable from '@/views/hostscan/scan-engine/locale/zh-CN';
import localeCardList from '@/views/hostscan/scan-template/locale/zh-CN';
import scanConfig from '@/views/hostscan/scan-config/locale/zh-CN';
// 管理
import localManageUser from '@/views/manage/user-list/locale/zh-CN'
import localManageRole from '@/views/manage/role-manage/locale/zh-CN'
import localOrganizationChart from '@/views/manage/organization-chart/locale/zh-CN'

// 资产
import localAsset from '@/views/asset/locale/zh-CN'
// 凭证
import localCert from '@/views/certmanage/locale/zh-CN'
// 源数据
import localSourceData from '@/views/sourcedata/locale/zh-CN'


import localeStepForm from '@/views/form/step/locale/zh-CN';
import localeGroupForm from '@/views/form/group/locale/zh-CN';

import localeBasicProfile from '@/views/profile/basic/locale/zh-CN';

import localeDataAnalysis from '@/views/visualization/data-analysis/locale/zh-CN';
import localeMultiDAnalysis from '@/views/visualization/multi-dimension-data-analysis/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';

import globalSettings from './zh-CN/global';

import localeSettings from './zh-CN/settings';

export default {
  'menu.hostscan': '扫描',
  'menu.hostscan.config': '主机扫描配置',
  'menu.hostscan.config.add': '添加主机扫描配置',
  'menu.hostscan.config.detail': '主机扫描配置详情',
  'menu.hostscan.config.record.host.detail': '主机记录详情',
  'menu.weak.hostscan.config.edit':'编辑弱口令扫描',
  'menu.weak.hostscan.config.add':'添加弱口令扫描',
  'menu.weak.hostscan.config.detail':'弱口令扫描配置详情',


  'menu.manage':'系统管理',
  'menu.manage.permissionsManage':'权限管理',
  'menu.manage.roleManage':'角色管理',
  'menu.manage.userList':'用户列表',
  'menu.manage.organization':'组织架构',

  'menu.asset':'资产',
  'menu.asset.search':'资产搜索',
  'menu.asset.detail':'资产详情',
  'menu.asset.leak.detail':'漏洞详情',
  'menu.asset.clusterAnalysis':'聚合分析',

  'menu.certManage':'凭证管理',
  'menu.sourceData':'源数据',
  'menu.list.sourceData.weakPasswords':'弱口令',
  'menu.list.sourceData.vulnerabilityLibrary':'漏洞库',
  
  'menu.dashboard': '仪表盘',
  'menu.server.dashboard': '仪表盘-服务端',
  'menu.server.workplace': '工作台-服务端',
  'menu.server.monitor': '实时监控-服务端',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.arcoWebsite': 'Arco Design',
  'menu.faq': '常见问题',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,

  ...localeMonitor,
  ...localeSearchTable,
  ...localeCardList,
  ...localeStepForm,
  ...localeGroupForm,
  ...localeBasicProfile,
  ...localeDataAnalysis,
  ...localeMultiDAnalysis,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,
  ...globalSettings,
  ...scanConfig,
  ...localManageUser,
  ...localManageRole,
  ...localOrganizationChart,
  ...localAsset,
  ...localCert,
  ...localSourceData,
};
