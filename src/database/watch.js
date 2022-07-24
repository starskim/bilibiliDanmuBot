const db = require('./db')


/**
 * 保存房间观看人数历史信息
 * @param info {{
 *     room:Number,
 *     amount:Number,
 * }}
 * @returns {Promise<{message, status: boolean}>}
 */
const saveWatchInfo = async (info) => {
    try {
        await new db.watch(info).save()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


module.exports = {
    saveWatchInfo
}