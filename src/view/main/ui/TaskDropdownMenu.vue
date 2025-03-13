<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="ml-auto"
      >
        <DotsHorizontalIcon />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent>
      <!--      <DropdownMenuItem @click="openDialog">-->
      <!--        <ColorWheelIcon class="text-amber-500" />-->
      <!--        <span>Change color</span>-->
      <!--      </DropdownMenuItem>-->

      <!--      <DropdownMenuSeparator />-->

      <DropdownMenuItem @click="isRemoveDialogOpen = true">
        <TrashIcon class="text-red-500" />
        <span>Remove</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
    <Dialog
      :open="isRemoveDialogOpen || isAddDialogOpen"
      @update:open="closeAllDialogs"
    >
      <DialogContent v-if="isRemoveDialogOpen">
        <DialogTitle> Confirm Remove </DialogTitle>
        <DialogDescription>
          <p>
            Are you sure you want to <b>Remove</b> the task <b>{{ name }}</b
            >?
          </p>
        </DialogDescription>
        <DialogFooter>
          <DialogClose as-child>
            <Button @click="$emit('remove-task')"> Remove </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </DropdownMenu>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import { DotsHorizontalIcon, TrashIcon } from '@radix-icons/vue';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { PropType, ref } from 'vue';

defineProps({
  name: {
    type: String as PropType<string>,
    required: true,
  },
  taskId: {
    type: Number as PropType<number>,
    required: true,
  },
});

const emit = defineEmits(['remove-task']);

const isRemoveDialogOpen = ref(false);
const isAddDialogOpen = ref(false);
// const activeDialog = ref('');

// const openDialog = (dialogName: 'color' | 'remove') => {
//   activeDialog.value = dialogName;
// };

const closeAllDialogs = () => {
  isRemoveDialogOpen.value = false;
  isAddDialogOpen.value = false;
};
</script>

<style scoped></style>
