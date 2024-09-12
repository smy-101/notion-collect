import {create, createStore} from 'zustand';
import {Client} from '@notionhq/client';
import {persist} from 'zustand/middleware';

type State = {
  notion?: Client;
  isConnect: boolean;
  setNotion: (notion: Client) => void;
  setConnect: (isConnect: boolean) => void;
}

const useStore = create<State>((set) => ({
  isConnect: false,
  setNotion: (notion: Client) => set((state) => ({
    notion: state.isConnect ? notion : undefined,
  })),
  setConnect: (isConnect: boolean) => set({isConnect}),
}));

type AuthState = {
  auth: string;
  databaseId: string;
};
export const authStore = createStore<AuthState>()(
  persist(
    () => ({
      auth: '',
      databaseId: '',
    }),
    {name: 'auth-store'} // 存储的键名
  )
);
