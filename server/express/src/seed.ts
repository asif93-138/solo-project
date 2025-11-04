import sequelize from "./models/sequelize";
import db from "./models"

const Movie = db.Movie;
const Genre = db.Genre;
const MG = db.MG;

const arr = [
    {
        title: "Harry Potter and the Order of the Phoenix",
        img: "/uploads/Harry Potter and the Order of the Phoenix.jpg",
        genre: ["Drama"]
    },
    {
        title: "Harry Potter and the Prisoner of Azkaban",
        img: "/uploads/Harry Potter and the Prisoner of Azkaban.jpg",
        genre: ["Family"]
    },
    {
        title: "Harry Potter and the Sorcerer's Stone",
        img: "/uploads/Harry Potter and the Sorcerer's Stone.jpg",
        genre: ["Fantasy"]
    },
    {
        title: "Ip Man",
        img: "/uploads/Ip Man.jpg",
        genre: ["Action"]
    },
    {
        title: "Taare Zameen Par",
        img: "/uploads/Taare Zameen Par.jpg",
        genre: ["Drama"]
    },
    {
        title: "The Dark Knight",
        img: "/uploads/The Dark Knight.jpg",
        genre: ["Action"]
    },
    {
        title: "The Lord of the Rings-The Fellowship of the Ring",
        img: "/uploads/The Lord of the Rings-The Fellowship of the Ring.jpg",
        genre: ["Mystery"]
    },
    {
        title: "The Lord of the Rings-The Return of the King",
        img: "/uploads/The Lord of the Rings-The Return of the King.jpg",
        genre: ["Horror"]
    },
    {
        title: "The Lord of the Rings-The Two Towers",
        img: "/uploads/The Lord of the Rings-The Two Towers.jpg",
        genre: ["Comedy"]
    },
    {
        title: "The Shawshank Redemption",
        img: "/uploads/The Shawshank Redemption.jpg",
        genre: ["Horror"]
    },
    {
        title: "Harry Potter and the Half-Blood Prince",
        img: "/uploads/Harry Potter and the Half-Blood Prince.jpg",
        genre: ["Fantasy"]
    },
    {
        title: "Harry Potter and the Goblet of Fire",
        img: "/uploads/Harry Potter and the Goblet of Fire.jpg",
        genre: ["Family"]
    },
    {
        title: "Harry Potter and the Deathly Hallows-Part 2",
        img: "/uploads/Harry Potter and the Deathly Hallows-Part 2.jpg",
        genre: ["Mystery"]
    },
    {
        title: "Harry Potter and the Deathly Hallows-Part 1",
        img: "/uploads/Harry Potter and the Deathly Hallows-Part 1.jpg",
        genre: ["Fantasy", "Family"]
    },
    {
        title: "Harry Potter and the Chamber of Secrets",
        img: "/uploads/Harry Potter and the Chamber of Secrets.jpg",
        genre: ["Fantasy", "Family"]
    },
    {
        title: "The Conjuring",
        img: "/uploads/The Conjuring.jpg",
        genre: ["Mystery", "Horror"]
    },
    {
        title: "A Beautiful Mind",
        img: "/uploads/A Beautiful Mind.jpg",
        genre: ["Mystery"]
    }
];

async function seedMovies() {
  await sequelize.sync({ force: false });

  // 🔹 Pre-create genres once
  const genres:any = {};
  for (const template of arr) {
    for (const g of template.genre) {
      if (!genres[g]) {
        const [genreInstance] = await Genre.findOrCreate({ where: { genre: g } });
        genres[g] = genreInstance.genre_id;
      }
    }
  }

  const BATCH_SIZE = 100; // insert 100 at a time
  let buffer: any[] = [];
  let associations: any[] = [];

  for (let i = 1; i < 81; i++) {
    for (const template of arr) {
      const movieData = {
        user_id: i % 2 === 0 ? 2 : 1,
        title: template.title + "-" + i,
        img: template.img,
        desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        release_yr: 2005,
        director: "Christopher Nolan",
        length: 150,
        producer: "Dhaka Studio",
      };

      buffer.push(movieData);

      // collect associations later (need movie_id after insert)
      associations.push({ movieData, genre: template.genre });
    }

    // 🔹 Flush buffer every BATCH_SIZE
    if (buffer.length >= BATCH_SIZE) {
      const movies = await Movie.bulkCreate(buffer, { returning: true });
      const movieAssociations:any = [];

      movies.forEach((movie: { movie_id: number; }, idx: number) => {
        const genresForMovie = associations[idx].genre;
        for (const g of genresForMovie) {
          movieAssociations.push({
            movie_id: movie.movie_id,
            genre_id: genres[g],
          });
        }
      });

      await MG.bulkCreate(movieAssociations);

      buffer = [];
      associations = [];
      console.log(`Inserted batch up to movie #${i}`);
    }
  }

  // flush last batch
  if (buffer.length > 0) {
    const movies = await Movie.bulkCreate(buffer, { returning: true });
    const movieAssociations:any = [];

    movies.forEach((movie: { movie_id: number; }, idx: number) => {
      const genresForMovie = associations[idx].genre;
      for (const g of genresForMovie) {
        movieAssociations.push({
          movie_id: movie.movie_id,
          genre_id: genres[g],
        });
      }
    });

    await MG.bulkCreate(movieAssociations);
  }

  console.log("✅ Seeding completed");
}

seedMovies().then(() => process.exit()).catch(console.error);
