import axios from "axios";
import CourseCard from "@/components/cards/CourseCard";
import { courses } from "@/static/data";
import React, { useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../components/ui/button";
import plus from "../icon/plus-icon.png";
import { Button } from "@/components/ui/button";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MAIN_API } from "@/constants/path";
import { AuthContext } from "@/context/AuthContext";
import { Pagination, Stack } from "@mui/material";

const Courses = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.userType === "normal") {
      navigate("/profile");
    }
  }, [user]);

  useEffect(() => {
   getNotes(); 
  }, [user]);

  useEffect(() => {
    getNotes(); 
   }, [currentPage]);


const getNotes = async () =>{
  if (user && user._id) {
    const apiUrl = `${MAIN_API}api/v1/notes/own/${user._id}?limit=5&page=${currentPage}`;

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("Fetched notes successfully!", response?.data);
        setNotes(response?.data?.notes);
        setTotalPage(response?.data?.totalPages); // Assuming response.data is an array of notes
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
        // Handle error scenarios, show error message, etc.
      });
  }
}

  const handleAdd = () => {
    const apiUrl = MAIN_API + "api/v1/notes/" + user._id;

    // Make POST request using Axios
    axios
      .post(apiUrl, {
        title: title,
        details: details,
      })
      .then((response) => {
        console.log("Note added successfully!", response?.data);
        navigate(`/create/${response?.data?._id}`);
      })
      .catch((error) => {
        console.error("Error adding note:", error);
        // Handle error scenarios, show error message, etc.
      });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close modal on Cancel button click
  };

  return (
    <main>
      <div class="mx-auto bg-beta text-ta-black flex items-center">
        <div class="container max-w-7xl w-full grid grid-cols-6 items-center gap-5 py-16">
          <div class="col-span-6 sm:col-span-4 flex flex-col gap-5">
            <div class="font-medium text-3xl sm:text-4xl md:text-5xl">
              Smart Class Room
            </div>
            <p class="sm:text-lg">Smart way to Teach</p>
            <p>Welcome : {user?.name}</p>
          </div>
        </div>
      </div>
      <section class="container max-w-7xl w-full grid sm:grid-cols-2 md:grid-cols-3 gap-4 py-10 sm:py-12">
        <div className="bg-beta/40 flex flex-col items-center justify-center gap-3 sm:gap-4 rounded p-6 sm:p-8">
          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <DialogTrigger asChild>
              <button onClick={() => setIsModalOpen(true)}>
                <img
                  alt="Add"
                  loading="lazy"
                  width="70"
                  height="70"
                  src={plus}
                  style={{ color: "transparent" }}
                />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Note</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="title" className="text-right">
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="col-span-3 border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="details" className="text-right">
                    Description
                  </label>
                  <textarea
                    id="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={5}
                    style={{ height: "150px" }}
                    className="col-span-3 border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-end gap-4">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAdd}
                >
                  Add
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {notes?.map((course, i) => (
          <CourseCard data={course} />
        ))}
        
      </section>
      <Stack alignItems="center" sx={{ mb: 2 }} >
          <Pagination
            onChange={handlePageChange}
            count={totalPage}
            color="primary"
          />
        </Stack>
    </main>
  );
};

export default Courses;
