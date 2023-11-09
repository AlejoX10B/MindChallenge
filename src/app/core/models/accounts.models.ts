import { MinTeam, Team } from './teams.models';


export interface FullAccount {
    id:         number;
    account:    string;
    client:     string;
    supervisor: string;
    teams:      Team[];
}

export interface Account {
    id:         number;
    account:    string;
    client:     string;
    supervisor: string;
    team:       MinTeam;
}
