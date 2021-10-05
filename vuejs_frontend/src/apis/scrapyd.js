import Api from './server'


const SCRAPYD_LIST_JOBS_END_POINT = "/listjobs"
const SCRAPYD_CANCEL_JOB = "/crawler_cancel_process"
const SCRAPYD_LOGFILE_END_POINT = "/read_log"

export default{

    async getRuningJobs(form){
        return Api.post(SCRAPYD_LIST_JOBS_END_POINT, form)
    },

    async cancelRunningJob(form){
        return Api.post(SCRAPYD_CANCEL_JOB, form)
    },

    async getLogfile(form){
        let bodyFormData = new FormData();
        let headers = { "Content-Type": "multipart/form-data" };
        bodyFormData.append('task_id', form['task_id']);
        return Api.post(SCRAPYD_LOGFILE_END_POINT, bodyFormData, headers)
    }

}