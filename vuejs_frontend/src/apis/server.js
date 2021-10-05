import axios from 'axios'

let Api = axios.create({
    baseURL: "http://0.0.0.0:8000"
})



export default Api;