import { useEffect, useLayoutEffect, useState } from "react";
import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";

interface SideBarIconsProps {
  id?: string;
  icon: any;
  onClickMethod?: Function | null;
}
// dark: bg - gray - 900;
const SideBar = () => {
  const isWindowSmall = window.innerWidth < 768;
  const tab1 = document.querySelector("#infoTab1");
  const tab2 = document.querySelector("#infoTab2");
  const tab3 = document.querySelector("#infoTab3");
  const timeShifter = document.querySelector("#timeShifter");

  //Custom hook to force a rerender on window size change
  //    This makes sure that the menus function correctly at any size
  const [windowSize, setWindowSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateWindowSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateWindowSize);
    console.log("windowsize change: ", windowSize);
    updateWindowSize();
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  //Resets the menus when called (minimizes and sets them for small or large)
  const handleResize = () => {
    if (isWindowSmall) {
      tab1?.classList.remove("move-off-X");
      tab2?.classList.remove("move-off-X");
      tab3?.classList.remove("move-off-X");

      tab1?.classList.add("move-off-Y");
      tab2?.classList.add("move-off-Y");
      tab3?.classList.add("move-off-Y");
    } else {
      tab1?.classList.remove("move-off-Y");
      tab2?.classList.remove("move-off-Y");
      tab3?.classList.remove("move-off-Y");

      tab1?.classList.add("move-off-X");
      tab2?.classList.add("move-off-X");
      tab3?.classList.add("move-off-X");
    }
  };

  //Handles calling the above method on a resize event
  window.addEventListener("load", handleResize); //hides tabs initially, need to rework
  window.addEventListener("resize", handleResize);

  const handleClick = (onClickValue: string) => {
    if (onClickValue == "tab1" && tab1) {
      //Handles visibility for InfoTab1
      if (isWindowSmall) {
        tab1.classList.toggle("move-off-Y");
      } else {
        tab1.classList.toggle("move-off-X");
      }
      //Handles hiding InfoTab2 if InfoTab1 is visible
      if (
        tab2?.className.includes("move-off-X") != true &&
        tab1?.className.includes("move-off-X") != true &&
        !isWindowSmall
      ) {
        tab2?.classList.toggle("move-off-X");
      }
      if (
        tab2?.className.includes("move-off-Y") != true &&
        tab1?.className.includes("move-off-Y") != true &&
        isWindowSmall
      ) {
        tab2?.classList.toggle("move-off-Y");
      }
      //Handles hiding InfoTab3 if InfoTab1 is visible
      if (
        tab3?.className.includes("move-off-X") != true &&
        tab1?.className.includes("move-off-X") != true &&
        !isWindowSmall
      ) {
        tab3?.classList.toggle("move-off-X");
      }
      if (
        tab3?.className.includes("move-off-Y") != true &&
        tab1?.className.includes("move-off-Y") != true &&
        isWindowSmall
      ) {
        tab3?.classList.toggle("move-off-Y");
      }
    } else if (onClickValue == "tab2" && tab2) {
      //Handles visibility for InfoTab2
      if (isWindowSmall) {
        //Changes to a vertical slide on smaller devices
        tab2.classList.toggle("move-off-Y");
      } else {
        tab2.classList.toggle("move-off-X");
      }
      // Handles hiding InfoTab1 if InfoTab2 is visible
      if (
        tab1?.className.includes("move-off-X") != true &&
        tab2?.className.includes("move-off-X") != true &&
        !isWindowSmall
      ) {
        tab1?.classList.toggle("move-off-X");
      }
      if (
        tab1?.className.includes("move-off-Y") != true &&
        tab2?.className.includes("move-off-Y") != true &&
        isWindowSmall
      ) {
        tab1?.classList.toggle("move-off-Y");
      }
      //Handles hiding InfoTab3 if InfoTab2 is visible
      if (
        tab3?.className.includes("move-off-X") != true &&
        tab2?.className.includes("move-off-X") != true &&
        !isWindowSmall
      ) {
        tab3?.classList.toggle("move-off-X");
      }
      if (
        tab3?.className.includes("move-off-Y") != true &&
        tab2?.className.includes("move-off-Y") != true &&
        isWindowSmall
      ) {
        tab3?.classList.toggle("move-off-Y");
      }
    } else if (onClickValue == "tab3" && tab3) {
      //Handles visibility for InfoTab3 - if tab3 is clicked
      if (isWindowSmall) {
        //Changes to a vertical slide on smaller devices
        tab3.classList.toggle("move-off-Y");
      } else {
        tab3.classList.toggle("move-off-X");
      }
      // Handles hiding InfoTab1 if InfoTab3 is visible
      if (
        tab1?.className.includes("move-off-X") != true &&
        tab3?.className.includes("move-off-X") != true &&
        !isWindowSmall
      ) {
        tab1?.classList.toggle("move-off-X");
      }
      if (
        tab1?.className.includes("move-off-Y") != true &&
        tab3?.className.includes("move-off-Y") != true &&
        isWindowSmall
      ) {
        tab1?.classList.toggle("move-off-Y");
      }
      //Handles hiding InfoTab2 if InfoTab3 is visible
      if (
        tab2?.className.includes("move-off-X") != true &&
        tab3?.className.includes("move-off-X") != true &&
        !isWindowSmall
      ) {
        tab2?.classList.toggle("move-off-X");
      }
      if (
        tab2?.className.includes("move-off-Y") != true &&
        tab3?.className.includes("move-off-Y") != true &&
        isWindowSmall
      ) {
        tab2?.classList.toggle("move-off-Y");
      }
    }

    //Handles visibility for the time shifter
    if (onClickValue == "timeShifter" && timeShifter) {
      //Handles visibility for InfoTab1
      timeShifter.classList.toggle("move-off-X");
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-16 md:h-screen md:w-16 z-20 flex flex-row md:flex-col
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
      <SideBarIcon
        icon={<BsGearFill size="22" />}
        onClickMethod={() => handleClick("timeShifter")}
      />
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
