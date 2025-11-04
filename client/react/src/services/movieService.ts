/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getAllMovies(start: number, end: number) {
  const movies = await fetch(`https://solo-project-llin.onrender.com/api/movie?start=${start}&end=${end}`)
    .then((res) => res.json())
    .then((data) => data);
  return movies;
}

export async function searchMovies(title: any, genre: any, start?: number, end?: number) {
  if (title != '' && genre != '') {
    const results = await fetch(`https://solo-project-llin.onrender.com/api/movie/?title=${title}&genre=${genre}&start=${start}&end=${end}`)
    .then((res) => res.json())
    .then((data) => data);
    return results;
  }
  else if (title != '') {
    const results = await fetch(`https://solo-project-llin.onrender.com/api/movie/?title=${title}&start=${start}&end=${end}`)
    .then((res) => res.json())
    .then((data) => data);
    return results;
  }
  else if (genre != '') {
    const results = await fetch(`https://solo-project-llin.onrender.com/api/movie/?genre=${genre}&start=${start}&end=${end}`)
    .then((res) => res.json())
    .then((data) => data);
    return results;
  }
}

export async function getMyList(user_id: any, start: number, end: number) {
  return await fetch("https://solo-project-llin.onrender.com/api/movie/user/" + user_id + "?start=" + start + "&end=" + end)
    .then((res) => res.json())
    .then((data) => data);
}

export function getMovieDetails(movie_id: any, setDataObj: any) {
  fetch("https://solo-project-llin.onrender.com/api/movie/" + movie_id)
    .then((res) => res.json())
    .then((data) => setDataObj(data));
}

export async function createMovie(data: any) {
  const movieResponse = await fetch("https://solo-project-llin.onrender.com/api/movie/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const movieData = await movieResponse.json();
  return movieData;
}

export async function deleteMovie(id: any, fileName: any) {
  const response = await fetch("https://solo-project-llin.onrender.com/api/movie/" + id, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({fileName}),
  });
  const result = await response.json();
  return result;
}

export async function updateMovie(id: any, data: any, file: any) {
  const response = await fetch("https://solo-project-llin.onrender.com/api/movie/" + id, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: file ? JSON.stringify({...data, file}) : JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}