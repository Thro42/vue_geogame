import Vue from 'vue';
import Vuex from 'vuex';
import caches from './caches';
import shared from './shared';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    caches: caches,
    shared: shared
  }
});
