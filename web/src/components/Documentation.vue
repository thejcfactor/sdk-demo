<template>
  <div class="documentation-wrapper">
    <b-embed type="iframe" aspect="16by9" :src="documentationUrl"> </b-embed>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Documentation",
  data: function() {
    return {};
  },
  methods: {},
  computed: {
    ...mapState({
      selectedLanguage: state => state.sdkStore.selectedLanguage,
      documentationUrl: state => state.sdkCommandStore.currentDocumentationUrl
    })
  }
};
</script>

<style scoped>
.documentation-wrapper {
  padding: 1em;
  max-height: 380px;
  overflow-y: auto;
}
</style>
