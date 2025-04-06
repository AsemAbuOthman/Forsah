import { useState } from "react";
import HeaderMenuSection from "./HeaderMenuSection"
import HeaderMenuSectionOthers from "./HeaderMenuSectionOthers";

export default function HomeHeaderMenuExplore({tabs,  otherTalents}) {

    const [activeTab, setActiveTab] = useState(1); 

    const showTabs = ()=>{

        return tabs.map((tab) => (
            <HeaderMenuSection 
                key={tab.id} 
                {...tab} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
            />
        ))
    }

    const showOtherTalents = ()=>{

        return <HeaderMenuSectionOthers otherTalents={otherTalents} isWithTitle={false}/> ;
            
    }

    return (
        <> 
            <nav className="md:flex items-start justify-center  starting:-translate-x-60 transition duration-500 ease-in-out z-100 h-140 w-fit m-0 py-5 mt-10 fixed ">

                <div className="hidden  bg-gradient-to-tr from-[#ff00008a] via-yellow-400 to-amber-500  w-fit h-full md:flex justify-around flex-wrap overflow-auto gap-10   py-6 px-8 rounded-2xl">

                    <div className="md:flex flex-col  items-center gap-2 h-fit ">
                        <div className="space-y-4">
                            {
                                showTabs()
                            }
                        </div>
                    </div>

                    <div className="">
                        {
                            showOtherTalents()
                        }
                    </div>

                </div>

            </nav>
        </>
    )
}

