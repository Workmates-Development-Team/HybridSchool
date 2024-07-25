import { IMAGE_API, MAIN_API } from "@/constants/path";
import { AlignCenter } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const HandleImage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [imageText, setImageText] = useState(null);
  const { id } = useParams();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        IMAGE_API + "invoke-claude-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res?.data?.completion);
      setImageText(res?.data?.completion);
      //alert("Image processed successfully!");
    } catch (error) {
      console.error("There was an error uploading the image:", error);
      alert("Failed to upload image.");
    }
  };

  const handleSaveImage = async () => {
    if (!image) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("rawNotes", imageText);
    formData.append("type", "image");
    //formData.append("file", image);

    try {
        const res = await axios.post(MAIN_API+'api/v1/collections/'+id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(res.data);
        alert('Collection added successfully!');
      } catch (error) {
        console.error('There was an error adding the collection:', error);
        alert('Failed to add collection.');
      }

  };

  return (
    <div style={styles.container}>
      <input
        type="file"
        accept="image/*"
        id="upload-button"
        style={styles.input}
        onChange={handleImageUpload}
      />
      <label htmlFor="upload-button" style={styles.uploadButton}>
        Upload Image
      </label>
      {preview && (
        <div>
          <img
            src={preview}
            alt="Preview"
            style={styles.imagePreview}
            height={"25%"}
            width={"20%"}
          />
          <button onClick={handleSaveImage} style={styles.saveButton}>
            Save Image
          </button>
        </div>
      )}
    </div>
  );
};

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
    backgroundColor: "#008CBA",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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
export default HandleImage;
