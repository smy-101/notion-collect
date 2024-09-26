import {NotionClient} from '../../utils';
import {create} from 'zustand';

type State = {
  notionClient: NotionClient | undefined;
  setNotionClient: (notionClient: NotionClient | undefined) => void;
};

export const useStore = create<State>((set) => ({
  notionClient: undefined,
  setNotionClient: (notionClient) => set({notionClient}),
}));
