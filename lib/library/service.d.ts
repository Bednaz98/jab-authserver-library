import { PermissionsUnit } from "..";
/**This is used by services to make JWT for each other to verify. Return a string of Server JWT*/
export declare function createServerToken(permissions: PermissionsUnit): string;
