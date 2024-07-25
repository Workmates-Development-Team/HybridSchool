import Note from '../models/Notes.models.js';
import Collection from '../models/Collection.models.js'
import UserModels from "../models/User.models.js"
import NotesModels from '../models/Notes.models.js';

export const addNote = async (req, res) => {
  const { id } = req.params;
  const { title, details, GenAiTag } = req.body;

  try {
    const newNote = new Note({
      mentor: id,
      title,
      details,
      GenAiTag,
    });

    const savedNote = await newNote.save();

    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSingleNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Find the note by ID
    const note = await Note.findById(noteId).populate('mentor', 'name'); // Adjust the fields to populate as needed

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params; // Get the note ID from the URL parameters
    const { AllSummary } = req.body; // Extract the fields from the request body

    // Find the note by ID and update it
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        $set: {
          AllSummary,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





export const getOwnNotes = async (req, res) => {
  try {
    //const userId = req.userId;
    const mentorId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    // Find notes that belong to the user
    const notes = await Note.find({ mentor: mentorId })
      .populate('mentor', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get the total count of notes that belong to the user
    const count = await Note.countDocuments({ mentor: mentorId });

    res.status(200).json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMentorsNotes = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userID = req.params.id;

  try {
    const skip = (page - 1) * limit;
    // Find the user to get their mentors
    const user = await UserModels.findById(userID).populate("mentors");

    // Extract mentor IDs
    const mentorIds = user.mentors.map((mentor) => mentor._id);

    const mentorNotes = await NotesModels.find({ mentor: { $in: mentorIds } })
      .sort({ createdAt: -1 })  // Sort by createdAt in descending order
      .skip(skip)
      .limit(Number(limit));

    // Get the total count of mentor notes
    const totalNotes = await NotesModels.countDocuments({
      mentor: { $in: mentorIds },
    });

    // Send paginated notes and additional information
    res.json({
      notes: mentorNotes,
      totalNotes,
      totalPages: Math.ceil(totalNotes / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};



export const deleteNoteAndCollections = async (req, res) => {
  try {
    const noteId = req.params.id;

    // Find and delete the note by ID
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Delete all collections where noteId matches the deleted note's ID
    await Collection.deleteMany({ noteId });

    res.status(200).json({ message: 'Note and related collections deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// import NotesModels from "../models/Notes.models.js";
// import UserModels from "../models/User.models.js";

// export const getSingleNote = async (req, res) => {
//   try {
//     let note = await NotesModels.findById(req.params.id);

//     if (!note) return res.status(404).json({ msg: "Note not found" });

//     res.json(note);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };
// export const addNotes = async (req, res) => {
//   const { rawNote } = req.body;
//   try {
//     const newNote = new NotesModels({
//       mentor: req.userId,
//       rawNote,
//     });
//     await newNote.save();
//     res.json(newNote);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

// export const addNewNotes = async (req, res) => {
//   const { title, details } = req.body;
//   try {
//     const newNote = new NotesModels({
//       mentor: req.userId,
//       title,
//       details
//     });
//     await newNote.save();
//     res.json(newNote);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

// export const updateNotes = async (req, res) => {
//   const { rawNote, rewrittenNote, summary, faq, rawTypeNote, rawPDFNote, rawImageNote, GenAiTag } = req.body;

//   try {
//     let note = await NotesModels.findById(req.params.id);

//     if (!note) return res.status(404).json({ msg: "Note not found" });

//     // Check if the mentor owns the note
//     if (note.mentor.toString() !== req.userId) {
//       return res.status(401).json({ msg: "Not authorized" });
//     }

//     if(rawNote)
//     {
//       note.rawNote = rawNote;
//     }  
//     if (rewrittenNote) {
//       note.rewrittenNote = rewrittenNote;
//     }
//     if (summary) {
//       note.summary = summary;
//     }
//     if (faq) {
//       note.faq = faq;
//     }
//     if (rawTypeNote) {
//       note.rawTypeNote = rawTypeNote;
//     }
//     if (rawPDFNote) {
//       note.rawPDFNote = rawPDFNote;
//     }
//     if (rawImageNote) {
//       note.rawImageNote = rawImageNote;
//     }
//     if (GenAiTag) {
//       note.GenAiTag = GenAiTag;
//     }
//     if (req.file) {
//       note.videoNoteUrl = req.file.filename;
//     }

//     await note.save();
//     res.json(note);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

// export const deleteNotes = async (req, res) => {
//   try {
//     let note = await NotesModels.findById(req.params.id);
//     if (!note) return res.status(404).json({ msg: "Note not found" });

//     // Check if the mentor owns the note
//     if (note.mentor.toString() !== req.userId) {
//       return res.status(401).json({ msg: "Not authorized" });
//     }

//     await NotesModels.findByIdAndDelete(req.params.id);

//     res.json({ msg: "Note removed" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

// export const getOwnNotes = async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;

//   try {
//     const skip = (page - 1) * limit;

//     const mentorNotes = await NotesModels.find({ mentor: req.userId })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(Number(limit));

//     const totalNotes = await NotesModels.countDocuments({ mentor: req.userId });

//     res.json({
//       notes: mentorNotes,
//       totalNotes,
//       totalPages: Math.ceil(totalNotes / limit),
//       currentPage: Number(page),
//     });
//   } catch (err) {
//     console.error("error", err.message);
//     res.status(500).send("Server error");
//   }
// };

// export const getNoteTitleById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const note = await NotesModels.findById(id, 'title'); // Fetch only the title field

//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }

//     res.json({ title: note.title });
//   } catch (err) {
//     console.error("error", err.message);
//     res.status(500).send("Server error");
//   }
// };






// export const getMentorsNotes = async (req, res) => {
//   const { page = 1, limit = 10 } = req.query;

//   try {
//     const skip = (page - 1) * limit;
//     // Find the user to get their mentors
//     const user = await UserModels.findById(req.userId).populate("mentors");

//     // Extract mentor IDs
//     const mentorIds = user.mentors.map((mentor) => mentor._id);

//     const mentorNotes = await NotesModels.find({ mentor: { $in: mentorIds } })
//       .skip(skip)
//       .limit(Number(limit));

//     // Get the total count of mentor notes
//     const totalNotes = await NotesModels.countDocuments({
//       mentor: { $in: mentorIds },
//     });

//     // Send paginated notes and additional information
//     res.json({
//       notes: mentorNotes,
//       totalNotes,
//       totalPages: Math.ceil(totalNotes / limit),
//       currentPage: Number(page),
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };
