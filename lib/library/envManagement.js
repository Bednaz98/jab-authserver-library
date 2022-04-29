"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenTime = exports.getTokenKey = exports.getSaltValue = exports.getStaticPepper = exports.getPepperArray = exports.EnvironmentVars = void 0;
require('dotenv').config();
/**This enum is used to specify the type of environment variable that should be pulled that is needed.*/
var EnvironmentVars;
(function (EnvironmentVars) {
    // Pepper ####################################################
    EnvironmentVars[EnvironmentVars["DynamicPepperArray"] = 0] = "DynamicPepperArray";
    EnvironmentVars[EnvironmentVars["StaticPepper"] = 1] = "StaticPepper";
    //Salt          ####################################################
    /**This is used to specific that a salt value is needed*/
    EnvironmentVars[EnvironmentVars["SaltValue"] = 2] = "SaltValue";
    //static token  ####################################################
    /**this is used to specific that a refresh token is needed for @long term authentication*/
    EnvironmentVars[EnvironmentVars["RefreshTokenKey"] = 3] = "RefreshTokenKey";
    /**this is needed to specify that a permissions token is needed for a @Medium length of time*/
    EnvironmentVars[EnvironmentVars["PermissionsTokenKey"] = 4] = "PermissionsTokenKey";
    /**this is needed to specify that a permissions token is needed for a @short period of time to have quick access on the server*/
    EnvironmentVars[EnvironmentVars["ActionTokenKey"] = 5] = "ActionTokenKey";
    /**this is used to specify that a server token is needed for services to communicate with each other and should only last for a @short amount of time*/
    EnvironmentVars[EnvironmentVars["ServerTokenKey"] = 6] = "ServerTokenKey";
    //Dynamic token ####################################################
    EnvironmentVars[EnvironmentVars["DynamicKeyArray"] = 7] = "DynamicKeyArray";
    //Token time    ####################################################
    /**this is used to set the time a JWT is valid for in seconds for server tokens*/
    EnvironmentVars[EnvironmentVars["ServerTime"] = 8] = "ServerTime";
    /**this is used to set the time a JWT is valid for in seconds for action*/
    EnvironmentVars[EnvironmentVars["ShortTime"] = 9] = "ShortTime";
    /**this is used to set the time a JWT is valid for in seconds for permissions tokens*/
    EnvironmentVars[EnvironmentVars["MediumTime"] = 10] = "MediumTime";
    /**this is used to set the time a JWT is valid for in seconds for refresh tokens tokens*/
    EnvironmentVars[EnvironmentVars["LoneTime"] = 11] = "LoneTime";
})(EnvironmentVars = exports.EnvironmentVars || (exports.EnvironmentVars = {}));
function getEnvParams(type) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    switch (type) {
        case EnvironmentVars.DynamicPepperArray: return (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.DYNAMIC_PEPPER_ARRAY;
        case EnvironmentVars.StaticPepper: return (_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.STATIC_PEPPER;
        case EnvironmentVars.SaltValue: return (_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.SALT;
        case EnvironmentVars.RefreshTokenKey: return (_d = process === null || process === void 0 ? void 0 : process.env) === null || _d === void 0 ? void 0 : _d.REFRESH_KEY;
        case EnvironmentVars.PermissionsTokenKey: return (_e = process === null || process === void 0 ? void 0 : process.env) === null || _e === void 0 ? void 0 : _e.PERMISSIONS_KEY;
        case EnvironmentVars.ActionTokenKey: return (_f = process === null || process === void 0 ? void 0 : process.env) === null || _f === void 0 ? void 0 : _f.ACTION_TOKEN_KEY;
        case EnvironmentVars.ServerTokenKey: return (_g = process === null || process === void 0 ? void 0 : process.env) === null || _g === void 0 ? void 0 : _g.SERVER_TOKEN_KEY;
        case EnvironmentVars.DynamicKeyArray: return (_h = process === null || process === void 0 ? void 0 : process.env) === null || _h === void 0 ? void 0 : _h.DYNAMIC_KEY_ARRAY;
        case EnvironmentVars.ShortTime: return (_j = process === null || process === void 0 ? void 0 : process.env) === null || _j === void 0 ? void 0 : _j.SERVER_TIME;
        case EnvironmentVars.ShortTime: return (_k = process === null || process === void 0 ? void 0 : process.env) === null || _k === void 0 ? void 0 : _k.SHORT_TIME;
        case EnvironmentVars.MediumTime: return (_l = process === null || process === void 0 ? void 0 : process.env) === null || _l === void 0 ? void 0 : _l.MEDIUM_TIME;
        case EnvironmentVars.LoneTime: return (_m = process === null || process === void 0 ? void 0 : process.env) === null || _m === void 0 ? void 0 : _m.LONG_TIME;
        default: return undefined;
    }
}
/**used to parse environment variables strings, that should be in the form of x.y.z...*/
function ParseEnvArray(inString) { var _a; return (_a = inString === null || inString === void 0 ? void 0 : inString.split(".")) !== null && _a !== void 0 ? _a : undefined; }
/**turn a EnvArray into a pepper array*/
function convertStringToPepper(inString) {
    return inString.map((e) => { return parseInt(e); });
}
/**returns a string array that is used when adding 'peppers' to hash data*/
function getPepperArray() {
    var _a;
    try {
        return convertStringToPepper(ParseEnvArray(String((_a = getEnvParams(EnvironmentVars.DynamicPepperArray)) !== null && _a !== void 0 ? _a : '3.5.7')));
    }
    catch (error) {
        return [1, 2, 3];
    }
}
exports.getPepperArray = getPepperArray;
/**This will return the static Pepper string form the environment variables*/
function getStaticPepper() {
    const sp = getEnvParams(EnvironmentVars.StaticPepper);
    if (sp)
        return String(sp);
    else
        throw new Error("Static pepper environment variable not set.");
}
exports.getStaticPepper = getStaticPepper;
/**returns the salt value used when trying to hash data. If no SALT env is found, it will return 10 by default */
function getSaltValue() {
    try {
        return parseInt(String(getEnvParams(EnvironmentVars.SaltValue)));
    }
    catch (error) {
        return 10;
    }
}
exports.getSaltValue = getSaltValue;
/**gets the keys required to generate a specific type of token. This will throw an error informing you that the token being accessed is not set.*/
function getTokenKey(type) {
    const key = (getEnvParams(type));
    if (key !== undefined)
        return key;
    else
        throw new Error(`Your token key is not set, check that your environment variables are set up correctly -- undefine variable: ${EnvironmentVars[type]}`);
}
exports.getTokenKey = getTokenKey;
/**this return a time in seconds that is associated with access token. If no environment variables are set, default times will be returned:
 *
 * @Server 60s, (1 minute)
 * @short 600s, (10 minute)
 * @Medium 604800s, (7 days)
 * @Long 2592000s,  (30 days)
 * */
function getTokenTime(type) {
    try {
        return parseInt(String(getEnvParams(type)));
    }
    catch (error) {
        return 10;
    }
}
exports.getTokenTime = getTokenTime;
//# sourceMappingURL=envManagement.js.map