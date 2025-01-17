// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-edit-movie',
//   templateUrl: './edit-movie.component.html',
//   styleUrls: ['./edit-movie.component.css']
// })
// export class EditMovieComponent {

// }

// import { CommonModule } from "@angular/common";
// import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
// import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { Movie } from "interfaces/movie";

// @Component({
//   selector: "app-mu-form",
//   standalone: true,
//   imports: [FormsModule, CommonModule, ReactiveFormsModule],
//   templateUrl: "./edit-movie.component.html",
//   styleUrls: ["./edit-movie.component.css"],
// })
// export class MUFormComponent implements OnInit {
//   @Input() dataObj: Partial<Movie> = {};
//   //@Input() setRefresh!: (value: number) => void;
//   // @Output() setShowModal4A1 = new EventEmitter<boolean>();
//   // @Output() setShowModal4A2 = new EventEmitter<boolean>();
//   // @Output() setShowModal4 = new EventEmitter<boolean>();
//   @Output() formSubmit = new EventEmitter<Partial<Movie>>();
//   @Output() formCancel = new EventEmitter<void>();

//   formData: Partial<Movie> = {};
//   imageFile: File | null = null;
//   imagePreview: string | null = null;
//   uniqueTitleError: boolean = false;

//   constructor(private fb: FormBuilder) {}

//   ngOnInit(): void {
//     this.formData = { ...this.dataObj };
//   }

//   handleInputChange(event: Event): void {
//     const target = event.target as HTMLInputElement | HTMLTextAreaElement;
//     const { name, value } = target;
//     this.formData = {
//       ...this.formData,
//       [name]: name === "release_yr" || name === "length" ? +value : value,
//     };
//     this.uniqueTitleError = false;
//   }

//   handleImageChange(event: Event): void {
//     const target = event.target as HTMLInputElement;
//     const file = target.files?.[0];
//     if (file) {
//       this.imageFile = file;
//       this.imagePreview = URL.createObjectURL(file);
//     }
//   }

//   handleCancelImage(): void {
//     this.imageFile = null;
//     this.imagePreview = null;
//   }

//   async handleSubmit(event: Event): Promise<void> {
//     event.preventDefault(); // Prevent the default form submission

//     // Filter out empty or undefined values from formData
//     const filteredData = Object.keys(this.formData).reduce((acc, key) => {
//       const value = (this.formData as any)[key];
//       if (value !== "" && value !== undefined) {
//         (acc as any)[key] = value;
//       }
//       return acc;
//     }, {} as Partial<Movie>);

//     try {
//       if (this.imageFile) {
//         // Upload image first
//         const formDataImage = new FormData();
//         formDataImage.append("image", this.imageFile);
//         const imageResponse = await fetch("http://localhost:3000/upload", {
//           method: "POST",
//           body: formDataImage,
//         });

//         const imageData = await imageResponse.json();
//         if (imageData.filePath) {
//           filteredData.img = imageData.filePath;
//         } else {
//           throw new Error("Image upload failed");
//         }
//       }

//       // Call the updateMovie service
//       const response = await this.updateMovie(
//         this.dataObj.movie_id,
//         filteredData
//       );
//       if (response.movie_id) {
//         this.resetForm();
//         // this.setShowModal4A1.emit(false);
//         // this.setShowModal4A2.emit(true);
//         //this.setRefresh(this.setRefresh + 1);
//         // this.setShowModal4.emit(false);
//         // setTimeout(() => {
//         //   this.setShowModal4A2.emit(false);
//         //   this.setShowModal4A1.emit(true);
//         // }, 1500);
//       } else {
//         this.uniqueTitleError = true;
//       }
//     } catch (error) {
//       console.error("Error during form submission", error);
//     }
//   }

//   // Mock updateMovie method, replace with actual service call
//   async updateMovie(
//     movieId: number | undefined,
//     data: Partial<Movie>
//   ): Promise<any> {
//     // This should call the service method, e.g., this.movieService.updateMovie(movieId, data).toPromise();
//     return new Promise((resolve) => {
//       setTimeout(() => resolve({ movie_id: movieId }), 1000);
//     });
//   }

//   private resetForm(): void {
//     this.formData = {};
//     this.imageFile = null;
//     this.imagePreview = null;
//   }

//   handleCancel(): void {
//     this.formData = { ...this.dataObj };
//     // this.setShowModal4.emit(false);
//   }
// }

