import Crawler from "../../../apis/crawler";
import Scrapyd from "../../../apis/scrapyd";
import router from "../../../router/index"

// Create Crawler
export const createCrawler = ({ commit }, playload) => {
    commit('SET_LOADING',true)
    commit('CLEAR_OTHER_ERRORS')

    Crawler.createCrawler(playload.form).then(response => {

        // commit('SET_CRAWLERDATA', response.data);
        commit('SET_LOADING',false)
        // playload.vm.crawlerDeleted = true
        // playload.vm.crawlerDeletedMessage = response.data.message
        // router.push({ name: 'crawlers_list' });
        }).catch((error) => {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
            commit('SET_CRAWLERDATA', null);
            commit('SET_LOADING',false);
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            let error_data = error.response.data
            console.log(error.response.status)
            // commit('SET_CRAWLERDATA', null);
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        
        commit('SET_LOADING',false)
    })
    
}


//Run Crawler
export const runCrawler = ({ commit, dispatch }, playload) => {
    commit('SET_LOADING',true)
    commit('CLEAR_OTHER_ERRORS')
    commit('SET_LOADING_CRAWLER_EXECUTION', true)
    Crawler.runCrawler(playload.id).then(response => {
        console.log(response.data)
        // if(response.data.start_url){
        //     commit('SET_CRAWLER_URL', response.data.auth_token)
        // }
        commit('SET_RUNNING_CRAWLER', response.data)
        commit('SET_LOADING_CRAWLER_EXECUTION', false)
        commit('SET_LOADING',false)
        dispatch('getAllCrawlers', playload.form)
        dispatch('getCrawlerDetailsApi')
        commit('CLEAR_OTHER_ERRORS')
        commit('SET_RUNNING_CRAWLER_TASK_ID', response.data['task_id'])
        // router.push({ name: 'dashboard' });
        }).catch((error) => {
            commit('SET_RUNNING_CRAWLER', null)
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
            commit('SET_LOADING_CRAWLER_EXECUTION', false)
            commit('SET_LOADING',false);
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            let error_data = error.response.data
            console.log(error.response.status)
            commit('SET_RUNNING_CRAWLER', null)
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        commit('SET_LOADING_CRAWLER_EXECUTION', false)
        commit('SET_LOADING',false)
    })
    
}


// Get Crawlers
export const getAllCrawlers = ({ commit, dispatch  }, form) => {
    commit('SET_LOADING',true)
    commit('CLEAR_OTHER_ERRORS')

    Crawler.getAllCrawlers().then(response => {
        // if(response.data.start_url){
        //     commit('SET_CRAWLER_URL', response.data.auth_token)
        // }
        commit('SET_CRAWLERS_DATA', response.data);
        dispatch('getRuningJobs', form)
        commit('SET_LOADING',false)
        // router.push({ name: 'dashboard' });
        }).catch((error) => {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
            // commit('SET_CRAWLERDATA', null);
            commit('SET_LOADING',false);
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            let error_data = error.response.data
            console.log(error.response.status)
            commit('SET_CRAWLERS_DATA', null);
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        
        commit('SET_LOADING',false)
    })
    
}


// Get Running jobs
export const getRuningJobs = ({ commit}, form) => {
    commit('SET_LOADING_TO_SCRAPYD',true)
    commit('CLEAR_OTHER_ERRORS')
    Scrapyd.getRuningJobs(form).then(response => {
        let pending = response.data['pending']
        let running = response.data['running']
        let finished = response.data['finished']
        if(pending.length > 0 ){
            // pending['state'] = 'pending'
            var pending_result = pending.map(function(el) {
                var o = Object.assign({}, el);
                o.state = 'pending';
                o.isActive = true;
                return o;
            })
            commit('SET_JOB',pending_result)
            commit('SET_JOB_STATE', 'pending')
        }
        else if(running.length > 0){
            var running_result = running.map(function(el) {
                var o = Object.assign({}, el);
                o.state = 'running';
                o.isActive = true;
                return o;
            })
            commit('SET_JOB',running_result)
            commit('SET_JOB_STATE', 'running')
        }
        else if(finished.length > 0){
            var finished_result = finished.map(function(el) {
                var o = Object.assign({}, el);
                o.state = 'finished';
                o.isActive = false;
                return o;
            })
            commit('SET_FINISHED_JOBS',finished_result)
            commit('SET_JOB_STATE', 'finished')
        }
        
        commit('SET_LOADING_TO_SCRAPYD',false)
        }).catch((error) => {
            error = error+". Can't connect to the server.JOBS"
            commit('SET_OTHER_ERRORS',error)
            commit('SET_LOADING_TO_SCRAPYD',false);
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            console.log(error.response.status)
            commit('SET_CRAWLERS_DATA', null);
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        
        commit('SET_LOADING_TO_SCRAPYD',false)
    })
    
}

// Cancel Running jobs
export const cancelRunningJob = ({ commit, dispatch }, form) => {
    commit('SET_LOADING',true)
    commit('CLEAR_OTHER_ERRORS')
    commit('SET_LOADING_CRAWLER_EXECUTION', true)
    
    Scrapyd.cancelRunningJob(form).then(response => {
        // if(response.data.start_url){
        //     commit('SET_CRAWLER_URL', response.data.auth_token)
        // }
        // commit('SET_CRAWLERDATA', response.data);
        commit('SET_LOADING_CRAWLER_EXECUTION', false)
        commit('SET_LOADING',false)
        // router.push({ name: 'crawlers_list' });
        }).catch((error) => {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
            commit('SET_LOADING',false);
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            let error_data = error.response.data
            console.log(error.response.status)
            // commit('SET_CRAWLERDATA', null);
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        
        commit('SET_LOADING',false)
        commit('SET_LOADING_CRAWLER_EXECUTION', false)
    })
    
}

