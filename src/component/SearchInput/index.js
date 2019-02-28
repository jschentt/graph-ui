import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input, AutoComplete } from 'antd'

class SearchInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      dataSource: [],
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value })
      return
    }
  }

  handleSearch = value => {
    this.setState({ value, dataSource: [] })
    const nodesDatas = JSON.parse(sessionStorage.getItem('nodeData')) || []
    let tempSource = nodesDatas
      .map(item => (item.name.indexOf(value) != -1 ? item.name : undefined))
      .filter(item => item)
    tempSource = Array.from(new Set(tempSource))

    if (tempSource.length > 0) {
      this.setState({ dataSource: tempSource })
    } else {
      this.setState({
        dataSource: !value ? [] : [value, value + value, value + value + value],
      })
    }
  }

  render() {
    const { placeholder, style, onSearch, size, enterButton } = this.props
    const { value, dataSource } = this.state
    return (
      <AutoComplete
        style={{ width: 200 }}
        dataSource={dataSource}
        onSearch={this.handleSearch}
        optionLabelProp="value"
      >
        <Input.Search
          enterButton={enterButton}
          size={size}
          placeholder={placeholder}
          style={style}
          value={value}
          onSearch={onSearch}
        />
      </AutoComplete>
    )
  }
}

SearchInput.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  onSearch: PropTypes.func.isRequired,
  size: PropTypes.string,
  enterButton: PropTypes.bool,
}

SearchInput.defaultProps = {
  placeholder: '',
  style: { width: 200 },
  size: 'default',
  enterButton: true,
}

export default SearchInput
