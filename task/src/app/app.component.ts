import { Component, inject, OnInit } from '@angular/core';
import { AlertType } from './components/alertbox/alertbox.component';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  message: string = '';
  isAlertBoxOpen: boolean = false;
  alerttype: AlertType = 'Success';

  // injecting the user service for notifying the change
  userservice: UserService = inject(UserService)

  onAlertBoxClose(): void {
    this.isAlertBoxOpen = false;
  }

  ngOnInit(): void {
    this.userservice.notify$.subscribe((data) => {
      this.alerttype = data.alerttype;
      this.isAlertBoxOpen = data.isAlertBoxOpen;
      this.message = data.message
    })
  }
}
