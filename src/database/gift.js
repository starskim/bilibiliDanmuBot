const db = require ('./db')


/**
 *
 * @param gift {{
 *  uid:Number,
    room:Number,
    guard:Number,
    gift:{
        id:Number,
        name:String,
        amount:Number,
        type:Number
    },
    price:{
        type:String,
        amount:Number
    },
    medal:{
        level:Number,
        owner:Number,
        name:String
    }
 * }}
 * @returns {Promise<{message: string, status: boolean}>}
 */
const saveGiftInfo = async (gift)=>{
    try {
        await new db.gift(gift).save()
        return {status:true,message:'OK'}
    }catch (e) {
        return {status:false,message:e.message}
    }
}

module.exports = {
    saveGiftInfo
}