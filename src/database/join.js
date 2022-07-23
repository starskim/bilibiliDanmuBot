const db = require('./db')

/**
 *
 * @param info {{
 *  room:Number,
    uid:Number,
    medal:{
        level:Number,
        name:String
    }
 * }} 用户加入信息
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveUserJoinInfo = async (info) => {
    try {
        await new db.join(info).save()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


module.exports = {
    saveUserJoinInfo
}