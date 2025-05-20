import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";

interface SideBarIconsProps {
  id?: string;
  icon: any;
  onClickMethod?: Function | null;
}
// dark: bg - gray - 900;
const SideBar = () => {
  const tab1 = document.querySelector("#infoTab1");
  const tab2 = document.querySelector("#infoTab2");
  const tab3 = document.querySelector("#infoTab3");
  const handleClick = (onClickValue: string) => {
    if (onClickValue == "tab1" && tab1) {
      //Handles visibility for InfoTab1
      tab1.classList.toggle("move-off-X");
      //Handles hiding InfoTab2 if InfoTab1 is visible
      if (
        document.querySelector("#infoTab2")?.className.includes("move-off-X") !=
          true &&
        document.querySelector("#infoTab1")?.className.includes("move-off-X") !=
          true
      ) {
        tab2?.classList.toggle("move-off-X");
      }
      //Handles hiding InfoTab3 if InfoTab1 is visible
      if (
        document.querySelector("#infoTab3")?.className.includes("move-off-X") !=
          true &&
        document.querySelector("#infoTab1")?.className.includes("move-off-X") !=
          true
      ) {
        tab3?.classList.toggle("move-off-X");
      }
    } else if (onClickValue == "tab2" && tab2) {
      tab2.classList.toggle("move-off-X");
      //Handles hiding InfoTab1 if InfoTab2 is visible
      if (
        document.querySelector("#infoTab1")?.className.includes("move-off-X") !=
          true &&
        document.querySelector("#infoTab2")?.className.includes("move-off-X") !=
          true
      ) {
        tab1?.classList.toggle("move-off-X");
      }
      //Handles hiding InfoTab3 if InfoTab2 is visible
      if (
        document.querySelector("#infoTab3")?.className.includes("move-off-X") !=
          true &&
        document.querySelector("#infoTab2")?.className.includes("move-off-X") !=
          true
      ) {
        tab3?.classList.toggle("move-off-X");
      }
    } else if (onClickValue == "tab3" && tab3) {
      tab3.classList.toggle("move-off-X");
      //Handles hiding InfoTab1 if InfoTab3 is visible
      if (
        document.querySelector("#infoTab1")?.className.includes("move-off-X") !=
          true &&
        document.querySelector("#infoTab3")?.className.includes("move-off-X") !=
          true
      ) {
        tab1?.classList.toggle("move-off-X");
      }
      //Handles hiding InfoTab2 if InfoTab3 is visible
      if (
        document.querySelector("#infoTab2")?.className.includes("move-off-X") !=
          true &&
        document.querySelector("#infoTab3")?.className.includes("move-off-X") !=
          true
      ) {
        tab2?.classList.toggle("move-off-X");
      }
    }
  };

  return (
    <div
      className="fixed top-0 left-0 h-screen w-16 z-20 flex flex-col
                  bg-gray-900  shadow-lg"
    >
      <SideBarIcon icon={<FaFire size="28" />} onClickMethod={null} />
      <Divider />
      <SideBarIcon
        id="SBI_1"
        icon={<BsPlus size="32" />}
        onClickMethod={() => handleClick("tab1")}
      />
      <SideBarIcon
        id="SBI_2"
        icon={<BsFillLightningFill size="20" />}
        onClickMethod={() => handleClick("tab2")}
      />
      <SideBarIcon
        id="SBI_3"
        icon={<FaPoo size="20" />}
        onClickMethod={() => handleClick("tab3")}
      />
      <Divider />
      <SideBarIcon icon={<BsGearFill size="22" />} onClickMethod={null} />
    </div>
  );
};

const SideBarIcon = ({ id, icon, onClickMethod }: SideBarIconsProps) => (
  <div
    id={id}
    className="sidebar-icon group"
    onClick={() => {
      onClickMethod ? onClickMethod() : null;
    }}
  >
    {icon}
    {/* <span className="sidebar-tooltip group-hover:scale-100">{text}</span> */}
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
