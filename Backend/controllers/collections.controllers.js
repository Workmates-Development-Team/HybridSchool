import Collection from "../models/Collection.models.js";
import path from "path";

export const addCollection = async (req, res) => {
  const { id } = req.params;
  const { rawNotes, type, rewrittenNotes, summary, faq } = req.body;

  
  
  let url = "";
  if (req.file) {
    url = req.file.filename;
  }

  try {
    const newCollection = new Collection({
      noteId: id,
      rawNotes,
      type,
      url,
      rewrittenNotes,
      summary,
      faq,
    });

    const savedCollection = await newCollection.save();

    res.status(201).json(savedCollection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCollectionsByNoteId = async (req, res) => {
    const { noteId } = req.params;
  
    try {
      const collections = await Collection.find({ noteId }).populate('noteId', 'title details');
  
      if (collections.length === 0) {
        return res.status(404).json({ message: 'Collections not found' });
      }
  
      res.status(200).json(collections);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  export const updateCollection = async (req, res) => {
    const { id } = req.params;
    const { rewrittenNotes, summary, faq } = req.body;
  
    try {
      const updatedCollection = await Collection.findByIdAndUpdate(
        id,
        { rewrittenNotes, summary, faq },
        { new: true }
      );
  
      if (!updatedCollection) {
        return res.status(404).json({ message: "Collection not found" });
      }
  
      res.status(200).json(updatedCollection);
    } catch (error) {
      res.status(500).json({ message: "Error updating collection", error });
    }
  };

  export const deleteCollection = async (req, res) => {
    try {
      const collectionId = req.params.id;
  
      // Find the collection by ID and delete it
      const collection = await Collection.findByIdAndDelete(collectionId);
  
      if (!collection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
  
      res.status(200).json({ message: 'Collection deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };