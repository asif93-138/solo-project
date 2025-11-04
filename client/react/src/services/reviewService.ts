/* eslint-disable @typescript-eslint/no-explicit-any */
export async function createRatingAndReview(data: any) {
    const response = await fetch("https://solo-project-llin.onrender.com/api/review/", {
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
    const response = await fetch("https://solo-project-llin.onrender.com/api/review/" + id, {
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
    const response = await fetch("https://solo-project-llin.onrender.com/api/review/" + id, {
        method: "DELETE",
    });
    const result = await response.json();
    return result;
}