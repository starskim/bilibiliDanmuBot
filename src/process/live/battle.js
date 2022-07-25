const logger = require('../../local/logger')
const {
    saveNewBattleInfo,
    updateBattleProgressInfo,
    updateBattleResult,
    updateBattleAssistUsers
} = require("../../database/live/battle");


/**
 *  处理大乱斗开始,填充基本数据到数据库
 * @param infos {{
 *   "cmd": String,
 *   "pk_id": Number,
 *   "pk_status": Number,
 *   "timestamp": Number,
 *   "data": {
 *     "battle_type": Number,
 *     "final_hit_votes": Number,
 *     "pk_start_time": Number,
 *     "pk_frozen_time": Number,
 *     "pk_end_time": Number,
 *     "pk_votes_type": Number,
 *     "pk_votes_add": Number,
 *     "pk_votes_name": String,
 *     "star_light_msg": String,
 *     "pk_countdown": Number,
 *     "final_conf": {
 *       "switch": Number,
 *       "start_time": Number,
 *       "end_time": Number
 *     },
 *     "init_info": {
 *       "room_id": Number,
 *       "date_streak": Number
 *     },
 *     "match_info": {
 *       "room_id": Number,
 *       "date_streak": Number
 *     }
 *   },
 *   "roomid": String
 * }}
 * @param room {Number}
 * @returns {Promise<void>}
 */
