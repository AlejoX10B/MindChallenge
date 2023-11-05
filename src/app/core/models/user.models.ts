
export interface User {
    id:         number;
    name:       string;
    lastname:   string;
    role:       'SUPER' | 'ADMIN' | 'USER'
}
