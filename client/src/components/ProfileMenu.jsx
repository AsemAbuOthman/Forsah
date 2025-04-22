
import GeneralList from './Home/GeneralList'

export default function ProfileMenu() {


    const menuOptions = [
        { name: "Profile", icon: "bi bi-person-vcard", link: "/dashboard/Profile" },
        { name: "Account analytics", icon: "bi bi-bar-chart-line", link: "/dashboard/account_analytics" },
        { name: "Settings", icon: "bi bi-gear", link: "/dashboard/Settings" },
        { name: "Withdraw funds", icon: "bi bi-wallet", link: "/dashboard/Withdraw funds" },
        { name: "Transaction history", icon: "bi bi-clock-history", link: "/dashboard/Transaction history" },
        { name: "Financial dashboard", icon: "bi bi-pie-chart", link: "/dashboard/Financial dashboard" },
        { name: "Support", icon: "bi bi-question-square", link: "/dashboard/Support" },
        { name: "Logout", icon: "bi bi-box-arrow-left", link: "/dashboard/Logout" },
    
    ];

    return (
        <>

            <nav className="md:flex items-start justify-center starting:translate-y-10 starting:scale-90 transition duration-300 ease-in-out z-100 max-h-screen w-fit m-0 py-5 shadow-[0px_0px_10px_1px_rgba(0,0,0,0.1)] absolute">
                <div className="bg-white w-70 px-2 h-full md:flex justify-around flex-wrap overflow-auto gap-10 py-5 rounded-2xl shadow-[0px_0px_10px_1px_rgba(0,0,0,0.1)]">
                    <div className="text-primary  w-full flex items-center justify-center space-x-3 hover:bg-accent hover:bg-opacity-10 rounded-md p-2 transition duration-200">
                        <GeneralList  items={menuOptions} isWithImg={true} isWithTitle={false}/>
                    </div>
                </div>
            </nav>
        </>
    )
}


        //     <nav className="md:flex items-start justify-center  starting:translate-y-10 starting:scale-90  transition duration-300 ease-in-out z-100 max-h-screen w-fit m-0 py-5  absolute  ">

        //         <div className="hidden bg-gray-100 w-70 px-2 h-full md:flex justify-around flex-wrap overflow-auto gap-10 py-5   rounded-2xl shadow-[0px_0px_10px_1px_rgba(0,0,0,0.6)] ">

        //             {/* <div className="md:flex flex-col  items-center gap-2 h-fit ">
        //                 <div className="space-y-4">
        //                     {
        //                         // showTabs()
        //                     }
        //                 </div>
        //             </div> */}

        //             <div className="text-blue-500 border-blue-500 w-full">
        //                 {
        //                     <GeneralList items={menuOptions} isWithImg={true} isWithTitle={false}/>
        //                 }
        //             </div>

        //         </div>

        // </nav>