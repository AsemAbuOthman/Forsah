import HomeHeader from "../components/Home/HomeHeader";
import HomeHeroSection from "../components/Home/HomeHeroSection";

export default function HomeLayout() {
    return (
        <>
            <div className="h-1000">
                <HomeHeader />
                <HomeHeroSection/>
                
            </div>
        </>
    )
}
