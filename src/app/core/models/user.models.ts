
export interface User {
    id:         number;
    name:       string;
    lastname:   string;
    email:      string;
    role:       'SUPER' | 'ADMIN' | 'USER'
}
