<template>
  <b-tab class="p-2" :disabled="!isConnected">
    <template v-slot:title>
      2. Play
    </template>
    <b-card class="main-card" no-body>
      <b-card-body class="p-1">
        <b-row>
          <b-col cols="2" class="pr-1">
            <b-card no-body class="cmd-menu-wrapper">
              <b-card-text>
                <div class="play-card-title">
                  1. Select a command
                </div>
                <hr class="divider" />
                <div class="play-card-content">
                  <div id="cmd-menu">
                    <b-nav vertical>
                      <b-nav-item v-b-toggle.collapse-kv class="nav-collapse">
                        Key-Value (KV)
                      </b-nav-item>
                      <b-collapse id="collapse-kv" v-model="kvVisible">
                        <b-nav-item
                          v-for="(cmd, index) in getChildCommands('KV')"
                          :key="index"
                          class="sub-nav-item"
                          @click="onCommandItemClick(cmd.Name)"
                          v-bind:class="{
                            'sub-nav-item-active':
                              selectedCommand != null &&
                              selectedCommand.Name === cmd.Name
                          }"
                        >
                          {{ cmd.Label }}
                        </b-nav-item>
                      </b-collapse>
                      <b-nav-item
                        @click="onCommandItemClick('n1ql')"
                        v-bind:class="{
                          'nav-item-active':
                            selectedCommand != null &&
                            selectedCommand.Name === 'n1ql'
                        }"
                        >N1QL</b-nav-item
                      >
                      <b-nav-item
                        @click="onCommandItemClick('fts')"
                        v-bind:class="{
                          'nav-item-active':
                            selectedCommand != null &&
                            selectedCommand.Name === 'fts'
                        }"
                        >Full Text Search (FTS)</b-nav-item
                      >
                      <b-nav-item
                        v-b-toggle.collapse-acid
                        class="nav-collapse"
                        v-if="hasAcidOperation"
                      >
                        ACID
                      </b-nav-item>
                      <b-collapse
                        id="collapse-acid"
                        v-model="acidVisible"
                        v-if="hasAcidOperation"
                      >
                        <b-nav-item
                          class="sub-nav-item"
                          @click="onCommandItemClick('acid')"
                          v-bind:class="{
                            'sub-nav-item-active':
                              selectedCommand != null &&
                              selectedCommand.Name === 'acid'
                          }"
                          >Generic</b-nav-item
                        >
                        <b-nav-item
                          class="sub-nav-item"
                          @click="onCommandItemClick('acid-beer-sample')"
                          v-if="connectedBucket == 'beer-sample'"
                          v-bind:class="{
                            'sub-nav-item-active':
                              selectedCommand != null &&
                              selectedCommand.Name === 'acid-beer-sample'
                          }"
                          >Beer Sample</b-nav-item
                        >
                      </b-collapse>
                    </b-nav>
                  </div>
                </div>
              </b-card-text>
            </b-card>
          </b-col>
          <b-col cols="4" class="px-1">
            <b-card no-body>
              <b-card-text>
                <div class="play-card-title">
                  2. Provide inputs for
                  {{ selectedCommand != null ? selectedCommand.Label : "" }}
                  command
                </div>
                <hr class="divider" />
                <div class="play-card-content play-card-input">
                  <b-row v-if="isKVCommand">
                    <b-col>
                      <b-row class="my-1">
                        <b-col>
                          <div
                            class="align-self-center input-info float-right"
                            v-on:click.stop="onHelpClick(selectedCommand.Info)"
                          >
                            <font-awesome-icon
                              :icon="icons.info"
                            ></font-awesome-icon>
                          </div>
                          <b-button-group class="float-right">
                            <b-button
                              size="sm"
                              variant="outline-secondary"
                              v-on:click="onApplyHintsClick"
                              :disabled="!selectedCommand"
                            >
                              Use Hints
                            </b-button>
                            <b-button
                              size="sm"
                              variant="outline-secondary"
                              v-on:click="onClearInputsClick"
                              :disabled="!selectedCommand"
                            >
                              Clear Input
                            </b-button>
                            <b-button
                              size="sm"
                              variant="outline-secondary"
                              v-on:click="onRunCommandClick"
                              :disabled="!canRunCommand"
                              >Run</b-button
                            >
                          </b-button-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col>
                          <div
                            class="d-flex flex-column justify-content-start align-items-start cmd-option"
                            v-for="(option,
                            index) in selectedCommandInputOptions"
                            :key="index"
                          >
                            <div class="cmd-option-title">
                              {{ option.Label }}
                            </div>
                            <div class="cmd-option-input align-self-stretch">
                              <b-form-textarea
                                v-model="option.Value"
                                size="sm"
                                v-if="option.InputType == 'TEXT_AREA'"
                                rows="4"
                              ></b-form-textarea>
                              <input
                                type="text"
                                v-model="option.Value"
                                v-else-if="option.InputType == 'INPUT'"
                              />
                              <b-form-select
                                v-model="option.Value"
                                :options="option.InputOptions"
                                size="sm"
                                v-else
                              ></b-form-select>
                            </div>
                            <div
                              class="cmd-option-hint"
                              v-if="option.Hint != ''"
                            >
                              Hint: {{ parseCommandHint(option.Hint) }}
                            </div>
                          </div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <b-row v-else-if="showN1ql">
                    <b-col>
                      <b-row class="my-1">
                        <b-col>
                          <div
                            class="align-self-center input-info float-right"
                            v-on:click.stop="onHelpClick(selectedCommand.Info)"
                          >
                            <font-awesome-icon
                              :icon="icons.info"
                            ></font-awesome-icon>
                          </div>
                          <b-button-group class="float-right">
                            <b-button
                              size="sm"
                              variant="outline-secondary"
                              v-on:click="onClearInputsClick"
                              :disabled="!selectedCommand"
                            >
                              Clear Input
                            </b-button>
                            <b-button
                              size="sm"
                              variant="outline-secondary"
                              v-on:click="onRunCommandClick"
                              :disabled="!canRunCommand"
                              >Execute Query</b-button
                            >
                          </b-button-group>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col>
                          <div
                            class="d-flex flex-column justify-content-start align-items-start cmd-option"
                            v-for="(option,
                            index) in selectedCommandInputOptions"
                            :key="index"
                          >
                            <div class="cmd-option-title">
                              {{ option.Label }}
                            </div>
                            <div class="cmd-option-input align-self-stretch">
                              <b-form-textarea
                                id="queryOrDocument-textarea"
                                v-model="option.Value"
                                size="sm"
                                v-if="option.InputType == 'TEXT_AREA'"
                                rows="4"
                              ></b-form-textarea>
                              <input
                                type="text"
                                v-model="option.Value"
                                v-else
                              />
                            </div>
                            <div class="cmd-option-hint">
                              Hint: {{ parseCommandHint(option.Hint) }}
                            </div>
                          </div>
                          <div
                            class="cmd-option mt-2"
                            v-if="
                              sampleQueries != null && sampleQueries.length > 0
                            "
                          >
                            <b-form inline>
                              <label for="sample-queries-select" class="mr-2"
                                >Selected Sample N1QL Query:</label
                              >
                              <b-form-select
                                id="sample-queries-select"
                                v-model="selectedSampleQuery"
                                :options="sampleQueries"
                                size="sm"
                                @change="onSampleQueryChange"
                              ></b-form-select>
                            </b-form>
                          </div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <b-row v-else-if="showAcid">
                    <b-col>
                      <b-row class="my-1">
                        <b-col>
                          <div
                            class="align-self-center input-info float-right"
                            v-on:click.stop="onHelpClick(selectedCommand.Info)"
                          >
                            <font-awesome-icon
                              :icon="icons.info"
                            ></font-awesome-icon>
                          </div>
                          <b-form inline class="float-right">
                            <b-form-checkbox v-model="txnRollback">
                              Force rollback
                            </b-form-checkbox>
                            <b-button-group class="ml-2">
                              <b-button
                                size="sm"
                                variant="outline-secondary"
                                v-on:click="onApplyHintsClick"
                                :disabled="!selectedCommand"
                                v-if="
                                  selectedCommand.Name == 'acid-beer-sample'
                                "
                              >
                                Use Hints
                              </b-button>
                              <b-button
                                size="sm"
                                variant="outline-secondary"
                                v-on:click="onClearInputsClick"
                                :disabled="!selectedCommand"
                                v-if="
                                  selectedCommand.Name == 'acid-beer-sample'
                                "
                              >
                                Clear Input
                              </b-button>
                              <b-button
                                size="sm"
                                variant="outline-secondary"
                                v-on:click="onRunCommandClick"
                                :disabled="!canRunCommand"
                              >
                                Execute Txn
                              </b-button>
                            </b-button-group>
                          </b-form>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col>
                          <div
                            class="d-flex flex-column justify-content-start align-items-start cmd-option"
                            v-for="(option,
                            index) in selectedCommandInputOptions"
                            :key="index"
                          >
                            <div class="cmd-option-title">
                              {{ option.Label }}
                            </div>
                            <div class="cmd-option-input align-self-stretch">
                              <b-form-textarea
                                id="queryOrDocument-textarea"
                                v-model="option.Value"
                                size="sm"
                                v-if="option.InputType == 'TEXT_AREA'"
                                rows="4"
                              ></b-form-textarea>
                              <input
                                type="text"
                                v-model="option.Value"
                                v-else
                              />
                            </div>
                            <div
                              class="cmd-option-hint"
                              v-if="selectedCommand.Name == 'acid-beer-sample'"
                            >
                              Hint: {{ parseCommandHint(option.Hint) }}
                            </div>
                          </div>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                  <b-row v-else>
                    <b-col>
                      <div class="cmd-input-placeholder">
                        Select a command.
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </b-card-text>
            </b-card>
          </b-col>
          <b-col cols="6" class="pl-1">
            <b-card no-body>
              <b-card-text>
                <div class="play-card-title">
                  3. View results
                </div>
                <hr class="divider" />
                <div class="play-card-results">
                  <b-form-textarea
                    id="results-textarea"
                    size="sm"
                    :value="resultsText"
                    rows="8"
                  ></b-form-textarea>
                </div>
              </b-card-text>
            </b-card>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </b-tab>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { _ } from "vue-underscore";
