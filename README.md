# JAB AuthServer Library

### Overview

This is a library used to create the JAB Authentication Server. This is written entirely in TypeScript and is used as a wrapper around the jsonwebtoken npm module and was created with the Express and Prisma framework in mind. It is not required to use Express or Prisma for this module to work. Only Express types are included and the example environment variables show an example of how setup the prisma connection string.

The user should login to the authentication server to receive their refresh and permissions token. When requesting to perform an action, they would send their permissions token in the body of a request. If it is expected that multiple changes should happened over a few minute time span, an action token would be send to the user which would be used in the header instead of sending the permissions token multiple times.

This library only contains logic for creating server tokens. All other types of tokens should be created by an authentication server. It also includes all expected type to communication with the authentication server.

- _For Front end Applications_ - this should only be used for type decelerations to help make a client to communicate with the backend authentication server.
- _For back end applications_ - This should be used for creating server tokens only, and for permissions checking before processing any end points.

### JWT Creation

- refresh token: is used for long term login and for account owner to perform **_quickly one time_** admin actions. This should be place under _bearer_ in a header of an HTTP request.
  - this should almost never be used except for logging in and logging out along with requesting new permissions tokens that are expiring soon.
  - This should be configured to only last a few months to a year for long term authentication.
- Permissions Token: This is used as a long list of all permissions thi user has. It should be send in _the body_ of a request one time then receive permissions to perform more actions.
  - This JWT is expected to exceed the 8 KB limit many servers will accept for header lengths.
  - This should change as users gain and remove permissions rapidly (deleting content they own, becoming editors on other peoples work, being blocked access to content ect...)
  - This should only last for a few days to a month at most and is expected to be replace regularly.
- Action token: This is used as a quick, rapid access to perform user actions normally placed under _bearer_ in a header of an HTTP request.
  - it is expected that this token has a short expiration time of a few minutes to an hour at most.
  - This should allow a user quick access for editing content in a short _window session_ of time.
  - Action tokens should be created and discarded rapidly.
- Server token: This should be the only token created by trusted services. It is used for Admins and autonomous services to request access from each other.
- EXAMPLES:
  - A human admin could be updating account information on half of a user that was locked out of their account. They may be updating an email that normally would be accessible to any authorized user to perform this action them selves. The admin would use a server token to by pass the individual only user expected token.
  - A analytics service wants to get data on behalf of a user from a data service. The data service could be open to any user on the web, but only a specific route should be used by other services. The analytic service will send a JWT to request access from the data service that the general public does not have access to.

# Front End

When using this library in a front end application that a user will interact with, the only important logic is to implement correct HTTP body request. This is only required when using the JAB AuthServer. The following are interfaces that show the format the AuthServer will use to communication with the client:

- some some rely on other types that are defined in the server types declarations section.

