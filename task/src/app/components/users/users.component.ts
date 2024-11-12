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
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserFormValidator } from '../../Validators/userform.validator';
import dayjs from 'dayjs';
import { IUserDetails } from '../../Models/user';
import { data } from 'jquery';

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
  IdofInterests: FormArray<FormControl<boolean | null>>;
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
  uploadedimage: File | null = null;
  uploadedimageurl: string = '';
  isFileDialogClosed: boolean = false;

  // get the input view children
  @ViewChild('profileimageinputfile')
  imageInput: ElementRef = null as any;

  // creating the reactive forms
  interestformarray = new FormArray<FormControl<boolean>>(
    [],
    [UserFormValidator.oneSelected(1)]
  );

  // max date or current date not able to select the future date
  maxDate: string = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

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
      Age: new FormControl<number>(0, [
        Validators.required,
        UserFormValidator.checkAge(),
      ]),
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

  onAlertBoxClose(): void {
    this.isAlertBoxOpen = false;
  }

  // remove the image selected
  removeUploadedImage(): void {
    this.uploadedimage = null;
    this.uploadedimageurl = '';
    this.imageInput.nativeElement.value = null;
    // TODO: handle when the edit page got the uploaded image
    this.reuserregisterform.controls.ProfileImage.reset();
  }

  setAlerts(open: boolean, message: string, alerttype: AlertType): void {
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
        this.interestlist.interests.forEach((value) => {
          this.interestformarray.push(new FormControl<boolean | null>(false));
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
  changeCityAccordingtoState(selection: HTMLSelectElement): void {
    this.cities = this.statecitylist[selection.value];
    this.reuserregisterform.controls.City.reset('');
  }

  // submit form
  submitForm(): void {

    this.checkAllInputsareValid();
    if (this.reuserregisterform.valid) {
      // TODO: Handle for the edit page
      const formdata = this.toFormData(this.reuserregisterform.value);
      this.userservice.addUser(formdata).subscribe({
        next: (data) => {
          this.setAlerts(true, data.message, 'Success');
          this.resetForm();
          window.scrollTo(0,0);
          this.userservice.notifyreferesh.emit("data")
        },
        error: (err) => {
          this.setAlerts(
            true,
            'Some Error Occured While Registering the User',
            'Danger'
          );
        },
      });
    }
  }

  // when the file is upload its blob is created and shown the uploaded image
  fileUpload(): void {
    this.isFileDialogClosed = false;
    let filetype = this.imageInput.nativeElement as HTMLInputElement;

    if (filetype.files?.length !== 0) {
      const supportedimagetypes: string[] = [
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];
      if (supportedimagetypes.includes(filetype?.files[0]?.type)) {
        this.uploadedimageurl = URL.createObjectURL(filetype.files[0]);
        this.uploadedimage = filetype?.files[0];
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
  fileUploadCancel(): void {
    let filetype = this.imageInput.nativeElement as HTMLInputElement;
    this.isFileDialogClosed = true;
    if (!this.uploadedimage) {
      filetype.classList.add('input-error');
    }
  }

  // toggling the eye button of the password field
  toggleEye(passwordinput: HTMLInputElement): void {
    passwordinput.type =
      passwordinput.type === 'password' ? 'text' : 'password';
    document.getElementById('eye-icon').classList.toggle('glyphicon-eye-close');
  }

  // auto select the age when the user clicks on the dateof birth
  onDobChange(inputele: HTMLInputElement): void {
    this.reuserregisterform.controls.Age.patchValue(
      this.userservice.calculateAge(inputele.value)
    );
  }

  // Don't Allow the Character to be entered into the phone input field
  DontAllowCharacter(event: KeyboardEvent, inputele: HTMLInputElement): void {
    if (Number.isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  checkAllInputsareValid(): void {
    if (this.reuserregisterform.invalid) {
      let controls: string[] = Object.keys(this.reuserregisterform.controls);
      controls.forEach((value) => {
        let currentcontrol: AbstractControl = this.reuserregisterform.controls[
          value
        ] as AbstractControl;
        if (currentcontrol.invalid) {
          currentcontrol.markAllAsTouched();
          this.isFileDialogClosed = true;
          this.imageInput.nativeElement.classList.add('input-error');
        }
      });
    }
  }

  // resets the form
  resetForm(): void {
    this.reuserregisterform.reset();
    this.removeUploadedImage()
    this.reuserregisterform.patchValue({ Age: 0, Gender: 'Male' });
    this.imageInput.nativeElement.classList.remove('input-error');
  }

  // converts the data into formdata
  toFormData(user: any): FormData {
    const formdata = new FormData();
    let keys: string[] = Object.keys(user);
    keys.forEach((value) => {
      if (value === 'ProfileImage') {
        formdata.append(value, this.uploadedimage);
      } else if (value === 'IdofInterests') {
        formdata.append(value, this.convertToArray(user[value]));
      } else {
        formdata.append(value, user[value]);
      }
    });
    return formdata;
  }

  // converts the true value to id that should be submitted to the api
  convertToArray(IdofInterests: boolean[]): any {
    let interestsid: number[] = [];
    IdofInterests.forEach((value, index) => {
      if (value) {
        interestsid.push(this.interestlist.interests[index].InterestId);
      }
    });
    return `[${interestsid.toString()}]`;
  }
}
