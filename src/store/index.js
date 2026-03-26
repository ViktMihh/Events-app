import { defineStore } from 'pinia';

export const storePreffix = 'events-platform->';
export const storeId = `${storePreffix}main`;

const useStore = defineStore('main', {
  state: () => ({
    selectedKeys: ['1'],
    openKeys: ['sub1'],
    event: {
      name: '',
      projectCode: '',
      startDate: '',
      finishDate: '',
      projectType: '',
    },
  }),
  persist: true,
  getters: {
  },
});

export default useStore;
