const menu = {
  VT:{
    permittedPaths: ['/404','/index', '/favorites', '/keywords', '/matrix', '/copywriting', '/benchmark-accounts', '/bm-accounts-video'],
    menuList: [
      {
        name: '我的关键词',
        path: '/keywords'
      },
      {
        name: '视频列表',
        path: '/index'
      },
      {
        name: '我的收藏',
        path: '/favorites'
      },
      {
        name: '矩阵管理',
        path: '/matrix'
      }
    ]
  },
  MT:{
    permittedPaths: ['/404','/index', '/favorites', '/keywords', '/matrix'],
    menuList:[
      {
        name: '我的关键词',
        path: '/keywords'
      },
      {
        name: '视频列表',
        path: '/index'
      },
      {
        name: '我的收藏',
        path: '/favorites'
      },
      {
        name: '矩阵管理',
        path: '/matrix'
      },
    ]
  }
}

export const patternConfig = {
  'VT-10001': {
    name: '光点科技',
    logo: '/logo/gzgoodidea_logo.png',
    menuComponent: 'MenuVT',
    indexPath: '/index',
    permittedPaths: menu.VT.permittedPaths,
    menu: menu.VT.menuList
  },
  'VT-10002': {
    name: '智能管理系统',
    logo: '/logo/wy_logo.png',
    menuComponent: 'MenuVT',
    indexPath: '/index',
    permittedPaths: menu.VT.permittedPaths,
    menu: menu.VT.menuList
  }
}