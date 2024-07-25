import { cn } from "@/lib/utils";
import React, { useContext } from "react";
import { buttonVariants } from "../ui/button";
import logo from './atom.webp';
import { Link } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

const CourseCard = ({ data }) => {
  
  return (
    <div class="bg-beta/40 flex flex-col gap-3 sm:gap-4 rounded p-6 sm:p-8">
      <img
        alt="Human Geography"
        loading="lazy"
        width="37"
        height="37"
        src={logo}
        style={{ color: "transparent" }}
      />
      <div class="font-medium text-lg sm:text-xl md:text-2xl">
        {data?.title}
        
      </div>
      <p class="text-sm opacity-70">{data?.details}</p>
      <div className="flex gap-2">     
      <Link
        class={cn(buttonVariants(),"no-underline bg-[#FF6542] hover:bg-[#ff6542d1] w-fit")}
        tabindex="0"
        role="button"
        to={`/courses/${data?._id}`}
      >
        Details
      </Link>
      <Link
        class={cn(buttonVariants(),"no-underline bg-[#FF6542] hover:bg-[#ff6542d1] w-fit")}
        tabindex="0"
        role="button"
        to={`/create/${data?._id}`}
      >
        Add More
      </Link>
      </div>
    </div>
  );
};

export default CourseCard;
