

export default function HomeFillBackground({imgs}) {

        return (
            <>
                {
                    imgs.map((img, index )=>(
            
                        <img className=" rounded-lg object-cover object-center" key={index} src={imgs[index]} alt="" />
                    ))  
                }
            </>
        )
}
