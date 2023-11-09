import { Team } from './teams.models';


export interface Account {
    id:         number;
    account:    string;
    client:     string;
    supervisor: string;
    teams:      Team[];
}
