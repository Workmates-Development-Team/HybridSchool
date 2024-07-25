import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
//import { extractQuestionData } from "../utils/extractQuestionData";
import { PYTHON_API } from "../constants/path";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";


const CardStyled = styled(Card)(({ theme }) => ({
  boxShadow: "none",
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: "20px",
  marginLeft: '8px'
}));

const QuizComponent = ({noteId}) => {
  const [quizData, setQuizData] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState(false);
  const [highlightedAnswer, setHighlightedAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  //const [noteId, setnoteId] = useState("668ba1d46f61e9d9b5a3c24d");

  
  
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const fetchQuiz = async () => {
    setSelectedOption(false);
    try {
      setHighlightedAnswer("");
      setError("");
      setLoading(true);
      const quizData = await axios.post(PYTHON_API + "/ask_note", {
        input:
          "Generate single MCQ question on this with Options (1), 2), 3), 4)), Question will be start with question: and also give the ans ans should start with ans:",
        start_new: true,
        doc_id: noteId,
      });

      const extractedData = extractQuestionData(quizData?.data?.response);
      setQuestionData(extractedData);
      setQuizData(quizData?.data?.response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const extractQuestionData = (inputString) => {
    // Regular expression to match the question, options, and answer
    const questionRegex =
      /(.*)\n\n1\) (.*)\n2\) (.*)\n3\) (.*)\n4\) (.*)\n\nAns: \d\) (.*)/;

    const match = inputString.match(questionRegex);

    if (match) {
      return {
        question: match[1].trim(),
        options: [
          { id: 1, text: match[2].trim() },
          { id: 2, text: match[3].trim() },
          { id: 3, text: match[4].trim() },
          { id: 4, text: match[5].trim() },
        ],
        answer: match[6].trim(),
      };
    }

    return null;
  };

  const handleNextQuestion = () => {
    if (selectedOption === questionData.answer) {
      setError("");
      setHighlightedAnswer(questionData.answer);
    } else {
      setError(`Wrong answer, the correct answer is ${questionData.answer}`);
      setHighlightedAnswer(questionData.answer);
      return;
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [noteId]);

  return (
    <>
    {loading ? (
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" />
              </div>
            ) :
    <Box>
      <div className="d-flex gap-2 justify-content-end mb-3"></div>

      <CardStyled>
        <CardContent>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "200" }}>
              {questionData?.question}
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup value={selectedOption} onChange={handleOptionChange}>
                <Grid container gap={2} sx={{ mt: 5 }}>
                  {questionData?.options?.map((option, index) => (
                    <Grid
                      key={index}
                      sx={{
                        background:
                          error && selectedOption === option.text
                            ? "#fdeded"
                            : highlightedAnswer === option.text
                            ? "#b1f2b1"
                            : "#f0f0f0",
                        borderRadius: "50px",
                        display: "flex",
                        minHeight: "50px",
                        px: 4,
                        py: 1,
                        fontWeight: "300",
                      }}
                      item
                      xs={5}
                    >
                      <FormControlLabel
                        disabled={highlightedAnswer ? true : false}
                        value={option.text}
                        control={<Radio color={"success"} />}
                        label={
                          <Typography color={"textPrimary"}>
                            {option.text}
                          </Typography>
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>
          </Box>
          <Stack direction="row" display="flex" alignItems="flex-end" mr={24}>
            <ButtonStyled
              variant="contained"
              color="success"
              onClick={handleNextQuestion}
              disabled={!selectedOption}
            >
              Submit
            </ButtonStyled>
            <ButtonStyled
              variant="contained"
              color="success"
              onClick={fetchQuiz}
              
            >
              Next Question
            </ButtonStyled>
            
          </Stack>
        </CardContent>
      </CardStyled>
    </Box>}
    
    
    </>
    
  );
};

QuizComponent.propTypes = {
  noteId: PropTypes.string.isRequired,
};

export default QuizComponent;
