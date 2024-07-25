import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Brain, CircleUser } from "lucide-react";
import { Auth } from "./Auth";
import { AuthContext } from "@/context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = () => {
  const { handleLogout, user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-50 4 border-b bg-background shadow-sm px-4 md:px-6">
      <div className="max-w-7xl mx-auto flex h-16 items-center gap-">
        <nav className="gap-6 text-lg font-medium flex flex-row md:items-center md:gap-4 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            {/* <Brain className="h-8 w-8 text-[#FF6542]" /> */}
            <span className="whitespace-nowrap text-[30px] font-normal tracking-[2px]">
              Voice Vista
            </span>
          </Link>
          {/* <Link
            to="/"
            className="flex items-center gap-2 text-gray-600"
          >
            Courses
          </Link> */}
        </nav>

        <div className="flex ml-auto items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          {/* <Button className="uppercase tracking-[2px] px-5" size="sm">
            Sign In
          </Button> */}

          <Button className="uppercase tracking-[2px] px-5" size="sm">
            <Link class="nav-link active" aria-current="page" to="/">
            <i class="bi bi-house-door"></i>
            </Link>
          </Button>

          {user?.userType == "normal" ? (
            <Button className="uppercase tracking-[2px] px-5" size="sm">
              <Link class="nav-link active" aria-current="page" to="/all-Notes">
                All Notes
              </Link>
            </Button>
          ) : (
              null
          )}
        </div>

        <div className="flex items-center gap-4 ml-3 md:gap-2 lg:gap-4">
          {/* <Button className="uppercase tracking-[2px] px-5" size="sm">
            Sign In
          </Button> */}

          {user ? (
            <Button
              className="uppercase tracking-[2px] px-5"
              size="sm"
              onClick={handleLogout}
            >
              Log out
            </Button>
          ) : (
            <Button className="uppercase tracking-[2px] px-5" size="sm">
              <Link class="nav-link active" aria-current="page" to="/login">
                Log In
              </Link>
            </Button>
          )}

          {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