import bucketOptions from "@/logic/bucketOptions";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

export default {
  name: "SdkDemoPlay",
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      icons: {
        info: faInfoCircle
      },
      kvVisible: false,
      acidVisible: false,
      selectedSampleQuery: null,
      txnRollback: false,
      nonKVCommands: ["n1ql", "fts"],
      acidCommands: ["acid", "acid-beer-sample"]
    };
  },
  methods: {
    onHelpClick: function(msg) {
      this.displayMessageBox("Information", msg);
    },
    displayMessageBox: function(title, msg) {
      this.$bvModal.msgBoxOk(msg, {
        title: title,
        buttonSize: "sm",
        okVariant: "secondary",
        headerClass: "p-2 border-bottom-0",
        footerClass: "p-2 border-top-0",
        centered: true
      });
    },
    getChildCommands: function(cmdType) {
      return _.where(this.availableCommands, { Parent: cmdType });
    },
    onCommandItemClick: function(cmd) {
      this.clearResults();
      this.clearCommandInputs();
      if (this.nonKVCommands.includes(cmd) || this.acidCommands.includes(cmd)) {
        this.kvVisible = false;
      }
      if (!this.acidCommands.includes(cmd)) {
        this.acidVisible = false;
      }
      this.setSdkCommand(cmd);
    },
    onCommandOptionChange: function(type, evt) {
      console.log(type);
      console.log(evt.target.value);
    },
    parseCommandHint: function(hint) {
      //TODO:  handle possible case of multiple substitutions
      if (hint.includes("{{DOC_ID}}") && this.sampleDocIds != null) {
        let numDocuments = this.sampleDocIds.length;
        let rand = Math.floor(Math.random() * numDocuments);
        let newHint = hint.replace("{{DOC_ID}}", this.sampleDocIds[rand]);
        return newHint;
      }
      if (hint.includes("{{DOC_IDS}}") && this.sampleDocIds != null) {
        let docIds = this.sampleDocIds.slice(0, 3);
        let newHint = hint.replace("{{DOC_IDS}}", JSON.stringify(docIds));
        return newHint;
      }
      if (hint.includes("{{BUCKET}}")) {
        let bucketName = this.connectedBucket;
        if (this.connectedBucket.includes("-")) {
          bucketName = "`" + this.connectedBucket + "`";
        }
        let newHint = hint.replace("{{BUCKET}}", bucketName);
        return newHint;
      }
      if (hint.includes("{{SAMPLE_DOC_ID}}")) {
        let sampleDocId = bucketOptions.getSampleDocId(this.connectedBucket);
        if (sampleDocId) {
          let newHint = hint.replace("{{SAMPLE_DOC_ID}}", sampleDocId);
          return newHint;
        }
      }
      if (hint.includes("{{SAMPLE_DOC}}")) {
        let sampleDoc = bucketOptions.getSampleDocument(this.connectedBucket);
        if (sampleDoc) {
          let newHint = hint.replace(
            "{{SAMPLE_DOC}}",
            JSON.stringify(sampleDoc, null, 2)
          );
          return newHint;
        }
      }

      return hint;
    },
    clearCommandInputs: function() {
      if (this.selectedCommand != null) {
        for (let i = 0; i < this.selectedCommand.InputOptions.length; i++) {
          this.selectedCommand.InputOptions[i].Value = "";
        }
      }
    },
    onApplyHintsClick: function() {
      for (let i = 0; i < this.selectedCommand.InputOptions.length; i++) {
        let hint = this.parseCommandHint(
          this.selectedCommand.InputOptions[i].Hint
        );
        this.selectedCommand.InputOptions[i].Value = hint;
      }
    },
    onSampleQueryChange: function() {
      for (let i = 0; i < this.selectedCommand.InputOptions.length; i++) {
        if (this.selectedCommand.InputOptions[i].Name === "query") {
          let query = bucketOptions.getSampleQuery(
            this.connectedBucket,
            this.selectedSampleQuery
          );
          this.selectedCommand.InputOptions[i].Value = query;
        }
      }
    },
    onClearInputsClick: function() {
      if (this.showN1ql) {
        this.selectedSampleQuery = null;
      }
      this.clearCommandInputs();
    },
    onRunCommandClick: function() {
      let options = [];
      for (let i = 0; i < this.selectedCommandInputOptions.length; i++) {
        options.push(this.selectedCommandInputOptions[i]);
      }
      let payload = {
        inputOptions: options,
        language: this.selectedLanguage
      };
      //add if the acid txn should rollback or not
      if (this.selectedCommand.Name.includes("acid")) {
        payload.inputOptions.push({
          Name: "rollback",
          Value: this.txnRollback
        });
      }
      this.runSdkCommand(payload);
    },
    ...mapActions("sdkCommandStore", [
      "setSdkCommand",
      "clearResults",
      "runSdkCommand",
      "addAvailableOutputCommand"
    ])
  },
  computed: {
    canRunCommand: function() {
      //TODO:  various commands that have required inputs?
      return this.selectedCommand != null;
    },
    isKVCommand: function() {
      return this.selectedCommand != null && !(this.showN1ql || this.showAcid);
    },
    showN1ql: function() {
      if (this.selectedCommand == null) {
        return false;
      }
      if (this.selectedCommand.Name === "n1ql") {
        return true;
      } else {
        return false;
      }
    },
    sampleQueries: function() {
      if (this.connectedBucket) {
        let sampleQueries = bucketOptions.getSampleQueries(
          this.connectedBucket
        );
        if (sampleQueries != null) {
          return sampleQueries;
        } else {
          return null;
        }
      }
      return null;
    },
    selectedCommandInputOptions: function() {
      //TODO:  get/set and update input options in store?  This might not be necessary
      let inputOptions = [];
      if (this.selectedCommand != null) {
        return this.selectedCommand.InputOptions;
      }

      return inputOptions;
    },
    hasAcidOperation: function() {
      return this.selectedLanguage && this.selectedLanguage == "JAVA30b";
    },
    showAcid: function() {
      let acidCommands = ["acid", "acid-beer-sample"];
      if (this.selectedCommand == null) {
        return false;
      }
      if (acidCommands.includes(this.selectedCommand.Name)) {
        return true;
      } else {
        return false;
      }
    },
    ...mapState({
      isConnected: state => state.sdkConnectStore.isConnected,
      selectedLanguage: state => state.sdkStore.selectedLanguage,
      availableCommands: state => state.sdkCommandStore.availableCommands,
      selectedCommand: state => state.sdkCommandStore.selectedCommand,
      sampleDocIds: state => state.sdkCommandStore.sampleDocIds,
      connectedBucket: state => state.sdkConnectStore.connectionSettings.Bucket,
      resultsText: state => state.sdkCommandStore.results
    })
  }
};
</script>

