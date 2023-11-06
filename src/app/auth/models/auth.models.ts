
export enum AuthStatus {
    Authenticated = 'AUTHENTICATED',
    NotAuthenticated = 'NOT_AUTHENTICATED',
}

export interface Credentials {
    username: string;
    password: string;
}
