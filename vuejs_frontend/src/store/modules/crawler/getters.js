export const getCrawlers = (state) => {
    return state.crawlers;
}

export const getStartUrl = (state) => {
    return state.start_url;
}

export const getOtherErrors = (state) => {
    return state.other_errors;
}

export const isLoading = (state) => {
    return state.loading
}

export const isLoadingScrapyd = (state) => {
    return state.loading_scrapyd
}

export const getRunningCrawler = (state) => {
    return state.running_crawler
}

export const getRunningCrawlerTaskId = (state) => {
    return state.running_crawler
}

export const getJob = (state) => {
    return state.job
}

export const getFinishedJobs = (state) => {
    return state.finished_jobs
}

export const getJobState = (state) => {
    return state.job_state
}

export const getLoadingRunningCrawlerExecution = (state) => {
    return state.loading_crawler_execution
}


export const getPollingInterval = (state) => {
    return state.polling_interval
}


export const getDeletingCrawlerLoading = (state) => {
    return state.deleting_crawler_loading
}

export const getCrawlerDetailsLoading = (state) => {
    return state.crawler_details_loading
}

export const getCrawlerDetails = (state) => {
    return state.crawler_details
}

export const getCrawlerLogfile = (state) => {
    return state.crawler_logfile
}

export const getProductsDataFromDB = (state) => {
    return state.products_data
}

export const getLoadingProductsData = (state) => {
    return state.loading_products_data
}

export const getLoadingProductsDrop = (state) => {
    return state.loading_products_drop
}

