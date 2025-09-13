import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor() { }

  async createRatingAndReview(data: any) {
    const response = await fetch("https://solo-project-llin.onrender.com/api/review/", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  async updateRatingAndReview(id: any, data: any) {
    const response = await fetch("https://solo-project-llin.onrender.com/api/review/" + id, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  async deleteRatingAndReview(id: any) {
    const response = await fetch("https://solo-project-llin.onrender.com/api/review/" + id, {
      method: "DELETE",
    });
    return await response.json();
  }
}
