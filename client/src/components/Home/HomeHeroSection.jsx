import HomeFillBackground from "./HomeFillBackground";

export default function HomeHeroSection() {

    return (  
        <>

            <div className=" flex justify-center  items-center flex-col md:flex-row md:flex-nowrap md:py-35 py-5 max-w-400 md:gap-20 flex-wrap ">

                <div className="text-white flex items-start justify-center gap-15  max-w-200 p-8 flex-col bg-gradient-to-br from-[#fc1d1dda] via-violet-600/95 to-amber-400 rounded-xl shadow-[0px_0px_15px_0px_rgba(0,0,0,0.4)]">
                    <h1 className=" text-4xl md:text-7xl font-semibold  animate-pulse">Find a freelancer to achive your project in no time </h1>
                    <p className="text-lg md:text-xl ">Hire the best freelancers for any job, online. By creating and posting a project with your needs, pay only when you're 100% happy. Our freelancers will take it from here</p>
                    <button className="rounded-full py-3 bg-gradient-to-tl from-[#ff0000aa] via-yellow-500 to-amber-600 px-8 text-2xl transition delay-150 duration-400 ease-in-out hover:translate-x-1 hover:scale-105 e not-hover:shadow-[0px_0px_5px_1px_rgba(0,0,0,0.3)]">Post a project</button>
                </div>

                <div className="grid md:grid-cols-2 grid-cols-3 justify-center items-center justify-items-center gap-10 w-[80%] bg-white">
                    <video
                        autoPlay
                        loop
                        muted
                        loading="lazy"
                        className=" w-40 object-cover object-center hover:-translate-10 transition-transform duration-500 ease-in-out">
                            
                        <source src="https://ouch-prod-src-cdn.icons8.com/om/videos/bmXw6O7gN1og4-2O.webm" type="video/mp4"/>
                            Your browser does not support the video tag.
                    </video>
                        
                    <video
                        autoPlay
                        loop
                        muted
                        loading="lazy"
                        className="  w-40 object-cover object-center  hover:rotate-z-90 transition-transform duration-500 ease-in-out">

                        <source src="https://ouch-prod-src-cdn.icons8.com/ba/videos/dMBaYsVLtJd66yBB.webm" type="video/mp4"/>
                            Your browser does not support the video tag.
                    </video>
                    <video
                        autoPlay
                        loop
                        muted
                        loading="lazy"

                        className=" w-40 object-cover object-center  hover:rotate-z-90 transition-transform duration-500 ease-in-out">

                        <source src="https://ouch-prod-src-cdn.icons8.com/of/videos/x4dENWkGoArx06Ay.webm" type="video/mp4"/>
                            Your browser does not support the video tag.
                    </video>
                    <video
                        autoPlay
                        loop
                        muted
                        loading="lazy"

                        className=" w-40 object-cover object-center hover:-translate-5 transition-transform duration-500 ease-in-out">

                        <source src="https://ouch-prod-src-cdn.icons8.com/ga/videos/QziRbRZyhSXzYq7O.webm" type="video/mp4"/>
                            Your browser does not support the video tag.
                    </video>
                    <video
                        autoPlay
                        loop
                        muted
                        loading="lazy"

                        className=" w-40 object-cover object-center  hover:scale-125 transition-transform duration-500 ease-in-out">

                        <source src="https://ouch-prod-src-cdn.icons8.com/rf/videos/LSV340gUkxrDLecN.webm " type="video/mp4"/>
                            Your browser does not support the video tag.
                    </video>
                    <video
                        autoPlay
                        loop    
                        muted
                        loading="lazy"

                        className=" w-40 object-cover object-center  hover:-rotate-30 transition-transform duration-500 ease-in-out">

                        <source src="https://ouch-prod-src-cdn.icons8.com/xc/videos/ZjWuqH5_sUSs7P2I.webm" type="video/mp4"/>
                            Your browser does not support the video tag.
                    </video>
                </div>

            </div>
        </>
    )
}
