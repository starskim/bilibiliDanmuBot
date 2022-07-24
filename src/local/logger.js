// noinspection JSUnusedGlobalSymbols

'use strict';

const color = require('colors')
const config = require('./config')
const develop = config.get('develop')


function getFormatTime() {
    let date = new Date();
    return (date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') +
        '-' + String(date.getDate()).padStart(2, '0') + ' ' + String(date.getHours()).padStart(2, '0') +
        ':' + String(date.getMinutes()).padStart(2, '0') + ':' + String(date.getSeconds()).padStart(2, '0') +
        '.' + date.getMilliseconds());
}

module.exports = {
    debug(...args) {
        if (develop.debug === false) {
            return
        }
        console.log(color.green('[DEBUG]' + '[' + getFormatTime() + ']: '), ...args);
    },
    danmu(...args) {
        if (develop.danmu === false) {
            return
        }
        console.log(color.gray('[DANMU]' + '[' + getFormatTime() + ']: '), ...args);
    },
    gift(...args) {
        if (develop.gift === false) {
            return
        }
        console.log(color.yellow('[GIFT]' + '[' + getFormatTime() + ']: '), ...args);
    },
    block(...args) {
        if (develop.block === false) {
            return
        }
        console.log(color.red('[BLOCK]' + '[' + getFormatTime() + ']: '), ...args);
    },
    mute(...args) {
        if (develop.mute === false) {
            return
        }
        console.log(color.cyan('[MUTE]' + '[' + getFormatTime() + ']: '), ...args);
    },
    join(...args) {
        if (develop.join === false) {
            return
        }
        console.log(color.blue('[JOIN]' + '[' + getFormatTime() + ']: '), ...args);
    },
    redPacket(...args) {
        if (develop.redPacket === false) {
            return
        }
        console.log(color.red('[RED PACKET]' + '[' + getFormatTime() + ']: '), ...args);
    },
    anchor(...args) {
        if (develop.anchor === false) {
            return
        }
        console.log(color.red('[ANCHOR]' + '[' + getFormatTime() + ']: '), ...args);
    },
    pk(...args) {
        if (develop.pk === false) {
            return
        }
        console.log(color.red('[PK BATTLE]' + '[' + getFormatTime() + ']: '), ...args);
    },
    info(...args) {
        console.log(color.magenta('[INFO]') + '[' + getFormatTime() + ']:', ...args);
    },
    warn(...args) {
        console.error(color.yellow('[WARN]' + '[' + getFormatTime() + ']:'), ...args);
    },
    error(...args) {
        console.error(color.red('[ERROR]' + '[' + getFormatTime() + ']:'), ...args);
        console.trace();
    }
}