<template>
  <b-tab class="p-2" active>
    <template v-slot:title>
      <div class="d-inline-flex flex-row justify-content-start">
        <div>
          1. Connect
        </div>
        <div class="connection-pending-icon" v-show="!isConnected">
          <font-awesome-icon
            id="connection-pending"
            :icon="icons.warning"
          ></font-awesome-icon>
          <b-popover
            target="connection-pending"
            placement="right"
            triggers="hover"
          >
            Connection needs to be made.
          </b-popover>
        </div>
        <div class="connection-success-icon" v-show="isConnected">
          <font-awesome-icon :icon="icons.success"></font-awesome-icon>
        </div>
      </div>
    </template>
    <b-card class="main-card" no-body>
      <b-card-body>
        <div
          class="d-flex flex-column justify-content-center align-items-stretch waiting-to-connect-wrapper"
          v-if="waitingToConnect"
        >
          <div class="align-self-center waiting-to-connect-spinner">
            <hollow-dots-spinner
              :animation-duration="1000"
              :dot-size="15"
              :dots-num="3"
              color="#070999"
            />
          </div>
          <div class="align-self-center waiting-to-connect-text">
            Connecting to cluster...
          </div>
        </div>
        <b-row v-if="showAlert">
          <b-col>
            <b-alert v-model="showAlertSuccess" variant="success" dismissible>
              Successfully connected to cluster. Use the 'Play' tab to see
              various commands available.
            </b-alert>
            <b-alert v-model="showAlertFailure" variant="danger" dismissible>
              Not able to connected to cluster.
            </b-alert>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <div class="d-flex flex-row justify-content-start">
              <b-form class="flex-fill">
                <label class="float-left mb-0" size="sm" for="host-name">
                  Host:
                </label>
                <b-input
                  id="host-name"
                  v-model="host"
                  class="mr-sm-2"
                  size="sm"
                  aria-describedby="host-help-block"
                ></b-input>
                <b-form-text id="host-help-block">
                  default: {{ defaultConnection.Host }}
                </b-form-text>
              </b-form>
              <div
                class="align-self-center connection-info"
                v-on:click.stop="onHelpClick('host')"
              >
                <font-awesome-icon
                  id="host-info"
                  :icon="icons.info"
                ></font-awesome-icon>
              </div>
            </div>
          </b-col>
          <b-col>
            <div class="d-flex flex-row justify-content-start">
              <b-form class="flex-fill">
                <label class="float-left mb-0" size="sm" for="bucket-name">
                  Bucket:
                </label>
                <b-input
                  id="bucket-name"
                  v-model="bucket"
                  class="mr-sm-2"
                  size="sm"
                  aria-describedby="bucket-help-block"
                ></b-input>
                <b-form-text id="bucket-help-block">
                  default: {{ defaultConnection.Bucket }}
                </b-form-text>
              </b-form>
              <div
                class="align-self-center connection-info"
                v-on:click.stop="onHelpClick('bucket')"
              >
                <font-awesome-icon
                  id="bucket-info"
                  :icon="icons.info"
                ></font-awesome-icon>
              </div>
            </div>
          </b-col>
          <b-col>
            <div class="d-flex flex-row justify-content-start">
              <b-form class="flex-fill">
                <label class="float-left mb-0" size="sm" for="username">
                  Username:
                </label>
                <b-input
                  id="username"
                  v-model="username"
                  class="mr-sm-2"
                  size="sm"
                  aria-describedby="username-help-block"
                ></b-input>
                <b-form-text id="username-help-block">
                  default: {{ defaultConnection.Username }}
                </b-form-text>
              </b-form>
              <div
                class="align-self-center connection-info"
                v-on:click.stop="onHelpClick('username')"
              >
                <font-awesome-icon
                  id="username-info"
                  :icon="icons.info"
                ></font-awesome-icon>
              </div>
            </div>
          </b-col>
          <b-col>
            <div class="d-flex flex-row justify-content-start">
              <b-form class="flex-fill">
                <label class="float-left mb-0" size="sm" for="pw">
                  Password:
                </label>
                <b-input
                  id="pw"
                  v-model="password"
                  class="mr-sm-2"
                  size="sm"
                  aria-describedby="pw-help-block"
                ></b-input>
                <b-form-text id="pw-help-block">
                  default: {{ defaultConnection.Password }}
                </b-form-text>
              </b-form>
              <div
                class="align-self-center connection-info"
                v-on:click.stop="onHelpClick('password')"
              >
                <font-awesome-icon
                  id="pw-info"
                  :icon="icons.info"
                ></font-awesome-icon>
              </div>
            </div>
          </b-col>
        </b-row>
        <b-row class="mt-2">
          <b-col cols="6" offset="1">
            <b-card no-body align="left">
              <b-card-text>
                <div class="sdk-accordian-tabs">
                  <div class="sdk-accordian-tab">
                    <input type="checkbox" id="chbx1" />
                    <label class="sdk-accordian-label" for="chbx1"
                      >What's all this for?</label
                    >
                    <div class="sdk-accordian-content">
                      <div class="sdk-notes-div">
                        The information here (host, bucket, username and
                        password) is needed in order to connect to a Couchbase
                        cluster. The defaults can be applied (click the "Apply
                        Defaults" button on the right), or you can look at the
                        information icon for each option to see more details
                        about the option.
                      </div>
                    </div>
                  </div>
                </div>
                <!--<div class="connect-details-title">
                  What's all this for?
                </div>
                <hr class="divider" />
                <div class="connect-info">
                  The information here (host, bucket, username and password) is
                  needed in order to connect to a Couchbase cluster. The
                  defaults can be applied (click the "Apply Defaults" button on
                  the right), or you can look at the information icon for each
                  option to see more details about the option.
                </div>-->
              </b-card-text>
            </b-card>
          </b-col>
          <b-col>
            <b-button-group class="float-right">
              <b-button
                size="sm"
                variant="outline-secondary"
                v-on:click="onApplyDefaultsClick"
              >
                Apply Defaults
              </b-button>
              <b-button
                size="sm"
                variant="outline-secondary"
                v-on:click="onClearInputsClick"
              >
                Clear Inputs
              </b-button>
              <b-button
                size="sm"
                variant="outline-secondary"
                v-on:click="onConnectClick"
                :disabled="!connectionReady"
                >Connect</b-button
              >
            </b-button-group>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </b-tab>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faInfoCircle,
  faCheckCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { HollowDotsSpinner } from "epic-spinners";

export default {
  name: "SdkDemoConnect",
  components: {
    FontAwesomeIcon,
    HollowDotsSpinner
  },
  data: function() {
    return {
      icons: {
        info: faInfoCircle,
        warning: faExclamationTriangle,
        success: faCheckCircle
      },
      showAlertSuccess: false,
      showAlertFailure: false,
      waitingToConnect: false
    };
  },
  created: function() {
    this.reset(false);
  },
  methods: {
    onHelpClick: function(type) {
      let msg = "";
      if (type == "host") {
        msg =
          "Name of the host that should be used to connect to a Couchbase cluster.";
      } else if (type == "bucket") {
        msg = "Name of the bucket in the cluster to connect to.";
      } else if (type == "username") {
        msg = "";
      } else if (type == "password") {
        msg = "";
      }

      this.displayMessageBox("Information", msg);
    },
    displayMessageBox: function(title, msg) {
      this.$bvModal.msgBoxOk(msg, {
        title: title,
        size: "sm",
        buttonSize: "sm",
        okVariant: "secondary",
        headerClass: "p-2 border-bottom-0",
        footerClass: "p-2 border-top-0",
        centered: true
      });
    },
    onApplyDefaultsClick: function() {
      this.host = this.defaultConnection.Host;
      this.bucket = this.defaultConnection.Bucket;
      this.username = this.defaultConnection.Username;
      this.password = this.defaultConnection.Password;
    },
    onClearInputsClick: function() {
      this.host = "";
      this.bucket = "";
      this.username = "";
      this.password = "";
    },
    onConnectClick: function() {
      this.waitingToConnect = true;
      this.showAlertSuccess = false;
      this.showAlertFailure = false;
      let connectSettings = {
        Host: this.host,
        Bucket: this.bucket,
        Username: this.username,
        Password: this.password,
        Language: this.selectedLanguage
      };
      let self = this;
      this.connectToBucket(connectSettings).then(response => {
        self.waitingToConnect = false;
        if (response) {
          self.showAlertSuccess = true;
        } else {
          self.showAlertFailure = true;
        }

        let connectCommand = {
          Name: "connect",
          Label: "Connect"
        };

        let availConnectCommand = {
          Name: "connect",
          Label: "Connect",
          Selected: false
        };

        self.addOrSetViewedCommand(connectCommand);
        self.addAvailableOutputCommand(availConnectCommand);
      });
    },
    onCodeClick: function() {
      console.log("Code link click!");
    },
    ...mapActions("sdkConnectStore", [
      "setHost",
      "setBucket",
      "setUsername",
      "setPassword",
      "connectToBucket"
    ]),
    ...mapActions("sdkCommandStore", [
      "reset",
      "addOrSetViewedCommand",
      "addAvailableOutputCommand"
    ])
  },
  computed: {
    host: {
      get: function() {
        return this.connection.Host;
      },
      set: function(newValue) {
        this.setHost(newValue);
      }
    },
    bucket: {
      get: function() {
        return this.connection.Bucket;
      },
      set: function(newValue) {
        this.setBucket(newValue);
      }
    },
    username: {
      get: function() {
        return this.connection.Username;
      },
      set: function(newValue) {
        this.setUsername(newValue);
      }
    },
    password: {
      get: function() {
        return this.connection.Password;
      },
      set: function(newValue) {
        this.setPassword(newValue);
      }
    },
    connectionReady: function() {
      return (
        this.host &&
        this.host !== "" &&
        this.bucket &&
        this.bucket !== "" &&
        this.username &&
        this.username !== "" &&
        this.password &&
        this.password !== ""
      );
    },
    ...mapState({
      isConnected: state => state.sdkConnectStore.isConnected,
      defaultConnection: state =>
        state.sdkConnectStore.defaultConnectionSettings,
      connection: state => state.sdkConnectStore.connectionSettings,
      selectedLanguage: state => state.sdkStore.selectedLanguage,
      showAlert: state => state.sdkConnectStore.showConnectAlert
    })
  }
};
</script>

<style scoped>
.waiting-to-connect-wrapper {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 100%;
  height: 100%;
  /*padding: 20px 0 0 20px;*/
  margin: 20px 0 0 20px;
  background-color: #fff;
  z-index: 3001;
  opacity: 0.9;
}

.loader-text {
  font-size: 1em;
  font-weight: bold;
}

.connection-pending-icon {
  margin-left: 10px;
  color: #ecba4f;
}

.connection-success-icon {
  margin-left: 10px;
  color: green;
}

.connection-info {
  font-size: 1.2em;
  font-weight: normal;
  margin-left: 5px;
  cursor: pointer;
  outline: none;
  /*max-height: 45px;
  line-height: 45px;*/
}

.connect-details-title {
  font-size: 1em;
  font-weight: bold;
  padding-top: 5px;
  padding-left: 5px;
}

.connect-info {
  font-size: 0.9em;
  padding-left: 5px;
  overflow-y: auto;
}

/* sdk-accordian styles*/

.sdk-accordian-tabs {
  border-radius: 4px;
  overflow: hidden;
  margin: 0.25rem;
}

.sdk-accordian-tab {
  width: 100%;
  color: #000;
  overflow: hidden;
}

.sdk-accordian-tab input {
  position: absolute;
  opacity: 0;
  z-index: -1;
}

.sdk-accordian-label {
  display: flex;
  /* if using ::before for caret, dont use*/
  justify-content: space-between;
  font-size: 1rem;
  padding: 0.1em;
  background: transparent;
  cursor: pointer;
  margin-bottom: 0px;
}

.sdk-accordian-label:hover {
  color: #0000ee;
}

.sdk-accordian-label::after {
  content: "\276F";
  width: 1em;
  height: 1em;
  text-align: center;
  transition: all 0.35s;
}

.sdk-accordian-content {
  max-height: 0;
  padding: 0 1em;
  color: #000;
  background: white;
  transition: all 0.35s;
}

.sdk-accordian-tab input:checked + .sdk-accordian-label {
  background: transparent;
}

.sdk-accordian-tab input:checked + .sdk-accordian-label:hover {
  background: transparent;
  color: #0000ee;
}

.sdk-accordian-tab input:checked + .sdk-accordian-label::after {
  transform: rotate(90deg);
}

.sdk-accordian-tab input:checked ~ .sdk-accordian-content {
  max-height: 100vh;
  padding: 0.5em 0.5em;
}
</style>
