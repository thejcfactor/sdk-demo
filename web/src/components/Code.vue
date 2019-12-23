<template>
  <b-row align-h="center">
    <b-col cols="5" class="pr-1">
      <b-card no-body>
        <b-card-text>
          <div class="code-card-title">
            Current Command
            <div class="info" v-on:click.stop="onHelpClick('current-cmd')">
              <font-awesome-icon :icon="icons.info"></font-awesome-icon>
            </div>
          </div>
          <hr class="divider" />
          <div class="code-card-content">
            <div class="code-image-zoom" v-if="imageExists()">
              <!--https://github.com/vuejs-templates/webpack/issues/450-->
              <v-zoomer :limitTranslation="false">
                <img
                  class="zoom-img"
                  :src="require(`@/assets/images/${getImageUrl()}`)"
                  style="object-fit: contain; width: 100%; height: 100%;"
                />
              </v-zoomer>
              <!--<b-img src="@/assets/images/nodejs/get.png"></b-img>-->
            </div>
            <div class="" v-else>
              Under construction. Please view documentation for code.
            </div>
          </div>
        </b-card-text>
      </b-card>
    </b-col>
    <b-col cols="2" class="px-1">
      <b-card no-body>
        <b-card-text>
          <div class="code-card-title">
            Viewed Commands
            <div class="info" v-on:click.stop="onHelpClick('viewed-cmds')">
              <font-awesome-icon :icon="icons.info"></font-awesome-icon>
            </div>
          </div>
          <hr class="divider" />
          <div
            class="d-flex flex-column justify-content-start align-items-stretch viewed-cmds-list"
          >
            <div
              class="viewed-cmd-img"
              v-for="(cmd, index) in viewedCommands"
              :key="index"
            >
              <div
                class="viewed-cmd-img-wrapper"
                v-if="imageExists(cmd)"
                @click.stop="onViewedCommandClick(cmd)"
              >
                <div
                  class="viewed-cmd-img-div"
                  v-bind:class="{
                    'selected-cmd-img': currentViewedCommand.Name == cmd.Name
                  }"
                >
                  <b-img
                    class="img-background"
                    :src="require(`@/assets/images/${getImageUrl(cmd)}`)"
                    fluid
                  ></b-img>
                  <div class="viewed-cmd-overlay">
                    <div
                      class="viewed-cmd-label"
                      v-bind:class="{
                        'selected-cmd-img-label':
                          currentViewedCommand.Name == cmd.Name
                      }"
                    >
                      {{ cmd.Label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-card-text>
      </b-card>
    </b-col>
    <b-col cols="5" class="pl-1">
      <b-card no-body>
        <b-card-text>
          <div
            class="d-flex flex-row justify-content-center align-items-center"
          >
            <div class="fake-element">Fake</div>
            <div class="code-card-title d-flex">
              Code to output
              <div class="info" v-on:click.stop="onHelpClick('output-cmds')">
                <font-awesome-icon :icon="icons.info"></font-awesome-icon>
              </div>
            </div>
            <div class="ml-auto download-btn-div">
              <button
                id="download-btn"
                class="code-btn"
                v-on:click="onDownloadCodeClick"
                :disabled="!(selectedOutputCommands.length > 0)"
              >
                <font-awesome-icon :icon="icons.Download"></font-awesome-icon>
              </button>
              <b-popover target="download-btn" placement="top" triggers="hover">
                Download selected output commands.
              </b-popover>
            </div>
          </div>
          <hr class="divider" />
          <div class="code-card-content">
            <b-row align-h="center">
              <b-col>
                <b-card no-body class="m-1">
                  <b-card-text>
                    <div class="code-card-sub-title">
                      Available Commands
                    </div>
                    <hr class="divider" />
                    <div
                      class="d-flex flex-column justify-content-start align-items-stretch available-cmds-list"
                    >
                      <div
                        v-for="(cmd, index) in availableOutputCommands"
                        :key="index"
                        class="available-cmd-list-item"
                        @click="onAvailCommandClick(cmd)"
                        v-bind:class="{
                          'item-selected': cmd.Selected
                        }"
                      >
                        {{ cmd.Label }}
                      </div>
                    </div>
                  </b-card-text>
                </b-card>
              </b-col>
              <b-col cols="1">
                <div
                  class="d-flex flex-column justify-content-center align-items-center"
                >
                  <div>
                    <button
                      id="all-to-output-btn"
                      class="code-btn"
                      v-on:click="onMoveCommand('AllToOut')"
                      :disabled="!(availableOutputCommands.length > 0)"
                    >
                      <font-awesome-icon
                        :icon="icons.DblRight"
                      ></font-awesome-icon>
                    </button>
                  </div>
                  <div>
                    <button
                      id="avail-to-output-btn"
                      class="code-btn"
                      v-on:click="onMoveCommand('AvailToOut')"
                      :disabled="!(selectedAvailableCommands.length > 0)"
                    >
                      <font-awesome-icon
                        :icon="icons.Right"
                      ></font-awesome-icon>
                    </button>
                  </div>
                  <div>
                    <button
                      id="output-to-avail-btn"
                      class="code-btn"
                      v-on:click="onMoveCommand('OutToAvail')"
                      :disabled="!(selectedSelectedOutputCommands.length > 0)"
                    >
                      <font-awesome-icon :icon="icons.Left"></font-awesome-icon>
                    </button>
                  </div>
                  <div>
                    <button
                      id="all-to-avail-btn"
                      class="code-btn"
                      v-on:click="onMoveCommand('AllToAvail')"
                      :disabled="!(selectedOutputCommands.length > 0)"
                    >
                      <font-awesome-icon
                        :icon="icons.DblLeft"
                      ></font-awesome-icon>
                    </button>
                  </div>
                </div>
              </b-col>
              <b-col>
                <b-card no-body>
                  <b-card-text>
                    <div class="code-card-sub-title">
                      Selected Commands
                    </div>
                    <hr class="divider" />
                    <div
                      class="d-flex flex-column justify-content-start align-items-stretch selected-cmds-list"
                    >
                      <div
                        v-for="(cmd, index) in selectedOutputCommands"
                        :key="index"
                        class="selected-cmd-list-item"
                        @click="onOutputCommandClick(cmd)"
                        v-bind:class="{
                          'item-selected': cmd.Selected
                        }"
                      >
                        {{ cmd.Label }}
                      </div>
                    </div>
                  </b-card-text>
                </b-card>
              </b-col>
            </b-row>
          </div>
        </b-card-text>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faFileDownload,
  faAngleRight,
  faAngleLeft,
  faAngleDoubleRight,
  faAngleDoubleLeft,
  faInfoCircle
} from "@fortawesome/free-solid-svg-icons";
import languageOptions from "@/logic/languageOptions";
import { saveAs } from "file-saver";
import { _ } from "vue-underscore";

