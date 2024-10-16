<template>
  <div class="common-page-container" :class="[isTransparent? 'transparent-bg' : '']">
    <div class="common-panel">
      <div class="common-query-form-container" style="flex-direction: column;">
        <PageTitle v-if="pageTitle"></PageTitle>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageTitle from '@/components/page-title/index.vue';
import { defineProps } from 'vue'

const props = defineProps({
  pageTitle: {
    type: Boolean,
    default: true
  },
  isTransparent: {
    type: Boolean,
    default: false
  },
})

</script>

<style scoped lang="scss">

</style>