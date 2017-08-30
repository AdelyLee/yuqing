/**
 * Created by lyc on 17-7-7.
 */
import index from '../../src/page/index/index.vue'
export default {
  renderPageChart(state) {
    alert(state.user_name)
  },

  updateTheme(state, theme) {
    state.theme = theme
    index.methods.renderPageData()
  }
}
