import React, { useState, useEffect } from "react";
import { MovieData, MUFormProps } from "../interfaces/MUForm";
import { updateMovie } from "../services/movieService";

const MUForm: React.FC<MUFormProps> = ({ setRefresh, dataObj, setShowModal_4A1, setShowModal_4A2, setShowModal_4 }) => {
  const [formData, setFormData] = useState<Partial<MovieData>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uniqueTitleError, setUniqueTitleError] = useState(false);

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
    setUniqueTitleError(false);
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
        const deleteFile = filteredData.img;
        filteredData.img = imageData.filePath;
        const response = await updateMovie(dataObj.movie_id, filteredData, deleteFile);
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
        } else {
          setUniqueTitleError(true);
        }
      }
    } else {
        const response = await updateMovie(dataObj.movie_id, filteredData, false);
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
        } else {
          setUniqueTitleError(true);
        }
    }

  };

  const handleCancel = () => {
    setFormData(dataObj); // Reset form fields to initial values
    setShowModal_4(false);
  };

  return (
    <div className="md:p-6">
      <h1 className="text-2xl font-bold mb-4">Edit this entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
      {uniqueTitleError && <p className="text-red-600 text-center">This title already exists!</p>}
      <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          placeholder="Movie Title"
          className="input input-bordered w-full h-full py-1"
        />
        <textarea
          name="desc"
          value={formData.desc || ""}
          onChange={handleInputChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full h-full py-1"
        />
        <div className="flex justify-between">
        <input
          type="number"
          name="release_yr"
          value={formData.release_yr || ""}
          onChange={handleInputChange}
          placeholder="Release Year"
          className="input input-bordered h-full py-1" style={{width: '49%'}}
        />
        <input
          type="number"
          name="length"
          value={formData.length || ""}
          onChange={handleInputChange}
          placeholder="Length (minutes)"
          className="input input-bordered h-full py-1" style={{width: '49%'}}
        />
        </div>
        <div className="flex justify-between">
        <input
          type="text"
          name="director"
          value={formData.director || ""}
          onChange={handleInputChange}
          placeholder="Director"
          className="input input-bordered h-full py-1" style={{width: '49%'}}
        />
        <input
          type="text"
          name="producer"
          value={formData.producer || ""}
          onChange={handleInputChange}
          placeholder="Producer"
          className="input input-bordered h-full py-1" style={{width: '49%'}}
        />
        </div>
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
          <div className="card w-96 bg-base-100 shadow-xl mx-auto">
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
        <div className="flex justify-between">
        <button type="submit" className="btn" style={{width: '49%'}}>
          Submit
        </button>
        <button
          type="button"
          className="btn" style={{width: '49%'}}
          onClick={handleCancel}
        >
          Cancel
        </button>
        </div>

      </form>
    </div>
  );
};

export default MUForm;
