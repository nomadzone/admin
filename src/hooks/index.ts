// src/hooks/index.ts
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useRouteName() {
  const route = useRoute();
  const i18 = useI18n();
  const routeName = computed(() => i18.t(route.meta.locale as string));

  return {
    routeName,
  };
}

function isChinese(text) {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text);
}

export function useBreadcrumbs() {
  const route = useRoute();

  // 获取面包屑数组
  const breadcrumbs = computed(() => {
    const matchedRoutes = route.matched;
    
    // 用 Set 来记录已经遇到的 `label`
    const labelSet = new Set();
  
    // 遍历路由列表并去重
    const list = matchedRoutes.reduce((acc, r) => {
      if (labelSet.has(r.meta.locale)) {
        // 如果 `label` 已经存在，则删除第一个相同的 label 项
        acc = acc.filter(item => item.label !== r.meta.locale);
      }
      // 添加 `label` 到 Set 中
      labelSet.add(r.meta.locale);
  
      // 将当前路由项添加到 `acc`
      acc.push({
        isChinese: isChinese(r.meta.locale),
        label: r.meta.locale,
        path: r.path,
        name: r.name,
      });
  
      return acc;
    }, []);
    
    return list;
  });

  return {
    breadcrumbs
  };
}