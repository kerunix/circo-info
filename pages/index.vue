<template>
<div class="flex flex-col space-y-5 items-center">
  <div class="flex flex-col space-y-8 rounded p-8 text-gray-800 bg-white md:w-8/12">
    <p>Ce site vous permet de renseigner une adresse et de récupérer en retour des informations concernant votre député-e et votre circonscription. A l'approche des législatives 2022 (quand les données finales seront disponibles sur les plateformes du gouvernement) il sera mis à jour pour vous permettre de retrouver également les différent-es candidat-es dans votre circonscription.</p>
    <form
      class="flex flex-col space-y-6"
      @submit.prevent="onSubmit"
    >
      <label for="address" class="text-center text-xl font-semibold">Votre adresse</label>
      <div class="rounded-md bg-yellow-50 border border-yellow-500 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationIcon class="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-bold text-yellow-900">Attention</h3>
            <div class="font-medium mt-2 text-sm text-yellow-800 space-y-3">
              <p>Soyez le-la plus précis-e possible dans la saisie de votre adresse pour faciliter la recherche de votre député-e. Privilégiez une adresse complète plutôt qu'un simple nom de ville. Certaines villes sont composées de plusieurs circonscriptions et ont donc plusieurs député-es.</p>
              <p class="font-normal">
                Aucune donnée personnelle n'est conservée par ce site. Pour plus d'informations, consultez la page 
                <NuxtLink to="/about" class="underline">"À propos"</NuxtLink>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!hasSearched" class="flex items-center">
        <input
          type="text"
          name="address"
          id="address"
          v-model="form.address"
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md h-10"
        >
        <button
          type="submit"
          :disabled="!form.address"
          class="text-center flex-grow-0 h-10 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-400"
        >
          Rechercher
        </button>
      </div>
      <div v-else class="flex items-center justify-center">
        <button
          class="text-center flex-grow-0 h-10 px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="onReset"
        >
          Effectuer une autre recherche
        </button>
      </div>
    </form>
  </div>
  <div v-if="responses.length > 1 && !deputy" class="flex flex-col ite space-y-6 rounded p-8 bg-white md:w-8/12 text-gray-800">
    <ErrorMessage v-if="error?.type === 'geocoding'" :title="error.title">{{ error.message }}</ErrorMessage>
    <template v-else>
      <p class="text-center text-xl font-semibold">Veuillez affiner votre recherche en sélectionnant l'une des adresses ci dessous.</p>
      <div
        v-for="(address, index) in responses"
        :key="index"
        class="flex items-center justify-center"
      >
        <button
          class="rounded bg-indigo-100 px-3 py-2 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="onAddressSelected(index)"
        >
        {{ address.formatted }}
        </button>
      </div>
    </template>
  </div>
  <SearchResults v-if="hasResults || error?.type === 'circo'" :deputy="deputy" :error="error" :circonscription="circonscription" :candidates="candidates"/>
</div>
</template>

<script setup lang="ts">
  import { StringLiteral } from '@babel/types';
import { ExclamationIcon } from '@heroicons/vue/solid'

  const form = reactive({
    address: null
  })

  const responses = ref<Record<string, any>[]>([])
  const deputy = ref<Record<string, any> | null>(null)
  const circonscription = ref<Record<string, any> | null>(null)
  const candidates = ref<Record<string, any>[]>([])
  const error = ref<{ title: string, message: string, type: 'geocoding' | 'circo' } | null>(null)
  const hasResults = ref(false)
  const hasSearched = ref(false)

  async function onSubmit() {
    error.value = null
    try {
      const res = await $fetch('/api/geocoding', { method: 'post', body: form })
      if (res.results.length === 0) {
        throw new Error('No address found')
      }
      responses.value = res.results
      // If we only have one address matching, fetch the circo for this address immediately
      if (res.results.length === 1) {
        await onAddressSelected(0)
      }
    } catch (err) {
      error.value = {
        title: 'Nous n\'avons pas réussi à localiser cette adresse.',
        message: 'Veuillez vous assurer d\'avoir renseigné une adresse valide. Il est aussi possible que le service que nous utilisons pour localiser votre adresse soit inaccessible ou que nous ayons atteint notre quota quotidien d\'utilisations de ce service, veuillez réessayer demain.',
        type: 'geocoding'
      }      
    } finally {
      hasSearched.value = true
    }
  }

  async function onAddressSelected(index: number) {
    error.value = null
    try {
      const addressPoint = Object.values(responses.value[index].geometry)
      const payload = { coords: addressPoint }
      const { circonscription: circo, deputy: depute, candidates: casting } = await $fetch('/api/circo', { method: 'post', body: payload})
      circonscription.value = circo
      deputy.value = depute
      candidates.value = casting
      hasResults.value = true
    } catch (err) {
      console.log(err)
      error.value = {
        title: 'Nous n\'avons pas trouvé d\'information concernant votre circonscription ou votre député-e.',
        message: 'Cela peut être dû au fait que nos données sont incomplètes ou expirées.',
        type: 'circo'
      }
    }
  }

  function onReset() {
    responses.value = []
    deputy.value = null
    circonscription.value = null
    candidates.value = null
    error.value = null
    hasResults.value = false
    hasSearched.value = false
    form.address = null
  }
</script>