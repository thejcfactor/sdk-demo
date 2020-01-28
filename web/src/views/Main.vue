<template>
  <b-container fluid>
    <b-row align-h="center">
      <b-col cols="10">
        <b-row>
          <b-col class="px-0">
            <b-tabs card>
              <SdkDemoConnect></SdkDemoConnect>
              <SdkDemoPlay></SdkDemoPlay>
            </b-tabs>
          </b-col>
        </b-row>
        <b-row> </b-row>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="10" class="px-0">
        <b-tabs v-model="tabIndex" card>
          <b-tab class="p-2" title="Code">
            <Code></Code>
          </b-tab>
          <b-tab class="p-2" title="Documentation">
            <Documentation></Documentation>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import SdkDemoConnect from "@/components/SdkDemoConnect";
import SdkDemoPlay from "@/components/SdkDemoPlay";
import Code from "@/components/Code";
import Documentation from "@/components/Documentation";
import { mapActions, mapState } from "vuex";

export default {
  name: "Main",
  components: {
    SdkDemoConnect,
    SdkDemoPlay,
    Code,
    Documentation
  },
  data: function() {
    return {};
  },
  methods: {
    ...mapActions("sdkStore", ["setTabIndex"])
  },
  computed: {
    tabIndex: {
      get: function() {
        return this.storeTabIndex;
      },
      set: function(newValue) {
        this.setTabIndex(newValue);
      }
    },
    ...mapState({
      storeTabIndex: state => state.sdkStore.codeOrDocTabIndex
    })
  }
};
</script>

<style scoped>
.sample-code-title-div {
  border-bottom: 1px solid #cdcdcd;
  margin-top: 1em;
}

.sample-code-title-text {
  font-weight: bold;
  font-size: 1.25em;
  color: #000;
}
</style>
