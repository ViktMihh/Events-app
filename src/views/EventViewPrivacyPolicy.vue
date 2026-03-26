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
    name="privacyPolicyCaption"
    label="Caption text"
    extra="Text displayed next to the privacy policy acceptance checkbox"
  )
    a-textarea(
      v-model:value="state.privacyPolicyCaption" :rows="2"
    )
  a-form-item.mt-10(
    name="privacyPolicyCaption"
    label="Privacy policy"
  )
    a-textarea(
      :rows="14"
      v-model:value="state.privacyPolicy"
      id="editor"
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
import { onMounted, unref, ref } from 'vue';
import useEventEditor from '@/composables/useEventEditor';
import suneditor from 'suneditor';
import lang from 'suneditor/src/lang';
import plugins from 'suneditor/src/plugins';

export default {
  components: {
  },
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

    const textEditor = ref();

    const initEditor = () => {
      textEditor.value = suneditor.create((document.getElementById('editor')), {
        plugins,
        buttonList: [
          ['undo', 'redo'],
          ['font', 'fontSize'],
          ['bold', 'underline', 'italic', 'strike'],
          ['outdent', 'indent'],
          ['align', 'list', 'table'],
          ['codeView', 'removeFormat'],
        ],
        lang: lang.es,
      });
    };

    const handleFinish = async () => {
      eventEditor.state.privacyPolicy = textEditor.value.getContents();
      await handleSaveEvent({
        item: unref(eventEditor.state),
        showNotification: true,
      });
    };

    onMounted(() => {
      initEditor();
    });

    return {
      handleFinish,
      eventEditor,
      state: eventEditor.state,
    };
  },
};
</script>
