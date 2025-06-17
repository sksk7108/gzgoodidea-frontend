// 2. 模式层面：只定义该模式可用的菜单 ID 列表；前端根据注册表生成 menuList 和 permittedPaths
export const modeConfig = {
  VT: {
    // 后端下发时，也只需给出 ['001','002',...] 这样的数组
    permittedMenuIds: ['001', '002', '003', '004', '005', '006', '007'],
  },
  MT: {
    permittedMenuIds: ['001', '002', '003', '004'],
  },
};