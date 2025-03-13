<script lang="ts" setup>
import MainView from '@/view/main/MainView.vue';
import { isInit } from '@/db';
import { useExitDialog } from '@/useExitDialog.ts';
import { getCurrentWindow } from '@tauri-apps/api/window';

window.addEventListener('keydown', (e) => {
  if (e.key === 'q' && e.metaKey) {
    e.preventDefault();
    useExitDialog()
      .then((res) => {
        if (!res) {
          return;
        }
        getCurrentWindow().close();
      })
      .catch((reason) => {
        console.error('reason =>', reason);
      });
  }
});
</script>

<template>
  <main>
    <span v-if="!isInit">...loading</span>
    <MainView v-else />
  </main>
</template>
