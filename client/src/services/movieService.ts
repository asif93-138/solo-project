/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getAllMovies() {
  const movies = await fetch("http://localhost:3000/api/movie")
    .then((res) => res.json())
    .then((data) => data);
  return movies;
}

export async function getAllGenres() {
  const genres = await fetch("http://localhost:3000/api/genre/")
    .then((res) => res.json())
    .then((data) => data);
  return genres;
}

export async function searchMovies(searchType: any, value: any) {
  let results;
  if (searchType == "title") {
    results = await fetch("http://localhost:3000/api/movie/?title=" + value)
      .then((res) => res.json())
      .then((data) => data);
  } else {
    results = await fetch("http://localhost:3000/api/movie/?genre=" + value)
      .then((res) => res.json())
      .then((data) => data);
  }
  return results;
}

export function getMyList(user_id: any, setData: any) {
  fetch("http://localhost:3000/api/movie/user/" + user_id)
    .then((res) => res.json())
    .then((data) => setData(data));
}

export function getMovieDetails(movie_id: any, setDataObj: any) {
  fetch("http://localhost:3000/api/movie/" + movie_id)
    .then((res) => res.json())
    .then((data) => setDataObj(data));
}

export async function createRatingAndReview(data: any) {
  const response = await fetch("http://localhost:3000/api/review/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

export async function updateRatingAndReview(id: any, data: any) {
  const response = await fetch("http://localhost:3000/api/review/" + id, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

export async function createMovie(data: any) {
  const movieResponse = await fetch("http://localhost:3000/api/movie/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const movieData = await movieResponse.json();
  return movieData;
}

export async function createNewGenre(data: any) {
  const response = await fetch("http://localhost:3000/api/genre/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

export async function deleteMovie(id: any) {
  const response = await fetch("http://localhost:3000/api/movie/" + id, {
    method: "DELETE",
  });
  const result = await response.json();
  return result;
}

export async function updateMovie(id: any, data: any) {
  const response = await fetch("http://localhost:3000/api/movie/" + id, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

export async function deleteRatingAndReview(id: any) {
  const response = await fetch("http://localhost:3000/api/review/" + id, {
    method: "DELETE",
  });
  const result = await response.json();
  return result;
}