<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="10">
        <b-jumbotron class="jumbotron-padding">
          <template v-slot:header>
            <img src="@/assets/images/couchbase_logo.png" />
          </template>
          <template v-slot:lead>
            <div class="jumbotron-title">SDK Demo</div>
          </template>
        </b-jumbotron>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="10" offset-lg="1">
        <div class="d-flex flex-row">
          <div class="sub-title-text">
            Pick your poison:
          </div>
        </div>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="10">
        <b-row>
          <b-col>
            <b-row class="mt-2">
              <b-col>
                <div>
                  <button
                    class="language-btn grow"
                    v-bind:class="{
                      'selected-language': selectedLanguage == 'PYTHON25'
                    }"
                    @click="onLanguageSelect('PYTHON25')"
                  >
                    <img height="130" src="@/assets/images/python_small.png" />
                  </button>
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <div>
                  <button
                    class="language-btn grow"
                    @click="onLanguageSelect('DOTNET')"
                    v-bind:class="{
                      'selected-language': selectedLanguage == 'DOTNET'
                    }"
                  >
                    <img height="200" src="@/assets/images/dotnet_small.png" />
                  </button>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col>
            <b-row class="mt-2">
              <b-col>
                <div>
                  <button
                    class="language-btn grow"
                    @click="onLanguageSelect('JAVA27')"
                    v-bind:class="{
                      'selected-language':
                        selectedLanguage != null &&
                        selectedLanguage.includes('JAVA')
                    }"
                  >
                    <img height="200" src="@/assets/images/java_small.png" />
                  </button>
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <div class="btn-height-200">
                  <button
                    class="language-btn grow"
                    @click="onLanguageSelect('NODE26')"
                    v-bind:class="{
                      'selected-language': selectedLanguage == 'NODE26'
                    }"
                  >
                    <img height="130" src="@/assets/images/node_small.png" />
                  </button>
                </div>
              </b-col>
            </b-row>
          </b-col>
          <b-col>
            <b-row class="mt-2">
              <b-col>
                <div>
                  <button
                    class="language-btn grow"
                    @click="onLanguageSelect('GO')"
                    v-bind:class="{
                      'selected-language': selectedLanguage == 'GO'
                    }"
                  >
                    <img height="120" src="@/assets/images/Golang.png" />
                  </button>
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <div>
                  <button
                    class="language-btn grow"
                    @click="onLanguageSelect('C')"
                    v-bind:class="{
                      'selected-language': selectedLanguage == 'C'
                    }"
                  >
                    <img height="90" src="@/assets/images/c_small.png" />
                  </button>
                </div>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col>
                <div>
                  <button
                    class="language-btn grow"
                    @click="onLanguageSelect('PHP')"
                    v-bind:class="{
                      'selected-language': selectedLanguage == 'PHP'
                    }"
                  >
                    <img height="90" src="@/assets/images/php_small.png" />
                  </button>
                </div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal
      id="choose-sdk-version-modal"
      title="Select SDK Version"
      @ok="handleSdkVersionSelection"
      @cancel="handleModalCancel"
    >
      <b-form>
        <label for="sdk-version-select">Available Versions:</label>
        <b-form-select
          id="sdk-version-select"
          v-model="sdkVersion"
          :options="sdkVersions"
          size="sm"
        ></b-form-select>
      </b-form>
    </b-modal>
  </b-container>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "home",
  data: function() {
    return {
      sdkVersion: null,
      sdkVersions: []
    };
  },
  methods: {
    onLanguageSelect(language) {
      console.log(language);

      if (language.includes("JAVA")) {
        this.setSdkVersions("JAVA");
        this.$bvModal.show("choose-sdk-version-modal");
      } else {
        this.setSdkLanguage(language);
        this.sdkVersion = null;
        this.sdkVersions = [];
        this.$router.push({ path: "Main" });
      }
    },
    setSdkVersions: function(language) {
      if (language == "JAVA") {
        this.sdkVersions = this.javaVersions;
      }
    },
    handleSdkVersionSelection: function() {
      this.setSdkLanguage(this.sdkVersion);
      this.$router.push({ path: "Main" });
    },
    handleModalCancel: function() {
      this.sdkVersion = null;
      this.sdkVersions = [];
    },
    ...mapActions("sdkStore", ["setSdkLanguage"])
  },
  computed: {
    ...mapState({
      selectedLanguage: state => state.sdkStore.selectedLanguage
    }),
    ...mapGetters("sdkStore", {
      javaVersions: "javaVersions"
    })
  }
};
</script>

<style scoped>
.jumbotron-padding {
  padding: 32px 32px 16px 32px;
  margin-bottom: 5px;
}

.jumbotron-title {
  margin-top: 10px;
  font-weight: bold;
  font-size: 72px;
  color: #000;
}

p.lead {
  margin-bottom: 0px;
}

.sub-title-text {
  font-weight: bold;
  font-size: 1.25em;
  color: #000;
}

.language-btn {
  display: block;
  position: relative;
  width: 100%;
  border: solid 3px #cdcdcd;
  border-radius: 4px;
  cursor: pointer;
  outline: none;
  padding: 5px;
  transition: all 0.2s ease-in-out;
  /*transform-style: preserve-3d;*/
}

button.language-btn:hover {
  transform: scale(1.1, 1.1);
  z-index: 3000 !important;
}

.selected-language {
  border-color: #0430f7;
}

.btn-height-200 {
  max-height: 200px;
}
</style>
