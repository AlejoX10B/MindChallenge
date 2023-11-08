
export enum UserRoles {
    Super = 'SUPER',
    Admin = 'ADMIN',
    User = 'USER'
}

export interface User {
    id:         number;
    fullname:   string;
    email:      string;
    password:   string;
    role:       UserRoles;
}
