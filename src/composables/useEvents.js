import { reactive, watch } from 'vue';
import { includes, toUpper, deburr } from 'lodash';
import { fetchEvents } from '@/api';
import useStore from '@/store';
import { format, addMonths } from 'date-fns';

// eslint-disable-next-line
export default function () {
  const store = useStore();

  const events = reactive({
    visibleData: [],
    data: [],
    calendarData: [],
    loading: false,
    error: false,
    current: null,
    searchTerm: '',
    showUpcomingEvents: false,
  });

  watch(
    () => store.currentEvent,
    (current) => {
      events.current = current;
    },
  );

  const sortEvents = () => {
    events.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  };

  const handleFetchEvents = async () => {
    events.visibleData = [];
    events.loading = true;
    try {
      events.data = await fetchEvents();
      sortEvents();
      events.visibleData = events.data;
      events.calendarData = events.data;
    } catch (e) {
      events.error = true;
    } finally {
      events.loading = false;
    }
  };

  const handleSearch = () => {
    const searchQuery = deburr(toUpper(events.searchTerm));
    events.visibleData = events.data.filter((item) => includes(deburr(toUpper(`${item.projectCode} ${item.name} ${item.id}`)), searchQuery));
  };

  const handleResetCurrentEvent = () => {
    events.current = null;
  };

  const handleChangeSearch = (searchTerm) => {
    events.searchTerm = searchTerm;
    events.showUpcomingEvents = false;
    handleSearch();
  };

  const filterEventsByDate = () => {
    const currentDateTime = format(new Date(), 'yyyy-MM-dd HH:mm');
    const endDate = addMonths(new Date(), 2);
    const formattedEndDate = format(endDate, 'yyyy-MM-dd HH:mm');
    return events.data.filter(
      (event) => event.startDate > currentDateTime && event.startDate <= formattedEndDate,
    );
  };

  const handleSetUpcomingEvents = () => {
    if (!events.showUpcomingEvents) {
      events.showUpcomingEvents = true;
      events.visibleData = filterEventsByDate();
    } else {
      events.showUpcomingEvents = false;
      events.visibleData = events.data;
    }
  };

  const handleAfterSaveEvent = async () => {
    await handleResetCurrentEvent();
    await handleFetchEvents();
    if (events.showUpcomingEvents) {
      events.visibleData = filterEventsByDate();
    }
  };

  return {
    events,
    handleFetchEvents,
    handleChangeSearch,
    handleAfterSaveEvent,
    handleSetUpcomingEvents,
  };
}
