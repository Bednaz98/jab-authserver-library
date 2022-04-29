import { Request, Response } from "express";
import { PermissionsUnit, JWTType } from "..";
/**This is used when creating permissions and refresh tokens to add default [permissions*/
export declare function getDefaultPermissions(): PermissionsUnit;
export declare function getDefaultAdminPermissions(): PermissionsUnit;
/**Used to check if the permissions within a JWT are valid.*/
export declare function checkTokenPermissions(JWTType: JWTType, Jwt: string | undefined, permissions: PermissionsUnit): boolean | null;
/**Extracts a token from the request from the bearer part of a header*/
export declare function extractToken(req: Request): string | undefined;
/**This is used to check the permissions of a token. Throws undefine if permissions are excepted*/
export declare function checkRequestPermissions(req: Request, res: Response, type: JWTType, requestedPermissions: PermissionsUnit): Response<any, Record<string, any>>;
/**This is a compact try catch for handling request to the server. The execution function should contain all logic needed that would then return to the user.*/
export declare function validateRequestProcess(res: Response, execute: Function, inputStatusCode?: number): Response<any, Record<string, any>>;
/**This is a condense version of validate request process and permissions check.*/
export declare function ProcessRequest(req: Request, res: Response, type: JWTType, requestedPermissions: PermissionsUnit, execute: Function, statusCode?: number): Response<any, Record<string, any>>;
