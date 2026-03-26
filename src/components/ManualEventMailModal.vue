<template lang="pug">
a-modal(
  okType="default"
  title="Send emails"
  :visible="true"
  centered
  :footer="null"
  :class="state.modalWidth"
  @cancel="closeModal"
)
  a-form.px-4(
    ref="formRef"
    name="mailing"
    :model="state"
    :wrapper-col="{ span: 0 }"
    layout="vertical"
    @finish="handleFinish"
  )
    .mb-2 The email will be sent to the following addresses:
    .overflow-auto.mb-4(
      class="max-h-[150px]"
    )
      a-list(
        class="w-full"
        size="small"
        bordered
        :data-source="state.users"
      )
        template(
          #renderItem="{ item }"
        )
          a-list-item.flex.justify-start
            .w-14 {{ item.id }}
            div {{ item.mail }}
    div Total: {{ state.selectedUsersLength }}
    a-divider
    a-form-item.mb-2.w-full.flex.justify-end
      a-button.absolute.bottom-1.right-5(
        html-type="submit"
        :loading="state.loading"
      ) Enviar
    a-alert(
      v-if="state.success"
      message="Sent!"
      type="success"
    )
    div.p-4(
      class="bg-[#FFF2F0]"
      v-if="state.error"
    )
      .flex.justify-between.items-center
        div The following emails could not be sent
        a-button(
          @click="handleViewErrorDetails()"
        ) See details
      a-table.mt-2(
        class="w-full"
        v-if="state.viewErrorDetails"
        :dataSource="state.sentMailErrors"
        :columns="columns"
        :pagination="false"
      )
</template>

<script>
import { reactive, onMounted } from 'vue';
import { fetchEventMails, sendEventMail } from '@/api';
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-promise-executor-return */

export default {
  components: {
  },
  props: {
    eventId: {
      type: Number,
      required: true,
    },
    selectedUsers: {
      type: Array,
      required: true,
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const state = reactive({
      eventMails: null,
      emailTypes: null,
      eventMail: null,
      users: props.selectedUsers,
      selectedUsersLength: props.selectedUsers.length,
      viewErrorDetails: false,
      sentMailResults: [],
      sentMailErrors: [],
      success: false,
      error: false,
      modalWidth: 'w-1/4 sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2',
    });

    const closeModal = () => {
      emit('close', 'eventMailingModal');
    };

    const handleViewErrorDetails = () => {
      state.viewErrorDetails = !state.viewErrorDetails;
      state.modalWidth = 'w-1/2 sm:w-full md:w-full lg:w-full xl:w-full 2xl:w-3/4';
    };

    const getEventMailsTypes = async () => {
      state.eventMails = await fetchEventMails({ eventId: props.eventId });
      state.emailTypes = state.eventMails.map((item) => ({
        label: `${item.type} - ${item.subject}`,
        value: item.id,
      }));
    };

    const handleFinish = async () => {
      state.loading = true;
      let count = 0;
      for (const user of state.users) {
        try {
          const result = await sendEventMail({ mailId: state.eventMail, userMail: user.mail });
          state.sentMailResults.push(result);
        } catch (error) {
          state.sentMailResults.push(error.response.data);
        }
        count += 1;
        if (count % 9 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      state.success = state.sentMailResults.every((item) => item.status === 'success');
      state.error = state.sentMailResults.some((item) => item.status === 'error');
      if (state.error) {
        state.sentMailErrors = state.sentMailResults.filter((item) => item.status === 'error');
      }
      state.loading = false;
    };

    onMounted(() => {
      getEventMailsTypes();
    });

    const columns = [
      { title: 'Mail', dataIndex: 'user_mail', key: 'user_mail' },
      {
        title: 'Error',
        dataIndex: 'message',
        key: 'message',
      },
    ];

    const handleTypeChange = () => {
      state.success = false;
      state.error = false;
    };

    return {
      state,
      handleFinish,
      handleTypeChange,
      closeModal,
      handleViewErrorDetails,
      columns,
    };
  },
};
</script>

<style scoped>
.card-container{
  height: 550px;
}
.error-content {
  max-width: 615px;
  max-height: 100px;
  overflow: auto;
  white-space: pre-wrap;
  border: 1px solid #ddd;
  padding: 5px;
}

::v-deep(.ant-table-tbody > tr > td) {
  background-color: #f8f9fa !important;
}
</style>