const processBattleStart = async (infos, room) => {
    try {
        let battleInfo
        //可能存在init_info 和 match_info 反着来的状态,修正翻转一下
        if (infos.data.init_info.room_id === room) {
            battleInfo = {
                room: room,
                hash: infos.pk_id,
                info: {
                    target: infos.data.match_info.room_id,
                    self: infos.data.init_info.room_id,
                    voteName: infos.data.pk_votes_name,
                    type: infos.data.battle_type
                },
                time: {
                    start: new Date(infos.data.pk_start_time * 1000),
                    end: new Date(infos.data.pk_end_time * 1000)
                }
            }
        } else {
            battleInfo = {
                room: room,
                hash: infos.pk_id,
                info: {
                    target: infos.data.init_info.room_id,
                    self: infos.data.match_info.room_id,
                    voteName: infos.data.pk_votes_name,
                    type: infos.data.battle_type
                },
                time: {
                    start: new Date(infos.data.pk_start_time * 1000),
                    end: new Date(infos.data.pk_end_time * 1000)
                }
            }
        }
        logger.pk(`Room ${room} started an pk battle with room ${battleInfo.info.target}.`)
        const res = await saveNewBattleInfo(battleInfo)
        if (res.status === false) {
            logger.warn(`An error occurred when saving new battle info to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving new battle info, message:${e.message}`)
    }
}


/**
 * 处理大乱斗过程中的数据变更
 * @param infos {{
 *   "cmd": String,
 *   "data": {
 *     "battle_type": Number,
 *     "init_info": {
 *       "room_id": Number,
 *       "votes": Number,
 *       "best_uname": String,
 *       "vision_desc": Number
 *     },
 *     "match_info": {
 *       "room_id": Number,
 *       "votes": Number,
 *       "best_uname": String,
 *       "vision_desc": Number
 *     }
 *   },
 *   "pk_id": Number,
 *   "pk_status": Number,
 *   "timestamp": Number
 * }}
 * @param room {Number}
 * @returns {Promise<void>}
 */
const processBattleProgressInfo = async (infos, room) => {
    try {
        let progressInfo
        //可能存在init_info 和 match_info 反着来的状态,修正翻转一下
        if (infos.data.init_info.room_id === room) {
            progressInfo = {
                room: room,
                hash: infos.pk_id,
                progress: {
                    self: {
                        room: infos.data.init_info.room_id,
                        votes: infos.data.init_info.votes,
                        bestUser: infos.data.init_info.best_uname
                    },
                    target: {
                        room: infos.data.match_info.room_id,
                        votes: infos.data.match_info.votes,
                        bestUser: infos.data.match_info.best_uname
                    }
                }
            }
        } else {
            progressInfo = {
                room: room,
                hash: infos.pk_id,
                progress: {
                    self: {
                        room: infos.data.match_info.room_id,
                        votes: infos.data.match_info.votes,
                        bestUser: infos.data.match_info.best_uname
                    },
                    target: {
                        room: infos.data.init_info.room_id,
                        votes: infos.data.init_info.votes,
                        bestUser: infos.data.init_info.best_uname
                    }
                }
            }
        }
        const res = await updateBattleProgressInfo(progressInfo)
        if (res.status === false) {
            logger.warn(`An error occurred when saving battle progress info to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving battle progress info, message:${e.message}`)
    }
}


/**
 * 处理 PK_BATTLE_SETTLE_USER 对应的信息,保存PK结束后的结果
 * @param infos {{
 *   "cmd": String,
 *   "pk_id": Number,
 *   "pk_status": Number,
 *   "settle_status": Number,
 *   "timestamp": Number,
 *   "data": {
 *     "pk_id": String,
 *     "season_id": Number,
 *     "settle_status": Number,
 *     "result_type": Number,
 *     "battle_type": Number,
 *     "result_info": {
 *       "total_score": Number,
 *       "result_type_score": Number,
 *       "pk_votes": Number,
 *       "pk_votes_name": String,
 *       "pk_crit_score": Number,
 *       "pk_resist_crit_score": Number,
 *       "pk_extra_score_slot": String,
 *       "pk_extra_value": Number,
 *       "pk_extra_score": Number,
 *       "pk_task_score": Number,
 *       "pk_times_score": Number,
 *       "pk_done_times": Number,
 *       "pk_total_times": Number,
 *       "win_count": Number,
 *       "win_final_hit": Number,
 *       "winner_count_score": Number,
 *       "task_score_list": Array
 *     },
 *     "winner": {
 *       "room_id": Number,
 *       "uid": Number,
 *       "uname": String,
 *       "face": String,
 *       "face_frame": String,
 *       "exp": {
 *         "color": Number,
 *         "user_level": Number,
 *         "master_level": {
 *           "color": Number,
 *           "level": Number
 *         }
 *       },
 *       "best_user": {
 *         "uid": Number,
 *         "uname": String,
 *         "face": String,
 *         "pk_votes": Number,
 *         "pk_votes_name": String,
 *         "exp": {
 *           "color": Number,
 *           "level": Number
 *         },
 *         "face_frame": String,
 *         "badge": {
 *           "url": String,
 *           "desc": String,
 *           "position": Number
 *         },
 *         "award_info": null,
 *         "award_info_list": Array,
 *         "end_win_award_info_list": {
 *           "list": Array
 *         }
 *       }
 *     }|null,
 *     "my_info": {
 *       "room_id": Number,
 *       "uid": Number,
 *       "uname": String,
 *       "face": String,
 *       "face_frame": String,
 *       "exp": {
 *         "color": Number,
 *         "user_level": Number,
 *         "master_level": {
 *           "color": Number,
 *           "level": Number
 *         }
 *       },
 *       "best_user": {
 *         "uid": Number,
 *         "uname": String,
 *         "face": String,
 *         "pk_votes": Number,
 *         "pk_votes_name": String,
 *         "exp": {
 *           "color": Number,
 *           "level": Number
 *         },
 *         "face_frame": String,
 *         "badge": {
 *           "url": String,
 *           "desc": String,
 *           "position": Number
 *         },
 *         "award_info": null,
 *         "award_info_list": Array,
 *         "end_win_award_info_list": {
 *           "list": Array
 *         }
 *       }
 *     },
 *     "level_info": {
 *       "first_rank_name": String,
 *       "second_rank_num": Number,
 *       "first_rank_img": String,
 *       "second_rank_icon": String
 *     }
 *   }
 * }}
 * @param room {Number}
 * @returns {Promise<void>}
 */
const processBattleResult = async (infos, room) => {
    try {
        const selfInfo = {
            room: infos.data.my_info.room_id,
            uid: infos.data.my_info.uid,
            name: infos.data.my_info.uname,
            face: infos.data.my_info.face,
            exp: {
                level: infos.data.my_info.exp.user_level,
                ulLevel: infos.data.my_info.exp.master_level.level
            },
            bestUser: {
                uid: infos.data.my_info.best_user.uid,
                name: infos.data.my_info.best_user.uname,
                face: infos.data.my_info.best_user.face,
                votes: infos.data.my_info.best_user.pk_votes,
                ulLevel: infos.data.my_info.best_user.exp.level
            }
        }
        let resultInfo
        if (infos.data.winner === null) {
            resultInfo = {
                room: room,
                hash: infos.pk_id,
                winner: {
                    room: '',
                    uid: 0,
                    name: '',
                    face: '',
                    exp: {
                        level: 0,
                        ulLevel: 0
                    },
                    bestUser: {
                        uid: 0,
                        name: '',
                        face: '',
                        votes: 0,
                        ulLevel: 0
                    }
                },
                selfInfo: selfInfo
            }
        } else {
            resultInfo = {
                room: room,
                hash: infos.pk_id,
                winner: {
                    room: infos.data.winner.room_id,
                    uid: infos.data.winner.uid,
                    name: infos.data.winner.uname,
                    face: infos.data.winner.face,
                    exp: {
                        level: infos.data.winner.exp.user_level,
                        ulLevel: infos.data.winner.exp.master_level.level
                    },
                    bestUser: {
                        uid: infos.data.winner.best_user.uid,
                        name: infos.data.winner.best_user.uname,
                        face: infos.data.winner.best_user.face,
                        votes: infos.data.winner.best_user.pk_votes,
                        ulLevel: infos.data.winner.best_user.exp.level
                    }
                },
                selfInfo: selfInfo
            }
        }
        const res = await updateBattleResult(resultInfo)
        if (res.status === false) {
            logger.warn(`An error occurred when saving battle result info to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving battle result info, message:${e.message}`)
    }
}


/**
 * 处理 PK_BATTLE_SETTLE_V2 消息,保存助攻玩家的信息
 * @param infos {{
 *   "cmd": String,
 *   "pk_id": Number,
 *   "pk_status": Number,
 *   "settle_status": Number,
 *   "timestamp": Number,
 *   "data": {
 *     "pk_id": "Number",
 *     "season_id": Number,
 *     "pk_type": Number,
 *     "result_type": Number,
 *     "result_info": {
 *       "total_score": Number,
 *       "pk_votes": Number,
 *       "pk_votes_name": String,
 *       "pk_extra_value": Number
 *     },
 *     "level_info": {
 *       "uid": Number,
 *       "first_rank_name": String,
 *       "second_rank_num": Number,
 *       "first_rank_img": String,
 *       "second_rank_icon": String
 *     },
 *     "assist_list": [{
 *         "id": Number,
 *         "uname": String,
 *         "face": String,
 *         "score": Number
 *       }],
 *     "star_light_msg": String
 *   }
 * }}
 * @param room {Number}
 * @returns {Promise<void>}
 */
const processBattleAssistInfo = async (infos, room) => {
    try {
        /**
         *
         * @type {[{
         *     id:Number,
         *     name:String,
         *     face:String,
         *     score:Number
         * }]}
         */
        const userList = []
        for (let i = 0; i < infos.data.assist_list.length; i++) {
            userList.push({
                id: infos.data.assist_list[i].id,
                name: infos.data.assist_list[i].uname,
                face: infos.data.assist_list[i].face,
                score: infos.data.assist_list[i].score
            })
        }
        const assistInfo = {
            room: room,
            hash: infos.pk_id,
            users: userList
        }
        const res = await updateBattleAssistUsers(assistInfo)
        if (res.status === false) {
            logger.warn(`An error occurred when saving battle assist users info to database, message:${res.message}`)
        }
    } catch (e) {
        logger.warn(`An error occurred when saving battle assist users info to database, message:${e.message}`)
    }
}


module.exports = {
    processBattleProgressInfo,
    processBattleAssistInfo,
    processBattleResult,
    processBattleStart
}