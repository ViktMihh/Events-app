import { ref, reactive } from 'vue';
import { downloadCsv, handleUsersImportErrors } from '@/util';
import { saveEventUsers } from '@/api';

export default function useImportEventUsers({
  event,
}) {
  const state = reactive({
    event,
    dataSource: [],
    dataSource2: [],
    bool: false,
    bool2: false,
    loading: false,
    columns: [],
    columns2: [],
    error: false,
  });

  const handleCreateCSV = () => {
    const fields = ref(['observations']);
    event.userFields.forEach((element) => {
      fields.value.unshift(element.fieldType.name);
    });
    downloadCsv(fields.value, [], 'file.csv');
  };

  const handleCreateCSVBadRequest = () => {
    const fieldsWithError = Object.keys(state.dataSource2[0]);
    const fields = fieldsWithError.filter((element) => element !== 'error');
    // eslint-disable-next-line no-param-reassign
    state.dataSource2.map((element) => delete element.error);
    const cells = state.dataSource2.filter((element) => Object.values(element));
    downloadCsv(fields, cells, 'file.csv');
  };

  const handleTables = (users) => {
    state.dataSource = users.filter((element) => element.error === undefined);
    // eslint-disable-next-line max-len
    state.dataSource2 = users.filter((element) => element.error !== null && element.error !== undefined);
    state.dataSource2.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      element.error = handleUsersImportErrors(element.error);
    });

    if (state.dataSource.length > 0) {
      state.bool = true;
    }
    if (state.dataSource2.length > 0) {
      state.bool2 = true;
    }
  };

  const handleChange = async (e) => {
    if (e.target.files.length) {
      state.loading = true;
      state.bool = false;
      state.bool2 = false;
      const formData = new FormData();
      formData.append('file.csv', e.target.files[0]);
      try {
        const users = await saveEventUsers(
          formData,
          event.id,
        );
        handleTables(users);
      } catch (error) {
        state.error = true;
        console.log(error);
      } finally {
        state.loading = false;
      }
    }
  };

  const handleColumns = () => {
    const fields = ['observations'];
    event.userFields.forEach((element) => {
      fields.push(element.fieldType.name);
    });
    fields.forEach((element) => {
      state.columns.unshift(
        {
          title: element.charAt(0).toUpperCase() + element.slice(1),
          dataIndex: element,
          key: element,
        },
      );
    });
    Object.assign(state.columns2, state.columns);
    state.columns2.push({
      title: 'Error',
      dataIndex: 'error',
      key: 'error',
    });
  };

  return {
    state,
    handleChange,
    handleColumns,
    handleCreateCSV,
    handleCreateCSVBadRequest,
  };
}
