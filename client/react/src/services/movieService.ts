/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getAllMovies() {
  const movies = await fetch("http://localhost:3000/api/movie")
    .then((res) => res.json())
    .then((data) => data);
  return movies;
}

export async function searchMovies(title: any, genre: any) {
  if (title != '' && genre != '') {
    const results = await fetch(`http://localhost:3000/api/movie/?title=${title}&genre=${genre}`)
    .then((res) => res.json())
    .then((data) => data);
    return results;
  }
  else if (title != '') {
    const results = await fetch(`http://localhost:3000/api/movie/?title=${title}`)
    .then((res) => res.json())
    .then((data) => data);
    return results;
  }
  else if (genre != '') {
    const results = await fetch(`http://localhost:3000/api/movie/?genre=${genre}`)
    .then((res) => res.json())
    .then((data) => data);
    return results;
  }
}

export function getMyList(user_id: any, setData: any, setInitialResults: any) {
  fetch("http://localhost:3000/api/movie/user/" + user_id)
    .then((res) => res.json())
    .then((data) => {
      setData(data); setInitialResults(data);
    });
}

export function getMovieDetails(movie_id: any, setDataObj: any) {
  fetch("http://localhost:3000/api/movie/" + movie_id)
    .then((res) => res.json())
    .then((data) => setDataObj(data));
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

export async function deleteMovie(id: any, fileName: any) {
  const response = await fetch("http://localhost:3000/api/movie/" + id, {
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
  const response = await fetch("http://localhost:3000/api/movie/" + id, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: file ? JSON.stringify({...data, file}) : JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}