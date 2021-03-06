/* eslint-disable no-param-reassign */
import { action, thunk, persist } from 'easy-peasy';
import {
  Highlight,
  TotalTimes,
  PersonalTimes,
  PersonalAllFinished,
  Besttime,
  Records,
  MultiRecords,
  MultiBesttime,
  LevelPackDeleteLevel,
  LevelsSearchAll,
  LevelPackAddLevel,
  LevelPackSortLevel,
  LevelPackSort,
} from 'data/api';

export default {
  highlight: [9999999999, 9999999999, 9999999999, 9999999999, 9999999999],
  setHighlight: action((state, payload) => {
    state.highlight = payload;
  }),
  getHighlight: thunk(async actions => {
    const highlights = await Highlight();
    if (highlights.ok) {
      actions.setHighlight(highlights.data);
    }
  }),
  settings: persist(
    {
      highlightWeeks: 1,
      showLegacyIcon: true,
      showLegacy: true,
    },
    { storage: 'localStorage' },
  ),
  setHighlightWeeks: action((state, payload) => {
    state.settings.highlightWeeks = payload;
  }),
  toggleShowLegacyIcon: action(state => {
    state.settings.showLegacyIcon = !state.settings.showLegacyIcon;
  }),
  toggleShowLegacy: action(state => {
    state.settings.showLegacy = !state.settings.showLegacy;
  }),
  totaltimes: [],
  kinglist: [],
  lastPack: 0,
  totaltimesLoading: false,
  setTotalTimes: action((state, payload) => {
    state.totaltimes = payload;
  }),
  setKinglist: action((state, payload) => {
    state.kinglist = payload;
  }),
  setTotaltimesLoading: action((state, payload) => {
    state.totaltimesLoading = payload;
  }),
  setLastPack: action((state, payload) => {
    state.lastPack = payload;
  }),
  getTotalTimes: thunk(async (actions, payload) => {
    actions.setTotaltimesLoading(true);
    const tts = await TotalTimes(payload);
    if (tts.ok) {
      actions.setTotalTimes(tts.data.tts);
      actions.setKinglist(tts.data.points);
      actions.setLastPack(payload.levelPackIndex);
    }
    actions.setTotaltimesLoading(false);
  }),
  timesError: '',
  setError: action((state, payload) => {
    state.timesError = payload;
  }),
  personalTimes: [],
  personalKuski: '',
  personalTimesLoading: false,
  setPersonalTimes: action((state, payload) => {
    state.personalTimes = payload;
  }),
  setPersonalTimesLoading: action((state, paylaod) => {
    state.personalTimesLoading = paylaod;
  }),
  setPersonalKuski: action((state, payload) => {
    state.personalKuski = payload;
  }),
  getPersonalTimes: thunk(async (actions, payload) => {
    actions.setPersonalTimesLoading(true);
    actions.setPersonalKuski(payload.PersonalKuskiIndex);
    const times = await PersonalTimes(payload);
    if (times.ok) {
      if (times.data.error) {
        actions.setError(times.data.error);
      } else {
        actions.setPersonalTimes(times.data);
      }
    }
    actions.setPersonalTimesLoading(false);
  }),
  personalAllFinished: [],
  setPeronalAllFinished: action((state, payload) => {
    state.personalAllFinished = payload;
  }),
  getPersonalAllFinished: thunk(async (actions, payload) => {
    const times = await PersonalAllFinished(payload);
    if (times.ok) {
      actions.setPeronalAllFinished(times.data);
    }
  }),
  levelBesttimes: [],
  setLevelBesttimes: action((state, payload) => {
    state.levelBesttimes = payload;
  }),
  getLevelBesttimes: thunk(async (actions, payload) => {
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setLevelBesttimes(times.data);
    }
  }),
  levelMultiBesttimes: [],
  setLevelMultiBesttimes: action((state, payload) => {
    state.levelMultiBesttimes = payload;
  }),
  getLevelMultiBesttimes: thunk(async (actions, payload) => {
    const times = await MultiBesttime(payload);
    if (times.ok) {
      actions.setLevelMultiBesttimes(times.data);
    }
  }),
  records: [],
  recordsLoading: false,
  setRecords: action((state, payload) => {
    state.records = payload;
  }),
  setRecordsLoading: action((state, payload) => {
    state.recordsLoading = payload;
  }),
  getRecords: thunk(async (actions, payload) => {
    actions.setRecordsLoading(true);
    const times = await Records(payload);
    if (times.ok) {
      actions.setRecords(times.data);
    }
    actions.setRecordsLoading(false);
    actions.setAdminLoading(false);
  }),
  multiRecords: [],
  multiRecordsLoading: false,
  lastMultiName: '',
  setMultiRecords: action((state, payload) => {
    state.multiRecords = payload;
  }),
  setMultiRecordsLoading: action((state, payload) => {
    state.multiRecordsLoading = payload;
  }),
  setLastMultiName: action((state, payload) => {
    state.lastMultiName = payload;
  }),
  getMultiRecords: thunk(async (actions, payload) => {
    actions.setMultiRecordsLoading(true);
    const times = await MultiRecords(payload);
    if (times.ok) {
      actions.setMultiRecords(times.data);
    }
    actions.setMultiRecordsLoading(false);
  }),
  deleteLevel: thunk(async (actions, payload) => {
    const del = await LevelPackDeleteLevel(payload);
    if (del.ok) {
      actions.getRecords({
        name: payload.name,
        eolOnly: payload.showLegacy ? 0 : 1,
      });
    }
  }),
  levelsFound: [],
  adminLoading: false,
  setLevelsFound: action((state, payload) => {
    state.levelsFound = payload;
  }),
  setAdminLoading: action((state, payload) => {
    state.adminLoading = payload;
  }),
  searchLevel: thunk(async (actions, payload) => {
    const levs = await LevelsSearchAll(payload);
    if (levs.ok) {
      actions.setLevelsFound(levs.data);
    }
  }),
  addLevel: thunk(async (actions, payload) => {
    const add = await LevelPackAddLevel(payload);
    if (add.ok) {
      actions.getRecords({
        name: payload.name,
        eolOnly: payload.showLegacy ? 0 : 1,
      });
    }
  }),
  sortLevel: thunk(async (actions, payload) => {
    actions.setAdminLoading(true);
    const sort = await LevelPackSortLevel(payload);
    if (sort.ok) {
      actions.getRecords({
        name: payload.name,
        eolOnly: payload.showLegacy ? 0 : 1,
      });
    } else {
      actions.setAdminLoading(false);
    }
  }),
  sortPack: thunk(async (actions, payload) => {
    actions.setAdminLoading(true);
    const sort = await LevelPackSort(payload);
    if (sort.ok) {
      actions.getRecords({
        name: payload.name,
        eolOnly: payload.showLegacy ? 0 : 1,
      });
    } else {
      actions.setAdminLoading(false);
    }
  }),
};
