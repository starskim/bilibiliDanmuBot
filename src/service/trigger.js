const events = require('events')

//创建所需要的事件器以提供触发
const cronJobTrigger = new events.EventEmitter()

module.exports = {
    cronJobTrigger
}