```typescript
/**used for sending data to the server to create a new user*/
export interface CreateUserOptions {
  /**this can either be a username or a unique client ID given by another services for identification.*/
  userString: string;
  /**Optional password for a 'fullUser'*/
  password?: string;
}

/**This is used for typing on any incoming request to the auth server to login a user.*/
export interface LoginUserOptions {
  /**This can be a username or client string*/
  userString: string;
  /**This can be a password or pin number*/
  password?: string;
}

/**This is used for typing on an incoming request to the auth server to delete a user*/
// Refresh token should be send in the header under bearer
export interface DeleteUser {
  /**This can be a username or client string*/
  userString: string;
  /**This should be a list of any active JWT that the user currently has.*/
  jwtArray: string[];
}

/**This is used for typing on any incoming request to the auth server to logging out a user.*/
// Refresh token should be send in the header under bearer
export interface LogoutUserOptions {
  /**This should be a list of any active JWT that the user currently has.*/
  jwtArray: string[];
  /**This can be a username or client string*/
  userString: string;
  /**This can be a password or pin number*/
  password?: string;
}

/**This is used for typing on any incoming request to the auth server to update the username and password.*/
// Refresh token should be send in the header under bearer
export interface NewCredentialsData {
  /**This is used internally by the server. This will be ignored if sent as a request*/
  userId?: string;
  /**The original username to verify before changing. This can be a username or client string*/
  oldUserName: string;
  /**Used to verify the only password. This can be a password or pin number*/
  oldPassword: string;
  /**The new username to change to. This can be a username or client string*/
  newUsername: string;
  /**The new password to change to. This can be a password or pin number*/
  newPassword: string;
}

/**format to send back to the client. This allows for the sending of data along with included any updated jwt if updates are required*/
export interface ResponseData {
  /**any data to send to the client*/
  data: any;
  /**if a new refresh token is issued, this filed will contain a new value*/
  refreshToken?: string;
  /**if a new permissions token is issued, this filed will contain a new value*/
  permissionsToken?: string;
  /**if a new action token is issued, this filed will contain a new value*/
  actionToken?: string;
}

/**used to detail the updates needed to be performed on a JWT to change the permissions*/
export interface UpdatePermissionsUnit {
  /**the current JWT being updated*/
  jwt: string;
  /**permissions to change as a key value pair. Any permissions with a value below 0 will be remove.
   *Any permissions with a value greater than 0 will be updated according to the Permissions type.
   *All permissions in the current JWT will be copied over, missing permissions will be added accordingly.
   */
  updates: Map<string, number>;
}
```

# Backend Implementation

## Environment variables

This is only required for backend services and not front end applications. These environment variables should be configured exactly the same in every service using this library. This is to enureses that JWT to be verified across all services without having to communicate directly for cross references.

- _The following values should be unique secret keys, not to share with anyone. Provided below are just examples_
  - STATIC_PEPPER, REFRESH_KEY, PERMISSIONS_KEY, ACTION_TOKEN_KEY, SERVER_TOKEN_KEY, DYNAMIC_KEY_ARRAY
  - The rest of these values are for configuration of settings and not for security
- _The following values require to have a '.' to parse an an array_
  - DYNAMIC_PEPPER_ARRAY: This should be 3 number of your choice separated by '.'
  - DYNAMIC_KEY_ARRAY: This should be a unique string separated by '.'

```bash
## Postgres connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
## Pepper variables
DYNAMIC_PEPPER_ARRAY="3.5.7"
STATIC_PEPPER="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
## Static Token Keys
REFRESH_KEY="YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY"
PERMISSIONS_KEY="ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"
ACTION_TOKEN_KEY="WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
SERVER_TOKEN_KEY="RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR"
## Dynamic Token Keys
DYNAMIC_KEY_ARRAY="XXXX.YYYYYYYY.ZZ"
# Token Time in seconds
SERVER_TIME = "30"
SHORT_TIME ="600"
MEDIUM_TIME="604800"
LONG_TIME="2592000"
# Salt value
SALT="10"
```

- All time variables are used to define the length of time a token should be active for.
- The Salt variables is used for determining the number our rounds when salting pass words for database.
- All the keys variables are used as signatures for creating hashes when signing JWTs.
- The Dynamic key array can be any string array separated by '.', Based on the input data, a random element from the array will be used whe signing hashes. This is to help make it harder to discover the primary key used. A single primary key may be prefixed by any one of the dynamic keys.
- The pepper string is used to select a pepper based on the being hashed. This is to increase security by not using the exact same pepper for every hash value but allows for reapable peppers.
- The Dynamic pepper array is used in the algorithm to help select 3 random peppers for hashing data. Someone would need to have the pepper string and the exact same dynamic array values to get the correct pepper for any give data.

## Custom Implementation

The following are tools that can be used to verify and check permissions on incoming request to any route. These functions are used if you would like to keep consistent implementation of JWT across all services but custom logic is needed for verification.

