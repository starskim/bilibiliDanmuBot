const db = require('./db')


/**
 * 保存天选中奖人到数据库
 * @param info {{winners: {uid: Number, uname: String, face: String, level: Number, amount: Number}[], hash: Number}}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveAnchorResult = async (info) => {
    try {
        await db.anchor.updateOne({hash: info.hash}, {
            $push: {
                winners: info.winners
            }
        })
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}


/**
 * 保存天选抽奖开始信息
 * @param info {{winners: *[], time: {duration: Number, start: Date}, room, hash: Number, infos: {amount: Number, price: Number, danmu: String, name: String, require: {text: String, type: Number, value: Number}}}}抽奖开始信息
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveAnchorStart = async (info) => {
    try {
        await new db.anchor(info).save()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}

/**
 * 用户加入天选抽奖事件
 * @param info {{
 *     uid:Number,
 *     hash:Number
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const pushUserJoinAnchorEvent = async (info) => {
    try {
        await db.anchor.updateOne({hash: info.hash}, {
            $push: {
                users: {uid: info.uid}
            },
            $inc:{amount:1}
        }).exec()
        return {status: true, message: 'OK'}
    } catch (e) {
        return {status: false, message: e.message}
    }
}

/**
 * 修正更新对应天选的参与人数量
 * @param hash {Number}
 * @param amount {Number}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const updateAnchorUserAmount = async (hash,amount)=>{
    try {
        await db.anchor.updateOne({hash:hash},{
            $set:{
                amount:amount
            }
        }).exec()
        return {status:true,message:'OK'}
    }catch (e) {
        return {status:false,message:e.message}
    }
}
module.exports = {
    saveAnchorResult,
    pushUserJoinAnchorEvent,
    saveAnchorStart,
    updateAnchorUserAmount
}