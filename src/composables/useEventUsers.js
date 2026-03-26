/* eslint-disable no-param-reassign */
import { reactive } from 'vue';
import { fetchEventUsers, saveEventUser, deleteEventUser } from '@/api';
import { includes, toUpper, deburr } from 'lodash';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { notification } from 'ant-design-vue';

export default function useEventUsers({
  event,
  printIcon,
}) {
  const state = reactive({
    event,
    eventUsers: [],
    simpleSearchData: [],
    currentEventUser: null,
    tabulator: null,
    deleteSuccessUserCount: 0,
    deleteErrorUserCount: 0,
    deleteErrorUserData: [],
    selectedUsers: [],
  });

  // eslint-disable-next-line max-len
  const filterProcess = (headerValue, rowValue) => !!(includes(deburr(toUpper(rowValue)), deburr(toUpper(headerValue))));

  const loadCheckinDate = (value) => {
    if (value) {
      return new Date(value).toLocaleDateString('es-ES').split('T')[0];
    }
    return null;
  };

  const editProcess = (cell) => {
    saveEventUser({
      eventUser: cell.getRow().getData(),
      eventId: event.id,
    })
      .then((response) => {
        if (cell.getColumn().getField() === 'dni') {
          state.tabulator.updateData([cell.getRow().getData(), response]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const convertDate = async (cell) => {
    if (!cell.getRow().getData().checkinTime) {
      cell.getRow().getData().checkinTime = new Date().toISOString();
    } else {
      cell.getRow().getData().checkinTime = '';
    }
    editProcess(cell);
    await state.tabulator.updateData([cell.getRow().getData()]);
  };

  const setTableLayout = () => {
    if (window.screen.width <= 639) {
      return 'fitDataFill';
    }
    return 'fitData';
  };

  const filterMobileView = (field, data) => {
    state.tabulator.setFilter(field, 'like', data);
  };

  const rowSelectorColumn = {
    formatter: 'rowSelection',
    titleFormatter() {
      return "<label for='select-all'> Sel. all</label><br><input type='checkbox' style='margin-left: 30px' id='select-all'>";
    },
    width: 100,
    hozAlign: 'center',
    headerSort: false,
  };

  const editButton = {
    formatter: printIcon,
    width: 100,
    headerSort: false,
    hozAlign: 'center',
    cellClick: (e, cell) => {
      state.currentEventUser = state.eventUsers.find(
        (element) => element.id === cell.getRow().getData().id,
      );
    },
  };

  const tabulatorTranslations = {
    'es-es': {
      pagination: {
        page_size: 'Cantidad por página',
        page_title: 'Ver página',
        first: 'Primera',
        first_title: 'Primera página',
        last: 'Última',
        last_title: 'Última página',
        next: 'Siguiente',
        next_title: 'Página siguiente',
        all: 'Todo',
      },
    },
  };

  const getColumns = () => {
    const columns = [
      rowSelectorColumn,
      {
        width: 90,
        title: 'Id',
        field: 'id',
        hozAlign: 'center',
      }];

    state.event.userFields.forEach((element) => {
      const userFieldsColumns = {
        title: element.fieldType.description + (element.required ? '*' : ''),
        field: element.fieldType.name,
        editor: element.fieldType.name === 'treatment' ? 'list' : true,
        editorParams: element.fieldType.name === 'treatment' ? { values: element.options } : undefined,
        validator: element.required ? 'required' : '',
        cellEdited: editProcess,
        headerFilter: window.screen.width <= 639 ? false : 'input',
        headerFilterFunc: filterProcess,
      };

      if (element.fieldType.name === 'mail') {
        userFieldsColumns.editor = false;
      }

      columns.push(userFieldsColumns);
    });

    columns.push(
      {
        title: 'Observations',
        field: 'observations',
        editor: true,
        cellEdited: editProcess,
        headerFilter: 'input',
        headerFilterFunc: filterProcess,
      },
      {
        title: 'Check in time',
        field: 'checkinTime',
        hozAlign: 'center',
        mutator: loadCheckinDate,
      },
      {
        title: 'Confirmed',
        field: 'confirmado',
        formatter: 'tickCross',
        hozAlign: 'center',
        editor: true,
        cellEdited: convertDate,
        headerFilter: 'tickCross',
        headerFilterParams: { tristate: true },
        mutator: (value, data) => !!data.checkinTime,
      },
      editButton,
    );

    return columns;
  };

  const openNotification = (type) => {
    if (type === 'error') {
      notification.error({
        message: 'Se ha producido un error',
        description: `No se ha podido eliminar ${state.deleteErrorUserCount} registros.`,
        duration: 0,
      });
    }
    if (type === 'success') {
      notification.success({
        description: `Se ha eliminado ${state.deleteSuccessUserCount} registros correctamente.`,
        duration: 0,
      });
    }
  };

  const handleAddUser = () => {
    state.currentEventUser = {};
  };

  const getSelectedUsers = () => {
    const activeRows = state.tabulator.getRows('active');
    state.selectedUsers = activeRows.filter((row) => row.isSelected()).map((row) => row.getData());
  };

  const loadTable = async () => {
    try {
      state.eventUsers = await fetchEventUsers({ eventId: event.id });

      state.eventUsers.forEach((element) => {
        if (element.inscriptionTime) {
          // eslint-disable-next-line prefer-destructuring
          element.inscriptionTime = new Date(element.inscriptionTime).toLocaleDateString('es-ES').split('T')[0];
        }
      });

      state.tabulator = new Tabulator('#event-users-list', {
        data: state.eventUsers,
        index: 'id',
        layout: setTableLayout(),
        autoResize: false,
        ...(window.screen.width <= 639 ? { pagination: false }
          : { pagination: true }),
        paginationAddRow: 'table',
        paginationSize: 10,
        paginationSizeSelector: [10, 50, 100, true],
        columns: getColumns(),
        locale: true,
        langs: tabulatorTranslations,
      });
    } catch (e) {
      state.error = true;
    }

    await state.tabulator.on('tableBuilt', () => {
      document.getElementById('select-all').addEventListener('change', (e) => {
        if (e.target.checked) {
          state.tabulator.selectRow();
        } else {
          state.tabulator.deselectRow();
        }
      });
    });

    state.tabulator.on('rowSelectionChanged', () => {
      getSelectedUsers();
    });
  };

  const deleteUsers = async () => {
    state.deleteErrorUserData = [];
    state.deleteErrorUserCount = 0;
    state.deleteSuccessUserCount = 0;
    await Promise.all(state.selectedUsers.map(async (eventUser) => {
      getSelectedUsers();
      try {
        await deleteEventUser({
          eventUserId: eventUser.id,
          eventId: state.event.id,
          eventUser,
        });
        loadTable();
        state.deleteSuccessUserCount += 1;
        state.selectedUsers = [];
      } catch (e) {
        state.deleteErrorUserData.push(JSON.parse(e.config.data));
        state.deleteErrorUserCount += 1;
      }
    }));
    if (state.deleteErrorUserCount > 0) {
      openNotification('error');
    }
  };

  return {
    state,
    loadTable,
    handleAddUser,
    filterProcess,
    filterMobileView,
    deleteUsers,
  };
}
