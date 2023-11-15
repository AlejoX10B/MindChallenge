
export enum AuthStatus {
    LoadingAuth = 'LOADING_AUTH',
    Authenticated = 'AUTHENTICATED',
    NotAuthenticated = 'NOT_AUTHENTICATED',
}

export interface Credentials {
    username: string;
    password: string;
}
