import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { addCollection, deleteCollection, getCollectionsByNoteId, updateCollection } from '../controllers/collections.controllers.js';

const router = express.Router();

router.post('/:id', upload.single('file'), addCollection);
router.get('/collection/:noteId', getCollectionsByNoteId);
router.put("/update/:id", updateCollection);
router.delete("/delete/:id",deleteCollection);




export default router;