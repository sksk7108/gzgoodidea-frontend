// 5. 公司基础信息(rawCompanyInfo)：只关注与公司自身相关字段以及所属模式
export const rawCompanyInfo = {
  'VT-10001': {
    name: '光点科技',
    logo: '/logo/logo-1001.svg',
    menuComponent: 'MenuVT',
    indexPath: '/index',
    mode: 'VT',
    // 如果公司需对默认菜单做覆写，可加 overrides 字段（见示例2）
  },
  'VT-10002': {
    name: '爆米热点',
    logo: '/logo/logo-1002.svg',
    menuComponent: 'MenuVT',
    indexPath: '/index',
    mode: 'VT',
  },
  'MT-20001': {
    name: '示例MT公司',
    logo: '/logo/logo-2001.svg',
    menuComponent: 'MenuMT',
    indexPath: '/index',
    mode: 'MT',
  },
  // …更多公司
};