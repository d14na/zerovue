/**
 * Create a Vuex Store
 */
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        INCREMENT (state) {
            state.count++
        }
    },
    actions: {
        increment ({ commit }) {
            commit('INCREMENT')
        }
    }
})

module.exports = store
