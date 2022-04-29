import { Request, Response } from "express";
import { parseJwt, PermissionsType, PermissionsUnit,JWTType } from "..";


/**This is used when creating permissions and refresh tokens to add default [permissions*/
export function getDefaultPermissions(){
    const temp: PermissionsUnit= {permit: "AccountManager",type: PermissionsType.Owner}
    return temp
}

export function getDefaultAdminPermissions(){
    const temp: PermissionsUnit= {permit: "Admin",type: PermissionsType.Admin}
    return temp
}

function searchPermissions(inputPermissions:PermissionsUnit[],checkPermissions:PermissionsUnit){
    let check = false
    inputPermissions.forEach((e)=>{
        if(e.permit === checkPermissions.permit && e.type >= checkPermissions.type) {return check = true;}
    })
    return check
}

/**Used to check if the permissions within a JWT are valid.*/
export function checkTokenPermissions(JWTType:JWTType,Jwt:string|undefined,permissions:PermissionsUnit){
    try {
        if(Jwt === undefined) return false
        const jwtData = parseJwt(JWTType,Jwt)
        if(jwtData === undefined) return false;
        return searchPermissions(jwtData.permissions,permissions)
    }catch (error) {return null}
}

/**Extracts a token from the request from the bearer part of a header*/
export function extractToken( req:Request):string|undefined{
    try {
        if(!req?.headers?.bearer) return undefined
        if(req?.headers?.bearer instanceof Array) {req?.headers?.bearer[0]}
        else req?.headers?.bearer
        return String(req?.headers?.bearer) ?? undefined} 
    catch (error) {return undefined}
}

/**This is used to check the permissions of a token. Throws undefine if permissions are excepted*/
export function checkRequestPermissions(req:Request, res:Response,type:JWTType, requestedPermissions:PermissionsUnit ){
    try {
        const token = extractToken(req)
        const check = checkTokenPermissions(type,token, requestedPermissions)
        if(token === undefined) return res.status(403).send("access denied");
        else if(!check) return res.status(403).send("access denied");
        else throw undefined
    } catch (error) { return res.status(511).send("Authorization needed"); }
}


/**This is a compact try catch for handling request to the server. The execution function should contain all logic needed that would then return to the user.*/
export function validateRequestProcess(res:Response, execute:Function, inputStatusCode:number=200){
    try {return res.status(inputStatusCode).send(execute())}
    catch (error) {return res.status(500).send("Authorization needed"); }
}

/**This is a condense version of validate request process and permissions check.*/
export function ProcessRequest(req:Request, res:Response,type:JWTType, requestedPermissions:PermissionsUnit, execute:Function, statusCode:number =200){
    try { return checkRequestPermissions(req,res,type,requestedPermissions)
    } catch (except) { return validateRequestProcess(res, execute, statusCode)}
}

