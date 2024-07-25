import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { useParams } from "react-router-dom";
import axios from "axios";
import { MAIN_API } from "@/constants/path";

const HandleText = () => {
  const [editorHtml, setEditorHtml] = useState("");
  const { id } = useParams();
  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const saveContent = async () => {
    try {
      const response = await axios.post(MAIN_API + "api/v1/collections/" + id, {
        rawNotes: editorHtml, // Replace with actual data
        type: "text", // Replace with actual data
      });

      // Handle the response
      console.log("Response data:", response.data);
      alert("file saved successfully");
    } catch (error) {
      // Handle errors
      console.error("Error posting data:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={handleChange}
        style={{
          flex: 1,
          marginBottom: "10px",
          height: "300px",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      />

      <button className="btn btn-success mt-2" onClick={saveContent}>
        Save your Content
      </button>
    </div>
  );
};

export default HandleText;
