export default {
  'menu.list.scan.template': '扫描模板',
  'menu.list.scan.templateList': '模板列表',
  // 模板列表
  'scan.template.templateName': '模板名称',
  'scan.template.performance.assetConcurrency': '资产并发数',
  'scan.template.performance.singleAssetThread': '单个资产并发数',
  'scan.template.performance.portScanSpeed': '端口扫描速度',
  'scan.template.hostDiscovery.enableIcmp': 'ICMP扫描',
  'scan.template.hostDiscovery.enableArp': 'ARP扫描',
  'scan.template.hostDiscovery.enableSyn': 'Syn扫描',
  'scan.template.hostDiscovery.synPort': 'Syn端口',
  'scan.template.hostDiscovery.enablePu': '开启UDP',
  'scan.template.hostDiscovery.puPort': 'UDP端口',
  'scan.template.hostDiscovery.maxRetries': '重试次数',
  'scan.template.serviceDiscovery.tcpPort': '服务TCP端口',
  'scan.template.serviceDiscovery.udpPort': '服务UDP端口',
  'scan.template.port.scan.t1': '极慢',
  'scan.template.port.scan.t2': '慢速',
  'scan.template.port.scan.t3': '正常',
  'scan.template.port.scan.t4': '快速',
  'scan.template.port.scan.t5': '超速',
  // 搜索项
  // 'scan.template.serviceDiscovery.tcpPort': '服务TCP端口',
  // 'scan.template.serviceDiscovery.udpPort': '服务UDP端口',
  // 'scan.template.hostDiscovery.enableIcmp': 'ICMP扫描',
  // 'scan.template.hostDiscovery.enableArp': 'ARP扫描',
  //  'scan.template.performance.portScanSpeed': '端口扫描速度',
  // 'scan.template.templateName': '模板名称',

  // 搜索Placeholder
  'scan.template.name.input': '输入模板名称',
  'scan.template.synPort.input': '输入Syn端口',
  'scan.template.puPort.input': '输入Udp端口',
  'scan.template.serviceDiscovery.input.tcpPort': '输入服务TCP端口',
  'scan.template.serviceDiscovery.input.udpPort': '输入服务UDP端口',
  'scan.template.hostDiscovery.enableIcmp.input': '开启/关闭',
  'scan.template.hostDiscovery.enableArp.input': '开启/关闭',
  'scan.template.performance.portScanSpeed.input': '超慢速/慢速/正常/快速/超速',
  // 操作栏
  'scan.template.add': '新建扫描模板',
  'scan.template.operator.delete': '删除',
  'scan.template.operator.edit': '编辑',

  // 新建扫描模板
  // nav栏
  'menu.hostscan.addScanTemplate': '新建扫描模板',
  'menu.hostscan.editScanTemplate': '编辑扫描模板',
  'hostscan.addTemplate.hostDiscovery.nav': '主机发现',
  'hostscan.addTemplate.performParams.nav': '性能参数',
  'hostscan.addTemplate.serviceDiscovery.nav': '服务参数',
  // 表单
  'form.templateName.label': '模板名称',
  'form.enableArp.label': '是否开启ARP扫描',
  'form.enableIcmp.label': '是否开启ICMP扫描',
  'form.enableSyn.label': '是否开启SYN检测',
  'form.enablePu.label': '是否开启UDP检测',
  'form.synPort.label': 'TCP-SYN检测端口',
  'form.puPort.label': 'UDP端口检测',
  'form.maxRetries.label': '扫描重试次数',
  'form.assetConcurrency.label': '资产并发数量',
  'form.singleAssetThread.label': '单个主机线程数量',
  'form.portScanSpeed.label': '端口扫描速度',
  'form.survivalMode.label': '验证存活方式',
  'form.tcpPort.label': 'TCP服务端口',
  'form.udpPort.label': 'UDP服务端口',

  // 选择下拉框
  'form.enable.true': '开启',
  'form.enable.false': '关闭',
  'form.survival.all': 'SYN',
  'form.survival.single': 'TCP_CONNECT',

  // 表单验证
  'form.templateName.validate': '模板名称必填',
  'form.assetConcurrency.validate': '资产并发数量必填',
  'form.singleAssetThread.validate': '单个主机线程数量必填',
  'form.portScanSpeed.validate': '端口扫描速度必填',

  // 表单placeHolder
  'form.templateName.placeHolder': '请输入模板名称',
  'form.synPort.placeHolder': '1-1024',
  'form.puPort.placeHolder': '53,5353',
  'form.maxRetries.placeHolder': '次数为1-3次',
  'form.tcpPort.placeHolder': '1-1024',
  'form.udpPort.placeHolder': '53,5353',
  'form.survivalMode.placeHolder': '半连接/全连接',

  // 请求api状态
  'scan.add.template.success': '新增扫描模板成功',
  'scan.edit.template.success': '修改扫描模板成功',
  'scan.delete.template.success': '删除扫描模板成功',
  // 操作按钮
  'scan.add.template.submit': '提交',
  'scan.add.template.reset': '重置',
  'scan.add.template.back': '返回',
  'scan.template.operator.delete.question': '删除该模板',
};
