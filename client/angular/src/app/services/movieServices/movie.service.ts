import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Movie } from "interfaces/movie";

@Injectable({
  providedIn: "root",
})
export class MovieService {
  constructor(private http: HttpClient) {}
  private movieUrl = "https://solo-project-llin.onrender.com/api/movie/";
  getAllMovies(): Observable<Movie[]> {
    const res = this.http.get<Movie[]>(this.movieUrl);
    return res;
  }

  private myMovieUrl = "https://solo-project-llin.onrender.com/api/movie/user/";
  getMyList(user_id: Number): Observable<Movie[]> {
    const res = this.http.get<Movie[]>(this.myMovieUrl + user_id);
    return res;
  }


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

  createMovie(movieData: any): Observable<any> {
    console.log("movieData : ", movieData);
    return this.http.post("https://solo-project-llin.onrender.com/api/movie/", movieData);
  }

  uploadImage(imageData: FormData): Observable<any> {
    return this.http.post("https://solo-project-llin.onrender.com/upload", imageData);
  }

  getMovieDetails(movie_id: any) {
    return fetch("https://solo-project-llin.onrender.com/api/movie/" + movie_id).then((res) =>
      res.json()
    );
  }

  async deleteMovie(id: any) {
    const response = await fetch("https://solo-project-llin.onrender.com/api/movie/" + id, {
      method: "DELETE",
    });
    return await response.json();
  }

  updateMovie(
    movie_id: number | undefined,
    data: Partial<Movie>
  ): Observable<any> {
    return this.http.put<any>(`${this.movieUrl}${movie_id}`, data);
  }
}
