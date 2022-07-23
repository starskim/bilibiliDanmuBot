const logger = require('../local/logger')
const {saveGiftInfo} = require("../database/gift");


/**
 * 保存礼物赠送信息
 * @param gift {{
  cmd: string,
  data: {
    action: string,
    batch_combo_id: string,
    batch_combo_send: {
      action: string,
      batch_combo_id: string,
      batch_combo_num: number,
      blind_gift: null,
      gift_id: number,
      gift_name: string,
      gift_num: number,
      send_master: string,
      uid: number,
      uname: string
    },
    beatId: string,
    biz_source: string,
    blind_gift: string,
    broadcast_id: number,
    coin_type: string,
    combo_resources_id: number,
    combo_send: {
      action: string,
      combo_id: string,
      combo_num: number,
      gift_id: number,
      gift_name: string,
      gift_num: number,
      send_master: string,
      uid: number,
      uname: string
    },
    combo_stay_time: number,
    combo_total_coin: number,
    crit_prob: number,
    demarcation: number,
    discount_price: number,
    dmscore: number,
    draw: number,
    effect: number,
    effect_block: number,
    face: string,
    face_effect_id: number,
    face_effect_type: number,
    float_sc_resource_id: number,
    giftId: number,
    giftName: string,
    giftType: number,
    gold: number,
    guard_level: number,
    is_first: boolean,
    is_special_batch: number,
    magnification: number,
    medal_info: {
      anchor_roomid: number,
      anchor_uname: string,
      guard_level: number,
      icon_id: number,
      is_lighted: number,
      medal_color: number,
      medal_color_border: number,
      medal_color_end: number,
      medal_color_start: number,
      medal_level: number,
      medal_name: string,
      special: string,
      target_id: number
    },
    name_color: string,
    num: number,
    original_gift_name: string,
    price: number,
    rcost: number,
    remain: number,
    rnd: string,
    send_master: number,
    silver: number,
    super: number,
    super_batch_gift_num: number,
    super_gift_num: number,
    svga_block: number,
    switch: true,
    tag_image: '',
    tid: string,
    timestamp: number,
    top_list: number,
    total_coin: number,
    uid: number,
    uname: string
  }
}} 礼物实体
 * @param room {number} 房间号
 * @returns {Promise<void>}
 */
const processGiftMessage = async (gift,room)=>{
    try {
        const giftInfo = {
            uid:gift.data.uid,
            room:room,
            guard:gift.data.medal_info.guard_level,
            gift:{
                id:gift.data.giftId,
                name:gift.data.giftName,
                type:gift.data.giftType,
                amount:gift.data.num,
            },
            price:{
                type:gift.data.coin_type,
                amount:gift.data.total_coin,
            },
            medal:{
                level:gift.data.medal_info.medal_level,
                owner:gift.data.medal_info.target_id,
                name:gift.data.medal_info.medal_name,
            }
        }
        logger.gift(`[${gift.data.uname}]赠送了 ${gift.data.num} 个 ${gift.data.giftName}`)
        const res = await saveGiftInfo(giftInfo)
        if (res.status === false){
            logger.warn(`An error occurred when saving gift info to database, message:${res.message}`)
        }

    }catch (e) {
        logger.warn(`An error occurred when saving gift info, message:${e.message}`)
    }
}

module.exports = {
    processGiftMessage
}