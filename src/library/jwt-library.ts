import jwt from "jsonwebtoken"
import { EnvironmentVars, getTokenKey, getTokenTime, JWTData, JWTType } from "..";

/**returns a version of Date.now that is converted into a form that is the same that the JWT iat and exp time uses.*/
export function getJwtTime():number{return Math.floor(Date.now()/1000)}


/**Parses a raw JWT without verifying if its authentic. Null is returned if there is an error creating the */
export function parseRawJwt(tokenString:string):JWTData|undefined{
        const temp:any = jwt.decode(tokenString)
        if(!temp ) return undefined
        const returnData:JWTData = {...temp, sub:Number(temp?.sub)}
        return returnData
}

/**Checks if JWT is authentic and parses the result. Undefined is returned if the data is not authentic*/
export function parseJwt(keyType:JWTType,tokenString:string):JWTData|undefined{
        const type:EnvironmentVars.RefreshTokenKey | EnvironmentVars.PermissionsTokenKey | EnvironmentVars.ActionTokenKey | EnvironmentVars.ServerTokenKey = Number(keyType)
        const temp:any = jwt.verify(tokenString,String(getTokenKey(type)))
        const returnData:JWTData = {...temp,sub:Number(temp?.sub)}
        if(Boolean(returnData) ) return returnData
        else return undefined
}

/**returns a boolean after checking if the JWT is authentic.*/
export function verifyJwt(keyType:JWTType,tokenString:string){
    const type:EnvironmentVars.RefreshTokenKey | EnvironmentVars.PermissionsTokenKey | EnvironmentVars.ActionTokenKey | EnvironmentVars.ServerTokenKey = Number(keyType);
    return Boolean( jwt.verify(  tokenString,String(getTokenKey(type)) ));
}

export function checkJwtTimeValidity(keyType:JWTType,tokenString:string):boolean{
    const data = parseJwt(keyType,tokenString);
    const type =data?.sub;
    const expTime = data?.exp ?? 0;
    const minTime = getJwtTime() >= expTime - getTokenTime(Number(type));
    const maxTime = getJwtTime() < expTime;
    return (minTime && maxTime);
}

