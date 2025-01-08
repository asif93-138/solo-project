import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createMovie } from "../services/movieService";

describe("createMovie service", () => {
  //const userId = localStorage.getItem("user_id");
  let mock: InstanceType<typeof MockAdapter>;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("should create a new movie successfully", async () => {
    const mockData = "Movie created successfully";

    const movieData = {
      user_id: 32,
      title: "Inception",
      img: "https://example.com/inception.jpg",
      desc: "A mind-bending thriller",
      release_yr: 2010,
      director: "Christopher Nolan",
      length: 148,
      producer: "Emma Thomas",
    };

    // Mock the POST request
    mock.onPost("http://localhost:5173").reply(201, mockData);

    const response = await createMovie(movieData);
    console.log("Response: ", response);
    expect(response).toEqual(mockData);
  });

  it("should throw an error if movie creation fails", async () => {
    const movieData = {
      user_id: 123,
      title: "Inception",
    };

    // Mock the POST request
    mock.onPost("http://localhost:5173").reply(400);

    await expect(createMovie(movieData)).rejects.toThrow(
      "Failed creating movie"
    );
  });
});

// import { createMovie } from "../services/movieService";

// describe("createMovie service", () => {
//   beforeEach(() => {
//     global.fetch = jest.fn();
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });

//   it("should create a new movie successfully", async () => {
//     const mockData = { message: "Movie created successfully" };
//     const movieData = {
//       user_id: 32,
//       title: "Inception",
//       img: "https://example.com/inception.jpg",
//       desc: "A mind-bending thriller",
//       release_yr: 2010,
//       director: "Christopher Nolan",
//       length: 148,
//       producer: "Emma Thomas",
//     };

//     // Mock the fetch POST request
//     (global.fetch as jest.Mock).mockResolvedValueOnce({
//       json: async () => mockData,
//       ok: true,
//     });

//     const response = await createMovie(movieData);
//     console.log("Response: ", response);
//     console.log("Mock: ", mockData.message);
//     expect(response).toEqual(mockData.message);
//   });

//   it("should throw an error if movie creation fails", async () => {
//     const movieData = {
//       user_id: 123,
//       title: "Inception",
//     };

//     // Mock the fetch POST request to fail
//     (global.fetch as jest.Mock).mockResolvedValueOnce({
//       json: async () => ({}),
//       ok: false,
//     });

//     await expect(createMovie(movieData)).rejects.toThrow(
//       "Failed creating movie"
//     );
//   });
// });
