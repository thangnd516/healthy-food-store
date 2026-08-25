import { dataLogo } from "../../utils/dataLogo";
import LogoItem from "./LogoItem";

const LogoList = () => {
  return (
    <div className="flex mt-5 gap-x-5">
      {dataLogo?.length > 0 &&
        dataLogo?.map((logo) => <LogoItem key={logo?.id} logo={logo} />)}
    </div>
  );
};

export default LogoList;
