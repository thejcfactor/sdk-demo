import api from "@/logic/api";
import { _ } from "vue-underscore";

import utilities from "@/logic/apiPayloadUtilites";
import languageOptions from "@/logic/languageOptions";

export const namespaced = true;

export const state = {
  availableCommands: [
    {
      Name: "n1ql",
      Label: "N1QL",
      ApiUrl: "n1qlQuery",
      Selected: false,
      Parent: null,
      InputOptions: [
        {
          Name: "query",
          Label: "Enter N1QL query below:",
          InputType: "TEXT_AREA",
          Hint: "SELECT * FROM {{BUCKET}} LIMIT 5;",
          Value: ""
        }
      ],
      Info: `Enter a N1QL into the provided text area or selected a sample query from the select box.`
    },
    {
      Name: "get",
      Label: "get()",
      ApiUrl: "get",
      Selected: false,
      Parent: "KV",
      InputOptions: [
        {
          Name: "docId",
          Label: "Enter docId below:",
          InputType: "INPUT",
          Hint: "{{DOC_ID}}",
          Value: ""
        }
      ],
      Info: `Enter a document key into the provided text area.  Click the "Run" button to retrieve the document.`
    },
    {
      Name: "getMulti",
      Label: "getMulti()",
      ApiUrl: "getMulti",
      Selected: false,
      Parent: "KV",
      InputOptions: [
        {
          Name: "docIds",
          Label: "Enter docId(s) below:",
          InputType: "INPUT",
          Hint: "{{DOC_IDS}}",
          Value: ""
        }
      ],
      Info: `Enter document keys into the provided text area. Format: ["key1","key2", etc.]. Click the "Run" button to retrieve the document.`
    },
    {
      Name: "upsert",
      Label: "upsert()",
      ApiUrl: "upsert",
      Selected: false,
      Parent: "KV",
      InputOptions: [
        {
          Name: "docId",
          Label: "Enter docId below:",
          InputType: "INPUT",
          Hint: "{{SAMPLE_DOC_ID}}",
          Value: ""
        },
        {
          Name: "content",
          Label: "Enter document content below:",
          InputType: "TEXT_AREA",
          Hint: "{{SAMPLE_DOC}}",
          Value: ""
        }
      ],
      Info: `Enter a document key and document content into the provided text areas.  Make sure the document content is valid JSON.  Click the "Run" button to retrieve the document.`
    },
    {
      Name: "insert",
      Label: "insert()",
      ApiUrl: "insert",
      Selected: false,
      Parent: "KV",
      InputOptions: [
        {
          Name: "docId",
          Label: "Enter docId below:",
          InputType: "INPUT",
          Hint: "{{SAMPLE_DOC_ID}}",
          Value: ""
        },
        {
          Name: "content",
          Label: "Enter document content below:",
          InputType: "TEXT_AREA",
          Hint: "{{SAMPLE_DOC}}",
          Value: ""
        }
      ],
      Info: `Enter a document key and document content into the provided text areas.  Make sure the document content is valid JSON.  Click the "Run" button to retrieve the document.`
    },
    {
      Name: "replace",
      Label: "replace()",
      ApiUrl: "replace",
      Selected: false,
      Parent: "KV",
      InputOptions: [
        {
          Name: "docId",
          Label: "Enter docId below:",
          InputType: "INPUT",
          Hint: "{{SAMPLE_DOC_ID}}",
          Value: ""
        },
        {
          Name: "content",
          Label: "Enter document content below:",
          InputType: "TEXT_AREA",
          Hint: "{{SAMPLE_DOC}}",
          Value: ""
        }
      ],
      Info: `Enter a document key and document content into the provided text areas.  Make sure the document content is valid JSON.  Click the "Run" button to retrieve the document.`
    },
    {
      Name: "remove",
      Label: "remove()",
      ApiUrl: "remove",
      Selected: false,
      Parent: "KV",
      InputOptions: [
        {
          Name: "docId",
          Label: "Enter docId below:",
          InputType: "INPUT",
          Hint: "{{SAMPLE_DOC_ID}}",
          Value: ""
        }
      ],
      Info: `Enter a document key into the provided text area. Click the "Run" button to retrieve the document.`
    },
    {
      Name: "lookupIn",
      Label: "lookupIn()",
      ApiUrl: "lookupIn",
      Selected: false,
      Parent: "KV",
      InputOptions: [
        {
          Name: "docId",
          Label: "Enter docId below:",
          InputType: "INPUT",
          Hint: "{{SAMPLE_DOC_ID}}",
          Value: ""
        },
        {
          Name: "path",
          Label: "Enter sub-document path below:",
          InputType: "INPUT",
          Hint: "",
          Value: ""
        },
        {
          Name: "resultType",
          Label: "Select result type:",
          InputType: "SELECT",
          InputOptions: [
            { value: "primitive", text: "Primitive" },
            { value: "object", text: "Object" },
            { value: "array", text: "Array" }
          ],
          Hint: "",
          Value: ""
        }
      ],
      Info: `Enter a document key and the sub-document content's path into the provide text areas.
       Select the result type: Primitive is the sub-document's content is a String, Boolean, Float, etc., Object if the sub-document's content is a nest JSON object or
       Array if the sub-document's content is a JSON array.\n  Click the "Run" button to retrieve the sub-document content.`
    },
    {
      Name: "fts",
      Label: "Full Text Search (FTS)",
      ApiUrl: "/api/recvPOST/fts",
      Selected: false,
      Parent: null,
      InputOptions: [
        {
          Name: "ftsSearchTerm",
          Label: "Enter FTS search term below:",
          InputType: "INPUT",
          Hint: "hops",
          Value: ""
        }
        /*{
          Name: "ftsDescription",
          Label: "Enter attribute below:",
          InputType: "INPUT",
          //TODO:  configure a default
          Hint: "description",
          Value: ""
        },
        {
          Name: "ftsIndex",
          Label: "Enter FTS index below:",
          InputType: "INPUT",
          //TODO:  configure a default
          Hint: "cb121_typed_product",
          Value: ""
        }*/
      ],
      Info: `This command is under constuction...`
    }
  ],
  currentDocumentationUrl: null,
  sampleDocIds: [],
  selectedCommand: null,
  results: null,
  viewedCommands: [],
  currentViewedCommand: null,
  availableOutputCommands: [],
  selectedOutputCommands: []
};

