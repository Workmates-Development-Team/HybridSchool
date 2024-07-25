import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

export function Auth() {
  return (
    <Dialog>
      <DialogTrigger asChild>
              </DialogTrigger>
      <DialogContent className="">
      
        <div class="flex flex-1 flex-col gap-3 px-6 py-2" id=":R8raH2:">
          <div class="px-2 sm:px-6 py-8 flex flex-col items-center gap-6 min-w-unit-xl overflow-y-auto">
            <Link
              class="flex items-center gap-2 hover:drop-shadow-lg transition-all duration-300"
              to="/"
            >
              <Brain className="h-8 w-8 text-[#FF6542]" />
            </Link>
            <div class="flex flex-col gap-1 w-full">
              <div class="font-medium text-center text-2xl sm:text-3xl">
                Sign in to AiTutor
              </div>
              <div class="text-sm text-center opacity-80">
                Please sign in your account to get started.
              </div>
            </div>
            <div class="flex flex-col gap-3 w-full">
              <button class="font-medium w-full p-2.5 border border-black rounded flex justify-center items-center gap-4 hover:border-alpha hover:text-alpha transition-all duration-300">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  version="1.1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 48 48"
                  enable-background="new 0 0 48 48"
                  class="text-2xl"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
	c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
	c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
	C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>{" "}
                Sign in with Google
              </button>
              <button
                disabled=""
                class="font-medium w-full p-2.5 border border-black rounded flex justify-center items-center gap-4 transition-all duration-300 bg-gray-200 text-gray-500"
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 1024 1024"
                  class="text-2xl !text-gray-500"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z"></path>
                </svg>
                Sign in with Apple
              </button>
            </div>
            <div class="relative w-full h-[1px] bg-black/20 before:content-normal before:content-['OR'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-white before:px-4 before:font-semibold text-sm"></div>
            <form class="flex flex-col gap-3 w-full" name="emailForm">
              <div
                class="group flex flex-col w-full group relative justify-end data-[has-label=true]:mt-[calc(theme(fontSize.small)_+_12px)]"
                data-slot="base"
                data-filled="true"
                data-filled-within="true"
              >
                <div data-slot="main-wrapper" class="h-full flex flex-col">
                  <div
                    data-slot="input-wrapper"
                    class="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 border-medium border-default-200 data-[hover=true]:border-default-400 h-unit-12 min-h-unit-12 rounded-small transition-background !duration-150 transition-colors motion-reduce:transition-none group-data-[focus=true]:border-alpha/60"
                    style={{ cursor: "text" }}
                  >
                    <div
                      data-slot="inner-wrapper"
                      class="inline-flex w-full items-center h-full box-border"
                    >
                      <input
                        data-slot="input"
                        class="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 text-medium peer pr-6 h-full"
                        aria-label="Your email address"
                        placeholder="Your email address"
                        id="react-aria1641424445-:rl:"
                        type="email"
                        value=""
                      />
                      <span
                        role="button"
                        tabindex="0"
                        data-slot="clear-button"
                        class="p-2 -m-2 z-10 hidden absolute right-3 appearance-none select-none opacity-0 hover:!opacity-100 cursor-pointer active:!opacity-70 rounded-full outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-large peer-data-[filled=true]:opacity-70 peer-data-[filled=true]:block transition-opacity motion-reduce:transition-none"
                      >
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          height="1em"
                          role="presentation"
                          viewBox="0 0 24 24"
                          width="1em"
                        >
                          <path
                            d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                class="font-medium w-full p-2.5 bg-alpha text-white rounded flex justify-center items-center gap-4 hover:bg-alpha-500 transition-all duration-300"
                type="submit"
              >
                Sign in with email
              </button>
            </form>
            <div class="flex flex-col items-center gap-5 w-full">
              <div class="flex items-center gap-2 text-xs">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 24 24"
                  class="text-alpha text-lg"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.1986 9.94435C14.7649 9.53358 14.4859 8.98601 14.4085 8.39371L14.0056 5.31126L11.275 6.79711C10.7503 7.08262 10.1433 7.17876 9.55608 7.06936L6.49998 6.50003L7.06931 9.55612C7.17871 10.1434 7.08257 10.7503 6.79707 11.275L5.31121 14.0056L8.39367 14.4085C8.98596 14.4859 9.53353 14.7649 9.94431 15.1986L12.0821 17.4555L13.4178 14.6485C13.6745 14.1091 14.109 13.6745 14.6484 13.4179L17.4555 12.0821L15.1986 9.94435ZM15.2238 15.5078L13.0111 20.1579C12.8687 20.4572 12.5107 20.5843 12.2115 20.4419C12.1448 20.4102 12.0845 20.3664 12.0337 20.3127L8.49229 16.574C8.39749 16.4739 8.27113 16.4095 8.13445 16.3917L3.02816 15.7242C2.69958 15.6812 2.46804 15.3801 2.51099 15.0515C2.52056 14.9782 2.54359 14.9074 2.5789 14.8425L5.04031 10.3191C5.1062 10.198 5.12839 10.0579 5.10314 9.92241L4.16 4.85979C4.09931 4.53402 4.3142 4.22074 4.63997 4.16005C4.7126 4.14652 4.78711 4.14652 4.85974 4.16005L9.92237 5.10319C10.0579 5.12843 10.198 5.10625 10.319 5.04036L14.8424 2.57895C15.1335 2.42056 15.4979 2.52812 15.6562 2.81919C15.6916 2.88409 15.7146 2.95495 15.7241 3.02821L16.3916 8.13449C16.4095 8.27118 16.4739 8.39754 16.5739 8.49233L20.3127 12.0337C20.5533 12.2616 20.5636 12.6414 20.3357 12.8819C20.2849 12.9356 20.2246 12.9794 20.1579 13.0111L15.5078 15.2238C15.3833 15.2831 15.283 15.3833 15.2238 15.5078ZM16.0206 17.4349L17.4348 16.0207L21.6775 20.2633L20.2633 21.6775L16.0206 17.4349Z"></path>
                </svg>
                We'll email you a code for a password-free sign in
              </div>
            </div>
          </div>
        </div>
  
      </DialogContent>
    </Dialog>
  );
}
