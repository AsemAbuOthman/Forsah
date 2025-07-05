import { useState } from "react"
import HomeHeaderMenu from "./HomeHeaderMenu"
import HomeHeaderMenuExplore from "./HomeHeaderMenuExplore";
import { useNavigate } from "react-router-dom";


export default function HomeHeader() {


    const [isHover, setIsHover] = useState(false);
    const [tabId, setTabId] = useState(0);

    const navigate = useNavigate();

    const tabsFirstOption = [
        { id: 1, title: "By talent", desc: "Looking for a talent depend on specific skills ? Start here.", icon: "ri-brain-line" },
        { id: 2, title: "By country", desc: "Search for a talent based on country. Search now", icon: "ri-flag-line" },
        { id: 3, title: "By category", desc: "Find a talent to achive your certain project category.", icon: "ri-shapes-line" }
    ];

    const categoriesFirstOption = [
        { title: "Graphic Design", imgUrl: "https://www.fontfabric.com/wp-content/uploads/2024/12/Homepage-Fontfabric-We-Design-Fonts-Inverted.png", link: "/hires/graphic_design" },
        { title: "3D Modeling", imgUrl: "https://img.freepik.com/free-photo/3d-view-blooming-flower_23-2150472246.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid", link: "/hires/3d_modeling" },
        { title: "Illustration", imgUrl: "https://img.freepik.com/free-vector/hand-drawn-empowered-muslim-woman-illustration_23-2149742793.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid", link: "/hires/illustration" },
        { title: "Web development", imgUrl: "https://img.freepik.com/premium-psd/website-instant-showcase-mockup-isolated_359791-328.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid", link: "/hires/web_development" },
        { title: "Mobile development", imgUrl: "https://img.freepik.com/free-vector/furniture-shopping-app-interface_23-2148660330.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852&semt=ais_hybrid", link: "/hires/mobile_development" },
        { title: "Software development", imgUrl: "https://img.freepik.com/premium-psd/artist-room-decorated_23-2148834387.jpg?w=1800", link: "/hires/software_development" }
    ];
    
    const otherTalentsFirstOption = [
        { title: "Logo design", imgUrl: "", link: "/hires/logo_design" },
        { title: "SEO specialists", imgUrl: "", link: "/hires/seo_specialists" },
        { title: "Counseling Psychology", imgUrl: "", link: "/hires/counseling_psychology" },
        { title: "AI Development", imgUrl: "", link: "/hires/ai_development" },
        { title: "Translators", imgUrl: "", link: "/hires/translatorst" },
        { title: "Data Protection", imgUrl: "", link: "/hires/Data Protection" },
        { title: "Writting", imgUrl: "", link: "/hires/writting" },
        { title: "Marketing", imgUrl: "", link: "/hires/marketing" },
        { title: "Data Analytics", imgUrl: "", link: "/hires/data_analytics" },
        { title: "Animation", imgUrl: "", link: "/hires/animation" },
    
    ];

    const tabsSecondOption = [
        { id: 1, title: "By talent", desc: "Looking for a job depend on your talnets ? Boost up.", icon: "ri-brain-line" },
        { id: 2, title: "By language", desc: "Search for a job based on langauge. Search now", icon: "ri-global-line" },
        { id: 3, title: "All jobs", desc: "Find a job to earn money with exploring list of jobs.", icon: "ri-file-list-3-line" }
    ];

    const categoriesSecondOption = [
        { title: "Animation jobs", imgUrl: "https://media1.giphy.com/media/3o6UBedJJfaxXHvZyU/giphy.webp?cid=790b76113cv7p7rf3e1qqmvgsqa9e2fn3vw5bvwjhqw9715y&ep=v1_gifs_search&rid=giphy.webp&ct=g", link: "/jobs/animation" },
        { title: "Logo design jobs", imgUrl: "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852", link: "/jobs/logo_design" },
        { title: "AI Development jobs", imgUrl: "https://img.freepik.com/free-photo/ai-chip-artificial-intelligence-future-technology-innovation_53876-129780.jpg?t=st=1743549520~exp=1743553120~hmac=226f41067319d223b9be4bbf821e1eb52b7248594f6f61cb0731ece0d13685a4&w=740", link: "/jobs/ai_development" },
        { title: "Web development jobs", imgUrl: "https://img.freepik.com/premium-psd/laptop-screen-mockup_1163207-157.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852", link: "/web_development" },
        { title: "Marketing jobs", imgUrl: "https://img.freepik.com/premium-photo/close-up-laptop-abstract-gray-workplace-with-creative-forex-grid-map-blurry-background-trade-finance-market-invest-concept-3d-rendering_670147-7802.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852", link: "/jobs/marketing" },
        { title: "Mobile development jobs", imgUrl: "https://img.freepik.com/premium-psd/app-interface-mockup-phone-screen_772836-720.jpg?uid=R132432657&ga=GA1.1.710432733.1736715852", link: "/jobs/mobile_development" }
    ];
    
    const otherTalentsSecondOption = [
        { title: "Voice over jobs", imgUrl: "", link: "/jobs/web_development" },
        { title: "Writting jobs", imgUrl: "", link: "/jobs/mobile_development" },
        { title: "Data consulting  jobs", imgUrl: "", link: "/jobs/mobile_development" },
        { title: "Translators jobs", imgUrl: "", link: "/jobs/mobile_development" },
        { title: "SEO specialists jobs", imgUrl: "", link: "/jobs/3d_modeling" },
        { title: "Counseling Psychology jobs", imgUrl: "", link: "/jobs/illustration" },
        { title: "Data Protection jobs", imgUrl: "", link: "/jobs/software_development" },
        { title: "Thambnail design jobs", imgUrl: "", link: "/jobs/mobile_development" },
        { title: "Data analysis jobs", imgUrl: "", link: "jobs/graphic_design" },
        { title: "Software development jobs", imgUrl: "", link: "/jobs/mobile_development" },
    
    ];

    const tabsThirdOption = [
        { id: 1, title: "Local jobs", desc: "Get your job done by a local Freelancer. ", icon: "ri-map-pin-line" },
    ];


    const otherTalentsThirdOption = [
        { title: "Grocery Shopping", imgUrl: "", link: "/local/Grocery Shopping" },
        { title: "Photography or Videography", imgUrl: "", link: "/local/Photography or Videography" },
        { title: "Decorating", imgUrl: "", link: "/local/Decorating" },
        { title: "General maintincance", imgUrl: "", link: "/local/General maintincance" },
        { title: "Help Me Move", imgUrl: "", link: "/local/Help Me Move" },
        { title: "Pickup and Delivery", imgUrl: "", link: "/jobs/Pickup and Delivery" },
    ];
    

    return (
        <>
            <header className="container md:flex justify-center items-center  relative top-0 w-full  m-auto p-2 py-6  md:py-15 z-1000">
                <div className="flex justify-evenly items-center bg-white px-5 md:px-10 md:h-18  h-15 rounded-full shadow-[1px_0px_10px_1px_rgba(0,0,0,0.3)] md:fixed ">

                    <div className="hidden md:block md:pr-15">
                        <a href="/">
                            <img className="w-52" src="/icon_light.png" alt="Forsah" />
                        </a>    
                    </div> 

                    <div className="hidden md:block flex items-center justify-evenly w-full font-semibold text-black/65 ">
                        <ul className="flex items-center justify-start w-fit  gap-6 whitespace-nowrap">
                            <li className="group flex justify-evenly  cursor-pointer py-5 "  onMouseEnter={() => {setIsHover(true); setTabId(1)}} onMouseLeave={() => {setIsHover(false); setTabId(0)}}>
                                <button  className=" flex  items-center justify-center group-hover:text-violet-500/80 transation delay-75 duration-300  group-hover:scale-105 cursor-pointer" >Find talent<i className="ri-arrow-down-s-line text-2xl transition-transform delay-100 duration-300 ease-in-out transform-gpu group-hover:rotate-180"></i>
                                </button>
                                {
                                    tabId == 1 &&  isHover && <HomeHeaderMenu tabs={tabsFirstOption} categories={categoriesFirstOption} otherTalents={otherTalentsFirstOption} secondTabListApi={"https://restcountries.com/v3.1/all?fields=name,flags"}/>
                                }
                            </li>
                            <li className="group flex justify-start cursor-pointer py-5 "   onMouseEnter={() => {setIsHover(true); setTabId(2)}} onMouseLeave={() => {setIsHover(false); setTabId(0)} }>
                                <button className=" flex items-center justify-center group-hover:text-violet-500/80 transation delay-75 duration-300 group-hover:scale-105 cursor-pointer" >Find work<i className="ri-arrow-down-s-line text-2xl transition-transform delay-100 duration-300 ease-in-out transform-gpu group-hover:rotate-180"></i>
                                </button>   
                                {
                                    tabId == 2 &&  isHover && <HomeHeaderMenu tabs={tabsSecondOption} categories={categoriesSecondOption} otherTalents={otherTalentsSecondOption} secondTabListApi={null}/>
                                }
                            </li>
                            <li className="group flex justify-center cursor-pointer py-5 " onMouseEnter={() => {setIsHover(true); setTabId(3)}} onMouseLeave={() => {setIsHover(false); setTabId(0)}}>
                                <button className=" flex items-center justify-center group-hover:text-violet-500/80 transation delay-75 duration-300 group-hover:scale-105 cursor-pointer">Explore<i width='100' className="ri-arrow-down-s-line text-2xl transition-transform delay-100 duration-300 ease-in-out transform-gpu group-hover:rotate-180"></i>
                                </button>
                                {
                                    tabId == 3 && isHover && <HomeHeaderMenuExplore tabs={tabsThirdOption} otherTalents={otherTalentsThirdOption} />
                                } 
                            </li>
                        </ul>
                    </div>

                    <div className="hidden md:flex items-center justify-between h-10 w-full max-w-[300px] px-2  bg-white rounded-full  md:inline-flex  focus-within:border-1 border-black/50 focus-within:border-dashed  ">
                        <div className="hidden lg:block p-1 rounded-full flex-grow flex">
                            <input 
                            type="search" 
                            placeholder="Search by skills, or keyword"
                            className=" p-1 rounded-full flex-grow w-full text-black placeholder-gray-700 outline-none text-sm placeholder:font-semibold placeholder:text-black/50"
                            />
                        </div>
                        <button className="group bg-black/75 rounded-full w-7 h-7 flex items-center justify-center transition-transform delay-100 duration-200 ease-out hover:bg-gradient-to-tr from-[#44a201] to-[#a1ff25] not-hover:shadow-[0px_0px_5px_1px_rgba(0,0,0,0.8)] ">
                            <i className="ri-search-line text-lg text-white font-extralight transition-transform delay-100 duration-200 ease-out group-hover:rotate-90 "></i>
                        </button>
                    </div>

                    <div className="flex items-center justify-between w-full shrink-1 md:w-auto whitespace-nowrap">
                        <a href="#" className="md:hidden ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list " viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                            </svg>
                        </a>
                        <div className="md:hidden px-2">
                            <img className="w-35" src="/logo_light.svg" alt="Forsah" />
                        </div>
                        <a onClick={()=> navigate("/login")}  className="cursor-pointer hidden md:block md:px-5 font-medium transition duration-200 hover:text-violet-500/80 hover:scale-105">Log in</a>
                        <button onClick={()=> navigate("/signup")} className="cursor-pointer bg-black/80 text-white rounded-full px-5 py-0.5 md:px-10 md:py-1 transition delay-150 duration-400 ease-in-out hover:translate-x-1  hover:text-lg not-hover:shadow-[0px_0px_5px_1px_rgba(0,0,0,0.7)] ">Join</button>      
                    </div>
                </div>
            </header>
        </>
    )
}