export const mutations = {
  SET_SAMPLE_DOC_IDS(state, ids) {
    if (state.sampleDocIds == null) {
      state.sampleDocIds = [];
    }
    state.sampleDocIds = ids;
  },
  ADD_VIEWED_COMMAND(state, command) {
    state.viewedCommands.push(command);
  },
  SET_VIEWED_COMMAND(state, command) {
    let cmd = _.findWhere(state.viewedCommands, { Name: command.Name });
    if (cmd != null && typeof cmd !== "undefined") {
      state.currentViewedCommand = cmd;
    }
  },
  CLEAR_VIEWED_COMMAND(state) {
    state.currentViewedCommand = null;
  },
  SET_SDK_COMMAND(state, command) {
    for (let i = 0; i < state.availableCommands.length; i++) {
      if (state.availableCommands[i].Name === command) {
        state.availableCommands[i].Selected = true;
        state.selectedCommand = state.availableCommands[i];
      }
    }
  },
  CLEAR_SDK_COMMAND(state) {
    for (let i = 0; i < state.availableCommands.length; i++) {
      state.availableCommands[i].Selected = false;
    }
    state.selectedCommand = null;
  },
  SET_RESULTS(state, results) {
    state.results = JSON.stringify(results, null, 2);
  },
  CLEAR_RESULTS(state) {
    state.results = null;
  },
  ADD_ALL_AVAILABLE_COMMANDS_TO_AVAILABLE_OUTPUT(state) {
    for (let i = 0; i < state.availableCommands.length; i++) {
      let cmd = {
        Name: state.availableCommands[i].Name,
        Label: state.availableCommands[i].Label,
        Selected: false
      };

      state.availableOutputCommands.push(cmd);
    }
  },
  REMOVE_ALL_AVAILABLE_COMMANDS_FROM_AVAILABLE_OUTPUT(state) {
    state.availableOutputCommands = [];
  },
  REMOVE_ALL_OUTPUT_COMMANDS(state) {
    state.selectedOutputCommands = [];
  },
  REMOVE_ALL_VIEWED_COMMANDS(state) {
    state.viewedCommands = [];
  },
  ADD_AVAILABLE_OUTPUT_COMMAND(state, command) {
    state.availableOutputCommands.push(command);
  },
  ADD_SELECTED_OUTPUT_COMMAND(state, command) {
    state.selectedOutputCommands.push(command);
  },
  REMOVE_AVAILABLE_OUTPUT_COMMAND(state, command) {
    let index = -1;
    for (let i = 0; i < state.availableOutputCommands.length; i++) {
      if (state.availableOutputCommands[i].Name == command.Name) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      state.availableOutputCommands[index].Selected = false;
      state.availableOutputCommands.splice(index, 1);
    }
  },
  REMOVE_SELECTED_OUTPUT_COMMAND(state, command) {
    let index = -1;
    for (let i = 0; i < state.selectedOutputCommands.length; i++) {
      if (state.selectedOutputCommands[i].Name == command.Name) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      state.selectedOutputCommands.splice(index, 1);
    }
  },
  TOGGLE_AVAILABLE_OUTPUT_COMMAND(state, command) {
    for (let i = 0; i < state.availableOutputCommands.length; i++) {
      if (state.availableOutputCommands[i].Name == command.Name) {
        state.availableOutputCommands[i].Selected = !state
          .availableOutputCommands[i].Selected;
      }
    }
  },
  TOGGLE_SELECTED_OUTPUT_COMMAND(state, command) {
    for (let i = 0; i < state.selectedOutputCommands.length; i++) {
      if (state.selectedOutputCommands[i].Name == command.Name) {
        state.selectedOutputCommands[i].Selected = !state
          .selectedOutputCommands[i].Selected;
      }
    }
  },
  SET_DOCUMENTATION_URL(state, language) {
    let documentation = languageOptions.getDocumentationUrl(
      language,
      state.currentViewedCommand
    );
    if (!documentation) {
      state.currentDocumentationUrl =
        "https://docs.couchbase.com/server/6.0/sdk/overview.html";
    } else {
      state.currentDocumentationUrl = documentation.Url;
    }
  },
  ADD_AVAILABLE_COMMAND(state, command) {
    let found = false;
    for (let i = 0; i < state.availableCommands.length; i++) {
      if (state.availableCommands[i].Name == command.Name) {
        found = true;
        break;
      }
    }

    if (!found) {
      state.availableCommands.push(command);
    }
  }
};

