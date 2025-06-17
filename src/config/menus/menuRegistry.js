// 1. 菜单项注册表：每条菜单项有唯一 ID、名称、路径（可扩展：icon、排序 weight、父子关系等）
export const menuRegistry = {
  // 推荐用语义化或数字化 ID；
  '001': { name: '我的关键词', path: '/keywords' },
  '002': { name: '视频列表', path: '/index' },
  '003': { name: '我的收藏', path: '/favorites' },
  '004': { name: '矩阵管理', path: '/matrix' },
  '005': { name: '对标账号', path: '/benchmark-accounts' },
  '006': { name: '文案管理', path: '/copywriting' },
  '007': { name: '视频账号详情', path: '/bm-accounts-video' },
};