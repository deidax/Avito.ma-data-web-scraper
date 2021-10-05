import axios from 'axios'

export let Scrapyd = axios.create({
    baseURL: "http://localhost:6800"
})

export default Scrapyd;