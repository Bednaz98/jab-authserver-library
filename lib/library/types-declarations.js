"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTType = exports.BanType = exports.PermissionsType = void 0;
const __1 = require("..");
/**This enum is used to describe different types of permission a user might have.*/
var PermissionsType;
(function (PermissionsType) {
    PermissionsType[PermissionsType["Blocked"] = 0] = "Blocked";
    PermissionsType[PermissionsType["ViewOnlyPublic"] = 1] = "ViewOnlyPublic";
    PermissionsType[PermissionsType["ViewOnlyPrivate"] = 2] = "ViewOnlyPrivate";
    PermissionsType[PermissionsType["Contributor"] = 3] = "Contributor";
    PermissionsType[PermissionsType["Editor"] = 4] = "Editor";
    PermissionsType[PermissionsType["Owner"] = 5] = "Owner";
    PermissionsType[PermissionsType["Admin"] = 6] = "Admin";
})(PermissionsType = exports.PermissionsType || (exports.PermissionsType = {}));
/**used to specify the length of time for a ban jwt.*/
var BanType;
(function (BanType) {
    BanType[BanType["Minute1"] = 0] = "Minute1";
    BanType[BanType["Minutes10"] = 1] = "Minutes10";
    BanType[BanType["Hour1"] = 2] = "Hour1";
    BanType[BanType["Hour5"] = 3] = "Hour5";
    BanType[BanType["Day"] = 4] = "Day";
    BanType[BanType["Week"] = 5] = "Week";
    /**This will hold the JWT as banned until either it is expired or an admin removes it from the ban list.*/
    BanType[BanType["Review"] = 6] = "Review";
    /**This will continue the ban until the JWT has expired affectively making it useless*/
    BanType[BanType["Permanent"] = 7] = "Permanent";
})(BanType = exports.BanType || (exports.BanType = {}));
/**This is used to specify the type of JWT*/
var JWTType;
(function (JWTType) {
    /**used for specifying JWT that will be used for long term authentication by the client*/
    JWTType[JWTType["Refresh"] = 3] = "Refresh";
    /**This is used to specifying JWT that holds permissions the user is allowed to do*/
    JWTType[JWTType["Permissions"] = 4] = "Permissions";
    /**This is used for specifying JWT that allows for short term access for interacting with servers rapidly*/
    JWTType[JWTType["Actions"] = 5] = "Actions";
    /**This is used for cross server communication. Any time another server needs to communicate with this server, use this for verification*/
    JWTType[JWTType["Server"] = 6] = "Server";
})(JWTType = exports.JWTType || (exports.JWTType = {}));
//# sourceMappingURL=types-declarations.js.map