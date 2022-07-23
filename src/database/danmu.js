const db = require ('./db')


/**
 *
 * @param danmu {{
 *  uid:Number,
    room:Number,
    guard:Number,
    message:String,
    medalInfo:{
        level:Number,
        name:String,
        owner:{
            uid:Number,
            name:String,
            room:Number,
        }
    }
 * }}
 * @returns {Promise<{message, status: boolean}>}
 */
const saveDanmuInfo = async (danmu)=>{
    try{
        await new db.danmu(danmu).save()
        return {status:true,message:`OK`}
    }catch (e) {
        return {status:false,message:e.message}
    }
}

/**
 * 在红包参与信息刷新之后,立即拉取最后一次发送对应信息的用户
 * ,此方法可能存在高峰参与时的异常,但目前并无更好方法
 * @param room {number} 房间号
 * @param message {string} 参与弹幕
 * @returns {Promise<{message: string, status: boolean, uid:number|NumberConstructor?}>}
 */
const getRedPacketParticipant = async (room,message)=>{
    try {
        const res = await db.danmu.findOne({room:room,message:message}).sort({sendTime:-1}).exec()
        if (res === null){
            return {status:true,message:`No result`}
        }
        return {status:true,message:'OK',uid:res["uid"]}
    }catch (e) {
        return {status:false,message:e.message}
    }
}


module.exports = {
    saveDanmuInfo,
    getRedPacketParticipant
}