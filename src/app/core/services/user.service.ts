import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,  BehaviorSubject,  ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map,  distinctUntilChanged } from 'rxjs/operators';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor (
    private apiService: ApiService,
    private http: HttpClient,
    private jwtService: JwtService
  ) {}

  populate() {
    if (this.jwtService.getToken()) {
      this.apiService.get('/user')
        .subscribe(
          data => this.setAuth(data.user),
          err => this.purgeAuth()
        );
    } else {
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    //this.jwtService.saveToken(user.token);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next({} as User);
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(email, password): Observable<User> {
    return this.apiService.post('/user/login', {email: email, password: password})
      .pipe(map(
        data => {
          this.setAuth(data.user);
          return data;
        }
      ));
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

}
