import api from "@/logic/api";
import bucketOptions from "@/logic/bucketOptions";
import languageOptions from "@/logic/languageOptions";

export const namespaced = true;

export const state = {
  defaultConnectionSettings: {
    /*Host: process.env.VUE_APP_CB_HOST,
    Bucket: process.env.VUE_APP_CB_BUCKET,
    Username: process.env.VUE_APP_CB_USERNAME,
    Password: process.env.VUE_APP_CB_PW*/
    Host: "localhost",
    Bucket: "beer-sample",
    Username: "Administrator",
    Password: "password"
  },
  connectionSettings: {
    Host: null,
    Bucket: null,
    Username: null,
    Password: null
  },
  connectApiUrl: "connect",
  isConnected: false,
  showConnectAlert: false
};

export const mutations = {
  SET_HOST(state, host) {
    state.connectionSettings.Host = host;
  },
  SET_BUCKET(state, bucket) {
    state.connectionSettings.Bucket = bucket;
  },
  SET_USERNAME(state, username) {
    state.connectionSettings.Username = username;
  },
  SET_PASSWORD(state, password) {
    state.connectionSettings.Password = password;
  },
  SET_CONNECTION_STATE(state, value) {
    state.isConnected = value;
  },
  RESET_CONNECTION(state) {
    state.connectionSettings.Host = null;
    state.connectionSettings.Bucket = null;
    state.connectionSettings.Username = null;
    state.connectionSettings.Password = null;
  },
  SET_CONNECT_ALERT(state, value) {
    state.showConnectAlert = value;
  }
};

export const actions = {
  setHost({ commit }, host) {
    commit("SET_HOST", host);
  },
  setBucket({ commit }, bucket) {
    commit("SET_BUCKET", bucket);
  },
  setUsername({ commit }, username) {
    commit("SET_USERNAME", username);
  },
  setPassword({ commit }, password) {
    commit("SET_PASSWORD", password);
  },
  resetConnection({ commit }) {
    commit("RESET_CONNECTION");
    commit("SET_CONNECTION_STATE", false);
    commit("SET_CONNECT_ALERT", false);
  },
  connectToBucket({ commit, state, dispatch }, connectSettings) {
    let url = `/api/${connectSettings.Language.toLowerCase()}/${
      state.connectApiUrl
    }`;
    let payload = {
      host: connectSettings.Host,
      bucket: connectSettings.Bucket,
      username: connectSettings.Username,
      password: connectSettings.Password
    };

    return api
      .connectToBucket(url, payload)
      .then(response => {
        console.log(response);
        commit("SET_CONNECT_ALERT", true);
        if (response.data != null && response.data.length > 0) {
          let ids = [];
          for (let i = 0; i < response.data.length; i++) {
            ids.push(response.data[i]);
          }
          commit("SET_BUCKET", payload.bucket);
          commit("sdkCommandStore/SET_SAMPLE_DOC_IDS", ids, { root: true });
          let dispatchPayload = {
            bucket: payload.bucket,
            language: connectSettings.Language
          };
          dispatch("addLanguageSpecificCommands", dispatchPayload);
          commit(
            "sdkCommandStore/ADD_ALL_AVAILABLE_COMMANDS_TO_AVAILABLE_OUTPUT",
            null,
            { root: true }
          );
          commit("SET_CONNECTION_STATE", true);
          return true;
        } else {
          commit("SET_CONNECTION_STATE", false);
          return false;
        }
      })
      .catch(error => {
        if (!state.showConnectAlert) {
          commit("SET_CONNECT_ALERT", true);
        }
        console.log("Something went wrong.  Error: " + error);
        commit("SET_CONNECTION_STATE", false);
        return false;
      });
  },
  addLanguageSpecificCommands({ commit }, { language, bucket }) {
    if (language == "JAVA30b") {
      let sampleCommands = languageOptions.getLanguageSpecificCommands(
        language
      );
      for (let i = 0; i < sampleCommands.length; i++) {
        commit("sdkCommandStore/ADD_AVAILABLE_COMMAND", sampleCommands[i], {
          root: true
        });
      }
    }
    if (language == "JAVA30b" && bucket == "beer-sample") {
      let sampleCommand = bucketOptions.getSampleCommand(
        bucket,
        "acid-beer-sample"
      );
      commit("sdkCommandStore/ADD_AVAILABLE_COMMAND", sampleCommand, {
        root: true
      });
    }
  }
};
