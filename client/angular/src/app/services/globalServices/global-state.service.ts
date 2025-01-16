import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class GlobalStateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    this.checkLoggedInStatus();
  }

  checkLoggedInStatus() {
    if (localStorage.length) {
      this.setUser({ user_id: Number(localStorage.getItem('user_id')), name: localStorage.getItem('name') ?? '', email: localStorage.getItem('email') ?? ''});
    }
  }
    

  setUser(user: User | null) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.getValue();
  }
}
