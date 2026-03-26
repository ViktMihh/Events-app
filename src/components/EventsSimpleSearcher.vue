<template lang="pug">
a-input-search(
  id="input"
  v-model:value="searchTerm"
  enter-button
  placeholder="Search by title or project code"
  style="width: 70%;"
  class="2xl:w-full"
  @search="handleChangeSearchTerm"
  size="middle"
  :allow-clear="false"
  @change="deleteSearchTerm"
)
</template>

<script>
import { ref } from 'vue';

export default {
  emits: [
    'change-search',
    'fetch-events',
  ],
  setup(props, { emit }) {
    const searchTerm = ref('');
    const handleChangeSearchTerm = (newSearchTerm) => {
      emit('change-search', newSearchTerm);
    };

    const deleteSearchTerm = () => {
      document.getElementById('input').addEventListener('keydown', (event) => {
        if (event.key === 'Backspace' && searchTerm.value.length <= 1) {
          emit('fetch-events');
        }
      });
    };

    return {
      deleteSearchTerm,
      searchTerm,
      handleChangeSearchTerm,
    };
  },
};
</script>
