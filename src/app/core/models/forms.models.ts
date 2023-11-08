import { Roles } from '../../shared/models';


export interface UserForm {
    id:         number | null;
    name:       string | null;
    lastname:   string | null;
    email:      string | null;
    password:   string | null;
    role:       Roles | null;
}

export interface FullUserForm extends UserForm {
    engLevel:   string | null;
    knowledge:  string | null;
    link:       string | null;
}
