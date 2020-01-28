<template>
  <div id="app">
    <!--<div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <b-navbar toggleable="lg" variant="light" fixed="top">
      <b-navbar-brand to="/">
        <img src="@/assets/images/couchbase_no_equal.png" />
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-form>
            <b-nav-text class="mr-2">Selected SDK Language: </b-nav-text>
            <b-form-select
              id="sdk-language-select"
              v-model="sdkLanguage"
              :options="languageOptions"
              size="sm"
            ></b-form-select>
          </b-nav-form>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <div class="download-btn-div">
            <button
              id="download-btn"
              class="code-btn"
              v-on:click="onDownloadsClick"
            >
              <span class="code-btn-text">Downloads</span>
              <font-awesome-icon :icon="icons.Download"></font-awesome-icon>
            </button>
            <b-popover target="download-btn" placement="top" triggers="hover">
              Choose sample code file to download.
            </b-popover>
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view class="top-margin" />
    <b-modal
      id="choose-sample-code-download-modal"
      title="Choose Sample Code"
      @ok="handleSampleCodeSelection"
      @cancel="handleSampleCodeCancel"
    >
      <b-form>
        <label for="sdk-version-select">Available Sample Code:</label>
        <b-form-select
          id="sdk-version-select"
          v-model="sampleCodeOption"
          :options="sampleCodeOptions"
          size="sm"
        ></b-form-select>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { _ } from "vue-underscore";
import languageOptions from "@/logic/languageOptions";
import { saveAs } from "file-saver";
export default {
  name: "App",
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      icons: {
        Download: faDownload
      },
      sampleCodeOption: null
    };
  },
  methods: {
    onDownloadsClick: function() {
      let exists = _.findWhere(this.sampleCodeOptions, {
        value: this.selectedLanguage
      });
      if (exists) {
        this.sampleCodeOption = exists.value;
      }

      this.$bvModal.show("choose-sample-code-download-modal");
    },
    handleSampleCodeSelection: function() {
      let codeText = languageOptions.getCodeSnippet(this.sampleCodeOption, [
        "all"
      ]);
      let blob = new Blob([codeText], {
        type: "text/plain;charset=utf-8"
      });
      let outputName = "sampleCode.txt";
      if (this.sampleCodeOption.includes("JAVA")) {
        outputName = "sampleCode.java";
      } else if (this.sampleCodeOption.includes("NODE")) {
        outputName = "sampleCode.js";
      } else if (this.sampleCodeOption.includes("PYTHON")) {
        outputName = "sampleCode.py";
      }
      saveAs(blob, outputName);
      this.sampleCodeOption = null;
    },
    handleSampleCodeCancel: function() {
      this.sampleCodeOption = null;
    },
    ...mapActions("sdkStore", ["setSdkLanguage"]),
    ...mapActions("sdkConnectStore", ["resetConnection"]),
    ...mapActions("sdkCommandStore", ["reset"])
  },
  computed: {
    sdkLanguage: {
      get: function() {
        return this.selectedLanguage;
      },
      set: function(newValue) {
        this.setSdkLanguage(newValue);
        this.resetConnection();
        this.reset(true);
        if (this.$route.path !== "/Main") {
          this.$router.push({ path: "Main" });
        }
      }
    },
    ...mapState({
      selectedLanguage: state => state.sdkStore.selectedLanguage,
      languageOptions: state => state.sdkStore.languageOptions,
      sampleCodeOptions: state => state.sdkStore.sampleCodeOptions
    })
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.img-carousel {
  color: #000;
  border-color: #000;
}

.top-margin {
  margin-top: 70px;
}

hr.divider {
  margin-top: 3px;
  margin-bottom: 3px;
}

.main-card {
  width: 100%;
  min-height: 200px;
  max-height: 600px;
  overflow-x: hidden;
  overflow-y: auto;
}

.code-btn {
  border: 1px solid #cdcdcd;
  border-radius: 4px;
  background-color: white;
  color: #6c757d;
  font-size: 1em;
  cursor: pointer;
  float: left;
  outline: none;
}

.code-btn:hover {
  background-color: #6c757d;
  color: #fff;
}

button.code-btn:disabled,
button.code-btn[disabled],
button.code-btn[disabled]:hover {
  border: 1px solid #999999;
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}

.download-btn-div {
  margin: 5px 50px 0 0;
}

.code-btn-text {
  margin-right: 10px;
  font-weight: bold;
  font-size: 1.2em;
}
</style>
