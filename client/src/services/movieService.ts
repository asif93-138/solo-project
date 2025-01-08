// export async function createMovie(x: any) {
//   try {
//     const movieResponse = await fetch("http://localhost:3000/api/movie/", {
//       method: "POST",
//       headers: {
//         "content-type": "application/json",
//       },
//       body: JSON.stringify(x),
//     });

//     const movieData = await movieResponse.json();
//     console.log("Services: ", movieData);
//     return movieData.movie;
//   } catch (error) {
//     console.log(error);
//   }
// }

import axios from "axios";

export async function createMovie(x: any) {
  try {
    console.log("X: ", x);
    const response = await axios.post("http://localhost:3000/api/movie/", x);
    console.log("Services: ", response);
    return response.data; // Adjust based on actual API response
  } catch (error) {
    throw new Error("Failed creating movie");
  }
}
