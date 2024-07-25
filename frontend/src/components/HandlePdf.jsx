import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { MAIN_API, PYTHON_API } from '@/constants/path';
import { useParams } from 'react-router-dom';

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
  const [fileName, setFileName] = useState('');
  const { id } = useParams();
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setFileName(file.name);
    } else {
      setPdfFile(null);
      setFileName('');
    }
  };

  const handleSave = () => {
    if (pdfFile) {
      //console.log(pdfFile);

      const formData = new FormData();
      const file = new File([pdfFile], fileName, { type: 'application/pdf' });
      formData.append('pdf', file);
      formData.append('noteId',id );

      axios.post(PYTHON_API+'pdf_raw_save', formData)
        .then(async (response) => {
          console.log('show:', response?.data?.rawPDFnote);

          alert("file saved successfully");

        })
        .catch((error) => {
            
          console.error('Error saving file:', error);
        });

    }
  };

  return (
    <Container>
      <h2>Upload PDF</h2>
      <Input type="file" accept="application/pdf" onChange={handleFileChange} />
      {pdfFile && <Button onClick={handleSave}>Save</Button>}
    </Container>
  );
};

export default HandlePdf;
