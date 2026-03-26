import { saveEventUser } from '@/api';
import { reactive } from 'vue';

export default function useEventUserModalEditor({
  event,
  eventUser,
}) {
  const state = reactive({
    eventUser,
    loading: false,
    error: false,
    errorCode: '',
  });

  const handleSaveEventUser = async () => {
    state.error = false;
    state.loading = true;
    try {
      state.eventUser = await saveEventUser({
        eventUser: state.eventUser,
        eventId: event.id,
      });
    } catch (e) {
      state.errorCode = e.response.data.error;
      state.error = true;
    } finally {
      state.loading = false;
    }

    return null;
  };

  return {
    state,
    handleSaveEventUser,
  };
}
