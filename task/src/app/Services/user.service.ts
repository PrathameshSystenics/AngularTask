import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { ListUser } from '../Models/user';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../app.module';
import dayjs from 'dayjs';
import { Message } from '../Models/message';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // injecting the httpclient service
  private http: HttpClient = inject(HttpClient);
  // injecting the base url value
  private url: string = inject(BASE_URL);

  // Returns the list of the users.
  getUsers(): Observable<ListUser> {
    return this.http.get<ListUser>('/api/user/users').pipe(
      map((value) => {
        let user: ListUser = value;
        user.users.map((u) => {
          u.Profile = this.getImageUrl(u.Profile);
          u.FormattedDate = dayjs(u.DateOfBirth).format('DD-MMM-YYYY');
        });
        return user;
      })
    );
  }

  // using the filename getting the image url
  getImageUrl(filename: string): string {
    return this.url + '/content/images/' + filename;
  }

  // calls the delete user by its number.
  deleteUser(userid: number): Observable<Message> {
    return this.http.delete(`/api/user/users/${userid}`);
  }
}
