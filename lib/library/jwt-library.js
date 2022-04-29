"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwtTimeValidity = exports.verifyJwt = exports.parseJwt = exports.parseRawJwt = exports.getJwtTime = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const __1 = require("..");
/**returns a version of Date.now that is converted into a form that is the same that the JWT iat and exp time uses.*/
function getJwtTime() { return Math.floor(Date.now() / 1000); }
exports.getJwtTime = getJwtTime;
/**Parses a raw JWT without verifying if its authentic. Null is returned if there is an error creating the */
function parseRawJwt(tokenString) {
    const temp = jsonwebtoken_1.default.decode(tokenString);
    const returnData = Object.assign(Object.assign({}, temp), { sub: Number(temp === null || temp === void 0 ? void 0 : temp.sub) });
    return returnData;
}
exports.parseRawJwt = parseRawJwt;
/**Checks if JWT is authentic and parses the result. Undefined is returned if the data is not authentic*/
function parseJwt(keyType, tokenString) {
    const type = Number(keyType);
    const temp = jsonwebtoken_1.default.verify(tokenString, String((0, __1.getTokenKey)(type)));
    const returnData = Object.assign(Object.assign({}, temp), { sub: Number(temp === null || temp === void 0 ? void 0 : temp.sub) });
    if (Boolean(returnData))
        return returnData;
    else
        return undefined;
}
exports.parseJwt = parseJwt;
/**returns a boolean after checking if the JWT is authentic.*/
function verifyJwt(keyType, tokenString) {
    const type = Number(keyType);
    return Boolean(jsonwebtoken_1.default.verify(tokenString, String((0, __1.getTokenKey)(type))));
}
exports.verifyJwt = verifyJwt;
function checkJwtTimeValidity(type, expTime) {
    const minTime = getJwtTime() >= expTime - (0, __1.getTokenTime)(Number(type));
    const maxTime = getJwtTime() < expTime;
    return (minTime && maxTime);
}
exports.checkJwtTimeValidity = checkJwtTimeValidity;
//# sourceMappingURL=jwt-library.js.map