import { observable, action } from 'mobx'
import { getGraph } from 'api/graph'

class Store {
  @observable
  baseData = {}

  @action
  getBaseGraph = () => {
    return getGraph().then(result => {
      this.baseData = result.data
    })
  }
}

export default new Store()
