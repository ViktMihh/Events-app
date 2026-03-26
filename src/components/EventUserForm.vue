<!-- eslint-disable yoda -->
<template lang="pug">
a-form.m-0(
  v-if="state.form"
  ref="formRef"
  name="user"
  :model="state"
  :label-col="{ span: 5 }"
  class="w-full sm:w-full"
  layout="horizontal"
  labelAlign="left"
  @finish="onFinish"
  @finishFailed="validateEmail"
)
  a-form-item.m-3.font-bold(
    label="Treatment"
    v-if="treatmentField"
  )
    a-radio-group.font-normal(
      v-model:value="state.eventUserTreatment"
      name="radioGroup"
      v-for="option in treatmentField.options"
    )
      a-radio(:value="option") {{ option }}
  a-form-item.m-3.font-bold(
    v-for="(field, idx) in state.form"
    :key="field.key"
    :name="['form', idx, field.key]"
    :label="field.label"
    :rules="field.rules"
    :wrapper-col="{ span: field.width }"
  )
    a-input.m-0(
      v-model:value="field[field.key]"
    )
  a-form-item.m-3.font-bold(
    label="Email"
    v-if="disableEmail"
  )
    a-tag.flex.items-start.h-8.m-0.mt-2.pl-3.leading-8.w-full(
      color="blue"
      class="text-[14px]"
    ) {{eventUser.mail}}
  slot
</template>
<script>
import useEventUserEditor from '@/composables/useEventUserEditor';
import { onMounted, ref } from 'vue';

export default {
  props: {
    eventUserFields: {
      type: Object,
      required: true,
    },
    eventUser: {
      type: Object,
      required: false,
      default() { return {}; },
    },
    disableEmail: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
    confirmMail: {
      type: Boolean,
      required: false,
      default() { return false; },
    },
  },
  emits: ['set-event-user'],
  setup(props, { emit }) {
    const {
      state,
      handleBuildForm,
      handleConvertUserData,
    } = useEventUserEditor({
      eventUser: props.eventUser,
    });
    const mailConfirmation = ref('');
    const validateEmailError = ref(false);
    const treatmentField = ref('');
    const excludedDisabledEmailFieldTypes = ['mail', 'treatment'];
    const excludedFormFieldTypes = ['treatment'];
    onMounted(() => {
      if (props.disableEmail) {
        handleBuildForm({
          eventUserFields: props.eventUserFields,
        }, excludedDisabledEmailFieldTypes);
      } else {
        handleBuildForm({
          eventUserFields: props.eventUserFields,
        }, excludedFormFieldTypes);
      }
      treatmentField.value = props.eventUserFields.find((field) => field.fieldTypeId === 1);
    });
    const formRef = ref();
    const validateEmail = (values) => {
      if (!props.confirmMail) return;
      const formMail = values.values.form.find((item) => item.mail);
      if (formMail.mail === mailConfirmation.value) {
        validateEmailError.value = false;
      } else {
        validateEmailError.value = true;
      }
    };
    const onFinish = (values) => {
      if (props.disableEmail) {
        values.form.push({ mail: props.eventUser.mail });
      }
      validateEmailError.value = false;
      emit('set-event-user', handleConvertUserData(values.form));
    };
    return {
      formRef,
      onFinish,
      state,
      props,
      mailConfirmation,
      validateEmail,
      validateEmailError,
      treatmentField,
    };
  },
};
</script>
