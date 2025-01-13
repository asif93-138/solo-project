"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json()); // for parsing application/json
app.get('/', (req, res) => {
    res.send('DB');
});
app.post('/', (req, res) => {
    console.log(req.body);
    res.send('Got a POST request');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
// sequelize.sync({ alter: true }).then(() => {
//   console.log("Database connected and User table created");
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// });
