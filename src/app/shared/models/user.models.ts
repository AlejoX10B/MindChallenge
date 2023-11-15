
export enum Roles {
    Super = 'SUPER',
    Admin = 'ADMIN',
    User = 'USER'
}

export interface MinUser {
    id:         number;
    fullname:   string;
}

export interface User extends MinUser {
    email:      string;
    password:   string;
    role:       Roles;
    teamId?:    number | null;
}
