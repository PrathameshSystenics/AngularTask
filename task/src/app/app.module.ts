import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { UsersComponent } from './components/users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { UserlistingComponent } from './components/userlisting/userlisting.component';
import { apiInterceptor } from './Interceptors/api.interceptor';
import { LoaderComponent } from './components/loader/loader.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ModalComponent } from './components/modal/modal.component';
import { AlertboxComponent } from './components/alertbox/alertbox.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';

export const BASE_URL = new InjectionToken<string>("BASE_URL")

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    UsersComponent,
    UserlistingComponent,
    LoaderComponent,
    NotFoundComponent,
    ModalComponent,
    AlertboxComponent,
    ErrorMessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  providers: [provideHttpClient(
    withInterceptors([apiInterceptor])
  ),
  { provide: BASE_URL, useValue: "http://localhost:44315" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
