const db = require('./db')

/**
 * 保存客户端注册信息
 * @param info {{
 *    hash: String,
 *     name: String,
 *     version: String,
 *     amount:{
 *         room:Number,
 *         mission:Number
 *     },
 *     ip: String,
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const registerNewClient = async (info) => {
    try {
        await new db.client(info).save()
        return {status: true, message: `OK`}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


/**
 * 更新客户端所保持连接的房间数量
 * @param info {{
 *     id:String,
 *     amount:{
 *         room:Number,
 *         mission:Number
 *     }
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const updateClientAmounts = async (info) => {
    try {
        await db.client.updateOne({hash: info.id}, {
            $set: {
                amount:{
                    room:info.amount.room,
                    mission:info.amount.mission
                }
            }
        }).exec()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}

/**
 * 从数据库中删除客户端连接信息
 * @param id {string} 客户端唯一id
 * @returns {Promise<{message: string, status: boolean}>}
 */
const removeClientFromDB = async (id) => {
    try {
        const res = await db.client.deleteOne({hash: id}).exec()
        if (res.deletedCount === 0) {
            return {status: false, message: `Database didn't accept request`}
        }
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}

/**
 * 获取当前执行任务数最少的客户端
 * @returns {Promise<{client:String?, message: string, status: boolean}>}
 */
const getClientForMission = async ()=>{
    try {
        const res = await db.client.findOne().sort({"amount.mission":-1}).exec()
        if (res === null){
            return {status:false,message:`No any client can be found`}
        }else{
            return {status:true,message:'OK',client:res["hash"]}
        }
    }catch (e) {
        return {status:false,message:e.message}
    }
}

module.exports = {
    registerNewClient,
    removeClientFromDB,
    updateClientAmounts,
    getClientForMission
}