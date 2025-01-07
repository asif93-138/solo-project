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
    } catch(error) {
        console.log(error);
    }

}