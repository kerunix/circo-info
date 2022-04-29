<template>
  <main class="bg-gray-800 h-screen w-screen flex items-center justify-center">
    <div class="rounded p-8 bg-white">
      <input
        type="text"
        name="address"
        id="address"
        v-model="form.address"
      >
      <p>{{ form.address }}</p>
      <button @click="onSubmit">fetch</button>
      <p v-for="(address, key) in responses">{{ address }}</p>
    </div>
  </main>
</template>

<script setup lang="ts">
  const form = reactive({
    address: ''
  })

  const responses = ref<string[]>([])

  async function onSubmit() {
    const res = await $fetch('/api/geocoding', { method: 'post', body: form })
    responses.value = res.results.map(result => result.formatted)
  }
</script>