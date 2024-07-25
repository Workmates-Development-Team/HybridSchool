import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./db/db.config.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

import userRoutes from './routes/user.routes.js'
import notesRoutes from './routes/notes.routes.js'
import collectionRoutes from './routes/collection.routes.js'

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'))

app.use('/api/v1/user', userRoutes)
app.use('/api/v1/notes', notesRoutes)
app.use('/api/v1/collections', collectionRoutes)

dbConnection()
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
