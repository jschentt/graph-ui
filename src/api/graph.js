import axios from 'axios'

export const getGraph = () => {
  return axios.get('/mock/data.json')
}
