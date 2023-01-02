import axios from 'axios'

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    // Requests should be made to http://SERVICE-NAME.NAME-SPACE.svc.cluster.local...
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    })
  } else {
    // We are in the browser
    // Requests should be made with a base URL of ''
    return axios.create({ baseURL: '' })
  }
}
