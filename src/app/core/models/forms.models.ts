import { UserRoles } from '../../shared/models';


export interface UserForm {
    id:         number | null;
    name:       string | null;
    lastname:   string | null;
    email:      string | null;
    password:   string | null;
    role:       UserRoles | null;
}
