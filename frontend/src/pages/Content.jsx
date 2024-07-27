import { MAIN_API, PYTHON_API } from "@/constants/path";
import { AuthContext } from "@/context/AuthContext";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { Stack } from "@mui/system";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { useParams } from "react-router-dom";
import { styled } from "@mui/system";
import Box from "@mui/material/Box";
import QuizComponent from "@/components/QuizComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "bootstrap";
import { Spinner } from "react-bootstrap";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ReactPlayer from "react-player";
import { Autocomplete, TextField } from "@mui/material";

const Content = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [voice, setVoice] = useState([]);
  const [image, setImage] = useState([]);
  const [pdf, setPdf] = useState([]);
  const [typedText, setTypedText] = useState([]);
  const [video, setVideo] = useState([]);
  const [display, setDiplay] = useState([]);
  const [quiz, setQuiz] = useState(false);
  const [quizData, setQuizdata] = useState(null);
  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState(false);
  const [highlightedanswer, setHighlightedanswer] = useState("");

  const [summaryData, setSummaryData] = useState([]);
  const [rewritten, setRewritten] = useState([]);
  const [faq, setFaq] = useState([]);
  const [url, setUrl] = useState([]);

  const [checkSummary, setCheckSummary] = useState(false);
  const [AllSummary, setAllSummary] = useState("");
  const [noteDetails, setNoteDetails] = useState();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const { id } = useParams();

  const languageChoice = [
    { label: "Hindi" },
    { label: "English" },
    { label: "Bengali" },
    { label: "Tamil" },
    { label: "Odia" },
    { label: "Kannanda" },
    { label: "Punjabi" },
    { label: "Telugu" },
    { label: "Marathi" },
    { label: "Malayalam" },
  ];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const CardStyled = styled(Card)(({ theme }) => ({
    boxShadow: "none",
  }));

  const ButtonStyled = styled(Button)(({ theme }) => ({
    marginTop: "20px",
  }));

  useEffect(() => {
    const apiUrl = `${MAIN_API}api/v1/collections/collection/${id}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("Fetched notes successfully!", response?.data);
        setAllNotes(response?.data?.notes); // Assuming response.data is an array of notes
        const voice = response?.data.filter((note) => note.type === "voice");
        setVoice(voice);
        const image = response?.data.filter((note) => note.type === "image");
        setImage(image);
        const pdf = response?.data.filter((note) => note.type === "pdf");
        setPdf(pdf);
        const text = response?.data.filter((note) => note.type === "text");
        setTypedText(text);
        const video = response?.data.filter((note) => note.type === "video");
        setVideo(video);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        // Handle error scenarios, show error message, etc.
      });
  }, [summaryData]);

  useEffect(() => {
    const apiUrl = `${MAIN_API}api/v1/notes/${id}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("check data");
        console.log(response?.data?.AllSummary);
        setNoteDetails(response?.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        // Handle error scenarios, show error message, etc.
      });
  }, [AllSummary]);

  const summary = async (prompt) => {
    //console.log(prompt);
    setQuiz(false);
    setCheckSummary(false);
    console.log("here " + prompt[0]?.summary);

    if (prompt[0]?.summary) {
      try {
        const summaryResponses = await Promise.all(
          prompt.map(async (item) => {
            console.log(item.type);

            return item?.summary; // Assuming the response data contains the summary
          })
        );
        setSummaryData(summaryResponses); // Update the state with the array of responses
      } catch (error) {
        console.error("Error posting summary data:", error);
      }

      try {
        const faqResponses = await Promise.all(
          prompt.map(async (item) => {
            console.log(item.rawNotes);

            return item?.faq; // Assuming the response data contains the FAQ
          })
        );
        setFaq(faqResponses); // Update the state with the array of responses
      } catch (error) {
        console.error("Error posting FAQ data:", error);
      }

      try {
        const rewrittenResponses = await Promise.all(
          prompt.map(async (item) => {
            return item?.rewrittenNotes; // Assuming the response data contains the rewritten text
          })
        );
        setRewritten(rewrittenResponses); // Update the state with the array of responses
      } catch (error) {
        console.error("Error posting rewritten data:", error);
      }

      try {
        const urlrespponse = await Promise.all(
          prompt.map(async (item) => {
            return item?.url; // Assuming the response data contains the rewritten text
          })
        );
        setUrl(urlrespponse); // Update the state with the array of responses
      } catch (error) {
        console.error("Error posting rewritten data:", error);
      }
    } else {
      analyzeSave(prompt);
    }
  };

  const analyzeSave = async (prompt) => {
    setLoading(true);
    try {
      const summaryResponses = await Promise.all(
        prompt.map(async (item) => {
          console.log(item.rawNotes);

          const summaryResponse = await axios.post(PYTHON_API + "ask", {
            input: "summary only context,just the answer",
            doc_id: item._id,
            start_new: true,
          });

          // Save the summary
          try {
            const updateResponse = await axios.put(
              MAIN_API + `api/v1/collections/update/${item._id}`,
              {
                summary: summaryResponse?.data?.response,
              }
            );
            console.log(
              "Collection updated successfully:",
              updateResponse.data
            );
          } catch (error) {
            console.error(
              "Error updating collection:",
              error.response?.data || error.message
            );
            alert(
              "Error updating summary: " +
                (error.response?.data || error.message)
            );
          }

          return summaryResponse?.data?.response; // Assuming the response data contains the summary
        })
      );
      setSummaryData(summaryResponses); // Update the state with the array of responses
    } catch (error) {
      console.error("Error posting summary data:", error);
    }

    try {
      const faqResponses = await Promise.all(
        prompt.map(async (item) => {
          console.log(item.rawNotes);
          const faqResponse = await axios.post(PYTHON_API + "ask", {
            input:
              "Generate a list of Frequently Asked Questions (FAQs) about [insert topic]. For each question, provide a clear and concise answer . Ensure the questions cover all key aspects of the topic and are organized in a logical order, starting with basic information and progressing to more complex details. Write each question in strong and the answer on the next line. Use the following structure: Question 1: [Basic question about the topic] \n Answer: [Clear and concise answer] Question 2: [Follow-up or related question to Question 1] \n Answer: [Clear and concise answer] ... Question 10: [More complex or advanced question about the topic] \n Answer: [Clear and concise answer]. Example: Topic: Artificial Intelligence What is Artificial Intelligence (AI)? \n Answer: Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction. \n What are the main types of AI? \n Answer: The main types of AI are Narrow AI (or Weak AI), which is designed to perform a narrow task, and General AI (or Strong AI), which has the ability to understand, learn, and apply knowledge in a generalized way. \n How is AI used in everyday life? \n Answer: AI is used in various applications such as virtual assistants (e.g., Siri, Alexa), recommendation systems (e.g., Netflix, Amazon), autonomous vehicles, and more. ... What are the ethical concerns surrounding AI? \n Answer: Ethical concerns include issues of privacy, security, bias in decision-making, job displacement due to automation, and the potential for AI to be used in harmful ways. use seprate line for question and answer",
            doc_id: item._id,
            start_new: true,
          });

          const formattedText = faqResponse?.data?.response.replace(
            /^(Question \d+: .+?)\n/gm,
            "**$1**\n"
          );
          console.log(formattedText);
          // Save the FAQ
          try {
            const updateResponse = await axios.put(
              MAIN_API + `api/v1/collections/update/${item._id}`,
              {
                faq: formattedText,
              }
            );
            console.log(
              "Collection updated successfully:",
              updateResponse.data
            );
          } catch (error) {
            console.error(
              "Error updating collection:",
              error.response?.data || error.message
            );
            alert(
              "Error updating FAQ: " + (error.response?.data || error.message)
            );
          }

          return faqResponse?.data?.response; // Assuming the response data contains the FAQ
        })
      );
      setFaq(faqResponses); // Update the state with the array of responses
    } catch (error) {
      console.error("Error posting FAQ data:", error);
    }

    try {
      const rewrittenResponses = await Promise.all(
        prompt.map(async (item) => {
          console.log(item);
          const rewriteResponse = await axios.post(PYTHON_API + "ask", {
            input: "Rewrite this text and fix grammatical mistakes",
            doc_id: item._id,
            start_new: true,
          });
          console.log(rewriteResponse.data);

          // Save the rewritten notes
          try {
            const updateResponse = await axios.put(
              MAIN_API + `api/v1/collections/update/${item._id}`,
              {
                rewrittenNotes: rewriteResponse?.data?.response,
              }
            );
            console.log(
              "Collection updated successfully:",
              updateResponse.data
            );
          } catch (error) {
            console.error(
              "Error updating collection:",
              error.response?.data || error.message
            );
            alert(
              "Error updating rewritten notes: " +
                (error.response?.data || error.message)
            );
          }

          return rewriteResponse?.data?.response; // Assuming the response data contains the rewritten text
        })
      );
      setRewritten(rewrittenResponses); // Update the state with the array of responses
    } catch (error) {
      console.error("Error posting rewritten data:", error);
    }
    try {
      const urlrespponse = await Promise.all(
        prompt.map(async (item) => {
          return item?.url; // Assuming the response data contains the rewritten text
        })
      );
      setUrl(urlrespponse); // Update the state with the array of responses
    } catch (error) {
      console.error("Error posting rewritten data:", error);
    }

    setLoading(false);
  };

  const generateQuiz = async () => {
    setQuiz(true);
    setCheckSummary(false);
  };

  const TotalSummary = async () => {
    setQuiz(false);
    setCheckSummary(true);

    if (noteDetails?.AllSummary) {
      setAllSummary(noteDetails?.AllSummary);
    } else {
      genSum();
    }
  };

  const genSum = async () => {
    setQuiz(false);
    setCheckSummary(true);
    setLoading(true);
    const TotalSummary = await axios.post(PYTHON_API + "ask_note", {
      input:
        "Summarize the whole content and give a well structured detail analysis on the topic",
      start_new: true,
      doc_id: id,
    });
    console.log(TotalSummary?.data?.response);
    setAllSummary(TotalSummary?.data?.response);
    console.log(id);
    try {
      const response = await axios.put(`${MAIN_API}api/v1/notes/${id}`, {
        AllSummary: TotalSummary?.data?.response,
      });
      console.log("Note updated successfully:", response?.data);
    } catch (error) {
      console.error(
        "Error updating note:",
        error.response ? error.response.data : error.message
      );
    }
    setLoading(false);
  };

  const handleLanguage = async (event, newevent) => {
    console.log(newevent.label);

    const translation = await axios.post(PYTHON_API + "ask_note", {
      input:
        `Summarize the whole content and give a well structured detail analysis on the topic in ${newevent.label}`,
      start_new: true,
      doc_id: id,
    });


    console.log(translation?.data?.response);



  };

  return (
    <main>
      <div class="mx-auto bg-beta text-ta-black flex items-center">
        <div class="container max-w-7xl w-full grid grid-cols-6 items-center gap-5 py-16">
          <div class="col-span-6 md:col-span-5 flex flex-col gap-5">
            <div class="font-medium text-2xl sm:text-4xl md:text-5xl">Note</div>
            <div class="flex items-center flex-wrap gap-4 sm:gap-8">
              <div class="flex items-center gap-2">
                <img
                  alt="book"
                  loading="lazy"
                  width="24"
                  height="24"
                  decoding="async"
                  data-nimg="1"
                  src="https://tutorai.me/icon/book.svg"
                  style={{ color: "transparent" }}
                />
                <p class="opacity-70 text-sm sm:text-base md:text-lg"></p>
              </div>
              Name : {user && user?.name} || Role: {user && user?.userType}
            </div>
          </div>
        </div>
      </div>
      <div class="container max-w-7xl py-12">
        <div class="w-full grid grid-cols-5 gap-6">
          <div class="col-span-5 lg:col-span-2 flex flex-col gap-3">
            <div
              class="hover:border-black/60 hover:bg-beta/60 bg-beta/40 
              flex items-center justify-between gap-4  border rounded px-2.5 lg:px-4 py-2.5 lg:py-4 transition-all duration-300"
            >
              <div class="flex items-center gap-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  class="text-xl text-[#50A44E] flex-shrink-0"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
                </svg>
                <span class="text-lg sm:text-xl lg:text-2xl font-semibold">
                  Voice
                </span>
              </div>

              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                  onClick={() => summary(voice)}
                >
                  Show
                </button>
                {user?.userType == "mentor" ? (
                  <button
                    type="button"
                    class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                    onClick={() => analyzeSave(voice)}
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                ) : null}
              </div>
            </div>
            <div
              class="hover:border-black/60 hover:bg-beta/60 bg-beta/40 
              flex items-center justify-between gap-4  border rounded px-2.5 lg:px-4 py-2.5 lg:py-4 transition-all duration-300"
            >
              <div class="flex items-center gap-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  class="text-xl text-[#50A44E] flex-shrink-0"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
                </svg>
                <span class="text-lg sm:text-xl lg:text-2xl font-semibold">
                  Image
                </span>
              </div>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                  onClick={() => summary(image)}
                >
                  Show
                </button>
                {user?.userType == "mentor" ? (
                  <button
                    type="button"
                    class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                    onClick={() => analyzeSave(image)}
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                ) : null}
              </div>
            </div>
            <div
              class="hover:border-black/60 hover:bg-beta/60 bg-beta/40 
                                                             flex items-center justify-between gap-4  border rounded px-2.5 lg:px-4 py-2.5 lg:py-4 transition-all duration-300"
            >
              <div class="flex items-center gap-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  class="text-xl text-[#50A44E] flex-shrink-0"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
                </svg>
                <span class="text-lg sm:text-xl lg:text-2xl font-semibold">
                  Typed Text
                </span>
              </div>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                  onClick={() => summary(typedText)}
                >
                  Show
                </button>
                {user?.userType == "mentor" ? (
                  <button
                    type="button"
                    class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                    onClick={() => analyzeSave(typedText)}
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                ) : null}
              </div>
            </div>
            <div
              class="hover:border-black/60 hover:bg-beta/60 bg-beta/40 
                                                             flex items-center justify-between gap-4  border rounded px-2.5 lg:px-4 py-2.5 lg:py-4 transition-all duration-300"
            >
              <div class="flex items-center gap-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  class="text-xl text-[#50A44E] flex-shrink-0"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
                </svg>
                <span class="text-lg sm:text-xl lg:text-2xl font-semibold">
                  PDF
                </span>
              </div>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                  onClick={() => summary(pdf)}
                >
                  Show
                </button>
                {user?.userType == "mentor" ? (
                  <button
                    type="button"
                    class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                    onClick={() => analyzeSave(pdf)}
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                ) : null}
              </div>
            </div>

            <div
              class="hover:border-black/60 hover:bg-beta/60 bg-beta/40 
                                                             flex items-center justify-between gap-4  border rounded px-2.5 lg:px-4 py-2.5 lg:py-4 transition-all duration-300"
            >
              <div class="flex items-center gap-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  class="text-xl text-[#50A44E] flex-shrink-0"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
                </svg>
                <span class="text-lg sm:text-xl lg:text-2xl font-semibold">
                  Video
                </span>
              </div>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                  onClick={() => summary(video)}
                >
                  Show
                </button>
                {user?.userType == "mentor" ? (
                  <button
                    type="button"
                    class="w-24 sm:w-28 bg-green-600 hover:bg-green-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                    onClick={() => analyzeSave(video)}
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                ) : null}
              </div>
            </div>

            <div
              class="hover:border-black/60 hover:bg-beta/60 bg-beta/40 
                                                             flex items-center justify-between gap-4  border rounded px-2.5 lg:px-4 py-2.5 lg:py-4 transition-all duration-300"
            >
              <div class="flex items-center gap-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  class="text-xl text-[#e57335] flex-shrink-0"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
                </svg>
                <span class="text-lg sm:text-xl lg:text-2xl font-semibold">
                  Total Summary
                </span>
              </div>
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  class="w-24 sm:w-28 bg-orange-600 hover:bg-orange-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                  onClick={TotalSummary}
                >
                  Show
                </button>
                {user?.userType == "mentor" ? (
                  <button
                    type="button"
                    class="w-24 sm:w-28 bg-orange-600 hover:bg-orange-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                    onClick={genSum}
                  >
                    <i class="bi bi-arrow-clockwise"></i>
                  </button>
                ) : null}
              </div>
            </div>

            <div
              class="hover:border-black/60 hover:bg-beta/60 bg-beta/40 
                                                             flex items-center justify-between gap-4  border rounded px-2.5 lg:px-4 py-2.5 lg:py-4 transition-all duration-300"
            >
              <div class="flex items-center gap-2">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  class="text-xl text-[#db854c] flex-shrink-0"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path>
                </svg>
                <span class="text-lg sm:text-xl lg:text-2xl font-semibold">
                  Quiz
                </span>
              </div>
              <button
                type="button"
                class="w-24 sm:w-28 bg-orange-600 hover:bg-orange-600/90 rounded-md text-center text-xs lg:text-sm text-white font-medium py-2 px-3 flex-shrink-0 disabled:opacity-50 disabled:cursor-wait transition-all duration-300"
                onClick={generateQuiz}
              >
                show
              </button>
            </div>
          </div>

          <div class="col-span-5 lg:col-span-3">
            {quiz ? (
              <div class="flex flex-col gap-4 rounded bg-beta/40 p-4 sm:p-8 lg:p-10">
                <span class="text-xl sm:text-2xl lg:text-3xl font-semibold">
                  Quiz
                </span>
                <QuizComponent noteId={id} />
              </div>
            ) : checkSummary ? (
              loading ? (
                <div className="d-flex justify-content-center align-items-center">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div class="flex flex-col gap-4 rounded bg-beta/40 p-4 sm:p-8 lg:p-10">
                  <span class="text-xl sm:text-2xl lg:text-3xl font-semibold">
                    Total summary
                  </span>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={languageChoice}
                    sx={{ width: 300 }}
                    onChange={handleLanguage}
                    renderInput={(params) => (
                      <TextField {...params} label="Choose Language" />
                    )}
                  />
                  <MarkdownRenderer text={AllSummary} />
                </div>
              )
            ) : loading ? (
              <div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" />
              </div>
            ) : (
              <div class="flex flex-col gap-4 rounded bg-beta/40 p-4 sm:p-8 lg:p-10">
                {/* <button onClick={analyzeSave}>ReAnalyze</button> */}

                {url[0] && (
                  <>
                    {MAIN_API + "files/" + url[0]}
                    {url.map((item) => (
                      <ReactPlayer
                        className="react-player"
                        url={MAIN_API + "files/" + item}
                        width="40%"
                        height="40%"
                        controls={true} // Show player controls
                      />
                    ))}
                  </>
                )}
                <div class="font-medium text-xl sm:text-2xl">
                  Detail Analysis of the class
                </div>
                <div id="main-article" class="text-xs sm:text-sm">
                  <h1>
                    <span class="text-lg sm:text-xl font-semibold">
                      1. Summary
                    </span>
                  </h1>{" "}
                  <br />
                  {summaryData.map((item, index) => (
                    <p>
                      {" "}
                      <p key={index}>
                        <span class="text-sm sm:text-base font-semibold">
                          {item}
                        </span>
                      </p>
                      <br />
                    </p>
                  ))}
                  <p></p>
                  <p></p>
                  <br /> <br />
                  <h1>
                    <span class="text-lg sm:text-xl font-semibold">
                      2. Faqs
                    </span>
                  </h1>{" "}
                  <br />{" "}
                  {faq.map((item, index) => (
                    <p>
                      <p key={index}>
                        <span class="text-xs sm:text-sm font-semibold">
                          <MarkdownRenderer text={item} />
                        </span>
                      </p>{" "}
                      <br />
                    </p>
                  ))}
                  <p></p>
                  <br /> <br />
                  <h1>
                    <span class="text-lg sm:text-xl font-semibold">
                      3. ReWritten Notes
                    </span>
                  </h1>{" "}
                  <br /> <p></p>
                  {rewritten.map((item, index) => (
                    <p>
                      <span class="text-sm sm:text-base font-semibold">
                        <p key={index}>{item}</p> <br />
                      </span>
                    </p>
                  ))}
                  <p></p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <br /> <br />
                  <p></p>
                  <p></p>
                </div>

                <hr class="my-2 sm:my-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Content;
