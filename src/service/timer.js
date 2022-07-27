const crontab = require('node-crontab')
const {cronJobTrigger} = require("./trigger")
const jobList = []

//开始运行基本事项处理器
const startAllScheduleJob = async () => {
    //每小时运行执行一次房间拉取
    jobList.push(crontab.scheduleJob("* * * * *", async () => {
        cronJobTrigger.emit('GET_ROOM_FROM_INDEX')
    }))
    //每分钟推送所有任务到各个空闲的客户端
    jobList.push(crontab.scheduleJob('* * * * *', async () => {
        cronJobTrigger.emit('MISSION_DEPLOY')
    }))
}

module.exports = {
    startAllScheduleJob
}
