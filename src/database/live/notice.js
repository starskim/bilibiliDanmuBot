const db = require('./db')


/**
 *
 * @param info {{room:Number,type:Number,name:String,message:String,selfMessage:String}} 信息
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveNoticeInfo = async (info) => {
    try {
        await new db.notice(info).save()
        return {status: true, message: `OK`}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


module.exports = {
    saveNoticeInfo
}