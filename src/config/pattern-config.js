const patternAuthority = {
  'MenuVT': {
    permittedPaths: ['/index', '/favorites', '/keywords', '/matrix', '/copywriting']
  },
  'MenuWy1002': {
    permittedPaths: ['/index', '/favorites', '/keywords', '/matrix', '/copywriting']
  }
}

export const patternConfig = {
  'VT': {
    comment: {
      menuComponent: 'MenuVT',
      indexPath: '/index',
      permittedPaths: patternAuthority['MenuVT'].permittedPaths
    },

    detail_company: {
      '10001': {
        name: '光点科技'
      },
      '10002': {
        name: '爆米热点',
        logo: '/logo/logo-1001.svg',
      }
    }

  }
}
