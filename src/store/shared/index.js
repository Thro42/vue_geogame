export default {
  state: {
    loading: false,
    loadingTasks: 0,
    error: null
  },
  mutations: {
    setLoading (state, payload) {
      console.log('setLoading', payload)
      if (payload === true) {
        state.loadingTasks++
        state.loading = true
      } else {
        state.loadingTasks--
        if (state.loadingTasks <= 0) {
          state.loadingTasks = 0
          state.loading = false
        }
      }
      console.log('loadingTasks', state.loadingTasks)
    },
    clearLoading (state) {
      state.loadingTasks = 0
      state.loading = false
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    clearError ({ commit }) {
      commit('clearError')
    },
    setLoading ({ commit }, payload) {
      commit('setLoading', payload)
    },
    clearLoading ({ commit }) {
      commit('clearLoading')
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
}
