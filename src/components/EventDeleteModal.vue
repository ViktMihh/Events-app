<!-- eslint-disable max-len -->
<template lang="pug">
a-modal(
  @ok="handleDelete"
  ok-text="Si"
  cancel-text="No"
  :visible="true"
  centered
  class="w-1/4 sm:w-full"
  @cancel="handleCloseModal"
)
  a-alert.mt-6(
    type="error"
    show-icon
  )
    template(
      #message
    )
      span {{ message }}
</template>

<script>

export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  emits: ['delete', 'close'],
  setup(props, { emit }) {
    const handleDelete = () => {
      emit('delete');
    };

    const handleCloseModal = () => {
      emit('close');
    };

    return {
      props,
      handleDelete,
      handleCloseModal,
    };
  },
};
</script>

<style scoped>
.card-container{
  height: 550px;
}
</style>
