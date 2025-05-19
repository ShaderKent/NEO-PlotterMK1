import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";

interface SideBarIconsProps {
  icon: any;
  text?: string;
}

const SideBar = () => {
  return (
    <div
      className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg"
    >
      <SideBarIcon icon={<FaFire size="28" />} />
      <Divider />
      <SideBarIcon icon={<BsPlus size="32" />} text="Tab 1" />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Tab 2" />
      <SideBarIcon icon={<FaPoo size="20" />} text="Tab 3" />
      <Divider />
      <SideBarIcon icon={<BsGearFill size="22" />} text="Settings" />
    </div>
  );
};

const SideBarIcon = ({ icon, text }: SideBarIconsProps) => (
  <div className="sidebar-icon group">
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
