const db = require ('./db')


/**
 *
 * @param silent {{
    room:Number,
    type:string,
    level:Number,
    until:Date,
    method:String
}}
 * @returns {Promise<{message, status: boolean}>}
 */
const saveRoomMuteInfo = async (silent)=>{
    try{
        await new db.silent(silent).save()
        return {status:true,message:`OK`}
    }catch (e) {
        return {status:false,message:e.message}
    }
}

module.exports = {
    saveRoomMuteInfo
}