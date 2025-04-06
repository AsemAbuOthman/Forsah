
export default function HeaderMenuSectionOthers({otherTalents, isWithTitle = true}) {
    return (
        <>
            <div className="hidden md:flex flex-col  text-white gap-8">

                <div className="text-lg  font-semibold">
                    {
                        isWithTitle && <h3>Other popular talents</h3>
                    }
                </div>

                <div>
                    <ul className="flex flex-col gap-2 overflow-auto scroll-auto h-80 font-normal">

                        {
                            otherTalents.map((talent, index)=>(
                                <li key={index}>
                                    <a  className="hover:underline flex items-center gap-2 " href={talent.link.toLowerCase().replaceAll(' ', '_')} >
                                        {
                                            talent.title
                                        }
                                    </a>
                                </li>
                            ))
                        }       

                    </ul>
                </div>

                <div>
                    <h3 >
                        <a className="flex items-center" href="#">View more<i className="ri-arrow-right-s-line text-3xl "></i></a>
                    </h3>   
                </div>

            </div>
        </>
    )
}
