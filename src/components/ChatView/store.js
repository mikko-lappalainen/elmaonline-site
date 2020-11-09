/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { SearchChat } from 'data/api';

export default {
  chatLines: [],
  chatLineCount: 0,
  chatPage: 0,
  prevQuery: {},
  loading: false,
  setChatLines: action((state, payload) => {
    state.chatLines = payload;
  }),
  setChatLineCount: action((state, payload) => {
    state.chatLineCount = payload;
  }),
  setChatPage: action((state, payload) => {
    state.chatPage = payload;
  }),
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  setPrevQuery: action((state, payload) => {
    state.prevQuery = payload;
  }),
  searchChat: thunk(async (actions, payload) => {
    actions.setLoading(true);
    actions.setPrevQuery(payload);
    const chatLines = await SearchChat(payload);
    if (chatLines.ok) {
      actions.setChatLines(chatLines.data.rows);
      if (chatLines.data.count) actions.setChatLineCount(chatLines.data.count);
      actions.setLoading(false);
    }
  }),
};
