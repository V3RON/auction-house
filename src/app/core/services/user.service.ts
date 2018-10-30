import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,  BehaviorSubject,  ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { User } from '../models';
import { map,  distinctUntilChanged } from 'rxjs/operators';
import { AccountService } from "./account.service";


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  constructor (
    private apiService: ApiService,
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

}
