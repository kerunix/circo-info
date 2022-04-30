<template>
  <div>
    <nav class="absolute top-0 right-0 left-0 bg-gray-900 shadow-2xl flex items-center justify-between px-5 py-3 text-white">
      <h1>Circo Info</h1>
      <ul class="flex items-center justify-end space-x-5">
        <li>
          <NuxtLink to="/" class="rounded p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" exactActiveClass="text-indigo-200">Accueil</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about" class="rounded p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" exactActiveClass="text-indigo-200">A propos</NuxtLink>
        </li>
      </ul>
    </nav>
    <main class="bg-gray-800 min-h-screen w-screen py-20 px-2 md:py-28">
      <slot />
    </main>
  </div>
</template>