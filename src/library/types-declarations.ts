import { EnvironmentVars } from ".."


/**This enum is used to describe different types of permission a user might have.*/
export enum PermissionsType{
    Blocked,
    ViewOnlyPublic,
    ViewOnlyPrivate,
    Contributor,
    Editor,
    Owner,
    Admin
}

/**This is used to describe a particular permissions action a user can do.*/
export interface PermissionsUnit{
    /**A string identifying the specific permissions*/
    permit:string
    /**The type of permissions expected*/
    type:PermissionsType
}

/**used to detail the updates needed to be performed on a JWT to change the permissions*/
export interface UpdatePermissionsUnit{
    /**the current JWT being updated*/
    jwt:string
    /**permissions to change as a key value pair. Any permissions with a value below 0 will be remove. 
    *Any permissions with a value greater than 0 will be updated according to the Permissions type.
    *All permissions in the current JWT will be copied over, missing permissions will be added accordingly.
    */
    updates: Map<string,number>
}

/**used for sending data to the server to create a new user*/
export interface CreateUserOptions{
    /**this can either be a username or a unique client ID given by another services for identification.*/
    userString:string
    /**Optional password for a 'fullUser'*/
    password?:string
}

/**This is used for typing on any incoming request to the auth server to login a user.*/
export interface LoginUserOptions{
    /**This can be a username or client string*/
    userString:string
    /**This can be a password or pin number*/
    password?:string
}

/**This is used for typing on an incoming request to the auth server to delete a user*/
export interface DeleteUser{
    /**This can be a username or client string*/
    userString:string
    /**This should be a list of any active JWT that the user currently has.*/
    jwtArray:string[]
}

/**This is used for typing on any incoming request to the auth server to logging out a user.*/
export interface LogoutUserOptions{
    /**This should be a list of any active JWT that the user currently has.*/
    jwtArray:string[]
    /**This can be a username or client string*/
    userString:string
    /**This can be a password or pin number*/
    password?:string
}

/**This is used for typing on any incoming request to the auth server to update the username and password.*/
export interface NewCredentialsData{
    /**This is used internally by the server. This will be ignored if sent as a request*/
    userId?: string
    /**The original username to verify before changing. This can be a username or client string*/
    oldUserName:string
    /**Used to verify the only password. This can be a password or pin number*/
    oldPassword:string
    /**The new username to change to. This can be a username or client string*/
    newUsername: string
    /**The new password to change to. This can be a password or pin number*/
    newPassword: string
}


/**format to send back to the client. This allows for the sending of data along with included any updated jwt*/
export interface ResponseData{
    /**any data to send to the client*/
    data:any
    /**if a new refresh token is issued, this filed will contain a new value*/
    refreshToken?:string
    /**if a new permissions token is issued, this filed will contain a new value*/
    permissionsToken?:string
    /**if a new action token is issued, this filed will contain a new value*/
    actionToken?:string
}

/**used to specify the length of time for a ban jwt.*/

export enum BanType {
    Minute1,
    Minutes10,
    Hour1,
    Hour5,
    Day,
    Week,
    /**This will hold the JWT as banned until either it is expired or an admin removes it from the ban list.*/
    Review,
    /**This will continue the ban until the JWT has expired affectively making it useless*/
    Permanent
}

/**This is used for typing on any incoming request to the auth server to post a new ban.*/
export interface BanJWTOptions{
    /**The JWT to ban*/
    JWT:        string, 
    /**the type of ban which will effect how long it is banned for*/
    banType:    BanType, 
    /**The reason for the ban. This is for Admin purposes and could be parsed by a server is needed.*/
    banReason:  string
}

/**This is used to specify the type of JWT*/
export enum JWTType{
    /**used for specifying JWT that will be used for long term authentication by the client*/
    Refresh =EnvironmentVars.RefreshTokenKey,
    /**This is used to specifying JWT that holds permissions the user is allowed to do*/
    Permissions=EnvironmentVars.PermissionsTokenKey,
    /**This is used for specifying JWT that allows for short term access for interacting with servers rapidly*/
    Actions=EnvironmentVars.ActionTokenKey,
    /**This is used for cross server communication. Any time another server needs to communicate with this server, use this for verification*/
    Server=EnvironmentVars.ServerTokenKey
}

/**used to help with typing when parsing JWT data*/
export interface JWTData{
    /**unique ID of the jwt created*/
    jti:string,
    /**specifies the type of JWT*/
    sub:JWTType
    /**'issued at' date in epoch seconds*/
    iat: number,
    /**'expiration' date in epoch seconds*/
    exp: number
    /**list of granted permissions by this jwt*/
    permissions:PermissionsUnit[]
    /**unique string to identify the user. This maybe a username or a unique client string*/
    clientID:string
}

/**This is used for typing on any incoming request to the auth server to post a new ban on a user.*/
export interface BanUserOptions{
    /**This can be a username or client string*/
    userString: string, 
    /**the type of ban which will effect how long it is banned for*/
    banType:    BanType,
    /**The reason for the ban. This is for Admin purposes and could be parsed by a server is needed.*/
    banReason:  string
}

/**This is used to request an updated JWT. This should only be done by a server on behalf of the user and the header should send a server token.*/
export interface RenewJWTRequest{
    /**This is the current JWT that is requested for renewal*/
    JWT:string
}

/** This should only be done by a server on behalf of the user and the header should send a server token.*/
export interface CreateJWTRequest{
    /**This can be a username or client string*/
    clientString:string
    permissions:PermissionsUnit[]
}

/** This is used to created an action token for a client. This should only be done by a server on behalf of the user and the header should send a server token.*/
export interface ActionTokenCreation{
    /**This can be a username or client string*/
    clientString:string
    /**These are the permissions requested for creating an action token*/
    permissions:PermissionsUnit
}
