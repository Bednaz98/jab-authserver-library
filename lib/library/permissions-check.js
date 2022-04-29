"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessRequest = exports.validateRequestProcess = exports.checkRequestPermissions = exports.extractToken = exports.checkTokenPermissions = exports.getDefaultAdminPermissions = exports.getDefaultPermissions = void 0;
const __1 = require("..");
/**This is used when creating permissions and refresh tokens to add default [permissions*/
function getDefaultPermissions() {
    const temp = { permit: "AccountManager", type: __1.PermissionsType.Owner };
    return temp;
}
exports.getDefaultPermissions = getDefaultPermissions;
function getDefaultAdminPermissions() {
    const temp = { permit: "Admin", type: __1.PermissionsType.Admin };
    return temp;
}
exports.getDefaultAdminPermissions = getDefaultAdminPermissions;
function searchPermissions(inputPermissions, checkPermissions) {
    let check = false;
    inputPermissions.forEach((e) => {
        if (e.permit === checkPermissions.permit && e.type >= checkPermissions.type) {
            return check = true;
        }
    });
    return check;
}
/**Used to check if the permissions within a JWT are valid.*/
function checkTokenPermissions(JWTType, Jwt, permissions) {
    try {
        if (Jwt === undefined)
            return false;
        const jwtData = (0, __1.parseJwt)(JWTType, Jwt);
        if (jwtData === undefined)
            return false;
        return searchPermissions(jwtData.permissions, permissions);
    }
    catch (error) {
        return null;
    }
}
exports.checkTokenPermissions = checkTokenPermissions;
/**Extracts a token from the request from the bearer part of a header*/
function extractToken(req) {
    var _a, _b, _c, _d, _e, _f;
    try {
        if (!((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.bearer))
            return undefined;
        if (((_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.bearer) instanceof Array) {
            (_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c.bearer[0];
        }
        else
            (_d = req === null || req === void 0 ? void 0 : req.headers) === null || _d === void 0 ? void 0 : _d.bearer;
        return (_f = String((_e = req === null || req === void 0 ? void 0 : req.headers) === null || _e === void 0 ? void 0 : _e.bearer)) !== null && _f !== void 0 ? _f : undefined;
    }
    catch (error) {
        return undefined;
    }
}
exports.extractToken = extractToken;
/**This is used to check the permissions of a token. Throws undefine if permissions are excepted*/
function checkRequestPermissions(req, res, type, requestedPermissions) {
    try {
        const token = extractToken(req);
        const check = checkTokenPermissions(type, token, requestedPermissions);
        if (token === undefined)
            return res.status(403).send("access denied");
        else if (!check)
            return res.status(403).send("access denied");
        else
            throw undefined;
    }
    catch (error) {
        return res.status(511).send("Authorization needed");
    }
}
exports.checkRequestPermissions = checkRequestPermissions;
/**This is a compact try catch for handling request to the server. The execution function should contain all logic needed that would then return to the user.*/
function validateRequestProcess(res, execute, inputStatusCode = 200) {
    try {
        return res.status(inputStatusCode).send(execute());
    }
    catch (error) {
        return res.status(500).send("Authorization needed");
    }
}
exports.validateRequestProcess = validateRequestProcess;
/**This is a condense version of validate request process and permissions check.*/
function ProcessRequest(req, res, type, requestedPermissions, execute, statusCode = 200) {
    try {
        return checkRequestPermissions(req, res, type, requestedPermissions);
    }
    catch (except) {
        return validateRequestProcess(res, execute, statusCode);
    }
}
exports.ProcessRequest = ProcessRequest;
//# sourceMappingURL=permissions-check.js.map