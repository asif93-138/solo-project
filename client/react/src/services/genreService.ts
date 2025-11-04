/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getAllGenres() {
    const genres = await fetch("https://solo-project-llin.onrender.com/api/genre/")
        .then((res) => res.json())
        .then((data) => data);
    return genres;
}

export async function createNewGenre(data: any) {
    const response = await fetch("https://solo-project-llin.onrender.com/api/genre/", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
}