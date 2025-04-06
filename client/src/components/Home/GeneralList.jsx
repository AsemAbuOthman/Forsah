
export default function GeneralList({items, isWithImg}) {
    return (
        <>
            <div className="hidden md:flex flex-col  text-white gap-8">

                <div className="text-lg  font-semibold">
                    
                    <h3>Other popular talents</h3>
                    
                </div>

                <div>
                    <ul className="flex flex-col justify-center gap-2 overflow-auto scroll-auto h-80 font-normal">

                        {
                            items.map((item, index)=>(
                                <li key={index}>
                                    <a  className="hover:underline flex items-center scroll-auto gap-2" href={'/' + item.name.toLowerCase().replaceAll(' ', '_')} >
                                        {
                                            isWithImg && <img
                                            src={item.flag}
                                            alt={item.name}
                                            className="w-6 h-3.75 shadow-md"
                                            loading="lazy"
                                            />
                                        }
                                        {
                                            item.name
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
