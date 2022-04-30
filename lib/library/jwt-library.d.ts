import { JWTData, JWTType } from "..";
/**returns a version of Date.now that is converted into a form that is the same that the JWT iat and exp time uses.*/
export declare function getJwtTime(): number;
/**Parses a raw JWT without verifying if its authentic. Null is returned if there is an error creating the */
export declare function parseRawJwt(tokenString: string): JWTData | undefined;
/**Checks if JWT is authentic and parses the result. Undefined is returned if the data is not authentic*/
export declare function parseJwt(keyType: JWTType, tokenString: string): JWTData | undefined;
/**returns a boolean after checking if the JWT is authentic.*/
export declare function verifyJwt(keyType: JWTType, tokenString: string): boolean;
export declare function checkJwtTimeValidity(keyType: JWTType, tokenString: string): boolean;
