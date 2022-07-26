const db = require('./db')


/**
 * 保存superChat被发送时的对应信息
 * @param info {{
 *     room:Number,
 *     hash:Number,
 *     info:{
 *         message:String,
 *         deleted:Boolean,
 *         price:Number,
 *         time:Number,
 *     },
 *     sender:{
 *         uid:Number,
 *         name:String,
 *         face:String,
 *         level:Number,
 *     }
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveNewSuperChatInfos = async (info) => {
    try {
        await db.superChat.updateOne({hash: info.hash}, {
            $set: {
                room: info.room,
                info: {
                    message: info.info.message,
                    deleted: info.info.deleted,
                    price: info.info.price,
                    time: info.info.time
                },
                sender: {
                    uid: info.sender.uid,
                    name: info.sender.name,
                    face: info.sender.face,
                    level: info.sender.level
                }
            }
        }, {upsert: true}).exec()
        //评价:丑的一笔
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


/**
 * 更新小日子过得不错的日本语
 * @param info {{
 *     hash:Number,
 *     message:String
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const updateSuperChatJpnMessage = async (info) => {
    try {
        await db.superChat.updateOne({hash: info.hash}, {
            $set: {
                "info.messageJpn": info.message
            }
        }, {upsert: true}).exec()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}

/**
 * 标记hash对应的superChat为已删除
 * @param info {{
 *     hash:Number
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const markSuperChatAsDeleted = async (info) => {
    try {
        await db.superChat.updateOne({hash: info.hash}, {
            set: {
                "info.deleted": true
            }
        }).exec()

        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


module.exports = {
    markSuperChatAsDeleted,
    updateSuperChatJpnMessage,
    saveNewSuperChatInfos
}