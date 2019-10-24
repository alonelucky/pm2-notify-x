const crypto = require('crypto');

/**
 * @name md5函数封装
 * @param {Buffer|String} buf 
 */
function md5(buf){
    if(!buf instanceof Buffer && typeof buf != 'string') throw new Error("参数必须是buffer或字符串");
    let hash = crypto.createHash('md5');
    hash.update(buf);

    return hash.digest('hex');
}

module.exports = {
    md5
}