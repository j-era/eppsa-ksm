import axios from "axios"

export default class ContentServer {
  constructor(uri) {
    this.api = axios.create({ baseURL: uri })
  }

  getData(branch = "master") {
    return this.api.get(`/${branch}/content`).then((response) => response.data)
  }
}
