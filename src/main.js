import Vue from 'vue';
import App from './App.vue';
import * as firebase from 'firebase';
import store from './store/';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

new Vue({
  store,
  vuetify,
  render: h => h(App),
  created() {
    firebase.auth().signInAnonymously();
    this.$store.dispatch('fetchCaches');
    this.$store.dispatch('watchCaches');
  }
}).$mount('#app');