```typescript
import {getJwtTim, parseRawJwt, parseJwt, verifyJwt, checkJwtTimeValidity} from "jab-authserver-library";
// This will convert Date.now() to seconds which is what the JWT issued at and expiration time uses.
const time:number = getJwtTime();

//This parse a JWT's data without checking if its authentic. will return undefine if it fails to do so.
const rawData:JWTData|undefined = parseRawJwt(tokenString:string)

//This parse a JWT's data while checking if its authentic. will return undefine if it fails to do so.
const data:JWTData|undefined = parseJwt(keyType:JWTType,tokenString:string)

// This verifies if a JWT is authentic. Returns a boolean where only true mean it is excepted and false means it failed for any reason.
const checkValid:boolean = verifyJwt(keyType:JWTType,tokenString:string)

//This checks if the JWT is within a valid time span where it has not expired.
const checkValidTime:boolean = checkJwtTimeValidity(keyType:JWTType,tokenString:string):boolean
```

The following is for checking permissions within a JWT if custom implementation is needed.

```typescript
//After parsing a JWT, permissions data should be extracted and this function will check if the checkPermissions are present.
const hasPermissions:boolean = searchPermissions(inputPermissions:PermissionsUnit[],checkPermissions:PermissionsUnit)

// This function will do the same above but will parse the JWT. The type of JWT that is expected needs to be specified for this to work. Returning null means there is an error but is functionally the same as not having permissions
const tokenHasPermissions:Boolean | null = checkTokenPermissions(JWTType:JWTType,Jwt:string|undefined,permissions:PermissionsUnit)

//This is used to return general permissions => {"AccountManager", owner}
const generalPermit: PermissionsUnit = getDefaultPermissions(): PermissionsUnit

// This is used for return the default admin permissions needed
const adminPermit: PermissionsUnit = getDefaultAdminPermissions()

```

### Miscellaneous functions

```typescript
import {
  EnvironmentVars,
  PermissionsUnit,
  getTokenTime,
} from "jab-authserver-library";

const permissions: PermissionsUnit;
// Used to create a server token
const serverToken = createServerToken(permissions);

const type: EnvironmentVars = EnvironmentVars.Server; // this is an example
// Used to get the time a particular JWT is valid for
const time: number = getTokenTime();
```

## Express specific implementation

The following is used for easily changing incoming permissions on any route. This can be used for creating _middleware_, however for each required permissions, a new middleware will be needed. This implementation allows for customization for permissions while handling generic returns from the server.

```typescript
import {JWTType, PermissionsUnit, requestedPermissions, checkRequestPermissions, validateRequestProcess,  ProcessRequest} from "jab-authserver-library";
// Used to extract the token from a Express header
const JWTToken:string|undefined = extractToken( req:Request)

// These functions will take input and return the response as being send.

/*This will check the permissions and if the permissions are valid. If not valid it will display various generic 400 errors relating to authorization.
* If permissions are successful it will throw undefine.
*/
User.get('/', async (req, res)=>{
  try {
    // will send response if permissions are not valid
    // on any error, will send back: res.status(511).send("Authorization needed")
    const requestedPermissions:PermissionsUnit = {/*Permission to check*/}
    checkRequestPermissions(req,res,type,requestedPermissions)
  }
  catch (except) { // exception should be undefine
      // Your logic here on valid permissions
  }
})

/* This is used to condense a valid response.*/
User.get('/', async (req, res)=>{
  // custom logic for checking permissions
  //...
  if(Authorized){
    const execute = ()=>{/*Logic for a authorized action*/}
    const inputStatusCode:number=200 // *This is option, default is 200
    validateRequestProcess(res, execute, inputStatusCode)
    // if there is an error, will return: res.status(500).send("Authorization needed");
  }
})

/*This is used to combine the 2 functions above. This is a short hand for the process*/
User.get('/', async (req, res)=>{
  const execute = ()=>{/*Logic for a authorized action*/}
  const inputStatusCode:number=200 // *This is option, default is 200
  const requestedPermissions:PermissionsUnit = {/*Permission to check*/}
  const type:JWTType = JWTType.Action //This in an example of what
  ProcessRequest(req, res,type, requestedPermissions, execute, inputStatusCod)
})
```

