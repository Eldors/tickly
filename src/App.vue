<script lang="ts" setup>
import { getCurrentWindow } from '@tauri-apps/api/window';

import { useExitDialog } from '@/useExitDialog.ts';
import MainView from '@/view/main/MainView.vue';

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
    <MainView />
  </main>
</template>
