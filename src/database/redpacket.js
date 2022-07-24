const db = require('./db')


/**
 * 保存新红包事件信息
 * @param redPacketInfo {{winners: *[], senderInfo: {uid: Number, face: String, name: String}, price: Number, time: {start: Date, end: Date},amount:Number, message: String, room: Number, hash: Number, users: *[], gifts: *[]}}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveNewRedPacketInfo = async (redPacketInfo) => {
    try {
        await new db.redPacket(redPacketInfo).save()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


/**
 * 将用户推送到此次红包活动的参与者列表中
 * @param uid {Number}
 * @param packetId {Number}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const pushUserJoinRedPacketEvent = async (uid, packetId) => {
    try {
        await db.redPacket.updateOne({hash: packetId}, {
            $push: {
                users: {
                    uid: uid
                }
            },
            $inc: {amount: 1}
        }).exec()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


/**
 * 保存红包中奖用户到数据库
 * @param users {array}
 * @param packetId {Number}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const pushWinnerUsersToRedPacketEvent = async (users, packetId) => {
    try {
        await db.redPacket.updateOne({hash: packetId}, {
            $set: {
                winners: users
            }
        }).exec()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


/**
 * 更新实际参与人数
 * @param pocketId {number}
 * @param amount {number}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const updateRedPacketUserAmount = async (pocketId, amount) => {
    try {
        await db.redPacket.updateOne({hash: pocketId}, {
            $set: {
                amount: amount
            }
        }).exec()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


module.exports = {
    saveNewRedPacketInfo,
    pushUserJoinRedPacketEvent,
    updateRedPacketUserAmount,
    pushWinnerUsersToRedPacketEvent
}