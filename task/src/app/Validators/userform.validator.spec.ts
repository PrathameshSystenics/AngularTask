import { TestBed } from '@angular/core/testing';
import { UserService } from '../Services/user.service';
import { UserFormValidator } from './userform.validator';
import { FormControl } from '@angular/forms';

describe('UserFormValidator', () => {
  let userservice: jasmine.SpyObj<UserService>;
  beforeEach(() => {
    const spyobj = jasmine.createSpyObj<UserService>('UserService', [
      'calculateAge',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: UserService, useValue: spyobj }],
    });

    userservice = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should return an error on selecting the future date as the birthdate', () => {
    const dob = new FormControl('2024-11-30');
    const rest = UserFormValidator.pastDate(dob);
    expect(rest['futureDate'])
      .withContext('Should throw Error')
      .toEqual('Birthdate cannot be in the future');
  });

  it('should return null on selecting the valid past date', () => {
    const dob = new FormControl('1990-11-05');
    const rest = UserFormValidator.pastDate(dob);
    expect(rest).toEqual(null);
  });

});
