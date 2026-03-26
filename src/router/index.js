/* eslint-disable no-param-reassign */
import { createRouter, createWebHashHistory } from 'vue-router';
import routesNames from '@/router/constants';
import { fetchEvent } from '@/api';
import EventsView from '@/views/EventsView';
import EventView from '@/views/EventView';
import EventViewUsers from '@/views/EventViewUsers';
import EventViewSettings from '@/views/EventViewSettings';
import EventViewUserFieldsEditor from '@/views/EventViewUserFieldsEditor';
import EventViewPrivacyPolicy from '@/views/EventViewPrivacyPolicy';
import EventViewCheckIn from '@/views/EventViewCheckIn';
import EventViewImportUsers from '@/views/EventViewImportUsers';
import EventViewMarketingEmails from '@/views/EventViewMarketingEmails';

const routes = [
  {
    path: '/',
    name: 'events',
    component: EventsView,
  },
  {
    path: '/events/:id',
    name: 'event',
    component: EventView,
    meta: {
      event: null,
    },
    props: (route) => ({
      event: route.meta.event,
    }),
    children: [
      {
        path: 'settings',
        name: routesNames.EVENT_VIEW_SETTINGS,
        component: EventViewSettings,
        props: (route) => ({
          event: route.meta.event,
        }),
      },
      {
        path: 'user-fields-editor',
        name: routesNames.EVENT_VIEW_USER_FIELDS_EDITOR,
        component: EventViewUserFieldsEditor,
        props: (route) => ({
          event: route.meta.event,
        }),
      },
      {
        path: 'privacy-policy',
        name: routesNames.EVENT_VIEW_PRIVACY_POLICY,
        component: EventViewPrivacyPolicy,
        props: (route) => ({
          event: route.meta.event,
        }),
      },
      {
        path: 'check-in',
        name: routesNames.EVENT_VIEW_CHECK_IN,
        component: EventViewCheckIn,
        props: (route) => ({
          event: route.meta.event,
        }),
      },
      {
        path: 'users',
        name: routesNames.EVENT_VIEW_USERS,
        component: EventViewUsers,
        props: (route) => ({
          event: route.meta.event,
        }),
      },
      {
        path: 'import-users',
        name: routesNames.EVENT_VIEW_IMPORT_USERS,
        component: EventViewImportUsers,
        props: (route) => ({
          event: route.meta.event,
        }),
      },
      {
        path: 'marketing-emails',
        name: routesNames.EVENT_VIEW_MARKETING_EMAILS,
        component: EventViewMarketingEmails,
        props: (route) => ({
          event: route.meta.event,
        }),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const promises = [];

  const fetchEventAndSetMeta = () => {
    const event = fetchEvent();
    to.meta.event = event;
    return event;
  };

  switch (to.name) {
    case routesNames.EVENT_VIEW_SETTINGS:
      if (to.params.id === 'new') {
        promises.push(
          Promise.resolve({ speakers: [] }).then((event) => {
            to.meta.event = event;
            return event;
          }),
        );
      } else {
        promises.push(fetchEventAndSetMeta());
      }
      break;
    default:
      if (Object.values(routesNames).includes(to.name)) {
        promises.push(fetchEventAndSetMeta());
      }
      break;
  }

  if (promises.length) {
    await Promise.all(promises);
  }
});

export default router;
