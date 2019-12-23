import Vue from "vue";
import Vuex from "vuex";

import * as sdkStore from "@/store/modules/sdkStore.js";
import * as sdkConnectStore from "@/store/modules/sdkConnectStore.js";
import * as sdkCommandStore from "@/store/modules/sdkCommandStore.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    sdkStore,
    sdkConnectStore,
    sdkCommandStore
  }
});
