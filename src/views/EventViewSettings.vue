<!-- eslint-disable max-len -->
<template lang="pug">
a-form(
  ref="formRef"
  name="event"
  :model="state"
  :rules="formRules"
  layout="horizontal"
  labelAlign="right"
  :label-col="{ span: 4 }"
  @finish="handleFinish"
)
  a-form-item.mt-4(
    name="projectCode"
    label="Código de proyecto"
    :wrapper-col="{ span: 2 }"
  )
    a-input(
      v-model:value="state.projectCode"
    )
  a-form-item(
    name="name"
    label="Name"
  )
    a-input(
      v-model:value="state.name"
    )
  a-form-item(
    name="description"
    label="Description"
  )
    a-textarea(
      v-model:value="state.description"
    )
  a-form-item(
    name="projectType"
    label="Type"
    :wrapper-col="{ span: 3 }"
  )
    a-select(
      v-model:value='state.projectType'
    )
      a-select-option(
        :value="EVENT_TYPE.ONSITE"
      ) On-site
      a-select-option(
        :value="EVENT_TYPE.ONLINE"
      ) Online
  a-form-item(
    name="startDate"
    label="Start date"
    :wrapper-col="{ span: 5 }"
  )
    a-date-picker(
      type="datetime"
      v-model:value="state.startDate"
      show-time
      format="DD-MM-YYYY HH:mm"
      value-format="YYYY-MM-DD HH:mm:ss"
    )
      a-input(
        type="date"
        v-model:value="state.startDate"
      )
  a-form-item(
    name="finishDate"
    label="End date"
    :wrapper-col="{ span: 5 }"
  )
    a-date-picker(
      type="datetime"
      v-model:value="state.finishDate"
      show-time
      format="DD-MM-YYYY HH:mm"
      value-format="YYYY-MM-DD HH:mm:ss"
    )
  br
  .flex.justify-end
    a-form-item
      a-button(
        :disabled="loading"
        html-type="submit"
        type="primary"
      ) Save
</template>
<script>
import useStore from '@/store';
import { useRouter, useRoute } from 'vue-router';
import { ref, unref } from 'vue';
import useEventEditor from '@/composables/useEventEditor';

const EVENT_TYPE = {
  ONLINE: '1',
  ONSITE: '0',
};
export default {
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
    const route = useRoute();

    const {
      eventEditor,
      handleSaveEvent,
    } = useEventEditor({
      event: props.event,
    });

    const formRef = ref();
    const formRules = {
      projectCode: [
        {
          required: false,
          message: 'Rellene el campo',
          trigger: 'blur',
        },
      ],
      name: [
        {
          required: true,
          message: 'Rellene el campo',
          trigger: 'blur',
        },
      ],
      projectType: [
        {
          required: true,
          message: 'Elija una modalidad',
          trigger: 'blur',
        },
      ],
      startDate: [
        {
          required: true,
          message: 'Seleccione la fecha de inicio',
          trigger: 'blur',
        },
      ],
    };

    const handleFinish = async () => {
      await handleSaveEvent({
        item: unref(eventEditor.state),
        showNotification: true,
      });
      if (!eventEditor.error && route.path.includes('new')) {
        router.push({ path: `/events/${eventEditor.savedEvent.id}/settings` }).then(() => { router.go(); });
      }
      if (!eventEditor.error) {
        store.event.projectCode = eventEditor.state.projectCode;
        store.event.name = eventEditor.state.name;
        store.event.startDate = eventEditor.state.startDate;
        store.event.finishDate = eventEditor.state.finishDate;
        store.event.projectType = eventEditor.state.projectType;
      }
    };

    return {
      formRef,
      formRules,
      EVENT_TYPE,
      loading: eventEditor.loading,
      state: eventEditor.state,
      handleFinish,
      store,
    };
  },
};
</script>
<style scoped>
.card-container {
  height: 550px;
}
</style>
