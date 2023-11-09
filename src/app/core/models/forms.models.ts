import { Roles } from '../../shared/models';


export type ProfileAction = 'EDIT' | 'READ'


export interface UserForm {
    id:         number | null;
    fullname:   string | null;
    email:      string | null;
    password:   string | null;
    role:       Roles | null;
    engLevel:   string | null;
    knowledge:  string | null;
    link:       string | null;
}
