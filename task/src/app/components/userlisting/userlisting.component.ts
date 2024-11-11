import { Component, inject, OnInit } from '@angular/core';
import { IUserDetails, ListUser } from '../../Models/user';
import { UserService } from '../../Services/user.service';
import { AlertType } from '../alertbox/alertbox.component';

@Component({
  selector: 'app-userlisting',
  templateUrl: './userlisting.component.html',
})
export class UserlistingComponent implements OnInit {
  // injecting the user service
  private userservice: UserService = inject(UserService);

  userlisting: ListUser = { users: [], count: 0 };
  isLoading: boolean = true;
  selectedUser: IUserDetails = null as any;
  isModalOpen: boolean = false;
  isAlertBoxOpen: boolean = false;
  message: string = '';
  alerttype: AlertType = 'Success';

  ngOnInit(): void {
    this.isLoading = true;
    this.refereshTable();
  }

  refereshTable() {
    // subscribing the the user service to fetch all the users
    this.userservice.getUsers().subscribe({
      next: (data: ListUser) => {
        this.isLoading = false;
        this.userlisting = data;
      },
      complete: () => {
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.isAlertBoxOpen = true;
        this.alerttype = 'Danger';
        this.message = err;
      },
    });
  }

  // when clicked on delete button then modal will popup
  onDelete(user: IUserDetails) {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  // when the alert box emits these event closing the alert box.
  onAlertClose() {
    this.isAlertBoxOpen = false;
  }

  // when clicked on yes button of modal it will delete the user
  modalConfirm() {
    this.userservice.deleteUser(this.selectedUser.Id).subscribe({
      next: (data) => {
        this.refereshTable();

        // setting the alert box with some message
        this.isAlertBoxOpen = true;
        this.message = String(data.message);
        this.alerttype = 'Success';

        this.isModalOpen = false;
      },
      error: (err) => {
        this.message = err;
        this.isAlertBoxOpen = true;
        this.alerttype = 'Danger';
      },
      complete: () => {
        this.isModalOpen = false;
      },
    });
  }
}
