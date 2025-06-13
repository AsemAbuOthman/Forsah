
export default function HeaderMenuSection({id, title, desc, icon, activeTab, setActiveTab }) {

    let classIcon = icon + " text-3xl";
    const isActive = activeTab === id;

    return (
        <>
            <div 
                className={`bg-black/10 text-white md:flex justify-center space-x-4 p-4 px-6 rounded-full cursor-pointer 
                transition-all duration-300 ${isActive ? "bg-black/60" : "hover:bg-black/40"}`}
                onClick={() => setActiveTab(isActive ? null : id)} // Toggle active state
            >
                <div className="py-2 font-extralight">
                    <i className={classIcon}></i>
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="w-60">
                        <h4 className="pb-1.5 font-bold">{title}</h4>
                        <p className="text-sm text-wrap">{desc}</p>
                    </div>
                    <div>
                        <i className="ri-arrow-right-s-line text-4xl "></i>
                    </div>
                </div>
            </div>
        </>
    )
}
