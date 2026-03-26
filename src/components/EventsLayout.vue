<template lang="pug">
.flex.flex-col.pr-16(
  class="w-2/5 sm:w-full sm:px-0"
)
  div.flex.justify-between(
    class="2xl:flex-col"
  )
    add-event.mb-10(
      class="sm:mb-6"
    )
    events-simple-searcher.mb-10(
      @change-search="handleChangeSearch"
      @fetch-events="events.visibleData = events.data"
      class="sm:mb-10"
    )
  a-skeleton(
    :loading="events.loading"
    :active="events.loading"
  )
  div(
    v-if="!events.loading"
  )
    .flex.justify-between
      .flex.text-xl.font-bold.mb-4(
        v-if="!events.showUpcomingEvents"
      ) Events
      .flex.text-xl.font-bold.mb-4(
        v-else
      ) Future events
      div
        a-switch.mx-4(
          :checked="events.showUpcomingEvents"
          @click="handleSetUpcomingEvents"
        )
        span Future events
    a-list.mx-auto.overflow-scroll.overflow-x-hidden(
      class="h-[45rem]"
      :data-source="events.visibleData"
      :split="false"
    )
      template(
        #renderItem="{ item }"
        )
        a-list-item
          event-card(
            :item="item"
            :calendarView="true"
          )
        a-list-item-meta
</template>

<script>
import { onMounted } from 'vue';
import useEvents from '@/composables/useEvents';
import EventCard from '@/components/EventCard';
import AddEvent from '@/components/AddEvent';
import EventsSimpleSearcher from '@/components/EventsSimpleSearcher';

export default {
  components: {
    EventCard,
    AddEvent,
    EventsSimpleSearcher,
  },
  emits: ['get-data'],
  setup(props, { emit }) {
    const {
      events,
      handleFetchEvents,
      handleChangeSearch,
      handleSetUpcomingEvents,
    } = useEvents();

    onMounted(async () => {
      await handleFetchEvents();
      emit('get-data', events.calendarData);
    });

    return {
      events,
      handleChangeSearch,
      handleSetUpcomingEvents,
    };
  },
};
</script>
