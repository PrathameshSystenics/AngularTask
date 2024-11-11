import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { City, State, StateListCity } from '../../Models/statecity';
import { forkJoin } from 'rxjs';
import { UserService } from '../../Services/user.service';
import { ListInterest } from '../../Models/interest';
import { AlertType } from '../alertbox/alertbox.component';
import {
  Form,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IUserDetails } from '../../Models/user';
import { UserFormValidator } from '../../Validators/userform.validator';
import dayjs from 'dayjs';

export interface UserRegisterForm {
  FirstName: FormControl<string | null>;
  LastName: FormControl<string | null>;
  Email: FormControl<string | null>;
  Password: FormControl<string | null>;
  DateOfBirth: FormControl<Date | null>;
  Age: FormControl<number | null>;
  Gender: FormControl<string | null>;
  State: FormControl<State | null>;
  City: FormControl<City | null>;
  Address: FormControl<string | null>;
  PhoneNo: FormControl<string | null>;
  ProfileImage: FormControl<File | null>;
  IdofInterests: FormArray<FormControl<number | null>>;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  // injecting the user service
  private userservice: UserService = inject(UserService);

  // for storing the interest and state cities.
  statecitylist: StateListCity = {};
  interestlist: ListInterest = null as any;
  state: State[] = [];
  cities: City[] = [];

  // variables and properties related to alert box
  message: string = '';
  isAlertBoxOpen: boolean = false;
  alerttype: AlertType = 'Success';

  // property to store the uploaded image
  uploadedimage: File = null as any;
  uploadedimageurl: string = '';
  isFileDialogClosed: boolean = false;

  // get the input view children
  @ViewChild('profileimageinputfile')
  imageInput: ElementRef = null as any;

  // creating the reactive forms
  interestformarray = new FormArray<FormControl<number | null>>(
    [new FormControl<number | null>(0)],
    []
  );

  // max date or current date not able to select the future date
  maxDate: string = dayjs().subtract(1,"day").format('YYYY-MM-DD');

  reuserregisterform: FormGroup<UserRegisterForm> =
    new FormGroup<UserRegisterForm>({
      FirstName: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      LastName: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z]+$/),
      ]),
      Email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      Password: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        ),
      ]),
      DateOfBirth: new FormControl<Date | null>(null, [
        Validators.required,
        UserFormValidator.pastDate,
      ]),
      Age: new FormControl<number>(0, [Validators.required]),
      Gender: new FormControl<string>('Male', [Validators.required]),
      State: new FormControl<State | null>('', [Validators.required]),
      City: new FormControl<City | null>('', [Validators.required]),
      Address: new FormControl<string | null>('', [Validators.required]),
      PhoneNo: new FormControl<string | null>('', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ]),
      ProfileImage: new FormControl(null, [Validators.required]),
      IdofInterests: this.interestformarray,
    });

  onAlertBoxClose() {
    this.isAlertBoxOpen = false;
  }

  setAlerts(open: boolean, message: string, alerttype: AlertType) {
    this.isAlertBoxOpen = open;
    this.alerttype = alerttype;
    this.message = message;
  }

  ngOnInit(): void {
    // fetching the state, city and interest in one request
    forkJoin([
      this.userservice.getStateCity(),
      this.userservice.getInterests(),
    ]).subscribe({
      next: (data) => {
        this.statecitylist = data[0];
        this.interestlist = data[1];

        // retrieving all the keys from the statecity means all states
        this.state = Object.keys(this.statecitylist);

        // adding all the formcontrols in the formarray
        this.interestformarray.clear();
        this.interestlist.interests.forEach((value) => {
          this.interestformarray.push(new FormControl<number | null>(0));
        });
      },
      error: () => {
        this.setAlerts(
          true,
          'Failed to Load State, City and Interests',
          'Danger'
        );
      },
    });
  }

  // based on selected state change the cities
  changeCityAccordingtoState(selection: HTMLSelectElement) {
    this.cities = this.statecitylist[selection.value];
  }

  // submit form
  submitForm() {
    console.log(this.reuserregisterform);
  }

  // when the file is upload its blob is created and shown the uploaded image
  fileUpload() {
    this.isFileDialogClosed = false;
    let filetype = this.imageInput.nativeElement as HTMLInputElement;

    if (filetype.files.length !== 0) {
      const supportedimagetypes: string[] = [
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];
      if (supportedimagetypes.includes(filetype.files[0]?.type)) {
        this.uploadedimageurl = URL.createObjectURL(filetype.files[0]);
        this.uploadedimage = filetype.files[0];
        filetype.classList.remove('input-error');
      } else {
        console.log('callnig these');
        filetype.classList.add('input-error');
        this.uploadedimage = null;
        this.uploadedimageurl = '';
        this.reuserregisterform.controls.ProfileImage.setErrors({
          wrongfileupload: true,
        });
      }
    } else if (
      this.uploadedimage &&
      this.reuserregisterform.controls.ProfileImage.hasError('required')
    ) {
      this.reuserregisterform.controls.ProfileImage.setErrors(null);
    }
  }

  // when the file dialog box is cancel then the error should be thrown
  fileUploadCancel() {
    let filetype = this.imageInput.nativeElement as HTMLInputElement;
    this.isFileDialogClosed = true;
    if (!this.uploadedimage) {
      filetype.classList.add('input-error');
    }
  }

  // toggling the eye button of the password field
  toggleEye(passwordinput: HTMLInputElement) {
    passwordinput.type =
      passwordinput.type === 'password' ? 'text' : 'password';
    document.getElementById('eye-icon').classList.toggle('glyphicon-eye-close');
  }
}
