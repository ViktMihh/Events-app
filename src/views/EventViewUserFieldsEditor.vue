<template lang="pug">
.bg-white
  table(
    v-if="!eventUserFields.loading"
  )
    thead.mt-5
      tr
        th.px-8.text-left(
          class="sm:px-0"
        ) Field
        th.px-8(
          class="sm:px-2"
        ) Enabled
        th.px-8(
          class="sm:px-4"
        ) Required
        th.px-8(
          class="sm:px-4"
        ) Options
    tbody
      tr(v-for="eventUserField in eventUserFields.data")
        td.text-left.py-1.px-8(
          class="sm:px-0 sm:text-xs"
        ) {{eventUserField.fieldType.description}}
        td.py-1.px-14(
          class="sm:px-8"
        )
          a-checkbox(
            v-model:checked="eventUserField.enabled"
            :disabled="eventUserField.disabled"
            @change="handleClickEnabled(eventUserField)"
          )
        td.py-2.px-14(
          class="sm:px-10"
        )
          a-checkbox(
            v-model:checked="eventUserField.required"
            :disabled="eventUserField.disabled"
            @change="handleClickRequired(eventUserField)"
          )
        td.py-1.px-8(
          class="sm:px-0 sm:text-xs"
        )
          a-select(
            v-if="eventUserField.fieldType.id === 1"
            v-model:value="treatmentOptions"
            style="width: 250px"
            mode="multiple"
            placeholder="Seleccione tratamiento"
            :options="defaultTreatmentOptions.map((option) => ({value: option}))"
            :disabled="!eventUserField.enabled"
            @change="handleAddTreatmentOption"
          )
  br
  .flex.justify-end
      a-button(
        :disabled="eventEditor.loading"
        @click="setUserFields"
        type="primary"
      ) Save
</template>

<script>
import { onMounted, unref, ref } from 'vue';
import useEventUserFieldsEditor from '@/composables/useEventUserFieldsEditor';
import useEventEditor from '@/composables/useEventEditor';

export default {
  props: {
    event: {
      type: Object,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const {
      eventEditor,
      handleSaveEvent,
    } = useEventEditor({
      event: props.event,
    });

    const {
      eventUserFields,
      loadEventUserFields,
      eventUserFieldsFromView,
    } = useEventUserFieldsEditor({
      eventUserFields: props.event.userFields,
    });

    const defaultTreatmentOptions = ['Dr.', 'Dra.', 'Sr.', 'Sra.'];
    const treatmentOptions = ref([]);
    const treatmentField = eventUserFields.eventUserFields.find((field) => field.fieldTypeId === 1);
    if (treatmentField && treatmentField.options.length > 0) {
      treatmentOptions.value = treatmentField.options;
    } else {
      treatmentOptions.value = defaultTreatmentOptions;
    }

    const saveEventUserFields = async () => {
      await handleSaveEvent({
        item: unref(eventEditor.state),
        showNotification: true,
      });
    };

    const handleAddTreatmentOption = () => {
      eventEditor.state.userFields.forEach((field) => {
        const eventField = field;
        if (eventField.fieldTypeId === 1) {
          eventField.options = treatmentOptions.value;
        }
      });
    };

    const setUserFields = () => {
      eventEditor.state.userFields = eventUserFieldsFromView();
      handleAddTreatmentOption();
      saveEventUserFields();
    };

    const handleClickEnabled = (eventUserField) => {
      // eslint-disable-next-line no-param-reassign
      eventUserField.required = false;
    };

    const handleClickRequired = (eventUserField) => {
      // eslint-disable-next-line no-param-reassign
      eventUserField.enabled = true;
    };

    onMounted(() => {
      loadEventUserFields();
    });

    return {
      eventUserFields,
      eventEditor,
      handleClickEnabled,
      handleClickRequired,
      defaultTreatmentOptions,
      handleAddTreatmentOption,
      treatmentOptions,
      setUserFields,
    };
  },
};
</script>