<style scoped>
.play-card-title {
  font-size: 1em;
  font-weight: bold;
  padding-top: 5px;
  padding-left: 5px;
}

.play-card-content,
.play-card-results {
  font-size: 0.9em;
}

.play-card-input {
  padding-right: 5px;
  padding-bottom: 5px;
}

.play-card-results {
  padding: 5px;
  max-height: 300px;
  overflow-y: auto;
}

.cmd-menu-wrapper {
  max-height: 300px;
  overflow-y: auto;
}

#cmd-menu li.nav-item a {
  text-align: left;
  font-weight: bold;
  color: #495057;
}

.nav-collapse .nav-link::after {
  display: inline-block;
  content: "";
  vertical-align: 0;
  border-top: 0.3em solid transparent;
  border-right: 0;
  border-bottom: 0.3em solid transparent;
  border-left: 0.3em solid;
  margin-left: 10px;
}

#cmd-menu li.nav-item:hover {
  background-color: #e4e5e6;
}

#cmd-menu li.nav-item:hover > a {
  color: #495057;
}

#cmd-menu ul li[aria-expanded="true"] {
  background: #e4e5e6;
}
#cmd-menu ul li[aria-expanded="true"] > a {
  color: #495057;
}

#cmd-menu ul li[aria-expanded="true"] > a::after {
  transform: rotate(90deg);
  transition-duration: 500ms;
}

#cmd-menu .sub-nav-item {
  padding-left: 20px;
}

#cmd-menu .sub-nav-item.sub-nav-item-active,
#cmd-menu .nav-item.nav-item-active {
  background: #007bff;
}

#cmd-menu .sub-nav-item.sub-nav-item-active a,
#cmd-menu .nav-item.nav-item-active a {
  color: #fff;
}

.cmd-option {
  margin-left: 5px;
}

.cmd-option-title {
  font-size: 1em;
  font-weight: bold;
}

.cmd-option-input {
  /*min-width: 130px;
  max-width: 130px;
  min-height: 30px;
  max-height: 30px;*/
  font-size: 0.85em;
  height: auto;
  outline: none;
}

.cmd-option-input input[type="text"] {
  width: 100%;
  border: solid 1px #ddd;
  border-radius: 4px;
}

.cmd-option-hint {
  font-size: 0.75em;
  color: rgb(187, 186, 186);
}

.input-info {
  font-size: 1.3em;
  font-weight: normal;
  margin-left: 5px;
  cursor: pointer;
  outline: none;
  margin: 0 20px 0 20px;
  /*max-height: 45px;
  line-height: 45px;*/
}
</style>
