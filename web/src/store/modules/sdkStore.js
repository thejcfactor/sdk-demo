import { _ } from "vue-underscore";

export const namespaced = true;

export const state = {
  selectedLanguage: null,
  languageOptions: [
    { value: null, text: "--Select SDK language--" },
    { value: "JAVA27", text: "Java v2.7" },
    { value: "JAVA30b", text: "Java v3.0 BETA" },
    { value: "NODE26", text: "NodeJS v2.6" },
    { value: "PYTHON25", text: "Python v2.5" },
    { value: "DOTNET", text: ".NET" },
    { value: "GO", text: "GO" },
    { value: "C", text: "C/C++" },
    { value: "PHP", text: "PHP" }
  ],
  sampleCodeOptions: [
    { value: null, text: "--Select SDK language--" },
    { value: "JAVA27", text: "Java v2.7" },
    { value: "JAVA30b", text: "Java v3.0 BETA" },
    { value: "NODE26", text: "NodeJS v2.6" },
    { value: "PYTHON25", text: "Python v2.5" }
  ]
};

export const mutations = {
  SET_SDK_LANGUAGE(state, language) {
    state.selectedLanguage = language;
  }
};

export const actions = {
  setSdkLanguage({ commit }, language) {
    commit("SET_SDK_LANGUAGE", language);
  }
};

export const getters = {
  javaVersions: state => {
    let versions = [{ value: null, text: "Select SDK version..." }];
    let javaLanguages = _.filter(state.languageOptions, function(lang) {
      return lang.value && lang.value.includes("JAVA");
    });
    return versions.concat(javaLanguages);
  }
};
