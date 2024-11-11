import { IInterest } from "./interest";
import { City, State } from "./statecity";

export interface IUserDetails {
    Id: number ,
    FirstName: string,
    LastName: string,
    Email: string,
    Password: string,
    DateOfBirth: Date,
    Age: number,
    Gender: string,
    State: State,
    City: City,
    Address: string,
    PhoneNo: string,
    Profile: string,
    ProfileImage?: any,
    Interests: IInterest[],
    IdofInterests?: number[],
    IsDeleted: boolean,
    FormattedDate?: string
}

export type ListUser = {
    users: IUserDetails[],
    count: number,
}
