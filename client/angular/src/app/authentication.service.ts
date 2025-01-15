import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  async userLogin(email: any, pass: any) {
    return await fetch("http://localhost:3000/api/user/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: email, password: pass }),
    })
    .then(res => res.json())
    .then(data => data);
  }
}
