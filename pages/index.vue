<template>
<div class="flex flex-col space-y-5 items-center">
  <div class="flex flex-col space-y-8 rounded p-8 text-gray-800 bg-white md:w-8/12">
    <p>Ce site vous permet de renseigner une adresse et de récupérer en retour des informations concernant votre député-e et votre circonscription. A l'approche des législatives 2022 (quand les données finales seront disponibles sur les plateformes du gouvernement) il sera mis à jour pour vous permettre de retrouver également les différentes listes candidates dans votre circonscription.</p>
    <form
      class="flex flex-col space-y-6"
      @submit.prevent="onSubmit"
    >
      <label for="address" class="text-center text-xl font-semibold">Votre adresse</label>
      <p class="text-gray-800">Soyez le-la plus précis-e possible dans la saisie de votre adresse pour faciliter la recherche de votre député-e.</p>
      <div class="flex items-center">
        <input
          type="text"
          name="address"
          id="address"
          v-model="form.address"
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md h-10"
        >
        <button
          type="submit"
          class="text-center flex-grow-0 h-10 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Rechercher
        </button>
      </div>
    </form>
  </div>
  <div v-if="responses.length > 1 && !deputy" class="flex flex-col ite space-y-6 rounded p-8 bg-white md:w-8/12 text-gray-800">
    <p class="text-center text-xl font-semibold">Veuillez affiner votre recherche en sélectionnant l'une des adresses ci dessous.</p>
    <button
      v-for="(address, index) in responses"
      :key="index"
      class="rounded bg-indigo-100 px-3 py-2 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      @click="onAddressSelected(index)"
    >
    {{ address.formatted }}
    </button>
  </div>
  <div v-if="deputy" class="flex flex-col space-y-6 rounded p-8 bg-white w-full md:w-8/12 text-gray-800">
    <h2 class="text-center text-xl font-semibold">Votre député-e</h2>
    <div class="mt-5 border-t border-gray-200">
      <dl class="sm:divide-y sm:divide-gray-200">
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Nom</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ deputy.nom }}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Parti</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ deputy.parti_ratt_financier }}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Groupe</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ deputy.groupe_sigle }}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Email</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ deputy.emails[0].email }}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Profession</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ deputy.profession }}</dd>
        </div>
        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-gray-500">Liens</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <div class="flex justify-start space-x-7">
              <a class="underline" :href="deputy.url_an" target="_blank">Assemblée Nationale</a>
              <a class="underline" :href="deputy.url_nosdeputes" target="_blank">Nos députés</a>
            </div>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
  const form = reactive({
    address: ''
  })

  const responses = ref<Record<string, any>[]>([])
  const deputy = ref<Record<string, any> | null>(null)
  const circonscription = ref<Record<string, any> | null>(null)
  const error = ref<string | null>(null)

  async function onSubmit() {
    const res = await $fetch('/api/geocoding', { method: 'post', body: form })
    responses.value = res.results
    // If we only have one address matching, fetch the circo for this address immediately
    if (res.results.length === 1) {
      await onAddressSelected(0)
    }
  }

  async function onAddressSelected(index: number) {
    const addressPoint = Object.values(responses.value[index].geometry)
    const payload = { coords: addressPoint }
    const { circonscription: circo, deputy: { depute } } = await $fetch('/api/circo', { method: 'post', body: payload})
    circonscription.value = circo
    deputy.value = depute
  }
</script>