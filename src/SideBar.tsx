import {
  BiAlarmExclamation,
  BiAnalyse,
  BiAtom,
  BiSolidAddToQueue,
  BiSolidAlarm
} from "react-icons/bi";
import { BsGearFill } from "react-icons/bs";

interface SideBarIconsProps {
  id?: string;
  icon: any;
  onClickMethod?: Function | null;
}
// dark: bg - gray - 900;
const SideBar = () => {
  const explainTab = document.querySelector("#explainTab");
  const tab1 = document.querySelector("#infoTab1");
  const tab2 = document.querySelector("#infoTab2");
  const tab3 = document.querySelector("#infoTab3");
  const tab4 = document.querySelector("#infoTab4");
  const timeShifter = document.querySelector("#timeShifter");

  const handleClick = (onClickValue: string) => {
    //Handles display of InfoTab1 and hiding other tabs when visible
    if (onClickValue == "tab1" && tab1) {
      tab1.classList.toggle("move-off-X");
      if (
        tab2?.className.includes("move-off-X") != true &&
        tab1?.className.includes("move-off-X") != true // &&
      ) {
        tab2?.classList.toggle("move-off-X");
      }
      if (
        tab3?.className.includes("move-off-X") != true &&
        tab1?.className.includes("move-off-X") != true
      ) {
        tab3?.classList.toggle("move-off-X");
      }
      if (
        tab4?.className.includes("move-off-X") != true &&
        tab1?.className.includes("move-off-X") != true
      ) {
        tab4?.classList.toggle("move-off-X");
      }
      if (
        explainTab?.className.includes("move-off-X") != true &&
        tab1?.className.includes("move-off-X") != true
      ) {
        explainTab?.classList.toggle("move-off-X");
      }
    } else if (onClickValue == "tab2" && tab2) {
      //Handles display of InfoTab2 and hiding other tabs when visible
      tab2.classList.toggle("move-off-X");
      if (
        tab1?.className.includes("move-off-X") != true &&
        tab2?.className.includes("move-off-X") != true
      ) {
        tab1?.classList.toggle("move-off-X");
      }
      if (
        tab3?.className.includes("move-off-X") != true &&
        tab2?.className.includes("move-off-X") != true
      ) {
        tab3?.classList.toggle("move-off-X");
      }
      if (
        tab4?.className.includes("move-off-X") != true &&
        tab2?.className.includes("move-off-X") != true
      ) {
        tab4?.classList.toggle("move-off-X");
      }
      if (
        explainTab?.className.includes("move-off-X") != true &&
        tab2?.className.includes("move-off-X") != true
      ) {
        explainTab?.classList.toggle("move-off-X");
      }
    } else if (onClickValue == "tab3" && tab3) {
      //Handles display of InfoTab3 and hiding other tabs when visible
      tab3.classList.toggle("move-off-X");
      if (
        tab1?.className.includes("move-off-X") != true &&
        tab3?.className.includes("move-off-X") != true
      ) {
        tab1?.classList.toggle("move-off-X");
      }
      if (
        tab2?.className.includes("move-off-X") != true &&
        tab3?.className.includes("move-off-X") != true
      ) {
        tab2?.classList.toggle("move-off-X");
      }
      if (
        tab4?.className.includes("move-off-X") != true &&
        tab3?.className.includes("move-off-X") != true
      ) {
        tab4?.classList.toggle("move-off-X");
      }
      if (
        explainTab?.className.includes("move-off-X") != true &&
        tab3?.className.includes("move-off-X") != true
      ) {
        explainTab?.classList.toggle("move-off-X");
      }
    } else if (onClickValue == "tab4" && tab4) {
      //Handles display of InfoTab4 and hiding other tabs when visible
      tab4.classList.toggle("move-off-X");
      if (
        tab1?.className.includes("move-off-X") != true &&
        tab4?.className.includes("move-off-X") != true
      ) {
        tab1?.classList.toggle("move-off-X");
      }
      if (
        tab2?.className.includes("move-off-X") != true &&
        tab4?.className.includes("move-off-X") != true
      ) {
        tab2?.classList.toggle("move-off-X");
      }
      if (
        tab3?.className.includes("move-off-X") != true &&
        tab4?.className.includes("move-off-X") != true
      ) {
        tab3?.classList.toggle("move-off-X");
      }
      if (
        explainTab?.className.includes("move-off-X") != true &&
        tab4?.className.includes("move-off-X") != true
      ) {
        explainTab?.classList.toggle("move-off-X");
      }
    } else if (onClickValue == "explainTab" && explainTab) {
      //Handles display of explainTab and hiding other tabs when visible
      //Currently Disabled
      explainTab.classList.toggle("move-off-X");
      if (
        tab1?.className.includes("move-off-X") != true &&
        explainTab?.className.includes("move-off-X") != true
      ) {
        tab1?.classList.toggle("move-off-X");
      }
      if (
        tab2?.className.includes("move-off-X") != true &&
        explainTab?.className.includes("move-off-X") != true
      ) {
        tab2?.classList.toggle("move-off-X");
      }
      if (
        tab3?.className.includes("move-off-X") != true &&
        explainTab?.className.includes("move-off-X") != true
      ) {
        tab3?.classList.toggle("move-off-X");
      }
      if (
        tab4?.className.includes("move-off-X") != true &&
        explainTab?.className.includes("move-off-X") != true
      ) {
        tab4?.classList.toggle("move-off-X");
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
      <SideBarIcon
        icon={<BiAtom size="40" />}
        onClickMethod={() => handleClick("explainTab")}
      />
      <Divider />
      <SideBarIcon
        id="SBI_1"
        icon={<BiSolidAddToQueue size="32" />}
        onClickMethod={() => handleClick("tab1")}
      />
      <SideBarIcon
        id="SBI_2"
        icon={<BiAnalyse size="32" />}
        onClickMethod={() => handleClick("tab2")}
      />
      <SideBarIcon
        id="SBI_3"
        icon={<BiAlarmExclamation size="38" />}
        onClickMethod={() => handleClick("tab3")}
      />
      <Divider />
      <SideBarIcon
        id="SBI_4"
        icon={<BiSolidAlarm size="38" />}
        onClickMethod={() => handleClick("timeShifter")}
      />
      <SideBarIcon
        id="SBI_5"
        icon={<BsGearFill size="32" />}
        onClickMethod={() => handleClick("tab4")}
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
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
