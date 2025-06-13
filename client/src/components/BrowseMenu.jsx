import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderMenuSection from "./Home/HeaderMenuSection";
import HeaderMenuSectionCategory from "./Home/HeaderMenuSectionCategory";
import HeaderMenuSectionOthers from "./Home/HeaderMenuSectionOthers";
import GeneralList from "./Home/GeneralList";

export default function BrowseMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      id: 1,
      title: "Projects",
      desc: "Looking for a talent depend on specific skills? Start here.",
      icon: "ri-wechat-channels-line",
    },
    {
      id: 2,
      title: "Freelancers",
      desc: "Search for a talent based on country. Search now",
      icon: "ri-team-line",
    },
  ];

  const categories = [
    {
      title: "Graphic Design",
      imgUrl:
        "https://www.fontfabric.com/wp-content/uploads/2024/12/Homepage-Fontfabric-We-Design-Fonts-Inverted.png",
      link: "/hires/graphic_design",
    },
    {
      title: "3D Modeling",
      imgUrl:
        "https://img.freepik.com/free-photo/3d-view-blooming-flower_23-2150472246.jpg",
      link: "/hires/3d_modeling",
    },
    {
      title: "Illustration",
      imgUrl:
        "https://img.freepik.com/free-vector/hand-drawn-empowered-muslim-woman-illustration_23-2149742793.jpg",
      link: "/hires/illustration",
    },
    {
      title: "Web development",
      imgUrl:
        "https://img.freepik.com/premium-psd/website-instant-showcase-mockup-isolated_359791-328.jpg",
      link: "/hires/web_development",
    },
    {
      title: "Mobile development",
      imgUrl:
        "https://img.freepik.com/free-vector/furniture-shopping-app-interface_23-2148660330.jpg",
      link: "/hires/mobile_development",
    },
    {
      title: "Software development",
      imgUrl:
        "https://img.freepik.com/premium-psd/artist-room-decorated_23-2148834387.jpg?w=1800",
      link: "/hires/software_development",
    },
  ];

  const otherTalents = [
    { title: "Logo design", imgUrl: "", link: "/hires/logo_design" },
    { title: "SEO specialists", imgUrl: "", link: "/hires/seo_specialists" },
    { title: "Counseling Psychology", imgUrl: "", link: "/hires/counseling_psychology" },
    { title: "AI Development", imgUrl: "", link: "/hires/ai_development" },
    { title: "Translators", imgUrl: "", link: "/hires/translatorst" },
    { title: "Data Protection", imgUrl: "", link: "/hires/Data Protection" },
    { title: "Writting", imgUrl: "", link: "/hires/writting" },
    { title: "Marketing", imgUrl: "", link: "/hires/marketing" },
    { title: "Data Analytics", imgUrl: "", link: "/hires/data_analytics" },
    { title: "Animation", imgUrl: "", link: "/hires/animation" },
  ];

  const [activeTab, setActiveTab] = useState(1);
  const [languages, setLanguages] = useState([{ name: "English" }, { name: "Arabic" }]);
  const [whichSecondTabList, setWhichSecondTabList] = useState(2);

  // Sync activeTab with URL
  useEffect(() => {
    if (location.pathname.includes("/projects")) {
      setActiveTab(1);
    } else if (location.pathname.includes("/freelancers")) {
      setActiveTab(2);
    }
  }, [location.pathname]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 1) {
      navigate("/projects");
    } else if (tabId === 2) {
      navigate("/freelancers");
    }
  };

  const showTabs = () => {
    return tabs.map((tab) => (
      <HeaderMenuSection
        key={tab.id}
        {...tab}
        activeTab={activeTab}
        setActiveTab={() => handleTabClick(tab.id)}
      />
    ));
  };

  const showCategories = () => {
    return activeTab === 1
      ? categories.map((category, index) => (
          <HeaderMenuSectionCategory key={index} {...category} />
        ))
      : null;
  };

  const showOtherTalents = () => {
    return activeTab === 1 ? (
      <HeaderMenuSectionOthers otherTalents={otherTalents} />
    ) : activeTab === 2 ? (
      <GeneralList
        items={
          whichSecondTabList === 1 ? countries : whichSecondTabList === 2 ? languages : null
        }
        isWithImg={whichSecondTabList === 1}
      />
    ) : null;
  };

  return (
    <>
      <nav className="md:flex items-start justify-center starting:-translate-x-60 transition duration-500 ease-in-out z-100 h-80 w-fit m-0 py-5 mt-10 fixed">
        <div className="hidden bg-gradient-to-tr from-[#ff0000] via-violet-400 to-amber-500 w-fit h-full md:flex justify-around flex-wrap overflow-auto gap-10 py-6 px-8 rounded-2xl shadow-[0px_0px_10px_1px_rgba(0,0,0,0.3)]">
          <div className="md:flex flex-col items-center gap-2 h-fit ">
            <div className="space-y-4">{showTabs()}</div>
          </div>

          {/* Optional: Uncomment these if you want to show categories/others on the left menu */}
          {/* <div className="md:grid items-center justify-items-center grid-cols-1 justify-center overflow-auto shrink-1 border-l-1 border-dashed border-white/80 pl-5 gap-4.5 h-full px-2 py-1 no-scrollbar">
            {showCategories()}
          </div>
          <div className="text-white">{showOtherTalents()}</div> */}
        </div>
      </nav>
    </>
  );
}
