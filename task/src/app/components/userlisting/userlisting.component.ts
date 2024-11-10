import { Component, inject, OnInit } from '@angular/core';
import { ListUser } from '../../Models/user';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
  styleUrl: './userlisting.component.css'
})
export class UserlistingComponent implements OnInit {
  // injecting the user service 
  private userservice: UserService = inject(UserService)


  userlisting: ListUser = { users: [], count: 0 }
  isLoading: boolean = true;
  errorMessage: string = ""

  ngOnInit(): void {
    this.isLoading = true

    // subscribing the the user service to fetch all the users
    this.userservice.getUsers().subscribe({
      next: (data: ListUser) => {
        this.isLoading = false
        this.userlisting = data
      },
      complete: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      }
    })
  }

}
