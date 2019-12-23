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
      </b-collapse>
    </b-navbar>
    <router-view class="top-margin" />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "App",
  data: function() {
    return {};
  },
  methods: {
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
      languageOptions: state => state.sdkStore.languageOptions
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
</style>
