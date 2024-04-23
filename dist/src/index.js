"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const router_1 = __importDefault(require("./router"));
const mongoose_1 = __importDefault(require("mongoose"));
const port = process.env.PORT || 3001;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.json("API of Filipay Mobile");
});
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.log("Server running on http://localhost:" + port);
});
const MONGO_URL = process.env.MONGO_URL;
// const MONGO_URL = 'mongodb://localhost:27017/filipay';
mongoose_1.default.set("strictQuery", false);
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(MONGO_URL);
mongoose_1.default.connection.on("error", (error) => console.log(error));
app.use("/filipayMobile", (0, router_1.default)());
exports.default = app;
//# sourceMappingURL=index.js.map