<template lang="pug">
.flex.justify-start.w-full.mb-4
  .flex.normal-case.text-2xl.font-bold.ml-6
    a-button(
      v-if="mobileScreen"
      @click="handleAddUser"
    )
      user-add-outlined.text-lg
    a-button(
      v-else
      @click="handleAddUser"
    ) Add...
    a-dropdown.ml-4
      template(
        #overlay
      )
        a-menu
          a-menu-item(
            @click="handleDownloadCSV"
          ) CSV
          a-menu-item(
            @click="handleDownloadExcel"
          ) XLSX
          a-menu-item(
            @click="handleDownloadPDF"
          ) PDF
      a-button
        span Download
        down-outlined
    a-button.ml-4(
      @click="state.showMailingModal = true"
      v-if="state.selectedUsers.length != 0"
    ) Mailing...
    a-button.ml-4(
      @click="state.showDeleteUsersModal = true"
      type="danger"
      v-if="state.selectedUsers.length != 0"
    ) Delete...
a-select(
  ref="select"
  v-model:value="mobileFilterField"
  v-if="mobileScreen"
  class="w-1/4 mr-4 mb-6"
)
  a-select-option(value="name") Name
  a-select-option(value="surname1") Surname
  a-select-option(value="mail") Email
a-input(
  v-model:value="mobileFilterData"
  type="text"
  @change="handleMobileViewFilter(mobileFilterField, mobileFilterData)"
  v-if="mobileScreen"
  class="w-2/4 mb-6"
)
.mx-4.w-full(
  class="h-[600px]"
  id="event-users-list"
)
a-collapse.mt-4.w-full(
  v-if="state.deleteErrorUserCount != 0"
  v-model:activeKey="activeKey"
)
  a-collapse-panel.w-full(
    key="1"
    header="A continuación se muestran los usuarios que no han podido ser eliminados correctamente:"
  )
    a-table(
      :columns="deleteErrorUserDataColumns"
      :data-source="state.deleteErrorUserData"
      :pagination="false"
      :rowClassName = "(record, index) => ('red')"
    )
event-user-modal(
  v-if="state.currentEventUser"
  :event="state.event"
  :eventUser="state.currentEventUser"
  @after-save="handleAfterSaveEventUser"
  @close="handleCloseEventModals('eventUserModal')"
)
event-delete-modal(
  v-if="state.showDeleteUsersModal"
  :message="deleteUsersMessage"
  @delete="handleDeleteUsers"
  @close="handleCloseEventModals('eventDeleteUsersModal')"
)
manual-event-mail-modal(
  v-if="state.showMailingModal"
  :selectedUsers="state.selectedUsers"
  :eventId="state.event.id"
  @after-save="handleAfterSaveEventUser"
  @close="handleCloseEventModals('eventMailingModal')"
)
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import EventUserModal from '@/components/EventUserModal';
import EventDeleteModal from '@/components/EventDeleteModal';
import ManualEventMailModal from '@/components/ManualEventMailModal';
import useEventUsers from '@/composables/useEventUsers';
import {
  ArrowLeftOutlined, VerticalAlignBottomOutlined, UserAddOutlined,
  ExclamationCircleOutlined, DownOutlined, ColumnWidthOutlined,
} from '@ant-design/icons-vue';

