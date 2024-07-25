import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { MAIN_API, PYTHON_API } from "@/constants/path";
import { useParams } from "react-router-dom";
import { Cloud, CloudUpload } from "lucide-react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const HandlePdf = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const { id } = useParams();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setFileName(file.name);
    } else {
      setPdfFile(null);
      setFileName("");
    }
  };

  const handleSave = () => {
    if (pdfFile) {
      //console.log(pdfFile);

      const formData = new FormData();
      const file = new File([pdfFile], fileName, { type: "application/pdf" });
      formData.append("pdf", file);
      formData.append("noteId", id);

      axios
        .post(PYTHON_API + "pdf_raw_save", formData)
        .then(async (response) => {
          console.log("show:", response?.data?.rawPDFnote);

          alert("file saved successfully");
        })
        .catch((error) => {
          console.error("Error saving file:", error);
        });
    }
  };


  return (
    <div className="flex justify-center flex-col items-center gap-8">
      <div  className="flex justify-center">
        <div className="flex justify-center bg-white shadow-md p-6 rounded-md ">
          <input
            type="file"
            accept="application/pdf"
            id="upload-button"
            style={styles.input}
            onChange={handleFileChange}
          />
          <label
            htmlFor="upload-button"
            className="aspect-square"
            style={styles.uploadButton}
          >
            <CloudUpload className="w-8 h-8" />

{
  pdfFile? pdfFile.name: <span>Upload PDF</span>
}
            
          </label>
        </div>
      </div>
      <div>{pdfFile && <Button onClick={handleSave}>Save</Button>}</div>
    </div>
  );
};

export default HandlePdf;

const styles = {
  container: {
    textAlign: "center",
    marginTop: "20px",
  },
  input: {
    display: "none",
  },
  uploadButton: {
    padding: "10px 20px",
    backgroundColor: "#78d9f917",
    // color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    border: "1px dashed #18c0f79e",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    fontSize: "14px",
  },
  previewContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  imagePreview: {
    marginTop: "30px",
    maxWidth: "100%",
    height: "auto",
    display: "block",
    margin: "0 auto", // Center the image
  },
  saveButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
