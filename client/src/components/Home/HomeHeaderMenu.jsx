import { useEffect, useState } from "react";
import HeaderMenuSection from "./HeaderMenuSection"
import HeaderMenuSectionCategory from "./HeaderMenuSectionCategory"
import HeaderMenuSectionOthers from "./HeaderMenuSectionOthers"
import axios from "axios";
import GeneralList from "./GeneralList";

export default function HomeHeaderMenu({tabs, categories, otherTalents, secondTabListApi}) {

    const [activeTab, setActiveTab] = useState(1); 
    const [countries, setCountries] = useState([]);
    const [languages, setLanguages] = useState([{name : 'English'}, {name: 'Arabic'}]);
    const [whichSecondTabList, setWhichSecondTabList] = useState(2);

    useEffect(() => {

        let countriesApi = "https://restcountries.com/v3.1/all?fields=name,flags";
        
        const fetchCountries = async () => {
            try {
                const response = await axios.get(countriesApi);
                const filteredCountries = response.data.map((country) => ({
                    name: country.name.common,
                    imgUrl: country.flags.svg,
                }));
                setCountries(filteredCountries);
                console.log(filteredCountries);
            } catch (error) {
                console.error("Error fetching countries:", error);
            }
        };
        
        secondTabListApi === countriesApi ? (fetchCountries(), setWhichSecondTabList(1)) : null;
    }, []);

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

    const showCategories = ()=>{

        return activeTab == 1 ?
            categories.map((category, index) => (
                <HeaderMenuSectionCategory
                    key={index}
                    {...category}/>
            )) : activeTab == 2 ? null : null;
    }

    const showOtherTalents = ()=>{

        return activeTab == 1 ?
            <HeaderMenuSectionOthers otherTalents={otherTalents}/> :
            activeTab == 2 ? <GeneralList items={whichSecondTabList == 1 ? countries : whichSecondTabList == 2 ?  languages : null} isWithImg={whichSecondTabList == 1 ? true : false} /> :
            null;
    }

    return (
        <> 
            <nav className="md:flex items-start justify-center  starting:-translate-x-60 transition duration-500 ease-in-out z-100 h-140 w-fit m-0 py-5 mt-10 fixed">

                <div className="hidden  bg-gradient-to-tr from-[#ff0000] via-violet-400 to-amber-500  w-fit h-full md:flex justify-around flex-wrap overflow-auto gap-10   py-6 px-8 rounded-2xl  shadow-[0px_0px_10px_1px_rgba(0,0,0,0.3)]">

                    <div className="md:flex flex-col  items-center gap-2 h-fit ">
                        <div className="space-y-4">
                            {
                                showTabs()
                            }
                        </div>
                    </div>

                    <div className="md:grid items-center justify-items-center grid-cols-1   justify-center overflow-auto  shrink-1 border-l-1 border-dashed   border-white/80 pl-5  gap-4.5 h-full px-2 py-1 no-scrollbar">
                        {
                            showCategories()
                        }
                    </div>

                    <div className=" text-white">
                        {
                            showOtherTalents()
                        }
                    </div>

                </div>

            </nav>
        </>
    )
}
