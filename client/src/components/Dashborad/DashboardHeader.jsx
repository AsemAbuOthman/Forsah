import { useState } from "react";

export default function DashboardHeader() {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const tabs = [
        "Dashboard",
        "Lists",
        "My Projects",
        "Inbox",
        "Feedback",
        "Project Updates",
        "Bookmarks"
    ];

    return (
        <>
            <div className="flex justify-evenly items-center bg-gray-100 border-t-1 border-black/25 px-5 md:px-10 md:h-14 w-full shadow-[0px_0px_10px_1px_rgba(0,0,0,0.25)]">
                <div className="hidden md:flex items-center justify-center w-full font-semibold text-black/65">
                    <ul className="flex items-center justify-center w-fit px-4 whitespace-nowrap">
                        {tabs.map((tab) => (
                            <li
                                key={tab}
                                className={`group flex justify-center cursor-pointer p-3 px-5 rounded-xs transition duration-100 hover:bg-black/5 hover:scale-105 hover:border-b-5 hover:border-black/75 ${
                                    activeTab === tab ? "border-b-5 border-amber-400" : ""
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                <button className="flex items-center justify-center">{tab}</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


        </>
    );
}
