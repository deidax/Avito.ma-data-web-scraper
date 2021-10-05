import Api from './server'
import AuthHeader from './authHeader'


const RUN_CRAWLER_END_POINT = "/crawler/"
const CRAWLER_END_POINT = "/crawler_manager"
const CRAWLER_DETAILS_END_POINT ="/crawler_details_manager"
const GET_PRODUCTS_DATA_END_POINT ="/get_products_data"
const DROP_PRODUCTS_DATA_END_POINT ="/drop_products_data"


export default{

    async createCrawler(form){
        return Api.post(CRAWLER_END_POINT, form)
    },

    async runCrawler(id){
        
        return Api.get(RUN_CRAWLER_END_POINT+id)
    },

    async getAllCrawlers(){
        return Api.get(CRAWLER_END_POINT)
    },

    async deleteCrawler(id){
        return Api.delete(CRAWLER_END_POINT+'/'+id)
    },

    async getCrawlerDetails(){
        return Api.get(CRAWLER_DETAILS_END_POINT)
    },
    async getProductsData(){
        return Api.get(GET_PRODUCTS_DATA_END_POINT)
    },

    async dropProductsData(){
        return Api.get(DROP_PRODUCTS_DATA_END_POINT)
    }
    




    
}