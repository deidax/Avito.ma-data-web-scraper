import axios from 'axios'

let Api = axios.create({
    baseURL: "http://192.168.99.106:8000"
})



export default Api;