<template lang="pug">
div.flex.items-center.justify-between.bg-gray-100(
  class="sm:h-16"
)
  img.p-2.w-20.cursor-pointer(
    title="Inicio"
    @click="goHome"
    :src="`${publicPath}logo.png`"
    alt="Banner de MFAR", class="sm:w-40"
  )
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    return {
      goHome: () => router.push({ name: 'events' }),
      publicPath: process.env.BASE_URL,
    };
  },
};
</script>
