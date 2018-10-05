const Buffer = require('safe-buffer').Buffer;    
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);


module.exports = () => {
    // Session Object
    const sessionObject = {passport: {user: id}};
    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    
    // Generate session signature
    const sig = keygrip.sign('session=' + session);

    return { session, sig };
};