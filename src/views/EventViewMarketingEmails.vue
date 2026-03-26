<template lang="pug">
a-form(
  ref="formRef"
  name="event"
  :model="state"
  layout="horizontal"
  labelAlign="right"
  :label-col="{ span: 4 }"
  @finish="handleFinish"
)
  a-form-item.mb-0.mt-4(
    name="marketingEmailsCaption"
    label="Caption text"
    :extra="extraText"
  )
    a-textarea(
      v-model:value="state.marketingEmailsCaption" :rows="2"
    )
  br
  .flex.justify-end
    a-form-item
      a-button(
        :disabled="eventEditor.loading"
        html-type="submit"
        type="primary"
      ) Save
</template>

<script>
import { unref } from 'vue';
import useEventEditor from '@/composables/useEventEditor';

export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const {
      eventEditor,
      handleSaveEvent,
    } = useEventEditor({
      event: props.event,
    });

    const extraText = 'Text displayed next to the checkbox for agreeing to receive communications via email';

    const handleFinish = async () => {
      await handleSaveEvent({
        item: unref(eventEditor.state),
        showNotification: true,
      });
    };

    return {
      handleFinish,
      eventEditor,
      state: eventEditor.state,
      extraText,
    };
  },
};
</script>
