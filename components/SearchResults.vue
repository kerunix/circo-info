<template>
  <div class="w-full grid grid-cols-1 gap-4 md:grid-cols-2 md:w-8/12">
    <ErrorMessage
      v-if="error?.type === 'circo'"
      :title="error.title"
      class="col-span-1 md:col-span-2"
    >
      {{ error.message }}
    </ErrorMessage>
    <template v-if="!error">
      <div class="flex flex-col space-y-6 rounded p-8 bg-white text-gray-800 md:col-span-1">
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
      <div class="flex flex-col space-y-6 rounded p-8 bg-white text-gray-800 md:col-span-1">
        <h2 class="text-center text-xl font-semibold">Votre député-e</h2>
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
    </template>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  deputy: Record<string, any> | null,
  circonscription: Record<string, any> | null
  error?: { title: string, message: string, type: 'geocoding' | 'circo' } | null,
}

withDefaults(defineProps<IProps>(), {
  error: null,
})
</script>