export default {
  name: "Code",
  components: {
    FontAwesomeIcon
  },
  data: function() {
    return {
      icons: {
        Download: faFileDownload,
        Right: faAngleRight,
        Left: faAngleLeft,
        DblRight: faAngleDoubleRight,
        DblLeft: faAngleDoubleLeft,
        info: faInfoCircle
      }
    };
  },
  methods: {
    onHelpClick: function(type) {
      let msg = "";
      if (type == "current-cmd") {
        msg =
          "Current command being viewed.\n" +
          "Scroll up while mouse is over code to zoom in.\n" +
          "Scroll down while mouse is over code to zoom out.\n" +
          "Click and hold on code to move to specific area.\n" +
          "Double-click code to reset zoom/movement.";
      } else if (type == "viewed-cmds") {
        msg =
          'List of all commands that have been viewed in the "Play" section above.';
      } else if (type == "output-cmds") {
        msg =
          "Select commands to then download sample code." +
          'Select available command(s) and move (>) to "Selected Commmands" section, or move all available commands (>>) over.\n' +
          "If you don't want a command's sample code to be downloaded move the command(s) back to the \"Selected Commmands\" section (<), or move all selected commands (<<) back over.\n";
        ("Click the download button to download the sample code.");
      }

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
    imageExists: function(cmd) {
      //https://forum.vuejs.org/t/how-to-check-if-path-of-file-exist/59345
      try {
        let imgUrl = this.getImageUrl(cmd);
        //let fullUrl = "@/assets/images/" + imgUrl;
        //console.log(fullUrl);
        require(`@/assets/images/${imgUrl}`);
        return true;
      } catch {
        //console.log("error");
        return false;
      }
    },
    getImageUrl: function(cmd) {
      if (this.selectedLanguage == null || this.currentViewedCommand == null) {
        return null;
      }

      let lang = this.selectedLanguage.toLowerCase();
      if (cmd == null || typeof cmd === "undefined") {
        let imgUrl = lang + "/" + this.currentViewedCommand.ImgName;
        return imgUrl;
      } else {
        let imgUrl = lang + "/" + cmd.ImgName;
        return imgUrl;
      }
    },
    onViewedCommandClick: function(cmd) {
      //console.log("onViewedCommandClick");
      //console.log(cmd);
      this.setViewedCommand(cmd);
    },
    onDownloadCodeClick: function() {
      console.log("onDownloadCodeClick");
      let commands = _.map(this.selectedOutputCommands, function(cmd) {
        return cmd.Name;
      });
      let codeText = languageOptions.getCodeSnippet(
        this.selectedLanguage,
        commands
      );
      let blob = new Blob([codeText], {
        type: "text/plain;charset=utf-8"
      });
      let outputName = "sampleCode.txt";
      if (this.selectedLanguage.includes("JAVA")) {
        outputName = "sampleCode.java";
      }
      saveAs(blob, outputName);
    },
    onAvailCommandClick: function(cmd) {
      this.toggleAvailableOutputCommand(cmd);
    },
    onOutputCommandClick: function(cmd) {
      this.toggleSelectedOutputCommand(cmd);
    },
    onMoveCommand: function(moveType) {
      console.log(moveType);
      if (moveType == "AvailToOut") {
        //Note that this JSON.parse(JSON.stringify) works b/c these are arrays of simple objects
        let availableCmds = JSON.parse(
          JSON.stringify(this.selectedAvailableCommands)
        );
        for (let i = 0; i < availableCmds.length; i++) {
          this.toggleAvailableOutputCommand(availableCmds[i]);
          this.removeAvailableOutputCommand(availableCmds[i]);
          availableCmds[i].Selected = false;
          this.addSelectedOutputCommand(availableCmds[i]);
        }
      } else if (moveType == "AllToOut") {
        //Note that this JSON.parse(JSON.stringify) works b/c these are arrays of simple objects
        let availableCmds = JSON.parse(
          JSON.stringify(this.availableOutputCommands)
        );
        for (let i = 0; i < availableCmds.length; i++) {
          this.toggleAvailableOutputCommand(availableCmds[i]);
          this.removeAvailableOutputCommand(availableCmds[i]);
          availableCmds[i].Selected = false;
          this.addSelectedOutputCommand(availableCmds[i]);
        }
      } else if (moveType == "OutToAvail") {
        //Note that this JSON.parse(JSON.stringify) works b/c these are arrays of simple objects
        let outputCmds = JSON.parse(
          JSON.stringify(this.selectedSelectedOutputCommands)
        );
        for (let i = 0; i < outputCmds.length; i++) {
          this.toggleSelectedOutputCommand(outputCmds[i]);
          this.removeSelectedOutputCommand(outputCmds[i]);
          outputCmds[i].Selected = false;
          this.addAvailableOutputCommand(outputCmds[i]);
        }
      } else if (moveType == "AllToAvail") {
        //Note that this JSON.parse(JSON.stringify) works b/c these are arrays of simple objects
        let outputCmds = JSON.parse(
          JSON.stringify(this.selectedOutputCommands)
        );
        for (let i = 0; i < outputCmds.length; i++) {
          this.toggleSelectedOutputCommand(outputCmds[i]);
          this.removeSelectedOutputCommand(outputCmds[i]);
          outputCmds[i].Selected = false;
          this.addAvailableOutputCommand(outputCmds[i]);
        }
      }
    },
    ...mapActions("sdkCommandStore", [
      "setViewedCommand",
      "toggleAvailableOutputCommand",
      "addAvailableOutputCommand",
      "removeAvailableOutputCommand",
      "toggleSelectedOutputCommand",
      "addSelectedOutputCommand",
      "removeSelectedOutputCommand"
    ])
  },
  computed: {
    ...mapState({
      selectedLanguage: state => state.sdkStore.selectedLanguage,
      currentViewedCommand: state => state.sdkCommandStore.currentViewedCommand,
      viewedCommands: state => state.sdkCommandStore.viewedCommands,
      availableOutputCommands: state =>
        state.sdkCommandStore.availableOutputCommands,
      selectedOutputCommands: state =>
        state.sdkCommandStore.selectedOutputCommands
    }),
    ...mapGetters("sdkCommandStore", {
      selectedAvailableCommands: "selectedAvailableOutputCommands",
      selectedSelectedOutputCommands: "selectedSelectedOutputCommands"
    })
  }
};
</script>

<style scoped>
.code-card-title {
  font-size: 1em;
  font-weight: bold;
  padding-top: 5px;
  padding-left: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.code-card-sub-title {
  font-size: 1em;
  font-weight: bold;
  padding-top: 5px;
  padding-left: 5px;
}

.info {
  font-size: 1.2em;
  font-weight: normal;
  margin-left: 5px;
  cursor: pointer;
  outline: none;
  margin-left: 20px;
}

.code-btn {
  border: 1px solid #6c757d;
  border-radius: 4px;
  background-color: white;
  color: #6c757d;
  font-size: 0.9em;
  cursor: pointer;
  float: left;
  outline: none;
}

.code-btn:hover {
  background-color: #6c757d;
  color: #fff;
}

.fake-element {
  margin-right: auto;
  visibility: hidden;
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
  margin: 5px 5px 0 0;
}

.code-card-content {
  font-size: 0.9em;
}

.code-image-zoom {
  margin: 1em;
  border: 1px solid #000;
  border-radius: 4px;
}

.viewed-cmds-list {
  max-height: 300px;
  overflow-y: auto;
}

.viewed-cmd-img {
  padding: 0.25em 0.25em 0 0.25em;
}

.viewed-cmds-list > div.viewed-cmd-img:last-child {
  padding-bottom: 0.25em;
}

.viewed-cmd-img-div {
  position: relative;
}

.selected-cmd-img {
  color: blue;
  border: 2px solid blue;
  border-radius: 4px;
}

.viewed-cmd-img-wrapper {
  width: 100%;
  height: auto;
}

.viewed-cmd-img-wrapper:hover {
  cursor: pointer;
}

.viewed-cmd-overlay {
  position: absolute;
  top: 0%;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.45);
}

.viewed-cmd-label {
  font-size: 2em;
  font-weight: bold;
  color: #000;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
}

.selected-cmd-img-label {
  color: blue;
}

.available-cmd-list-item,
.selected-cmd-list-item {
  display: block;
  text-align: left;
  padding-left: 25%;
  min-height: 30px;
  line-height: 30px;
  font-size: 1em;
  border-top: 1px solid #ddd;
}

.available-cmd-list-item:hover,
.selected-cmd-list-item:hover {
  background-color: #e4e5e6;
  cursor: pointer;
}

.available-cmd-list-item.item-selected,
.selected-cmd-list-item.item-selected {
  background: #007bff;
  color: #fff;
}

.available-cmds-list {
  max-height: 300px;
  overflow-y: auto;
}

.available-cmds-list > .available-cmd-list-item:first-child,
.selected-cmds-list > .selected-cmd-list-item:first-child {
  border-top: none;
}
</style>
