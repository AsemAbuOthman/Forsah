import { useContext, useState } from "react";
import ProfileMenu from "./ProfileMenu"
import { useNavigate } from "react-router-dom";
import { UserContext } from "../store/UserProvider";

export default function HomeDashboardHeader({children}) {

    const [isHover, setIsHover] = useState(false);
    const [tabId, setTabId] = useState(0);
    const navigate = useNavigate();
    const [userData] = useContext(UserContext);

    return (
        <>
            <header className=" md:flex justify-center items-center flex-col relative border-1 shadow border-black/20 top-0 w-full  m-auto fixed">
                <div className="flex justify-evenly items-center bg-white px-5 md:px-10 md:h-16   ">

                    <div className="hidden md:block md:pr-15">
                        <a href="/dashboard">
                            <img className="w-80" src="/logo_light.svg" alt="Forsah" />
                        </a>    
                    </div> 

                    <div className="hidden md:block flex items-center justify-evenly w-full font-semibold text-black/65 ">
                        <ul className="flex items-center justify-start w-fit gap-2  whitespace-nowrap">
                            <li className="group flex justify-evenly  cursor-pointer py-5 px-3 rounded-sm hover:bg-black/10"  onMouseEnter={() => {setIsHover(true); setTabId(1)}} onMouseLeave={() => {setIsHover(false); setTabId(0)}}>
                                <button  className=" flex  items-center justify-center   group-hover:scale-105 cursor-pointer" ><i class="bi bi-browser-safari text-xl pr-3"></i>Browse
                                </button>
                                {
                                    // tabId == 1 &&  isHover && <ProfileMenu />
                                }
                            </li>
                            <li className="group flex justify-start cursor-pointer py-5 px-3 rounded-sm hover:bg-black/10"   onMouseEnter={() => {setIsHover(true); setTabId(2)}} onMouseLeave={() => {setIsHover(false); setTabId(0)} }>
                                <button className=" flex items-center justify-center  group-hover:scale-105 cursor-pointer" ><i class="bi bi-briefcase text-xl pr-3"></i>Manage
                                </button>   
                                {
                                    // tabId == 2 &&  isHover && <HomeHeaderMenu tabs={tabsSecondOption} categories={categoriesSecondOption} otherTalents={otherTalentsSecondOption} secondTabListApi={null}/>
                                }
                            </li>
                        </ul>
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
                        <ul className="flex items-center justify-start w-fit gap-1  whitespace-nowrap text-black/65">
                            <li className="group flex justify-evenly  cursor-pointer py-5 px-3 rounded-sm hover:bg-black/10 "  onMouseEnter={() => {setIsHover(true); setTabId(1)}} onMouseLeave={() => {setIsHover(false); setTabId(0)}}>
                                <button  className=" flex  items-center justify-center    group-hover:scale-105 cursor-pointer  " ><i className="bi bi-bell text-2xl "></i>
                                </button>
                                {
                                    // tabId == 1 &&  isHover && <HomeHeaderMenu tabs={tabsFirstOption} categories={categoriesFirstOption} otherTalents={otherTalentsFirstOption} secondTabListApi={"https://restcountries.com/v3.1/all?fields=name,flags"}/>
                                }
                            </li>
                            <li className="group flex justify-start cursor-pointer py-5 px-3 rounded-sm hover:bg-black/10"   onMouseEnter={() => {setIsHover(true); setTabId(2)}} onMouseLeave={() => {setIsHover(false); setTabId(0)} }>
                                <button className=" flex items-center justify-center group-hover:scale-105 cursor-pointer " ><i className="bi bi-folder2-open text-2xl "></i>
                                </button>   
                                {
                                    // tabId == 2 &&  isHover && <HomeHeaderMenu tabs={tabsSecondOption} categories={categoriesSecondOption} otherTalents={otherTalentsSecondOption} secondTabListApi={null}/>
                                }
                            </li>
                            <li className="group flex justify-start cursor-pointer py-5 px-3 rounded-sm hover:bg-black/10"   onMouseEnter={() => {setIsHover(true); setTabId(2)}} onMouseLeave={() => {setIsHover(false); setTabId(0)} }>
                                <button className=" flex items-center justify-center group-hover:scale-105 cursor-pointer " ><i className="bi bi-chat-left text-2xl "></i>
                                </button>   
                                {
                                    // tabId == 2 &&  isHover && <HomeHeaderMenu tabs={tabsSecondOption} categories={categoriesSecondOption} otherTalents={otherTalentsSecondOption} secondTabListApi={null}/>
                                }
                            </li>
                            <li className="group flex justify-start cursor-pointer py-5 px-3"   onMouseEnter={() => {setIsHover(true); setTabId(2)}} onMouseLeave={() => {setIsHover(false); setTabId(0)} }>
                                <button className="hidden md:block bg-black/30 text-white rounded-full px-5 py-0.5 md:py-1 transition delay-150 duration-400 ease-in-out active:translate-x-1   active:scale-93 hover:bg-gradient-to-tr from-[#e7a900] to-[#e1d600] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.6)] " onClick={()=> navigate('/post_project ')}>Post a Project</button>      
                                {
                                    // tabId == 2 &&  isHover && <HomeHeaderMenu tabs={tabsSecondOption} categories={categoriesSecondOption} otherTalents={otherTalentsSecondOption} secondTabListApi={null}/>
                                }
                            </li>
                            <li className="group flex justify-center items-center  cursor-pointer rounded-sm  hover:bg-transparent"   onMouseEnter={() => {setIsHover(true); setTabId(6)}} onMouseLeave={() => {setIsHover(false); setTabId(0)} }>
                                <div className=" p-3">
                                    <div className="relative  h-[42px] w-[42px] rounded-full p-1 ">
                                        <img
                                            src={userData.imageUrl}
                                            alt="avatar"
                                            className="h-full w-full rounded-full object-cover object-center "
                                            />
                                        <span className=" absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
                                    </div>
                                        {
                                            tabId == 6 &&  isHover && <ProfileMenu />
                                        }
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

        </header>
        <main>
            {
                children
            }
        </main>
    </>
    )
}
