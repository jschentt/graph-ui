import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import { observer, inject } from 'mobx-react'
import SearchInput from 'component/SearchInput'
import Graph from 'component/Graph'
import './index.less'

const prefixCls = 'GraphRule'
@inject(stores => {
  const { baseStore: { baseData } = {} } = stores
  return {
    baseData,
  }
})
@observer
class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseData: [],
      sourceData: this.props.baseData,
    }
  }

  componentDidMount() {
    const { sourceData } = this.state
    //获取节点数据
    const nodeData = sourceData.data
      .map(item => {
        return item.graph.nodes.map(value => {
          return { id: parseInt(value.id), name: value.properties.name }
        })
      })
      .reduce((pre, cur) => pre.concat(cur))

    //获取关系数据
    const relData = sourceData.data
      .map(item => {
        return item.graph.relationships.map(value => {
          return {
            id: parseInt(value.id),
            source: parseInt(value.startNode),
            target: parseInt(value.endNode),
            tag: value.properties.name,
          }
        })
      })
      .reduce((pre, cur) => pre.concat(cur))

    sessionStorage.setItem('nodeData', JSON.stringify(nodeData))
    sessionStorage.setItem('relData', JSON.stringify(relData))

    this.setState({ baseData: [nodeData, relData] })
  }

  onSearch = value => {
    const [nodes, rels] = [
      JSON.parse(sessionStorage.getItem('nodeData')) || [],
      JSON.parse(sessionStorage.getItem('relData')) || [],
    ]

    const nodeObj = nodes.filter(item => item.name.indexOf(value) != -1)
    const unique = arr => {
      let unique = {}
      arr.forEach(function(item) {
        unique[JSON.stringify(item)] = item //键名不会重复
      })
      arr = Object.keys(unique).map(function(u) {
        return JSON.parse(u)
      })
      return arr
    }

    const nodeSource = unique(nodeObj)
    let nodeData = []
    const child = nodeSource.pop()
    const relObj = rels.filter(item => item.source == child.id)
    const relData = unique(relObj)
    relData.forEach(item => {
      nodeData.push(...unique(nodes.filter(value => value.id == item.target)))
    })
    nodeData = [].concat(unique(nodeData), [child])
    this.setState({ baseData: [nodeData, relData] })
  }

  render() {
    const { baseData } = this.state
    return (
      <Row className={prefixCls}>
        <div className={`${prefixCls}-operate`}>
          <div>
            <span className={`${prefixCls}-label`}>知识图谱数据查询:</span>
          </div>
          <SearchInput
            placeholder="输入关键词"
            value=""
            onSearch={this.onSearch}
          />
        </div>
        <Graph baseData={baseData} onSearch={this.onSearch} />
      </Row>
    )
  }
}

Home.propTypes = {
  baseData: PropTypes.object,
}

export default Home
