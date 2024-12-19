import React, { useState, useContext } from 'react';
import { UserContext } from "./UserContext";


interface MovieData {
  title: string;
  img: string;
  desc: string;
  release_yr: number;
  director: string;
  length: number;
  producer: string;
  genre: string[];
}

interface Genre {
    genre_id: number;
    genre: string;
  }

  interface MovieFormProps {
    predefinedGenres: Genre[];
    setRefresh: React.Dispatch<React.SetStateAction<number>>;
  }
  

const MovieForm: React.FC<MovieFormProps> = ({ predefinedGenres, setRefresh }) => {
  const content = useContext(UserContext);
  const [formData, setFormData] = useState<MovieData>({
    title: '',
    img: '',
    desc: '',
    release_yr: new Date().getFullYear(),
    director: '',
    length: 0,
    producer: '',
    genre: [],
  });

  const [newGenre, setNewGenre] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, genre: selectedOptions }));
  };

  const handleAddNewGenre = () => {
    // console.log({genre: newGenre});
    if (newGenre.trim() && !predefinedGenres.find(x => x.genre == newGenre)) {
      fetch('http://localhost:3000/genres', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({genre: newGenre})
      })
    .then(res => res.json())
    .then(data => {
        if (data.genre_id) {
          setRefresh((prev) => prev + 1);
          setNewGenre('');
        }
    })
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log({user_id: content?.user?.user_id, ...formData});
    fetch('http://localhost:3000/movies', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({user_id: content?.user?.user_id, ...formData})
      })
    .then(res => res.json())
    .then(data => {
        if (data.movie.movie_id) {
            setFormData({
                title: '',
                img: '',
                desc: '',
                release_yr: new Date().getFullYear(),
                director: '',
                length: 0,
                producer: '',
                genre: [],
              });
              setNewGenre('');
              document.getElementsByTagName('section')[1].classList.add('hidden');
              document.getElementsByTagName('section')[0].classList.remove('hidden');
              setRefresh((prev) => prev + 1);
        }
    })
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Movie Data Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Movie Title"
          className="input input-bordered w-full"
        />

        <input
          type="text"
          name="img"
          value={formData.img}
          onChange={handleInputChange}
          placeholder="Image URL"
          className="input input-bordered w-full"
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
        />

        <input
          type="text"
          name="producer"
          value={formData.producer}
          onChange={handleInputChange}
          placeholder="Producer"
          className="input input-bordered w-full"
        />

        <select
          multiple
          value={formData.genre}
          onChange={handleGenreChange}
          className="select select-bordered w-full"
        >
          {predefinedGenres.map((genre) => (
            <option key={genre.genre_id} value={genre.genre}>
              {genre.genre}
            </option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            placeholder="Add new genre"
            className="input input-bordered flex-1"
          />
          <button
            type="button"
            onClick={handleAddNewGenre}
            className="btn btn-primary"
          >
            Add
          </button>
        </div>

        <button type="submit" className="btn btn-accent w-full">
          Submit
        </button>
      </form>
    </div>
  );
};

export default MovieForm;
