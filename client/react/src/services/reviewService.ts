/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function deleteRatingAndReview(id: any) {
    const response = await fetch("http://localhost:3000/api/review/" + id, {
        method: "DELETE",
    });
    const result = await response.json();
    return result;
}