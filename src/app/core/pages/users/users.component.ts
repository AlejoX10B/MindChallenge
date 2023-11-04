import { Component, OnInit, inject, signal } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private usersService = inject(UsersService)

  users$!: Observable<any>

  ngOnInit() {
    this.users$ = this.usersService.getUsers()
  }

}
