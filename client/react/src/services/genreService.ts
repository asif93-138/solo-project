/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getAllGenres() {
    const genres = await fetch("http://localhost:3000/api/genre/")
        .then((res) => res.json())
        .then((data) => data);
    return genres;
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