// Delete Crawler
export const deleteCrawler = ({ commit, dispatch }, playload )=> {
    commit('CLEAR_OTHER_ERRORS')
    commit('DELETING_CRAWLER_LOADING', true)
    Crawler.deleteCrawler(playload.crawler_id).then(response => {
        // if(response.data.start_url){
        //     commit('SET_CRAWLER_URL', response.data.auth_token)
        // }
        playload.vm.crawlerAlert = true
        playload.vm.crawlerAlertMessage = response.data.message
        playload.vm.crawlerAlertIcon = 'mdi-delete-sweep'
        commit('DELETING_CRAWLER_LOADING', false)
        dispatch('getAllCrawlers', playload.crawlerInProcess)
        // router.push({ name: 'crawlers_list' });
        }).catch((error) => {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
            commit('DELETING_CRAWLER_LOADING',false);
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            let error_data = error.response.data
            console.log(error.response.status)
            // commit('SET_CRAWLERDATA', null);
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        
        commit('DELETING_CRAWLER_LOADING', false)
    })
    
}

// Crawler Details
export const getCrawlerDetailsApi = ({ commit })=> {
    commit('CLEAR_OTHER_ERRORS')
    commit('CRAWLER_DETAILS_LOADING', true)
    Crawler.getCrawlerDetails().then(response => {
        commit('SET_CRAWLER_DETAILS', response.data)
        commit('CRAWLER_DETAILS_LOADING', false)
        // router.push({ name: 'crawlers_list' });
        }).catch((error) => {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
            commit('CRAWLER_DETAILS_LOADING',false);
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            let error_data = error.response.data
            console.log(error.response.status)
            // commit('SET_CRAWLERDATA', null);
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        
        commit('CRAWLER_DETAILS_LOADING', false)
    })
    
}

// Crawler logfile
export const getLogfile = ({ commit }, form)=> {
    commit('CLEAR_OTHER_ERRORS')
    Scrapyd.getLogfile(form).then(response => {
        // console.log(response.data)
        
        commit('SET_CRAWLER_LOGFILE', response.data)
        // commit('CRAWLER_DETAILS_LOADING', false)
        // router.push({ name: 'crawlers_list' });
        }).catch((error) => {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
            commit('CRAWLER_DETAILS_LOADING',false);
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            let error_data = error.response.data
            console.log(error.response.status)
            // commit('SET_CRAWLER_LOGFILE', '')
            // commit('SET_CRAWLERDATA', null);
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        
        // commit('CRAWLER_DETAILS_LOADING', false)
    })
    
}

// get products Data
export const getProductsData = ({ commit })=> {
    commit('CLEAR_OTHER_ERRORS')
    commit('SET_LOADING_PRODUCTS_DATA', true)
    Crawler.getProductsData().then(response => {
        console.log("PRODUCTS DATA")
        commit('SET_LOADING_PRODUCTS_DATA', false)
        commit('SET_PRODUCTS_DATA', response.data)
        // commit('CRAWLER_DETAILS_LOADING', false)
        // router.push({ name: 'crawlers_list' });
        }).catch((error) => {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
            commit('SET_LOADING_PRODUCTS_DATA', false)
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            let error_data = error.response.data
            console.log(error.response.status)
            // commit('SET_CRAWLER_LOGFILE', '')
            // commit('SET_CRAWLERDATA', null);
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        commit('SET_LOADING_PRODUCTS_DATA', false)
        // commit('CRAWLER_DETAILS_LOADING', false)
    })
    
}

export const dropProductsData = ({ commit }, vm)=> {
    commit('CLEAR_OTHER_ERRORS')
    commit('SET_LOADING_PRODUCTS_DROP', true)
    Crawler.dropProductsData().then(response => {
        console.log("PRODUCTS DROP")
        commit('SET_PRODUCTS_DATA', [])
        commit('SET_LOADING_PRODUCTS_DROP', false)
        vm.dropProductsDataAlert = true
        vm.dropProductsDataAlertMessage = response.data.message
        vm.dropProductsDataAlertIcon = 'mdi-database-check'
        // commit('CRAWLER_DETAILS_LOADING', false)
        // router.push({ name: 'crawlers_list' });
        }).catch((error) => {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
            commit('SET_LOADING_PRODUCTS_DROP', false)
    })
    .catch((error) => {
        if(error.response != undefined)
        {
            let error_data = error.response.data
            console.log(error.response.status)
            // commit('SET_CRAWLER_LOGFILE', '')
            // commit('SET_CRAWLERDATA', null);
            if (error.response.status != 400) {
                let error_message = error.response.status+" "+error.response.statusText
                commit('SET_OTHER_ERRORS',error_message)
            }
        }
        else
        {
            error = error+". Can't connect to the server."
            commit('SET_OTHER_ERRORS',error)
        }
        
        commit('SET_LOADING_PRODUCTS_DROP', false)
        // commit('CRAWLER_DETAILS_LOADING', false)
    })
    
}










