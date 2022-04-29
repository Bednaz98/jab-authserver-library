import jwt from "jsonwebtoken"
import { v4 } from "uuid";
import { EnvironmentVars, getTokenKey } from "..";
import { JWTType, PermissionsUnit } from "..";


/**This is used by services to make JWT for each other to verify. Return a string of Server JWT*/
export function createServerToken(permissions:PermissionsUnit){
    return jwt.sign(
        {clientID:v4(),permissions},
        String(getTokenKey(EnvironmentVars.ServerTokenKey)),
        {expiresIn:EnvironmentVars.ServerTime,jwtid:v4(),subject:`${Number(JWTType.Server)}`},
    );
}