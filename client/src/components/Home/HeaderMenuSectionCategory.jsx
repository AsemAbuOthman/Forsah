
export default function HeaderMenuSectionCategory({imgUrl, title, link}) {
    return (
        <>
            <a href={link} className="">
                <div className="  hidden  md:flex overflow-hidden gap-7 flex-col text-white rounded-xl  bg-black/75 h-56 w-53 shadow-[0px_0px_5px_1px_rgba(0,0,0,0.8)] ">
                    <div className=" flex justify-center w-full max-h-35 h-35 overflow-clip">
                        <img className=" object-cover object-center transition duration-200 hover:scale-90 hover:rounded-lg" src={imgUrl} alt={title} loading="lazy"/>
                    </div>
                    <div className="text-center text-sm font-semibold">
                        <p>{title}</p>
                    </div>
                </div>
            </a>
        </>
    )
}

