/* eslint-disable max-len */
import { reactive } from 'vue';

export default function useEventUserEditor({
  eventUser,
}) {
  const state = reactive({
    form: null,
    filteredEventUserFields: null,
    eventUserTreatment: eventUser.treatment,
  });

  const handleBuildForm = ({ eventUserFields }, excludedFieldTypes = []) => {
    state.filteredEventUserFields = eventUserFields.filter(
      ({ fieldType: { name } }) => !excludedFieldTypes.includes(name),
    );

    state.form = state.filteredEventUserFields.map((item) => ({
      key: item.fieldType.name,
      label: item.fieldType.description,
      [item.fieldType.name]: eventUser[item.fieldType.name],
      rules: [
        {
          required: !!item.required,
          message: 'Please fill in the field',
        },
      ],
      width: item.fieldType.name === 'dni' || item.fieldType.name === 'phone' ? 5 : '',
    }));
  };

  const handleConvertUserData = (values) => {
    const userDataArray = [];
    values.forEach((element, i) => {
      userDataArray[i] = Object.entries(element);
    });
    const userData = {};
    userDataArray.forEach((element) => {
      const key = element[0][0];
      const value = element[0][1];
      userData[key] = value;
    });
    return {
      id: eventUser.id,
      treatment: state.eventUserTreatment,
      checkinTime: eventUser.checkinTime,
      observations: eventUser.observations,
      ...userData,
    };
  };

  return {
    state,
    handleBuildForm,
    handleConvertUserData,
  };
}
