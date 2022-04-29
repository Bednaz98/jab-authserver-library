/**This enum is used to specify the type of environment variable that should be pulled that is needed.*/
export declare enum EnvironmentVars {
    DynamicPepperArray = 0,
    StaticPepper = 1,
    /**This is used to specific that a salt value is needed*/
    SaltValue = 2,
    /**this is used to specific that a refresh token is needed for @long term authentication*/
    RefreshTokenKey = 3,
    /**this is needed to specify that a permissions token is needed for a @Medium length of time*/
    PermissionsTokenKey = 4,
    /**this is needed to specify that a permissions token is needed for a @short period of time to have quick access on the server*/
    ActionTokenKey = 5,
    /**this is used to specify that a server token is needed for services to communicate with each other and should only last for a @short amount of time*/
    ServerTokenKey = 6,
    DynamicKeyArray = 7,
    /**this is used to set the time a JWT is valid for in seconds for server tokens*/
    ServerTime = 8,
    /**this is used to set the time a JWT is valid for in seconds for action*/
    ShortTime = 9,
    /**this is used to set the time a JWT is valid for in seconds for permissions tokens*/
    MediumTime = 10,
    /**this is used to set the time a JWT is valid for in seconds for refresh tokens tokens*/
    LoneTime = 11
}
/**returns a string array that is used when adding 'peppers' to hash data*/
export declare function getPepperArray(): number[];
/**This will return the static Pepper string form the environment variables*/
export declare function getStaticPepper(): string;
/**returns the salt value used when trying to hash data. If no SALT env is found, it will return 10 by default */
export declare function getSaltValue(): number;
/**gets the keys required to generate a specific type of token. This will throw an error informing you that the token being accessed is not set.*/
export declare function getTokenKey(type: EnvironmentVars.ActionTokenKey | EnvironmentVars.ServerTokenKey | EnvironmentVars.RefreshTokenKey | EnvironmentVars.PermissionsTokenKey): string;
/**this return a time in seconds that is associated with access token. If no environment variables are set, default times will be returned:
 *
 * @Server 60s, (1 minute)
 * @short 600s, (10 minute)
 * @Medium 604800s, (7 days)
 * @Long 2592000s,  (30 days)
 * */
export declare function getTokenTime(type: EnvironmentVars.ShortTime | EnvironmentVars.MediumTime | EnvironmentVars.LoneTime | EnvironmentVars.ServerTime): number;
