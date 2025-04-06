
export default function LogInForm() {
    return (
        <>
            <div className="flex items-center justify-center flex-col  md:w-140 h-160 gap-10 rounded-2xl w-90 flex-wrap shrink-1 shadow-[0px_0px_10px_1px_rgba(0,0,0,0.7)] bg-gradient-to-br from-[#ff0000cc]/90 via-yellow-500/90 to-amber-600/90 text-white">

                <div className="flex items-center  justify-center flex-col gap-10 py-10 w-40 ">
                    <img src="/logo_dark.svg" alt="" />
                    <h1 className="text-xl font-bold   animate-pulse ">Welcome back</h1>
                </div>


                <button className="flex items-center justify-center gap-5 rounded-full border-1 border-white/90 p-2 px-5 cursor-pointer hover:border-dashed   md:w-90">
                    <img className="w-8" alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiPjxwYXRoIGZpbGw9IiNGRkMxMDciIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0xLjY0OSw0LjY1Ny02LjA4LDgtMTEuMzAzLDhjLTYuNjI3LDAtMTItNS4zNzMtMTItMTJjMC02LjYyNyw1LjM3My0xMiwxMi0xMmMzLjA1OSwwLDUuODQyLDEuMTU0LDcuOTYxLDMuMDM5bDUuNjU3LTUuNjU3QzM0LjA0Niw2LjA1MywyOS4yNjgsNCwyNCw0QzEyLjk1NSw0LDQsMTIuOTU1LDQsMjRjMCwxMS4wNDUsOC45NTUsMjAsMjAsMjBjMTEuMDQ1LDAsMjAtOC45NTUsMjAtMjBDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIvPjxwYXRoIGZpbGw9IiNGRjNEMDAiIGQ9Ik02LjMwNiwxNC42OTFsNi41NzEsNC44MTlDMTQuNjU1LDE1LjEwOCwxOC45NjEsMTIsMjQsMTJjMy4wNTksMCw1Ljg0MiwxLjE1NCw3Ljk2MSwzLjAzOWw1LjY1Ny01LjY1N0MzNC4wNDYsNi4wNTMsMjkuMjY4LDQsMjQsNEMxNi4zMTgsNCw5LjY1Niw4LjMzNyw2LjMwNiwxNC42OTF6Ii8+PHBhdGggZmlsbD0iIzRDQUY1MCIgZD0iTTI0LDQ0YzUuMTY2LDAsOS44Ni0xLjk3NywxMy40MDktNS4xOTJsLTYuMTktNS4yMzhDMjkuMjExLDM1LjA5MSwyNi43MTUsMzYsMjQsMzZjLTUuMjAyLDAtOS42MTktMy4zMTctMTEuMjgzLTcuOTQ2bC02LjUyMiw1LjAyNUM5LjUwNSwzOS41NTYsMTYuMjI3LDQ0LDI0LDQ0eiIvPjxwYXRoIGZpbGw9IiMxOTc2RDIiIGQ9Ik00My42MTEsMjAuMDgzSDQyVjIwSDI0djhoMTEuMzAzYy0wLjc5MiwyLjIzNy0yLjIzMSw0LjE2Ni00LjA4Nyw1LjU3MWMwLjAwMS0wLjAwMSwwLjAwMi0wLjAwMSwwLjAwMy0wLjAwMmw2LjE5LDUuMjM4QzM2Ljk3MSwzOS4yMDUsNDQsMzQsNDQsMjRDNDQsMjIuNjU5LDQzLjg2MiwyMS4zNSw0My42MTEsMjAuMDgzeiIvPjwvc3ZnPg=="/>
                    Continue with Google
                </button>

                <h3 className="flex items-center justify-center gap-3 text-white text-center w-[65%] p-1 ">
                    <hr className="w-full text-white/90"/>
                        OR
                    <hr className="w-full text-white/90"/>
                </h3>                

                <form className="flex items-center justify-center flex-col gap-6  md:w-88  sm:w-80 text-sm" action="">
                        <input className="  rounded-full  focus:border-dashed border-1 focus:outline-none w-full border-white focus:border-dashed p-3 px-5 md:w-90 " type="text" placeholder="Email or Username" name="email"/>
                        <div className="flex justify-end items-center md:w-90 w-full">

                            <input className=" rounded-full focus:border-dashed border-1  focus:outline-none border-white p-3 px-5 pr-12 md:w-90 w-full" type="password" placeholder="Password" name="password"/>
                            <button 
                                type="button" 
                                id="togglePassword"
                                className=" transform absolute  -translate-x-4 text-gray-500 hover:text-blue-600 cursor-pointer"
                            >
                                <i className="bi bi-eye-slash md:text-2xl text-xl animate-pulse text-white"></i>
                            </button>
                            {/* <i class="bi bi-eye"></i> */}
                        </div>
                        <div className="flex justify-between items-center w-full h-10 bg-red-500 ">
                            <div className=" gap-1.5 cursor-pointer">
                                <input type="checkbox" className=" mt-2" id="rememberMe" />
                                <label className="cursor-pointer flex" for="rememberMe">
                                    <span className="text-base">Remember me</span>
                                </label>
                            </div>
                            <a className="hover:underline" href="forget_password">Forget password ?</a>
                        </div>
                </form>
            </div>
        </>
    )
}
