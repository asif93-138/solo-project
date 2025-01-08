/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getAllMovies() {
  const movies = await fetch('http://localhost:3000/api/movie/')
    .then((res) => res.json())
    .then((data) => data)
  return movies;
}

export async function getAllGenres() {
  const genres = await fetch('http://localhost:3000/api/genre/')
    .then((res) => res.json())
    .then((data) => data);
  return genres;
}

export async function searchMovies(searchType: any, value: any) {
  let results;
  if (searchType == 'title') {
    results = await fetch('http://localhost:3000/api/movie/?title=' + value)
      .then((res) => res.json())
      .then((data) => data);
  } else {
    results = await fetch('http://localhost:3000/api/movie/?genre=' + value)
      .then((res) => res.json())
      .then((data) => data);
  }
  return results;
}

export async function createMovie(x: any) {
  try {
    const movieResponse = await fetch("http://localhost:3000/api/movie/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(x),
    });

    const movieData = await movieResponse.json();

    return movieData.movie;
  } catch (error) {
    console.log(error);
  }

}