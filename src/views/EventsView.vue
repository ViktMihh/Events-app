<template lang="pug">
the-header
.flex.mt-10.px-16(
  class="sm:flex sm:px-5"
)
  events-layout(
    @get-data='getEventsData'
  )
  the-calendar(
    :calendarEvents='eventsData'
    v-if="eventsData"
    class="sm:hidden"
  )
</template>

<script>
import { ref } from 'vue';
import TheHeader from '@/components/TheHeader';
import EventsLayout from '@/components/EventsLayout';
import TheCalendar from '@/components/TheCalendar';
import useStore from '@/store';

export default {
  components: {
    EventsLayout,
    TheCalendar,
    TheHeader,
  },
  setup() {
    const store = useStore();
    store.openKeys = ['sub1'];
    store.selectedKeys = ['1'];

    const eventsData = ref('');

    const getEventsData = (data) => {
      eventsData.value = data;
    };
    return {
      getEventsData,
      eventsData,
    };
  },
};
</script>
