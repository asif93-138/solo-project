import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Movie } from "interfaces/movie";

@Injectable({
  providedIn: "root",
})
export class MovieService {
  constructor(private http: HttpClient) {}

  // getAllMovies() {
  //   const url = "http://localhost:3000/api/movie";
  //   const $obs = this.http.get(url).subscribe({
  //     next: (val) => {
  //       console.log(val, "data get from movies api");
  //     },
  //   });
  // }
  private apiUrl = "http://localhost:3000/api/movie";
  getAllMovies(): Observable<Movie[]> {
    const res = this.http.get<Movie[]>(this.apiUrl);
    return res;
  }

  private myMovieUrl = "http://localhost:3000/api/movie/user/";
  getMyList(user_id: Number): Observable<Movie[]> {
    const res = this.http.get<Movie[]>(this.myMovieUrl + user_id);
    // `${this.myMovieUrl}${user_id}`
    // console.log("My2: ", res);
    return res;
  }

  async searchMovies(title: any, genre: any) {
    if (title != "" && genre != "") {
      return await fetch(
        `http://localhost:3000/api/movie/?title=${title}&genre=${genre}`
      )
        .then((res) => res.json())
        .then((data) => data);
    } else if (title != "") {
      return await fetch(`http://localhost:3000/api/movie/?title=${title}`)
        .then((res) => res.json())
        .then((data) => data);
    } else if (genre != "") {
      return await fetch(`http://localhost:3000/api/movie/?genre=${genre}`)
        .then((res) => res.json())
        .then((data) => data);
    }
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