// import { CommonModule } from "@angular/common";
// import {
//   Component,
//   EventEmitter,
//   Input,
//   Output,
//   OnInit,
//   SimpleChanges,
// } from "@angular/core";
// import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { Movie } from "interfaces/movie";
// import { MovieDetails } from "src/app/interfaces/movie";

// @Component({
//   selector: "app-mu-form",
//   standalone: true,
//   imports: [FormsModule, CommonModule, ReactiveFormsModule],
//   templateUrl: "./edit-movie.component.html",
//   styleUrls: ["./edit-movie.component.css"],
// })
// export class MUFormComponent implements OnInit {
//   @Input() movieData: Partial<MovieDetails | null> = {};
//   @Output() formSubmit = new EventEmitter<Partial<Movie>>();
//   @Output() formCancel = new EventEmitter<void>();

//   formData: Partial<Movie> = {};
//   imageFile: File | null = null;
//   imagePreview: string | null = null;

//   constructor(private fb: FormBuilder) {
//   }
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes["movieData"] && changes["movieData"].currentValue) {
//       this.formData = { ...this.movieData };
//       console.log("FormData updated: ", this.formData);
//     }
//   }

//   ngOnInit(): void {
//     this.formData = { ...this.movieData };
//     //console.log("ForrmData: ", this.formData);
//   }

//   handleInputChange(event: Event): void {
//     const target = event.target as HTMLInputElement | HTMLTextAreaElement;
//     const { name, value } = target;
//     this.formData = {
//       ...this.formData,
//       [name]: name === "release_yr" || name === "length" ? +value : value,
//     };
//   }

//   handleImageChange(event: Event): void {
//     const target = event.target as HTMLInputElement;
//     const file = target.files?.[0];
//     if (file) {
//       this.imageFile = file;
//       this.imagePreview = URL.createObjectURL(file);
//     }
//   }

//   handleCancelImage(): void {
//     this.imageFile = null;
//     this.imagePreview = null;
//   }

//   async handleSubmit(event: Event): Promise<void> {
//     event.preventDefault();

//     // Preparing the data to emit
//     const formDataCopy = { ...this.formData };
//     if (this.imageFile) {
//       const formDataImage = new FormData();
//       formDataImage.append("image", this.imageFile);

//       // Simulate image upload
//       const imageResponse = await fetch("http://localhost:3000/upload", {
//         method: "POST",
//         body: formDataImage,
//       });
//       const imageData = await imageResponse.json();
//       if (imageData.filePath) {
//         formDataCopy.img = imageData.filePath;
//       }
//     }

//     this.formSubmit.emit(formDataCopy); // Emitting the form data
//   }

//   handleCancel(): void {
//     this.formCancel.emit();
//   }
// }

import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Movie } from "interfaces/movie";
import { MovieDetails } from "src/app/interfaces/movie";

@Component({
  selector: "app-mu-form",
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: "./edit-movie.component.html",
  styleUrls: ["./edit-movie.component.css"],
})
export class MUFormComponent implements OnInit, OnChanges {
  @Input() movieData: Partial<MovieDetails | null> = {};
  @Output() formSubmit = new EventEmitter<Partial<Movie>>();
  @Output() formCancel = new EventEmitter<void>();

  formData: Partial<MovieDetails> = {};
  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["movieData"] && changes["movieData"].currentValue) {
      this.formData = { ...this.movieData };
      console.log("FormData updated: ", this.formData);
    }
  }

  ngOnInit(): void {
    // Initialize formData here if needed, though ngOnChanges handles updates
    console.log("OnInit - FormData: ", this.movieData);
  }

  handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;
    this.formData = {
      ...this.formData,
      [name]: name === "release_yr" || name === "length" ? +value : value,
    };
  }

  handleImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.imageFile = file;
      this.imagePreview = URL.createObjectURL(file);
    }
  }

  handleCancelImage(): void {
    this.imageFile = null;
    this.imagePreview = null;
  }

  async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const formDataCopy = { ...this.formData };
    if (this.imageFile) {
      const formDataImage = new FormData();
      formDataImage.append("image", this.imageFile);

      const imageResponse = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formDataImage,
      });
      const imageData = await imageResponse.json();
      if (imageData.filePath) {
        formDataCopy.img = imageData.filePath;
      }
    }

    this.formSubmit.emit(formDataCopy);
  }

  handleCancel(): void {
    this.formCancel.emit();
  }
}
