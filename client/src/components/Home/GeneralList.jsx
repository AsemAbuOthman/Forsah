import { useNavigate } from "react-router-dom"

export default function GeneralList({items, isWithImg, isWithTitle = true}) {

    const navigate  = useNavigate();

    return (
        <>
            <div className="hidden md:flex flex-col w-full  gap-8">
            {
                isWithTitle &&

                <div className="text-lg  font-semibold">
                    
                    <h3>Other popular talents</h3>
                    
                </div>
            }

                <div className="h-80  overflow-auto scroll-auto ">
                    <ul className="flex flex-col justify-center gap-2 overflow-auto scroll-auto  font-normal">

                        {
                            items.map((item, index)=>(
                                <li key={index} className={` hover:bg-black/5  hover:rounded-md  hover:border-l-4 hover:border-amber-400 ${!isWithTitle && 'hover:border-blue-500 hover:text-blue-500'} `}>
                                    <a  className="hover:underline flex items-center scroll-auto gap-4 cursor-pointer p-1 hover:px-3" onClick={()=> navigate('/' + item.name.toLowerCase().replaceAll(' ', '_'))} >
                                        {
                                            isWithImg ? 
                                                (item.imgUrl ?
                                                    <img
                                                        src={item.imgUrl}
                                                        alt={item.name}
                                                        className="w-6 h-3.75 shadow-md"
                                                        loading="lazy"
                                                    /> : item.icon && <i className={`${item.icon} text-2xl font-extralight px-2 `}></i>)
                                                : null

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

                {
                    isWithTitle && 
                    <div>
                        <h3 >
                            <a className="flex items-center" href="#">View more<i className="ri-arrow-right-s-line text-3xl "></i></a>
                        </h3>   
                    </div>
                }

            </div>
        </>
    )
}
