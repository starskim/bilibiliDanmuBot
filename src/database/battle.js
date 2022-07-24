const db = require('./db')


/**
 * 保存大乱斗开始数据
 * @param infos {{
 *     room:Number,
 *     hash:Number,
 *     info:{
 *         target:Number,
 *         self:Number,
 *         voteName:String,
 *         type:Number
 *     },
 *     time:{
 *         start:Date,
 *         end:Date
 *     }
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveNewBattleInfo = async (infos)=>{
    try {
        await new db.battle(infos).save()
        return {status:true,message:`OK`}
    }catch (e) {
        return {status:false,message:e.message}
    }
}


/**
 * 保存大乱斗进程中的进度信息(通常发送在双方票数被改变)
 * @param infos {{
 * room:Number,
 * hash:Number,
 * progress:{
 *     self:{
 *         room:Number,
 *         votes:Number,
 *         bestUser:String
 *     },
 *     target:{
 *         room:Number,
 *         votes:Number,
 *         bestUser:String
 *     }
 * }
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const updateBattleProgressInfo = async (infos)=>{
    try {
        await db.battle.updateOne({room:infos.room,hash:infos.hash},{
            $push:{
                progress: infos.progress
            }
        }).exec()
        return {status:true,message:'OK'}
    }catch (e) {
        return {status:false,message:e.message}
    }
}


/**
 *
 * @param infos {{
 *     room:Number,
 *     hash:Number,
 *     winner:{
 *         room:Number,
 *         uid:Number,
 *         name:String,
 *         face:String,
 *         exp:{
 *             level:Number,
 *             ulLevel:Number,
 *         },
 *         bestUser:{
 *             uid:Number,
 *             name:String,
 *             face:String,
 *             votes:Number,
 *             ulLevel:Number
 *         }
 *     },
 *     self:{
 *         room:Number,
 *         uid:Number,
 *         name:String,
 *         face:String,
 *         exp:{
 *             level:Number,
 *             ulLevel:Number,
 *         },
 *         bestUser:{
 *             uid:Number,
 *             name:String,
 *             face:String,
 *             votes:Number,
 *             ulLevel:Number
 *         }
 *     }
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const updateBattleResult = async (infos)=>{
    try {
        await db.battle.updateOne({room:infos.room,hash:infos.hash},{
            $set:{
                winner:infos.winner,
                self:infos.self
            }
        }).exec()
        return {status:true,message:'OK'}
    }catch (e) {
        return {status:false,message:e.message}
    }
}


/**
 *
 * @param infos {{
 *     room:Number,
 *     hash:Number,
 *     users:[{
 *         id:Number,
 *         name:String,
 *         face:String,
 *         score:Number
 *     }]
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const updateBattleAssistUsers= async (infos)=>{
    try {
        await db.battle.updateOne({room:infos.room,hash:infos.hash},{
            $push:{
                assistList: infos.users
            }
        }).exec()
        return {status:true,message:'OK'}
    }catch (e) {
        return {status:false,message:e.message}
    }
}

module.exports = {
    saveNewBattleInfo,
    updateBattleResult,
    updateBattleProgressInfo,
    updateBattleAssistUsers
}