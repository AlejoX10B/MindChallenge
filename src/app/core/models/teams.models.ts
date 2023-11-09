import { MinUser } from '../../shared/models';


export interface Team {
    id:         number;
    name:       string;
    accountId:  string;
    users:      MinUser[]
}
