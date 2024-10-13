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
