export interface RefData {
  name: string;
  position: string;
  phone: string;
  email: string;
}

interface StoreState {
  personalData: Record<string, any>;
  refs: RefData[];
}

const state: StoreState = {
  personalData: {},
  refs: [
    { name: '', position: '', phone: '', email: '' },
    { name: '', position: '', phone: '', email: '' },
    { name: '', position: '', phone: '', email: '' },
  ],
};

export const profileStore = {
  getPersonalData: () => state.personalData,
  setPersonalData: (d: Record<string, any>) => { state.personalData = d; },
  getRefs: () => state.refs,
  setRefs: (r: RefData[]) => { state.refs = r; },
};
