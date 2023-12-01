// 扫描配置的状态颜色显示
export function getStatusColor(status: number) {
  let color = '#ff7d00';
  if (status === 0) {
    color = '#ff7d00'
  } else if (status === 1) {
    color = '#b71de8'
  } else if (status === 2) {
    color = "#168cff"
  } else if (status === 3) {
    color = '#ff5722'
  } else if (status === 4) {
    color = '#ffb400'
  } else if (status === 5) {
    color = '#f53f3f'
  } else if (status === 6) {
    color = '#00b42a'
  }
  return color;
}
// 扫描记录详情中的样式显示
export function getStatusColorInDetail(status: number) {
  let color = '#ff7d00';
  if (status === 0) {
    color = '#ff7d00'
  } else if (status === 1) {
    color = '#b71de8'
  } else if (status === 2) {
    color = "#168cff"
  } else if (status === 3) {
    color = '#ff5722'
  } else if (status === 4) {
    color = '#ffb400'
  } else if (status === 5) {
    color = '#f53f3f'
  } else if (status === 6) {
    color = 'green'
  }
  return color;
}
export function getStatusText(status: number) {
  let color = '';
  if (status === 0 || status === null) {
    color = '未开始'
  } else if (status === 1) {
    color = '准备中'
  } else if (status === 2) {
    color = "扫描中"
  } else if (status === 3) {
    color = '已暂停'
  } else if (status === 4) {
    color = '已停止'
  } else if (status === 5) {
    color = '已失败'
  } else if (status === 6) {
    color = '已完成'
  }
  return color;
}
export function getLevelText(status: number) {
  let color = '';
  if (status === 1) {
    color = '硬件层'
  } else if (status === 2) {
    color = "系统层"
  } else if (status === 3) {
    color = '技术层'
  } else if (status === 4) {
    color = '应用层'
  }
  return color;
}
export function searchOptions() {
  const optionsArr = [{
    label: 'Equal',
    value: 'eq',
  },
  {
    label: 'Contain',
    value: 'ct',
  },]
  return optionsArr;
}
export function getSeverityRatingText(status: any) {
  let color = '暂无漏洞';
  if (!status) return color
  if (status >= 0 && status <= 3) {
    color = '低危漏洞'
  } else if (status >= 4 && status <= 7) {
    color = "中危漏洞"
  } else if (status >= 8 && status <= 10) {
    color = '高危漏洞'
  } else {
    color = '暂无漏洞'
  }
  return color;

}
export function setSeverityRatingColor(status: any) {
  let color = '#86909c';
  if (!status) return color
  if (status >= 0 && status <= 3) {
    color = '#ff7d00'
  } else if (status >= 4 && status <= 7) {
    color = "#ff5722"
  } else if (status >= 8 && status <= 10) {
    color = '#f53f3f'
  } else {
    color = '#86909c'
  }
  return color;

}
// 资产详情中漏洞等级	0-提示 1-低危 2-中危 3-高危
export function setRiskGradeColor(status: any) {
  let color = '#333';
  if (!status) return color
  if (status ===1) {
    color = 'green'
  } else if (status === 2) {
    color = "#ff7d00"
  } else if (status ===3) {
    color = 'red'
  } else {
    color = '#86909c'
  }
  return color;

}
export function setRiskGradeText(status: any) {
  let color = '暂无';
  if (!status) return color
  if (status ===1 ) {
    color = '低危'
  } else if (status ===2) {
    color = "中危"
  } else if (status ===3) {
    color = '高危'
  } else {
    color = '暂无'
  }
  return color;

}