export const actions = {
  reset({ commit, dispatch, rootState }, init) {
    commit("CLEAR_SDK_COMMAND");
    commit("REMOVE_ALL_AVAILABLE_COMMANDS_FROM_AVAILABLE_OUTPUT");
    commit("REMOVE_ALL_OUTPUT_COMMANDS");
    commit("REMOVE_ALL_VIEWED_COMMANDS");
    commit("CLEAR_VIEWED_COMMAND");
    commit("CLEAR_RESULTS");
    if (init) {
      let connectCommand = {
        Name: "connect",
        Label: "Connect"
      };

      let availConnectCommand = {
        Name: "connect",
        Label: "Connect",
        Selected: false
      };

      dispatch("addOrSetViewedCommand", connectCommand);
      dispatch("addAvailableOutputCommand", availConnectCommand);
    }
    commit("SET_DOCUMENTATION_URL", rootState.sdkStore.selectedLanguage);
  },
  setSdkCommand({ commit, dispatch }, command) {
    commit("SET_SDK_COMMAND", command);
    dispatch("addOrSetViewedCommand", null);
  },
  clearResults({ commit }) {
    commit("CLEAR_RESULTS");
  },
  runSdkCommand({ state, commit }, { inputOptions, language }) {
    commit("CLEAR_RESULTS");
    let commandPayload = utilities.getCommandPayload(
      state.selectedCommand,
      inputOptions,
      language
    );

    let runCommand = true;
    if (commandPayload.Url == null || commandPayload.Url == "") {
      console.log("No command URL specified.");
      runCommand = false;
    }

    if (
      commandPayload.Payload == null ||
      typeof commandPayload.Payload === "undefined"
    ) {
      console.log("No command payload specified.");
      runCommand = false;
    }

    if (runCommand) {
      api
        .runCommand(commandPayload.Url, commandPayload.Payload)
        .then(function(response) {
          if (response != null) {
            commit("SET_RESULTS", response);
          }
        })
        .catch(error => {
          console.log("Error occurred running command.");
          console.log(error);
        });
    }
  },
  addOrSetViewedCommand({ state, commit, rootState }, command) {
    if (command == null) {
      command = state.selectedCommand;
    }
    let exists = _.findWhere(state.viewedCommands, { Name: command.Name });
    if (exists == null || typeof exists === "undefined") {
      //let lang = rootState.sdkStore.selectedLanguage.toLowerCase();
      //let src = "@/assets/images/" + lang + "/" + command.Name + ".png";
      let viewedCommand = {
        Name: command.Name,
        Label: command.Label,
        ImgName: command.Name + ".png"
      };
      commit("ADD_VIEWED_COMMAND", viewedCommand);
      commit("SET_VIEWED_COMMAND", viewedCommand);
      commit("SET_DOCUMENTATION_URL", rootState.sdkStore.selectedLanguage);
    } else {
      commit("SET_VIEWED_COMMAND", exists);
      commit("SET_DOCUMENTATION_URL", rootState.sdkStore.selectedLanguage);
    }
  },
  setViewedCommand({ commit, rootState }, command) {
    commit("SET_VIEWED_COMMAND", command);
    commit("SET_DOCUMENTATION_URL", rootState.sdkStore.selectedLanguage);
  },
  addAvailableOutputCommand({ commit, state }, command) {
    let exists = _.findWhere(state.availableOutputCommands, {
      Name: command.Name
    });
    if (exists == null || typeof exists == "undefined") {
      commit("ADD_AVAILABLE_OUTPUT_COMMAND", command);
    }
  },
  addSelectedOutputCommand({ commit, state }, command) {
    console.log(command);
    let exists = _.findWhere(state.selectedOutputCommands, {
      Name: command.Name
    });
    if (exists == null || typeof exists == "undefined") {
      commit("ADD_SELECTED_OUTPUT_COMMAND", command);
    }
  },
  removeAvailableOutputCommand({ commit }, command) {
    console.log(command);
    commit("REMOVE_AVAILABLE_OUTPUT_COMMAND", command);
  },
  removeSelectedOutputCommand({ commit }, command) {
    commit("REMOVE_SELECTED_OUTPUT_COMMAND", command);
  },
  toggleAvailableOutputCommand({ commit }, command) {
    commit("TOGGLE_AVAILABLE_OUTPUT_COMMAND", command);
  },
  toggleSelectedOutputCommand({ commit }, command) {
    commit("TOGGLE_SELECTED_OUTPUT_COMMAND", command);
  }
};

export const getters = {
  selectedAvailableOutputCommands: state => {
    let selectedCommands = _.where(state.availableOutputCommands, {
      Selected: true
    });
    return selectedCommands;
  },
  selectedSelectedOutputCommands: state => {
    let selectedCommands = _.where(state.selectedOutputCommands, {
      Selected: true
    });
    return selectedCommands;
  }
};
