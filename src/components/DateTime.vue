<template lang="pug">
a-tag.text-sm.text-left {{eventFormattedDate}}
</template>

<script>
import { computed } from 'vue';
import { getDateFormat, getStartAndFinishDateFormat } from '@/util';
import { getYear } from 'date-fns';

export default {
  props: {
    event: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const eventFormattedDate = computed(() => {
      const { startDate, finishDate } = props.event;

      // If an event has no end date, only the start date is displayed
      if (!finishDate) {
        return (getDateFormat(startDate, 'd MMMM yyyy HH:mm'));
      }

      if (finishDate) {
        // If the end date is the same as the start date, display the day only once
        if (getDateFormat(startDate, 'yyyy-MM-dd') === getDateFormat(finishDate, 'yyyy-MM-dd')) {
          return getStartAndFinishDateFormat(startDate, finishDate, 'd MMMM yyyy HH:mm', 'HH:mm');
        }
        // If the end year is greater than the start year, display the year of both dates
        if (getYear(new Date(finishDate)) > getYear(new Date(startDate))) {
          return getStartAndFinishDateFormat(startDate, finishDate, 'd MMMM yyyy HH:mm', 'd MMMM yyyy HH:mm');
        }
        // If the event has an end date, display the start date without the year,
        // followed by the end date with the year
        return getStartAndFinishDateFormat(startDate, finishDate, 'd MMMM HH:mm', 'd MMMM HH:mm yyyy');
      }
      return '';
    });

    return {
      eventFormattedDate,
    };
  },
};
</script>
