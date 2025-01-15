import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor() { }

  userExists = false;

  checkLoggedInStatus() {return this.userExists;}

  async userLogin(email: any, pass: any) {
    return await fetch("http://localhost:3000/api/user/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: email, password: pass }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.user_id) {
          this.userExists = true;
          // console.log(this.checkLoggedInStatus());
          return data;
        }
      });
  }

  async userRegistration(data: any) {
    const response = await fetch("http://localhost:3000/api/user/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}
