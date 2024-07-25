import React, { useContext, useEffect, useState } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import AuthGaurd from "../gaurd/AuthGaurd";
import { axiosInstance } from "../utils/axios";
import { Link } from "react-router-dom";
import { Stack } from "@mui/system";
import { Pagination } from "@mui/material";
import Navbar from "@/components/Navbar";
import { AuthContext } from "@/context/AuthContext";

export default function MyNotes() {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { user } = useContext(AuthContext);

  const getNotes = async () => {
    
    try {
      const { data } = await axiosInstance.get(
        `api/v1/notes/mentors/${user._id}?limit=5&page=${currentPage}`
      );
      setNotes(data?.notes);
      setTotalPage(data?.totalPages);
      console.log(data?.notes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    getNotes();
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  return (
    <AuthGaurd>
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
              Name : {user && user.name} || Role: {user && user.userType}
            </div>
           
          </div>
        </div>
      </div>  



      <div className="container mt-5">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Note Title</th>
              <th scope="col">Details</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {notes?.map((item, i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td>{item?.title}</td>
                <td>{item?.details}</td>
                
                <td>
                  <div className="d-flex gap-2">
                    <Link to={"/courses/"+item._id} class="btn btn-primary">
                      <i class="bi bi-eye-fill"></i>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Stack alignItems="center">
          <Pagination
            onChange={handlePageChange}
            count={totalPage}
            color="primary"
          />
        </Stack>
      </div>

</main>
    </AuthGaurd>
  );
}
