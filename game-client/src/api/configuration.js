import axios from "axios"

export default class Configuration {
  constructor(uri) {
    this.api = axios.create({ baseURL: uri })
  }

  getData(branch) {
    return this.api.get(`/${branch}/game`).then((response) => response.data)
  }
}
