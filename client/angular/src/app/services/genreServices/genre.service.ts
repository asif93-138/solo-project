import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class GenreService {

  constructor() { }

  async getAllGenres() {
    return await fetch("http://localhost:3000/api/genre/")
      .then((res) => res.json())
      .then((data) => data);
  }

  async createNewGenre(data: any) {
    const response = await fetch("http://localhost:3000/api/genre/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}
