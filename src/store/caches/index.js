//import * as firebase from 'firebase';
import db from '../firebaseInit';
//const admin = require('firebase-admin');

export default {
  state: {
    startpos: [7.5471869, 52.1693414],
    minZoom: 6,
    zoom: 15,
    repaint: false,
    the_team: 'none',
    caches: []
  },
  mutations: {
    setTeam(state, payload) {
      state.the_team = payload;
    },
    setCaches(state, payload) {
      state.caches = payload;
    },
    setStartpos(state, payload) {
      state.startpos = payload;
    },
    setZoom(state, payload) {
      state.zoom = payload;
    },
    setRepaint(state, payload) {
      state.repaint = payload;
    },
    setFound(state, payload) {
      for (var i = 0; i < state.caches.length; i++) {
        if (state.caches[i].id === payload) {
          state.caches[i].found = true;
          db.collection('caches')
            .doc(state.caches[i].id)
            .update({ found: true, found_by: state.the_team });
        }
      }
    },
    setVisible(state, payload) {
      for (var i = 0; i < state.caches.length; i++) {
        if (state.caches[i].code === payload) {
          state.caches[i].visible = true;
          let _showFor = state.the_team;
          if (state.caches[i].schow_for != 'all') {
            _showFor = 'all';
          }
          db.collection('caches')
            .doc(state.caches[i].id)
            .update({ visible: true, schow_for: _showFor });
        }
      }
    }
  },
  actions: {
    watchCaches({ state, commit }) {
      commit('clearError');
      db.collection('caches').onSnapshot(res => {
        const changes = res.docChanges();
        changes.forEach(change => {
          commit('setRepaint', false);

          if (change.type === 'modified') {
            for (var i = 0; i < state.caches.length; i++) {
              if (state.caches[i].id === change.doc.id) {
                const cache = change.doc.data();
                const newCach = {
                  id: change.doc.id,
                  description: cache.description,
                  header: cache.header,
                  visible: cache.visible,
                  found: cache.found,
                  is_final: cache.is_final,
                  found_by: cache.found_by,
                  schow_for: cache.schow_for,
                  coordinates: [
                    cache.coordinates._lat,
                    cache.coordinates._long
                  ],
                  code: cache.code
                };
                state.caches[i] = newCach;
              }
            }
          }
          commit('setRepaint', true);
        });
      });
    },
    fetchCaches({ commit }) {
      commit('setLoading', true);
      commit('clearError');
      var caches = [];
      var CachesRef = db.collection('caches');
      CachesRef.get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            const cache = doc.data();
            caches.push({
              id: doc.id,
              description: cache.description,
              header: cache.header,
              visible: cache.visible,
              found: cache.found,
              is_final: cache.is_final,
              found_by: cache.found_by,
              schow_for: cache.schow_for,
              coordinates: [cache.coordinates._lat, cache.coordinates._long],
              code: cache.code
            });
          });
          commit('setCaches', caches);
          commit('setLoading', false);
        })
        .catch(error => {
          console.log('fetchCaches:', error);
          commit('setLoading', false);
        });
    },
    fetchFileCaches({ commit }) {
      commit('setLoading', true);
      commit('clearError');
      var myHeaders = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/json'
      });
      // fetch('/static/caches.json', {
      fetch('/data/caches.json', {
        mode: 'no-cors',
        headers: myHeaders
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(cachedata) {
          commit('setCaches', cachedata.caches);
          commit('setStartpos', cachedata.startpos);
          commit('setZoom', cachedata.zoom);
          //this.caches = cachedata.caches;
        });
    },
    setTeam({ commit }, payload) {
      commit('setRepaint', false);
      commit('setTeam', payload);
      commit('setRepaint', true);
    },
    setFound({ commit }, payload) {
      commit('setFound', payload);
    },
    setVisible({ commit }, payload) {
      commit('setVisible', payload);
    }
  },
  /******************************************************************************/
  getters: {
    loadCaches(state) {
      let caches = [];
      if (state.caches.length > 0) {
        caches = state.caches;
      } else {
        console.log('not loaded');
      }
      return caches;
    },
    getRepaint(state) {
      return state.repaint;
    },
    getTeam(state) {
      return state.the_team;
    }
  }
};
