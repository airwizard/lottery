import type { IPrizeConfig } from "@/types/storeType";
import { defineStore } from "pinia";
import { defaultPrizeList, defaultCurrentPrize } from "./data";

export const usePrizeConfig = defineStore("prize", {
  state() {
    return {
      prizeConfig: {
        prizeList: JSON.parse(JSON.stringify(defaultPrizeList)),
        currentPrize: JSON.parse(JSON.stringify(defaultCurrentPrize)),
        temporaryPrize: {
          id: "",
          name: "",
          sort: 0,
          isAll: false,
          count: 1,
          isUsedCount: 0,
          picture: { id: "-1", name: "", url: "" },
          separateCount: { enable: true, countList: [] },
          desc: "",
          isShow: false,
          isUsed: false,
          frequency: 1,
        } as IPrizeConfig,
      },
    };
  },
  getters: {
    getPrizeConfigAll(state) {
      return state.prizeConfig;
    },
    getPrizeConfig(state) {
      return state.prizeConfig.prizeList;
    },
    getPrizeConfigById(state) {
      return (id: number | string) => {
        return state.prizeConfig.prizeList.find(
          (item: IPrizeConfig) => item.id === id
        );
      };
    },
    getCurrentPrize(state) {
      return state.prizeConfig.currentPrize;
    },
    getTemporaryPrize(state) {
      return state.prizeConfig.temporaryPrize;
    },
  },
  actions: {
    setPrizeConfig(prizeList: IPrizeConfig[]) {
      this.prizeConfig.prizeList = prizeList;
    },
    addPrizeConfig(prizeConfigItem: IPrizeConfig) {
      this.prizeConfig.prizeList.push(prizeConfigItem);
    },
    deletePrizeConfig(prizeConfigItemId: number | string) {
      this.prizeConfig.prizeList = this.prizeConfig.prizeList.filter(
        (item) => item.id !== prizeConfigItemId
      );
    },
    updatePrizeConfig(prizeConfigItem: IPrizeConfig) {
      const prizeListLength = this.prizeConfig.prizeList.length;
      if (prizeConfigItem.isUsed && prizeListLength) {
        for (let i = 0; i < prizeListLength; i++) {
          if (!this.prizeConfig.prizeList[i].isUsed) {
            this.setCurrentPrize(this.prizeConfig.prizeList[i]);
            break;
          }
        }
      }
      this.resetTemporaryPrize();
    },
    deleteAllPrizeConfig() {
      this.prizeConfig.prizeList = [];
    },
    setCurrentPrize(prizeConfigItem: IPrizeConfig) {
      this.prizeConfig.currentPrize = prizeConfigItem;
    },
    setTemporaryPrize(prizeItem: IPrizeConfig) {
      if (prizeItem.isShow === false) {
        for (let i = 0; i < this.prizeConfig.prizeList.length; i++) {
          if (this.prizeConfig.prizeList[i].isUsed === false) {
            this.setCurrentPrize(this.prizeConfig.prizeList[i]);
            break;
          }
        }
        this.resetTemporaryPrize();
        return;
      }
      this.prizeConfig.temporaryPrize = prizeItem;
    },
    resetTemporaryPrize() {
      this.prizeConfig.temporaryPrize = {
        id: "",
        name: "",
        sort: 0,
        isAll: false,
        count: 1,
        isUsedCount: 0,
        picture: { id: "-1", name: "", url: "" },
        separateCount: { enable: true, countList: [] },
        desc: "",
        isShow: false,
        isUsed: false,
        frequency: 1,
      } as IPrizeConfig;
    },
    resetDefault() {
      this.prizeConfig.prizeList = JSON.parse(JSON.stringify(defaultPrizeList));
      this.prizeConfig.currentPrize = JSON.parse(
        JSON.stringify(defaultCurrentPrize)
      );
      this.resetTemporaryPrize();
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, key: "prizeConfig" }],
  },
});
