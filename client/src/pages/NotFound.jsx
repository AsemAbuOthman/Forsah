import { useNavigate } from "react-router-dom"

export default function NotFound() {

    const navigate = useNavigate();

    return (
        <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-[0px_0px_10px_1px_rgba(0,0,0,0.25)]   max-w-md w-full">
                <div className=" text-6xl font-bold text-amber-500 mb-4   bg-gradient-to-tl from-[#ff0000c2] via-yellow-500 to-amber-600 bg-clip-text text-transparent animate-bounce">404</div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-2 animate-pulse">Page Not Found</h1>
                <p className="text-gray-600 mb-6">
                    Sorry, the page you’re looking for doesn’t exist or has been moved.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-5 py-2 bg-amber-500  text-white rounded-full hover:bg-amber-400 hover:scale-95 transition"
                >
                    Go to Home
                </button>
            </div>
        </div>
        </>
    )
}
