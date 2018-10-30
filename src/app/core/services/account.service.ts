import { Injectable } from "@angular/core";
import { Account } from "../models";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { JwtService } from "./jwt.service";
import { ApiService } from "./api.service";

@Injectable()
export class AccountService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private jwtService: JwtService,
    private apiService: ApiService
  ) {}

  populate() {
    if (this.jwtService.getToken()) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
      this.purgeAuth();
    }
  }

  setAuth(account: Account) {
    this.jwtService.saveToken(account.token);
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.isAuthenticatedSubject.next(false);
  }

  attemptAuth(email: string, password: string): Observable<Account> {
    return this.apiService.post('/user/login',{email: email, password: password})
      .pipe(map(
        data => {
          this.setAuth(data);
          return data;
        }
      ));
  }
}
