<!-- eslint-disable max-len -->
<template lang="pug">
the-header
a-layout.min-h-screen
  event-card.rounded-none(
    v-if="props.event"
    :item="storeEvent"
  )
  a-layout(
    style="background:#f7f7f7"
  )
    a-layout-sider(
      width="250"
      style="background:#f3f4f6"
    )
      a-menu(
        mode="inline"
        :style="{ height: '100%', borderRight: 0 }"
        v-model:openKeys="store.openKeys"
        v-model:selectedKeys="store.selectedKeys"
        @click="handleTabView"
      )
        a-sub-menu(
          key="sub1"
        )
          template(
            #title
          )
            carry-out-outlined
            span Event
          a-menu-item(
            key="1"
          ) {{sidebarTabs[1]}}
          a-menu-item(
            key="2"
            v-if="props.event.id"
          ) {{sidebarTabs[2]}}
          a-menu-item(
            key="3"
            v-if="props.event.id"
          ) {{sidebarTabs[3]}}
          a-menu-item(
            key="4"
            v-if="props.event.id"
          ) {{sidebarTabs[4]}}
          a-menu-item(
            key="5"
            v-if="props.event.id"
          ) {{sidebarTabs[5]}}
        a-sub-menu(
          key="sub2"
          v-if="props.event.id"
        )
          template(#title)
            team-outlined
            span(v-if="props.event.projectType === '1'") {{ `Users (${props.event.userCount})` }}
          a-menu-item(key="6") {{sidebarTabs[6]}}
          a-menu-item(key="7") {{sidebarTabs[7]}}
    a-layout-content.p-5.h-full
      a-breadcrumb.flex.justify-start
        a-breadcrumb-item
          router-link(
           :to="'/'"
          ) Home
        a-breadcrumb-item {{store.selectedKeys < 6 ? 'Event' : 'Users'}}
        a-breadcrumb-item {{ sidebarTabs[store.selectedKeys] }}
      a-divider
      .mx-auto.container.bg-white.overflow-auto.w-full
        a-card(
          :loading="loading"
        )
          router-view
</template>
<script>
import EventCard from '@/components/EventCard';
import { TeamOutlined, QuestionCircleOutlined, CarryOutOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { ref, reactive, onMounted } from 'vue';
import useStore from '@/store';
import routesNames from '@/router/constants';
import TheHeader from '@/components/TheHeader';

export default {
  components: {
    EventCard,
    TeamOutlined,
    QuestionCircleOutlined,
    CarryOutOutlined,
    TheHeader,
  },
  props: {
    event: {
      type: Object,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const loading = ref(false);

    const sidebarTabs = reactive({
      1: 'General Information',
      2: 'Registration fields',
      3: 'Privacy policy',
      4: 'Marketing emails',
      5: 'Check-in',
      6: 'Users list',
      7: 'Import users',
    });

    const handleTabView = async (e) => {
      loading.value = true;

      const tabActions = {
        1: { route: routesNames.EVENT_VIEW_SETTINGS, subKey: 'sub1' },
        2: { route: routesNames.EVENT_VIEW_USER_FIELDS_EDITOR, subKey: 'sub1' },
        3: { route: routesNames.EVENT_VIEW_PRIVACY_POLICY, subKey: 'sub1' },
        4: { route: routesNames.EVENT_VIEW_MARKETING_EMAILS, subKey: 'sub1' },
        5: { route: routesNames.EVENT_VIEW_CHECK_IN, subKey: 'sub1' },
        6: { route: routesNames.EVENT_VIEW_USERS, subKey: 'sub2' },
        7: { route: routesNames.EVENT_VIEW_IMPORT_USERS, subKey: 'sub2' },
        default: { route: routesNames.EVENT_VIEW_SETTINGS },
      };

      const action = tabActions[e.key] || tabActions.default;

      await router.push({ name: action.route });

      store.openKeys = [action.subKey];
      store.selectedKeys = [e.key];

      loading.value = false;
    };

    const breadcrumbRoutes = ref([{
      path: 'home',
      breadcrumbName: 'Home',
    }]);

    onMounted(() => {
      const {
        projectCode, name, startDate, finishDate, projectType,
      } = props.event;

      Object.assign(store.event, {
        id: props.event.id, projectCode, name, startDate, finishDate, projectType,
      });
    });

    return {
      props,
      handleTabView,
      store,
      sidebarTabs,
      breadcrumbRoutes,
      loading,
      storeEvent: store.event,
    };
  },
};
</script>
