<template>
    <div class="flex">
      <div>{{ routeName }}</div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { useRouteName } from '@/hooks/index';
  
  const { routeName } = useRouteName();
  </script>
  
  <style scoped>
  /* Add your styles here */
  .flex {
    display: flex;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding-bottom: 20px
  }
  </style>
  