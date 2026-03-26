<template lang="pug">
a-alert(
  :message="errorMessage"
  type="error"
)
  template(
    v-if="!errorCode"
    #description
  )
    .font-bold An error occurred during registration. Please try again later
</template>

<script>
import { ref } from 'vue';
import { handleUsersImportErrors } from '@/util';

export default {
  props: {
    errorCode: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const errorMessage = ref('');
    if (props.errorCode) {
      errorMessage.value = handleUsersImportErrors(props.errorCode)[0].slice(1, -1);
    }

    return {
      errorMessage,
    };
  },
};
</script>
