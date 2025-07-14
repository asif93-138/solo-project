// import { createMovie } from "./controllers/movieController";

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

for (let i = 1; i < 11; i++) {
    arr.forEach(x => {
    //     createMovie({body: {
    //     title: x.title + "-" + i,
    //     img: x.img,
    //     genre: x.genre,
    //     user_id: i % 2 == 0 ? 2 : 1,
    //     desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    //     release_yr: 2005,
    //     director: "Christopher Nolan",
    //     length: 150,
    //     producer: "Dhaka Studio"
    // }});
    });
}