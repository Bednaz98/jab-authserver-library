"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const __1 = require("..");
const __2 = require("..");
/**This is used by services to make JWT for each other to verify. Return a string of Server JWT*/
function createServerToken(permissions) {
    return jsonwebtoken_1.default.sign({ clientID: (0, uuid_1.v4)(), permissions }, String((0, __1.getTokenKey)(__1.EnvironmentVars.ServerTokenKey)), { expiresIn: __1.EnvironmentVars.ServerTime, jwtid: (0, uuid_1.v4)(), subject: `${Number(__2.JWTType.Server)}` });
}
exports.createServerToken = createServerToken;
//# sourceMappingURL=service.js.map