### Server Type Declarations

```typescript
/**This enum is used to describe different types of permission a user might have.*/
export enum PermissionsType {
  Blocked,
  ViewOnlyPublic,
  ViewOnlyPrivate,
  Contributor,
  Editor,
  Owner,
  Admin,
}

/**This is used to describe a particular permissions action a user can do.*/
export interface PermissionsUnit {
  /**A string identifying the specific permissions*/
  permit: string;
  /**The type of permissions expected*/
  type: PermissionsType;
}

/**format to send back to the client. This allows for the sending of data along with included any updated jwt*/
export interface ResponseData {
  /**any data to send to the client*/
  data: any;
  /**if a new refresh token is issued, this filed will contain a new value*/
  refreshToken?: string;
  /**if a new permissions token is issued, this filed will contain a new value*/
  permissionsToken?: string;
  /**if a new action token is issued, this filed will contain a new value*/
  actionToken?: string;
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
  Permanent,
}

/**This is used for typing on any incoming request to the auth server to post a new ban.*/
export interface BanJWTOptions {
  /**The JWT to ban*/
  JWT: string;
  /**the type of ban which will effect how long it is banned for*/
  banType: BanType;
  /**The reason for the ban. This is for Admin purposes and could be parsed by a server is needed.*/
  banReason: string;
}

/**This is used to specify the type of JWT*/
export enum JWTType {
  /**used for specifying JWT that will be used for long term authentication by the client*/
  Refresh = EnvironmentVars.RefreshTokenKey,
  /**This is used to specifying JWT that holds permissions the user is allowed to do*/
  Permissions = EnvironmentVars.PermissionsTokenKey,
  /**This is used for specifying JWT that allows for short term access for interacting with servers rapidly*/
  Actions = EnvironmentVars.ActionTokenKey,
  /**This is used for cross server communication. Any time another server needs to communicate with this server, use this for verification*/
  Server = EnvironmentVars.ServerTokenKey,
}

/**used to help with typing when parsing JWT data*/
export interface JWTData {
  /**unique ID of the jwt created*/
  jti: string;
  /**specifies the type of JWT*/
  sub: JWTType;
  /**'issued at' date in epoch seconds*/
  iat: number;
  /**'expiration' date in epoch seconds*/
  exp: number;
  /**list of granted permissions by this jwt*/
  permissions: PermissionsUnit[];
  /**unique string to identify the user. This maybe a username or a unique client string*/
  clientID: string;
}

/**This is used for typing on any incoming request to the auth server to post a new ban on a user.*/
export interface BanUserOptions {
  /**This can be a username or client string*/
  userString: string;
  /**the type of ban which will effect how long it is banned for*/
  banType: BanType;
  /**The reason for the ban. This is for Admin purposes and could be parsed by a server is needed.*/
  banReason: string;
}

/** Used to send to the authentication serer to renew a JWT that is possible expiring soon.*/
export interface RenewJWTRequest {
  JWT: string;
}

/**This is used to request an updated JWT. This should only be done by a server on behalf of the user and the header should send a server token.*/
export interface RenewJWTRequest {
  /**This is the current JWT that is requested for renewal*/
  JWT: string;
}

/** This should only be done by a server on behalf of the user and the header should send a server token.*/
export interface CreateJWTRequest {
  /**This can be a username or client string*/
  clientString: string;
  permissions: PermissionsUnit[];
}

/** This is used to created an action token for a client. This should only be done by a server on behalf of the user and the header should send a server token.*/
export interface ActionTokenCreation {
  /**This can be a username or client string*/
  clientString: string;
  /**These are the permissions requested for creating an action token*/
  permissions: PermissionsUnit;
}
```
