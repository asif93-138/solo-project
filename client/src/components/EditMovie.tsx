import React, { useState, useEffect } from "react";
import { MovieData, MUFormProps } from "../interfaces/MUForm";
import { updateMovie } from "../services/movieService";

const MUForm: React.FC<MUFormProps> = ({ setRefresh, dataObj, setShowModal_4A1, setShowModal_4A2, setShowModal_4 }) => {
  const [formData, setFormData] = useState<Partial<MovieData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Populate formData with dataObj values when the component mounts or dataObj changes
  useEffect(() => {
    setFormData(dataObj);
  }, [dataObj]);
  // console.log(dataObj);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedValue =
        name === "release_yr" || name === "length" ? Number(value) : value;
      return { ...prev, [name]: updatedValue };
    });
  };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    };
  
    const handleCancelImage = () => {
      setImageFile(null);
      setImagePreview(null);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredData = Object.entries(formData).reduce((acc, [key, value]) => {
      if (value !== "" && value !== undefined) {
        (acc as any)[key] = value; // Type assertion for flexibility
      }
      return acc;
    }, {} as Partial<MovieData>);
    // console.log(filteredData);
    if (imageFile) {
      // Upload image first
      const formDataImage = new FormData();
      formDataImage.append("image", imageFile);
      const imageResponse = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formDataImage,
      });

      const imageData = await imageResponse.json();
      if (imageData.filePath) {
        filteredData.img = imageData.filePath;
        const response = await updateMovie(dataObj.movie_id, filteredData);
        if (response.movie_id) {
          setFormData({}); // Clear form fields
          setShowModal_4A1(false);
          setShowModal_4A2(true);
          setRefresh((prev) => prev + 1);
          setShowModal_4(false);
          setTimeout(() => {
            setShowModal_4A2(false);
              setShowModal_4A1(true);
          }, 1500);
        }
      }
    } else {
        const response = await updateMovie(dataObj.movie_id, filteredData);
        if (response.movie_id) {
          setFormData({}); // Clear form fields
          setShowModal_4A1(false);
          setShowModal_4A2(true);
          setRefresh((prev) => prev + 1);
          setShowModal_4(false);
          setTimeout(() => {
            setShowModal_4A2(false);
              setShowModal_4A1(true);
          }, 1500);
        }
    }

  };

  const handleCancel = () => {
    setFormData(dataObj); // Reset form fields to initial values
    setShowModal_4(false);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit this entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
      <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          placeholder="Movie Title"
          className="input input-bordered w-full"
        />
        <textarea
          name="desc"
          value={formData.desc || ""}
          onChange={handleInputChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
        />
        <input
          type="number"
          name="release_yr"
          value={formData.release_yr || ""}
          onChange={handleInputChange}
          placeholder="Release Year"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="director"
          value={formData.director || ""}
          onChange={handleInputChange}
          placeholder="Director"
          className="input input-bordered w-full"
        />
        <input
          type="number"
          name="length"
          value={formData.length || ""}
          onChange={handleInputChange}
          placeholder="Length (minutes)"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          name="producer"
          value={formData.producer || ""}
          onChange={handleInputChange}
          placeholder="Producer"
          className="input input-bordered w-full"
        />
                {/* Image Upload Section */}
                {!imageFile && (
          <>
                    <label className="btn btn-block">
            Select Image
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
          <p id="img-notification" className="text-red-500 text-center hidden"><b>Image is required!!</b></p>
          </>
        )}

        {/* Preview Section */}
        {imagePreview && (
          <div className="card w-96 bg-base-100 shadow-xl">
            <figure>
              <img src={imagePreview} alt="Preview" className="rounded-t-lg max-h-60 object-cover" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">Image Preview</h2>
              <div className="card-actions justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-error text-white"
                  onClick={handleCancelImage}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <button type="submit" className="btn w-full">
          Submit
        </button>
        <button
          type="button"
          className="btn btn-block"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default MUForm;
