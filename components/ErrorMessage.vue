<template> 
<div class="rounded-md bg-red-50 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
    </div>
    <div class="ml-3">
      <h3 class="text-sm font-medium text-red-800">{{ title }}</h3>
      <p class="mt-2 text-sm text-red-700">
        <slot />
      </p>
    </div>
  </div>
</div>
</template>

<script lang="ts" setup>
import { XCircleIcon } from '@heroicons/vue/solid'

interface Props {
  title: string
}

defineProps<Props>()
</script>
