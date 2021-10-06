import axios from 'axios'

let Api = axios.create({
    baseURL: "http://"+location.hostname+":8000"
})



export default Api;