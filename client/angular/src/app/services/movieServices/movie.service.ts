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
  private movieUrl = "http://localhost:3000/api/movie/";
  getAllMovies(): Observable<Movie[]> {
    const res = this.http.get<Movie[]>(this.movieUrl);
    return res;
  }

  private myMovieUrl = "http://localhost:3000/api/movie/user/";
  getMyList(user_id: Number): Observable<Movie[]> {
    const res = this.http.get<Movie[]>(this.myMovieUrl + user_id);
    // `${this.myMovieUrl}${user_id}`
    // console.log("My2: ", res);
    return res;
  }

  // async searchMovies(title: any, genre: any) {
  //   if (title != "" && genre != "") {
  //     return await fetch(
  //       `http://localhost:3000/api/movie/?title=${title}&genre=${genre}`
  //     )
  //       .then((res) => res.json())
  //       .then((data) => data);
  //   } else if (title != "") {
  //     return await fetch(`http://localhost:3000/api/movie/?title=${title}`)
  //       .then((res) => res.json())
  //       .then((data) => data);
  //   } else if (genre != "") {
  //     return await fetch(`http://localhost:3000/api/movie/?genre=${genre}`)
  //       .then((res) => res.json())
  //       .then((data) => data);
  //   }
  // }

  searchMovies(title: string, genre: string): Observable<Movie[]> {
    let queryParams = "";

    if (title && genre) {
      queryParams = `?title=${title}&genre=${genre}`;
    } else if (title) {
      queryParams = `?title=${title}`;
    } else if (genre) {
      queryParams = `?genre=${genre}`;
    }

    return this.http.get<Movie[]>(`${this.movieUrl}${queryParams}`);
  }

  // async createMovie(data: any) {
  //   const response = await fetch("http://localhost:3000/api/movie/", {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });
  //   return await response.json();
  // }

  createMovie(movieData: any): Observable<any> {
    console.log("movieData : ", movieData);
    return this.http.post("http://localhost:3000/api/movie/", movieData);
  }

  uploadImage(imageData: FormData): Observable<any> {
    return this.http.post("http://localhost:3000/upload", imageData);
  }

  getMovieDetails(movie_id: any) {
    return fetch("http://localhost:3000/api/movie/" + movie_id).then((res) =>
      res.json()
    );
  }

  async deleteMovie(id: any) {
    const response = await fetch("http://localhost:3000/api/movie/" + id, {
      method: "DELETE",
    });
    return await response.json();
  }

  // async updateMovie(id: any, data: any) {
  //   const response = await fetch("http://localhost:3000/api/movie/" + id, {
  //     method: "PUT",
  //     headers: {
  //       "content-type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  //   });
  //   return await response.json();
  // }

  updateMovie(movie_id: number, data: Partial<Movie>): Observable<any> {
    return this.http.put<any>(`${this.movieUrl}${movie_id}`, data);
  }
}
