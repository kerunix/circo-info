<template>
  <div class="w-full grid grid-cols-1 gap-4 md:w-8/12">
    <ErrorMessage
      v-if="error?.type === 'circo'"
      :title="error.title"
      class="col-span-1"
    >
      {{ error.message }}
    </ErrorMessage>
    <template v-if="!error">
      <div class="flex flex-col space-y-6 rounded p-8 bg-white text-gray-800">
        <h2 class="text-center text-xl font-semibold">Votre circonscription</h2>
        <template v-if="circonscription">
          <div class="mt-5 border-t border-gray-200">
            <dl class="sm:divide-y sm:divide-gray-200">
              <ResultItem title="Numéro" :data="circonscription.num_circ" />
              <ResultItem title="Département" :data="circonscription.nom_dpt" />
              <ResultItem title="Région" :data="circonscription.nom_reg" />
            </dl>
          </div>
        </template>
      </div>
      <div class="flex flex-col space-y-6 rounded p-8 bg-white text-gray-800">
        <h2 class="text-center text-xl font-semibold">Votre député-e sortant-e</h2>
        <template v-if="deputy">
          <div class="mt-5 border-t border-gray-200">
            <dl class="sm:divide-y sm:divide-gray-200">
              <ResultItem title="Nom" :data="deputy.nom" />
              <ResultItem title="Parti" :data="deputy.parti_ratt_financier" />
              <ResultItem title="Groupe" :data="deputy.groupe_sigle" />
              <ResultItem title="Email" :data="deputy.emails[0].email" />
              <ResultItem title="Profession" :data="deputy.profession" />
              <ResultItem title="Liens" data="">
                <div class="flex justify-start space-x-7">
                  <a class="underline" :href="deputy.url_an" target="_blank">Assemblée Nationale</a>
                  <a class="underline" :href="deputy.url_nosdeputes" target="_blank">Nos députés</a>
                </div>
              </ResultItem>
            </dl>
          </div>
        </template>
      </div>
      <div class="flex flex-col space-y-6 rounded p-8 bg-white text-gray-800">
        <h2 class="text-center text-xl font-semibold">Les candidat-es de votre circonscription</h2>
        <template v-if="candidates">
                      <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nom</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Prénom</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nuance</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Genre</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="candidate in candidates" :key="candidate.numero">
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{{ candidate.nom }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">{{ candidate.prenom }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ candidate.nuance }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ candidate.sexe }}</td>
                </tr>
              </tbody>
            </table>
        </template>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  deputy: Record<string, any> | null,
  circonscription: Record<string, any> | null
  candidates: Record<string, any> | null
  error?: { title: string, message: string, type: 'geocoding' | 'circo' } | null
}

withDefaults(defineProps<IProps>(), {
  error: null,
})
</script>
