import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor() { }

  async getAllMovies() {
    const movies = await fetch("http://localhost:3000/api/movie")
      .then((res) => res.json())
      .then((data) => data);
    return movies;
  }

  async searchMovies(title: any, genre: any) {
    if (title != '' && genre != '') {
      return await fetch(`http://localhost:3000/api/movie/?title=${title}&genre=${genre}`)
        .then((res) => res.json())
        .then((data) => data);
    }
    else if (title != '') {
      return await fetch(`http://localhost:3000/api/movie/?title=${title}`)
        .then((res) => res.json())
        .then((data) => data);
    }
    else if (genre != '') {
      return await fetch(`http://localhost:3000/api/movie/?genre=${genre}`)
        .then((res) => res.json())
        .then((data) => data);
    }
  }

  getMyList(user_id: any, setData: any) {
    fetch("http://localhost:3000/api/movie/user/" + user_id)
      .then((res) => res.json())
      .then((data) => setData(data));
  }

  getMovieDetails(movie_id: any, setDataObj: any) {
    fetch("http://localhost:3000/api/movie/" + movie_id)
      .then((res) => res.json())
      .then((data) => setDataObj(data));
  }

  async createMovie(data: any) {
    const response = await fetch("http://localhost:3000/api/movie/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  async deleteMovie(id: any) {
    const response = await fetch("http://localhost:3000/api/movie/" + id, {
      method: "DELETE",
    });
    return await response.json();
  }

  async updateMovie(id: any, data: any) {
    const response = await fetch("http://localhost:3000/api/movie/" + id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }
}
