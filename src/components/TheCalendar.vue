<template lang="pug">
div(
  class="w-3/5"
)
  .flex.font-bold.text-xl
    .border-2.border-solid.border-gray-300.rounded.mr-4.px-2
     calendar-outlined
    span Events calendar
  a-divider.my-5
  full-calendar(
    :options='calendarOptions'
  )
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useRouter } from 'vue-router';
import { CalendarOutlined } from '@ant-design/icons-vue';

export default {

  components: {
    FullCalendar,
    CalendarOutlined,
  },
  props: {
    calendarEvents: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const eventsData = props.calendarEvents.map((item) => {
      let backgroundColor = '';
      let textColor = '';
      let borderColor = '';
      if (item.projectType === '0') {
        backgroundColor = '#bad8f7';
        textColor = '#12406E';
        borderColor = '#88bdf1';
      } else if (item.projectType === '1') {
        backgroundColor = '#E6F7FF';
        textColor = '#236DD9';
        borderColor = '#91D5FF';
      }
      return {
        id: item.id,
        title: item.name,
        start: item.startDate.slice(0, 10),
        end: item.finishDate ? item.finishDate.slice(0, 10) : item.finishDate,
        backgroundColor,
        textColor,
        borderColor,
      };
    });

    const calendarOptions = ({
      contentHeight: 700,
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      weekends: true,
      locale: 'en',
      firstDay: 1,
      buttonText: {
        today: 'Today',
      },
      eventClick: (info) => {
        router.push(`/events/${info.event.id}/settings`);
      },
      events:
        eventsData,
    });

    return {
      calendarOptions,
    };
  },
};
</script>
<style>
.fc .fc-button-primary {
  background-color:white !important;
  border-color: #d9d9d9 !important;
  color:black !important;
}

.fc .fc-button-primary:hover {
  background-color:white !important;
  border-color: #1890ff !important;
  color:#1890ff !important;
}

.fc .fc-button-primary:disabled {
  background-color:white !important;
  border-color: #d9d9d9 !important;
  color:black !important;
}
</style>
