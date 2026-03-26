<!-- eslint-disable max-len -->
<template lang="pug">
.bg-light-blue.w-full.rounded-2xl.grid.grid-cols-full.grid-rows-1(
  :class="calendarView ? 'block relative h-52 grid-cols-small sm:h-56' : 'block relative h-16 sm:h-56'"
)
  .flex.items-center
    .flex.items-center.justify-center.text-2xl.w-20.h-full.cursor-pointer(
      v-if="!calendarView"
      @click="handleBackToEvents"
      class="bg-[#E6F7FE] sm:h-4 sm:absolute sm:top-5 "
    )
      left-outlined
  .flex.flex-col.text-left(
    :class="calendarView ? 'absolute top-20 left-5 sm:absolute sm:top-16 sm:left-5' : ' justify-center sm:absolute sm:top-16 sm:left-5'"
  )
    .font-bold(v-if="calendarView")
      | {{ item.projectCode ? `${item.projectCode} - ` : '' }}{{ item.name }}
    .text-lg.font-bold(v-if="!calendarView && item.id")
      | {{ item.projectCode ? `${item.projectCode} - ` : '' }}{{ item.name }}
    .text-lg.font-bold(v-if="!item.id")
      | Nuevo evento
    a-tooltip(
      placement="right"
    )
      template(
        #title
      ) {{item.description}}
      .text-gray-400(
        :class="calendarView ? 'hidden' : 'flex sm:hidden'"
      ) {{item.description}}
  .flex.items-center.justify-center(
    :class="calendarView ? 'absolute bottom-12 left-5 px-0 sm:bottom-14' : 'flex sm:absolute sm:bottom-12 sm:left-5'"
    v-if="item.id"
  )
    date-time(
      :event="item"
    )
  .flex.items-center.justify-center(
    :class="calendarView ? 'absolute top-5 right-5' : 'flex sm:absolute sm:top-5 sm:right-5'"
    v-if="item.id"
  )
    a-tag(
      v-if="item.projectType === '0'"
      color="#bad8f7"
    ) On-site
    a-tag(
      v-if="item.projectType === '1'"
      color="blue"
    ) Online
  a-tooltip(
    v-if="(['0', '2'].indexOf(item.projectType) !== -1)"
  )
    template(
        #title
      ) Confirmados / inscritos
    .flex.items-center.justify-center(
      :class="calendarView ? 'absolute top-5 left-5 px-0' : 'flex sm:absolute sm:top-4 sm:left-12'"
    )
      a-tag.text-sm.mr-4(
        v-if="calendarView"
        color="blue"
      ) # {{item.id}}
      div(
        v-if="calendarView"
      )
        team-outlined.text-xl.mr-3.text-gray-400
        span.text-lg.text-left.text-gray-400 {{item.userCount}}
  .flex.items-center.justify-center(
    v-else
    :class="calendarView ? 'absolute top-5 left-5 px-0' : 'flex sm:absolute sm:top-4 sm:left-12'"
  )
    a-tag.text-sm.mr-4(
      v-if="calendarView"
      color="blue"
    ) # {{item.id}}
    div(
      v-if="calendarView"
    )
      team-outlined.text-xl.mr-3.text-gray-400
      span.text-lg.text-left.text-gray-400 {{item.userCount}}
  slot
    .flex.items-center.justify-center(
      v-if="item.id"
    )
      a-button(
        @click="handleViewEvent"
        size="middle"
        :class="calendarView ? 'absolute bottom-5 right-5' : 'flex'"
        v-if="calendarView"
      ) View
</template>

<script>
import { useRouter } from 'vue-router';
import {
  CalendarOutlined, TeamOutlined, LaptopOutlined, BankOutlined, LeftOutlined, SettingOutlined,
} from '@ant-design/icons-vue';
import DateTime from '@/components/DateTime';
import useStore from '@/store';

export default {
  components: {
    CalendarOutlined,
    TeamOutlined,
    LaptopOutlined,
    BankOutlined,
    LeftOutlined,
    SettingOutlined,
    DateTime,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
    calendarView: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();

    const handleBackToEvents = () => {
      router.push({ name: 'events' });
    };

    const handleViewEvent = () => {
      router.push({ name: 'event-view-settings', params: { id: props.item.id } });
    };

    return {
      props,
      handleBackToEvents,
      store,
      handleViewEvent,
    };
  },
};
</script>

<style scoped>

.ant-tag-has-color {
  color: #12406E !important;
}
</style>
