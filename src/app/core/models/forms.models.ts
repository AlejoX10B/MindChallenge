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


export interface TeamMember {
    userId:     number | null;
    startDate:  Date | null;
    endDate:    Date | null;
}


export interface TeamForm {
    id:       number | null;
    name:     string | null;
    users:    TeamMember[];
}
