"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const blogroutes_1 = __importDefault(require("./Routes/blogroutes"));
const authroutes_1 = __importDefault(require("./Routes/authroutes"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
// Default welcome route
app.get("/", (req, res) => {
    res.send("Welcome to Prima's Blog API");
});
// ✅ Auth Routes
app.use("/auth", authroutes_1.default);
// ✅ Blog CRUD Routes
app.use("/blogs", blogroutes_1.default);
db_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    app.listen(port, () => {
        console.log("Server is running on http://localhost:" + port);
    });
    console.log("Data Source has been initialized!");
}))
    .catch((error) => console.log(error));
