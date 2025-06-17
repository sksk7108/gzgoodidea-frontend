import { menuRegistry } from './menus/menuRegistry';
import { modeConfig } from './mode/modeConfig';
import { rawCompanyInfo } from './rowCompanyInfo';

// 3. 构建工具函数：根据 menuRegistry 和模式配置生成最终 menuList、permittedPaths
function buildModeDerivedConfig(menuRegistry, permittedMenuIds) {
  const menuList = [];
  const permittedPaths = ['/404']; // 通常所有模式都允许访问 404，可根据需要调整或注册
  permittedMenuIds.forEach(id => {
    const item = menuRegistry[id];
    if (item) {
      menuList.push({ id, name: item.name, path: item.path });
      permittedPaths.push(item.path);
    } else {
      console.warn(`[Config Warning] 未在 menuRegistry 找到菜单 ID=${id}`);
    }
  });
  // 可去重 permittedPaths（若有需要）；此处简单返回
  return { menuList, permittedPaths };
}

// 4. 构建所有模式的衍生配置，方便直接引用
export const derivedModeConfig = {};
Object.entries(modeConfig).forEach(([mode, cfg]) => {
  derivedModeConfig[mode] = buildModeDerivedConfig(menuRegistry, cfg.permittedMenuIds);
});


// 6. 构建公司最终配置：将模式衍生配置合并进来
function buildCompanyConfig(rawInfo, derivedModeConfig) {
  const result = {};
  Object.entries(rawInfo).forEach(([companyId, info]) => {
    const { mode, overrides, ...rest } = info;
    const modeDerived = derivedModeConfig[mode];
    if (!modeDerived) {
      console.warn(`[Config Warning] 未找到模式 ${mode} 的配置，companyId=${companyId}`);
      return;
    }
    // 若需要覆盖：overrides 可以包含 permittedMenuIds（新数组），或 menuList/permittedPaths 覆盖
    if (overrides && overrides.permittedMenuIds) {
      // 重新生成覆盖的 menuList 和 permittedPaths
      const overrideDerived = buildModeDerivedConfig(menuRegistry, overrides.permittedMenuIds);
      result[companyId] = {
        ...rest,
        mode,
        indexPath: rest.indexPath,
        permittedPaths: overrideDerived.permittedPaths,
        menu: overrideDerived.menuList,
      };
    } else {
      // 默认模式配置
      result[companyId] = {
        ...rest,
        mode,
        indexPath: rest.indexPath,
        permittedPaths: modeDerived.permittedPaths,
        menu: modeDerived.menuList,
      };
    }
  });
  return result;
}

export const companyConfig = buildCompanyConfig(rawCompanyInfo, derivedModeConfig);