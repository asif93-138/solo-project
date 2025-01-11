import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { Genre } from "../interfaces/home";
import { MovieData, MovieFormProps } from "../interfaces/movieForm";
import { getAllGenres, createNewGenre } from "../services/genreService";
import { createMovie } from "../services/movieService";


const MovieForm: React.FC<MovieFormProps> = ({ setHomeRefresh, setListRefresh, setShowNavModal, setShowFirstModal }) => {
  const content = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreReloader, setGenreReloader] = useState(0);
  const [showIN, setShowIN] = useState(false);
  const [showGN, setShowGN] = useState(false);
  const [formData, setFormData] = useState<MovieData>({
    title: "",
    img: "",
    desc: "",
    release_yr: "",
    director: "",
    length: "",
    producer: "",
    genre: [],
  });

  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uniqueTitleError, setUniqueTitleError] = useState(false);
  async function getGenres() {
    const res = await getAllGenres();
    setGenres(res);
  }
  useEffect(() => {
    getGenres();
  }, [genreReloader]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUniqueTitleError(false);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!selectedGenres.includes(value) && value != "Select a genre") {
      setShowGN(false);
      setSelectedGenres((prev) => [...prev, value]);
    }
  };

  const handleRemoveGenre = (genre: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g !== genre));
  };

  const handleAddNewGenre = async () => {
    if (newGenre.trim() && !genres.find((x) => x.genre === newGenre)) {
      const response = await createNewGenre({ genre: newGenre });
      if (response.genre_id) {
        setNewGenre("");
        setGenreReloader(genreReloader + 1);
      }
    }
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

    if (imageFile) {
      setShowIN(false);

      if (selectedGenres.length > 0) {
        setShowGN(false);
        // Upload image first
        const formDataImage = new FormData();
        formDataImage.append("image", imageFile);

        try {
          const imageResponse = await fetch("http://localhost:3000/upload", {
            method: "POST",
            body: formDataImage,
          });

          const imageData = await imageResponse.json();

          if (imageData.filePath) {
            // Update form data with image URL and selected genres
            const updatedFormData = {
              ...formData,
              img: imageData.filePath,
              genre: selectedGenres,
            };
            // console.log(JSON.stringify({ user_id: content?.user?.user_id, ...updatedFormData }));
            // Submit movie data
            const movie = await createMovie({
              user_id: content?.user?.user_id,
              ...updatedFormData,
            });
            // console.log(movie);
            if (movie.movie?.movie_id) {
              setFormData({
                title: "",
                img: "",
                desc: "",
                release_yr: "",
                director: "",
                length: "",
                producer: "",
                genre: [],
              });
              setImageFile(null);
              setImagePreview(null);
              setSelectedGenres([]);
              if (location.pathname == "/") {
                setHomeRefresh((prev) => prev + 1);
              } else if (location.pathname == "/user") {
                setListRefresh((prev) => prev + 1);
              }
              setShowNavModal(0);
              setShowFirstModal(true);
              setTimeout(() => {
                setShowFirstModal(false);
                if (location.pathname != '/' && location.pathname != '/user') { navigate('/user'); }
              }, 1500);
            } else {
              if (movie.error == 'title must be unique') {
                setUniqueTitleError(true);
                console.log(movie.error)
              } else {
                console.log(movie)
              }
            }
          }
        } catch (error) {
          console.error("Error during upload:", error);
        }
      } else {
        setShowGN(true);
      }
    } else {
      setShowIN(true);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Create New Movie Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {uniqueTitleError && <p className="text-red-600 text-center">This title already exists!</p>}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Movie Title"
          className="input input-bordered w-full" style={{marginTop: uniqueTitleError? '10px' : 'auto'}}
          required
        />

        <textarea
          name="desc"
          value={formData.desc}
          onChange={handleInputChange}
          placeholder="Description"
          className="textarea textarea-bordered w-full"
        />

        <input
          type="number"
          name="release_yr"
          value={formData.release_yr}
          onChange={handleInputChange}
          placeholder="Release Year"
          className="input input-bordered w-full"
          required
          max="9999"
        />

        <input
          type="text"
          name="director"
          value={formData.director}
          onChange={handleInputChange}
          placeholder="Director"
          className="input input-bordered w-full"
        />

        <input
          type="number"
          name="length"
          value={formData.length}
          onChange={handleInputChange}
          placeholder="Length (minutes)"
          className="input input-bordered w-full"
          required
        />

        <input
          type="text"
          name="producer"
          value={formData.producer}
          onChange={handleInputChange}
          placeholder="Producer"
          className="input input-bordered w-full"
        />

        <div className="space-y-2">
          {genres.length > 0 && (
            <select
              onChange={handleGenreChange}
              className="select select-bordered w-full"
            >
              <option>Select a genre</option>
              {genres.map((genre) => (
                <option key={genre.genre_id} value={genre.genre}>
                  {genre.genre}
                </option>
              ))}
            </select>
          )}

          <p
            id="genre-notification"
            className={showGN ? "text-red-500 text-center" : "text-red-500 text-center hidden"}
          >
            <b>Genre must be added!</b>
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map((genre) => (
              <div key={genre} className="badge badge-ghost gap-1">
                {genre}
                <button
                  type="button"
                  onClick={() => handleRemoveGenre(genre)}
                  className="btn btn-ghost btn-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            placeholder="Add new genre"
            className="input input-bordered flex-1"
          />
          <button type="button" onClick={handleAddNewGenre} className="btn">
            Add
          </button>
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
            <p
              id="img-notification"
              className={showIN ? "text-red-500 text-center" : "text-red-500 text-center hidden"}
            >
              <b>Image is required!!</b>
            </p>
          </>
        )}

        {/* Preview Section */}
        {imagePreview && (
          <div className="card w-96 bg-base-100 shadow-xl">
            <figure>
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-t-lg max-h-60 object-cover"
              />
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
          onClick={() => {
            document
              .getElementById("img-notification")
              ?.classList.add("hidden");
            setShowNavModal(0);
            document
              .getElementById("genre-notification")
              ?.classList.add("hidden");
            setShowIN(false);
            setShowNavModal(0);
            setShowGN(false);
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default MovieForm;
