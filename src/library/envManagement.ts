require('dotenv').config()


/**This enum is used to specify the type of environment variable that should be pulled that is needed.*/
export enum EnvironmentVars{
    // Pepper ####################################################
    DynamicPepperArray,
    StaticPepper,
    //Salt          ####################################################
    /**This is used to specific that a salt value is needed*/
    SaltValue,
    //static token  ####################################################
    /**this is used to specific that a refresh token is needed for @long term authentication*/
    RefreshTokenKey,
    /**this is needed to specify that a permissions token is needed for a @Medium length of time*/
    PermissionsTokenKey,
    /**this is needed to specify that a permissions token is needed for a @short period of time to have quick access on the server*/
    ActionTokenKey,
    /**this is used to specify that a server token is needed for services to communicate with each other and should only last for a @short amount of time*/
    ServerTokenKey,
    //Dynamic token ####################################################
    DynamicKeyArray,
    //Token time    ####################################################
    /**this is used to set the time a JWT is valid for in seconds for server tokens*/
    ServerTime,
    /**this is used to set the time a JWT is valid for in seconds for action*/
    ShortTime,
    /**this is used to set the time a JWT is valid for in seconds for permissions tokens*/
    MediumTime,
    /**this is used to set the time a JWT is valid for in seconds for refresh tokens tokens*/
    LoneTime
}
function getEnvParams(type:EnvironmentVars):string |undefined{
    switch(type){
        case EnvironmentVars.DynamicPepperArray:    return process?.env?.DYNAMIC_PEPPER_ARRAY;
        case EnvironmentVars.StaticPepper:          return process?.env?.STATIC_PEPPER;
        case EnvironmentVars.SaltValue:             return process?.env?.SALT;
        case EnvironmentVars.RefreshTokenKey:       return process?.env?.REFRESH_KEY;
        case EnvironmentVars.PermissionsTokenKey:   return process?.env?.PERMISSIONS_KEY;
        case EnvironmentVars.ActionTokenKey:        return process?.env?.ACTION_TOKEN_KEY;
        case EnvironmentVars.ServerTokenKey:        return process?.env?.SERVER_TOKEN_KEY;
        case EnvironmentVars.DynamicKeyArray:       return process?.env?.DYNAMIC_KEY_ARRAY;
        case EnvironmentVars.ShortTime:             return process?.env?.SERVER_TIME;
        case EnvironmentVars.ShortTime:             return process?.env?.SHORT_TIME;
        case EnvironmentVars.MediumTime:            return process?.env?.MEDIUM_TIME;
        case EnvironmentVars.LoneTime:              return process?.env?.LONG_TIME;
        default:                                    return  undefined;
    }
}
/**used to parse environment variables strings, that should be in the form of x.y.z...*/
function ParseEnvArray(inString:string):string[]{return inString?.split(".") ?? undefined}
/**turn a EnvArray into a pepper array*/
function convertStringToPepper(inString:string[]){
    return inString.map((e)=>{return parseInt(e)})
}
/**returns a string array that is used when adding 'peppers' to hash data*/
export function getPepperArray():number[]{
    try {return   convertStringToPepper(ParseEnvArray(String(getEnvParams(EnvironmentVars.DynamicPepperArray) ?? '3.5.7')))} 
    catch (error) {return [1,2,3]}
}
/**This will return the static Pepper string form the environment variables*/
export function getStaticPepper():string{
    const sp = getEnvParams(EnvironmentVars.StaticPepper)
    if(sp) return String(sp)
    else throw new Error("Static pepper environment variable not set.")
}
/**returns the salt value used when trying to hash data. If no SALT env is found, it will return 10 by default */
export function getSaltValue():number{
    try {return parseInt(String(getEnvParams(EnvironmentVars.SaltValue)))} 
    catch (error) {return 10}
}
/**gets the keys required to generate a specific type of token. This will throw an error informing you that the token being accessed is not set.*/
export function getTokenKey(type:EnvironmentVars.ActionTokenKey|EnvironmentVars.ServerTokenKey|EnvironmentVars.RefreshTokenKey|EnvironmentVars.PermissionsTokenKey):string{
    const key = (getEnvParams(type));
    if(key !== undefined) return key;
    else throw new Error(`Your token key is not set, check that your environment variables are set up correctly -- undefine variable: ${EnvironmentVars[type]}`);
}

/**this return a time in seconds that is associated with access token. If no environment variables are set, default times will be returned:
 * 
 * @Server 60s, (1 minute) 
 * @short 600s, (10 minute)
 * @Medium 604800s, (7 days)
 * @Long 2592000s,  (30 days)
 * */
export function getTokenTime(type:EnvironmentVars.ShortTime|EnvironmentVars.MediumTime|EnvironmentVars.LoneTime|EnvironmentVars.ServerTime):number{
    try {return parseInt(String(getEnvParams(type)))} 
    catch (error) {return 10}
}
