<!-- eslint-disable max-len -->
<template lang="pug">
.flex.flex-col.p-5
  p.flex.justify-start.font-mono.text-gray-500 The following fields have been enabled for this event. Please note that you can edit them on the “Details” tab. Click the “Download Template” button to download a CSV file:
  div.flex.flex-col
    .overflow-auto.mb-4(
      class="max-w-full"
    )
      a-table.mt-5(
        class="table"
        :columns="state.columns"
      )
    a-button.my-4.w-44(
      @click="handleCreateCSV"
    ) Download template
  p.flex.justify-start.font-mono.text-gray-500.mt-5 Use the ‘Select File’ button to upload a CSV file containing the users you want to register:
  input(
    type="file"
    name="csv"
    @change="handleChange"
  )
  a-alert.mt-5.text-center(
    v-if="state.error"
    message="Se ha producido un error. Inténtelo de nuevo más tarde"
    type="error"
  )
  div(v-if="state.loading")
    a-alert.mt-5.text-center(
      message="Procesando información..."
      type="info"
    )
    a-skeleton(
      :loading="state.loading"
      :active="state.loading"
    )
  div(v-if="!state.loading")
    a-alert.mt-5.text-center(
      v-if="state.bool"
      message="Los usuarios de la siguiente tabla se han registrado correctamente."
      type="success"
    )
    .overflow-auto.mb-4(
      class="max-w-full max-h-[200px]"
    )
      a-table.mt-5(
        v-if="state.bool"
        :dataSource="state.dataSource"
        :columns="state.columns"
        style="color: green;"
        :scroll="{ y: 150 }"
      )
    a-alert.mt-5.text-center(
      v-if="state.bool2"
      message="Los usuarios de la siguiente tabla NO se han registrado correctamente."
      type="error"
    )
    .mb-4(
      class="max-w-full max-h-[200px]"
    )
      a-table.mt-5(
        v-if="state.bool2"
        :dataSource="state.dataSource2"
        :columns="state.columns2"
        :pagination="false"
        style="color: red;"
        :scroll="{ y: 150 }"
      )
    a-button.my-5(
      v-if="state.bool2"
      @click="handleCreateCSVBadRequest()"
    ) Download errors
</template>

<script>
import { onMounted } from 'vue';
import useImportEventUsers from '@/composables/useImportEventUsers';

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
      state,
      handleChange,
      handleColumns,
      handleCreateCSV,
      handleCreateCSVBadRequest,
    } = useImportEventUsers({
      event: props.event,
    });

    onMounted(() => {
      handleColumns();
    });

    return {
      state,
      handleChange,
      handleCreateCSV,
      handleCreateCSVBadRequest,
    };
  },
};
</script>

<style>
.table .ant-pagination{
  display: none;
}
.table .ant-table-placeholder{
  display: none;
}
</style>
