import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor() { }

  async userLogin(email: any, pass: any) {
    return await fetch("https://solo-project-llin.onrender.com/api/user/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: email, password: pass }),
    })
      .then(res => res.json())
      .then(data => data);
  }

  async userRegistration(data: any) {
    const response = await fetch("https://solo-project-llin.onrender.com/api/user/signup", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}
