const db = require('./db')


/**
 * 保存新舰长信息
 * @param info {{
 *     room:Number,
 *     uid:Number,
 *     level:Number,
 *     amount:Number,
 *     price:Number,
 *     time:{
 *         start:Date,
 *         end:Date
 *     }
 * }} 舰长信息
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveNewGuardInfo = async (info) => {
    try {
        await new db.guard(info).save()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


module.exports = {
    saveNewGuardInfo
}