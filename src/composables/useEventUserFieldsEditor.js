import { reactive } from 'vue';
import { fetchUserFieldTypes } from '@/api';

export default function useEventUserFieldsEditor({ eventUserFields = [] }) {
  const state = reactive({
    data: [],
    loading: false,
    eventUserFields,
  });

  const eventUserFieldsToView = (eventFieldTypes, _eventUserFields) => {
    const result = eventFieldTypes.map((fieldType) => {
      const eventUserField = _eventUserFields.find(
        (_eventUserField) => _eventUserField.fieldTypeId === fieldType.id,
      );

      let required = eventUserField && !!eventUserField.required;
      let enabled = !!eventUserField;
      let disabled = false;

      if ([3, 4, 10].includes(fieldType.id)) {
        required = true;
        enabled = true;
        disabled = true;
      }

      return {
        fieldType: {
          ...fieldType,
        },
        required,
        enabled,
        disabled,
        eventId: eventUserField && eventUserField.eventId,
      };
    });

    return result;
  };

  const eventUserFieldsFromView = () => {
    const filtered = state.data.filter(
      (item) => item.enabled || (item.enabled && item.required),
    );
    const result = filtered.map(({
      eventId, fieldType, required,
    }) => ({
      eventId,
      fieldTypeId: fieldType.id,
      required: required ? '1' : '0',
    }));

    return result;
  };

  const loadEventUserFields = async () => {
    try {
      state.loading = true;
      const userFieldTypes = await fetchUserFieldTypes();
      state.data = eventUserFieldsToView(userFieldTypes, state.eventUserFields);
    } catch (e) {
      console.log(e);
    } finally {
      state.loading = false;
    }
  };

  return {
    eventUserFieldsFromView,
    eventUserFields: state,
    loadEventUserFields,
  };
}
