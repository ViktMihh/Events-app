import { reactive } from 'vue';
import { saveEvent } from '@/api';
import { notification } from 'ant-design-vue';

export default function useEventEditor({
  event,
}) {
  const eventEditor = reactive({
    state: { ...event },
    savedEvent: null,
    error: false,
    fields: [],
    loading: false,
    textEditor: null,
  });

  const baseURL = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

  const openNotification = (type) => {
    if (type === 'error') {
      notification[type]({
        message: 'Error',
        description: 'Se ha producido un error.',
      });
    }
    if (type === 'success') {
      notification[type]({
        message: 'Guardado',
        description: 'Se ha guardado correctamente',
      });
    }
  };

  const handleSaveEvent = async ({ item, showNotification }) => {
    eventEditor.loading = true;
    const eventToSave = { ...item };
    try {
      if (!eventToSave.id) {
        eventToSave.userFields = [
          {
            fieldTypeId: 3,
            required: 1,
          },
          {
            fieldTypeId: 4,
            required: 1,
          },
          {
            fieldTypeId: 10,
            required: 1,
          }];
      }
      eventEditor.savedEvent = await saveEvent(eventToSave);
      if (showNotification) openNotification('success');
    } catch (e) {
      eventEditor.error = true;
      eventEditor.loading = false;
      if (showNotification) openNotification('error');
    } finally {
      eventEditor.loading = false;
    }
  };

  return {
    baseURL,
    eventEditor,
    handleSaveEvent,
    openNotification,
  };
}
