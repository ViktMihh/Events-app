<template lang="pug">
a-modal(
  okType="default"
  :title="eventUser.id ? 'Edit user' : 'Add user'"
  :visible="true"
  centered
  :footer="null"
  class="w-2/5 sm:w-full"
  @cancel="handleCloseModal"
)
  event-user-form(
    :eventUserFields="event.userFields"
    :eventUser="eventUser"
    :disableEmail="eventUser.id ? true : false"
    @set-event-user="handleSetEventUser"
  )
    a-form-item.m-3.font-bold(
      label="Observations"
    )
      a-textarea(
        v-model:value="eventUser.observations"
      )
    a-form-item.font-bold.m-3(
      v-if="eventUser.inscriptionTime"
      label="Inscription time"
    )
      a-tag {{ eventUser.inscriptionTime }}
    a-form-item.m-3.font-bold(
      label="Confirmed"
      html-for="confirmed_checkbox"
    )
      a-checkbox(
        id="confirmed_checkbox"
        v-model:checked="confirmedCheck"
        @click="handleChangeCheckinTime"
      )
    a-form-item.m-3.font-bold(
      label="Emails marketing"
      html-for="emails_checkbox"
    )
      a-checkbox(
        id="emails_checkbox"
        v-model:checked="emailsMarketingCheck"
        @change="handleChangeOptInMarketingEmails"
      )
    error-save-user-message(
      v-if="state.error"
      :errorCode="state.errorCode"
    )
    a-form-item
      a-button.absolute.right-0(
        html-type="submit"
        :disabled="state.loading"
        type="primary"
      ) Save
</template>

<script>
import EventUserForm from '@/components/EventUserForm';
import ErrorSaveUserMessage from '@/components/ErrorSaveUserMessage';
import useEventUserModalEditor from '@/composables/useEventUserModalEditor';
import { notification } from 'ant-design-vue';
import { ref } from 'vue';

export default {
  components: {
    EventUserForm,
    ErrorSaveUserMessage,
  },
  props: {
    event: {
      type: Object,
      required: true,
    },
    eventUser: {
      type: Object,
      required: true,
    },
  },
  emits: ['after-save', 'close'],
  setup(props, { emit }) {
    const {
      state,
      handleSaveEventUser,
    } = useEventUserModalEditor({
      event: props.event,
      eventUser: props.eventUser,
    });
    const confirmedCheck = ref(!!props.eventUser.checkinTime);
    const emailsMarketingCheck = ref(!!props.eventUser.optInMarketingEmails);

    const handleCloseModal = () => {
      emit('close');
    };

    const openNotification = (type) => {
      notification[type]({
        message: 'Error!',
        description: 'Se ha producido un error.',
      });
    };

    const handleSetEventUser = async (eventUser) => {
      const isNew = !eventUser.id;
      state.eventUser = { ...state.eventUser, ...eventUser };
      if (eventUser.checkinTime) {
        state.eventUser.checkinTime = new Date().toISOString();
      }
      await handleSaveEventUser();

      if (!state.error) {
        state.eventUser.confirmado = true;
        emit('after-save', { eventUser: state.eventUser, isNew });
      }
    };

    const handleChangeCheckinTime = (e) => {
      if (e.target.checked) {
        state.eventUser.checkinTime = new Date().toISOString();
      } else {
        state.eventUser.checkinTime = '';
      }
    };

    const handleChangeOptInMarketingEmails = (e) => {
      if (e.target.checked) {
        state.eventUser.optInMarketingEmails = 1;
      } else {
        state.eventUser.optInMarketingEmails = 0;
      }
    };

    return {
      state,
      props,
      confirmedCheck,
      emailsMarketingCheck,
      handleSetEventUser,
      handleCloseModal,
      openNotification,
      handleChangeCheckinTime,
      handleChangeOptInMarketingEmails,
    };
  },
};
</script>
