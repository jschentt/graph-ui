import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Icon } from 'antd'
import Loadable from 'react-loadable'
import { inject, observer } from 'mobx-react'

const Loading = () => {
  return <Icon type="loading" />
}

const AsyncLogin = Loadable({
  loader: () => import('page/Graph'),
  loading: Loading,
})

const pagesWithHome = [
  { path: '/', component: AsyncLogin },
  { path: '/admin', component: AsyncLogin },
]

@inject(stores => {
  const {
    baseStore: { getBaseGraph },
  } = stores
  return {
    getBaseGraph,
  }
})
@observer
class AppRoute extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    this.props.getBaseGraph()
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          {pagesWithHome.map(item => {
            const Com = item.component
            return (
              <Route
                exact
                key={item.path}
                path={item.path}
                render={props => (
                  <Com {...props} systemName={this.state.systemName} />
                )}
              />
            )
          })}
        </Switch>
      </BrowserRouter>
    )
  }
}

export default AppRoute
