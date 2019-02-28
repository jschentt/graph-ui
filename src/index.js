import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import axios from 'axios'
import _ from 'lodash'
import { message, LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import Route from 'page/Route'
import store from 'page/store'
import './index.less'

axios.interceptors.response.use(
  response => response,
  error => {
    const errorMsgMap = {
      401: '登录已失效，请重新登录',
      403: '您无权限查看该界面',
      502: '502 Bad Gateway',
      504: '504 Gateway Timeout',
    }
    const statusCode = _.get(error, 'response.status')
    const errorMsg =
      errorMsgMap[statusCode] ||
      _.get(error, 'response.data.message') ||
      '出现了错误'

    message.error(errorMsg)
    return Promise.reject(errorMsg)
  },
)

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Provider {...store}>
      <Route />
    </Provider>
  </LocaleProvider>,
  document.getElementById('root'),
)
