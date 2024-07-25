export function Home() {
  return (
    <main>
      <div class="mx-auto bg-beta text-ta-black min-h-[calc(100dvh-64px)] flex items-center">
        <div class="container max-w-7xl w-full">
          <div class="mx-auto max-w-3xl w-full flex flex-col justify-center items-center gap-5 py-12">
            <h1 class="text-center font-medium text-2xl sm:text-4xl md:text-5xl">
              <span class="inline-block">Next Level AI Tutoring</span>
              <span class="inline-block lg:mt-2">for Life-Long Learners</span>
            </h1>
            <p class="text-center sm:text-xl">
              Create a custom learning pathway to help you achieve more in
              school, work, and life.
            </p>
            <div class="mt-4 relative w-full">
              <input
                class="text-xs sm:text-sm md:text-base tracking-tighter sm:tracking-normal ps-3 sm:ps-6 py-3 sm:py-4 pr-10 sm:pr-36 rounded-md bg-white w-full border-0 shadow-[0px_0px_2px_6px_rgba(255,255,255,0.3)] focus:shadow-[0px_0px_2px_8px_rgba(255,255,255,0.5)] ring-transparent focus:ring-transparent transition-all duration-300 disabled:bg-white/30 disabled:cursor-not-allowed"
                id="search"
                placeholder="Choose any topic..."
                type="text"
                value=""
                name="search"
              />
              <button class="text-sm sm:text-base absolute py-1.5 sm:py-2 px-1.5 sm:px-4 top-1/2 right-2 sm:right-4 -translate-y-1/2 bg-alpha rounded-md text-white font-medium flex items-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 448 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path>
                </svg>{" "}
                <div class="hidden sm:block">Generate Course</div>
              </button>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <div class="sm:text-lg font-medium">Popular topics:</div>
              <button class="rounded bg-white/40 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-3 hover:bg-white/70 transition-all duration-300 disabled:bg-white/30 disabled:text-gray-600 disabled:cursor-not-allowed">
                Programming{" "}
              </button>
              <button class="rounded bg-white/40 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-3 hover:bg-white/70 transition-all duration-300 disabled:bg-white/30 disabled:text-gray-600 disabled:cursor-not-allowed">
                Walking meditation{" "}
              </button>
              <button class="rounded bg-white/40 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1.5 sm:py-3 hover:bg-white/70 transition-all duration-300 disabled:bg-white/30 disabled:text-gray-600 disabled:cursor-not-allowed">
                How to be happy{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
