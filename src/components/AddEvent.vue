<template lang="pug">
a-button(
  :href="eventViewUrl"
  type="primary"
  size="middle"
  class="sm:block sm:w-full"
) Add event
</template>

<script>
import { generateUrl } from '@/util';

export default ({
  components: {},
  setup() {
    const eventViewUrl = generateUrl('eventView', 'es', 'new');
    return {
      eventViewUrl,
    };
  },
});
</script>