export default {
  components: {
    EventUserModal,
    EventDeleteModal,
    ArrowLeftOutlined,
    VerticalAlignBottomOutlined,
    UserAddOutlined,
    ExclamationCircleOutlined,
    DownOutlined,
    ManualEventMailModal,
    ColumnWidthOutlined,
  },
  props: {
    event: {
      type: Object,
      required: false,
      default: null,
    },
  },
  setup(props) {
    const printIcon = () => '<a-button class="bg-gray-400 p-1 text-white text-sm" >Edit</a-button>';
    const {
      state,
      loadTable,
      handleAddUser,
      filterMobileView,
      deleteUsers,
    } = useEventUsers({
      event: props.event,
      printIcon,
    });

    const mobileScreen = window.screen.width <= 639;
    const mobileFilterField = ref('');
    const mobileFilterData = ref('');
    const activeKey = ref(['1']);
    const deleteUsersMessage = computed(() => `¿Está seguro que desea eliminar ${state.selectedUsers.length} registro(s)?`);

    const deleteErrorUserDataColumns = [
      {
        title: 'Treatment',
        dataIndex: 'treatment',
        key: 'treatment',
      },
      {
        title: 'DNI',
        dataIndex: 'dni',
        key: 'dni',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Surname',
        dataIndex: 'surname1',
        key: 'surname1',
      },
      {
        title: 'Email',
        dataIndex: 'mail',
        key: 'mail',
      },
      {
        title: 'City',
        dataIndex: 'city',
        key: 'city',
      },
    ];

    const handleCloseEventModals = (type) => {
      switch (type) {
        case 'eventUserModal':
          state.currentEventUser = null;
          break;
        case 'eventDeleteUsersModal':
          state.showDeleteUsersModal = false;
          break;
        case 'eventMailingModal':
          state.showMailingModal = false;
          break;
        default:
          break;
      }
    };

    const handleCloseEventDeleteUsersModal = () => {
      state.showMailingModal = false;
    };

    const handleCloseEventUserModal = () => {
      state.currentEventUser = null;
    };

    const handleAfterSaveEventUser = async ({ eventUser, isNew }) => {
      if (isNew) {
        await state.tabulator.addRow(eventUser);
        loadTable();
        setTimeout(() => state.tabulator.setPage('last'), 500);
      } else {
        await state.tabulator.updateData([eventUser]);
      }
      handleCloseEventModals('eventUserModal');
    };

    onMounted(() => {
      loadTable();
    });

    const handleDownloadCSV = () => {
      state.tabulator.download('csv', 'data.csv');
    };

    const handleDownloadExcel = () => {
      state.tabulator.download('xlsx', 'data.xlsx', { sheetName: 'My Data' });
    };

    const handleDownloadPDF = () => {
      state.tabulator.download('pdf', 'data.pdf', {
        orientation: 'landscape',
        title: 'Inscritos',
      });
    };

    const handleMobileViewFilter = (field, data) => {
      filterMobileView(field, data);
    };

    const cancel = (e) => {
      console.log(e);
    };

    const handleDeleteUsers = () => {
      deleteUsers();
      state.showDeleteUsersModal = false;
    };

    const showImportUsersModal = ref(false);

    const handleImportUsers = () => {
      showImportUsersModal.value = true;
    };

    const handleCloseImportEventUserModal = () => {
      showImportUsersModal.value = false;
    };

    return {
      state,
      cancel,
      handleAddUser,
      handleAfterSaveEventUser,
      handleCloseEventModals,
      handleDownloadCSV,
      handleDownloadExcel,
      handleDownloadPDF,
      mobileScreen,
      handleMobileViewFilter,
      mobileFilterField,
      mobileFilterData,
      deleteErrorUserDataColumns,
      handleDeleteUsers,
      handleCloseEventDeleteUsersModal,
      handleImportUsers,
      showImportUsersModal,
      handleCloseImportEventUserModal,
      handleCloseEventUserModal,
      activeKey,
      deleteUsersMessage,
    };
  },
};
</script>

<style>

#event-users-list .tabulator-row.tabulator-selected{
 background-color:#ececec !important;
}

#event-users-list .tabulator-row.tabulator-selectable.tabulator-row-odd.tabulator-selected >
.tabulator-cell.tabulator-frozen {
  background-color:#ececec !important;
}

#event-users-list .tabulator-row.tabulator-selectable.tabulator-row-even.tabulator-selected >
.tabulator-cell.tabulator-frozen {
  background-color:#ececec !important;
}

.visible {
  background-color: #fff !important;
  border: 1px solid #fff !important;
}

.red {
  color: red;
}

.tabulator-popup-container {
  top: 300px !important;
}
.tabulator-frozen {
  background-color: white !important;
  position: sticky !important;
}
</style>;
