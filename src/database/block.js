const db = require('./db')


/**
 * 保存房间封禁信息
 * @param info {{
 *  uid:Number,
    room:Number,
    operator:Number,
    name:String,
    dmscore:Number,
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveBlockMessage = async (info)=>{
    try {
        await new db.block(info).save()
        return {status:true,message:`OK`}
    }catch (e) {
        return {status:false,message:e.message}
    }
}



module.exports = {
    saveBlockMessage
}