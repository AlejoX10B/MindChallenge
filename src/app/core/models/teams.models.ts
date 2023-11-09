import { MinUser } from '../../shared/models';


export interface MinTeam {
    id:     number;
    name:   string;
}

export interface Team extends MinTeam {
    accountId:  string;
    users:      MinUser[]
}
