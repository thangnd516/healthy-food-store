interface IProps {
  logo: {
    id: number;
    image: string;
    title: string;
    desc: string;
  };
}
const LogoItem = (props: IProps) => {
  const { logo } = props;
  return (
    <div className="w-1/4">
      <div className="w-full">
        <img
          src={logo?.image}
          alt=""
          className="w-[105px] h-[105px] object-cover mx-auto"
        />
      </div>
      <h2 className="text-center text-xl font-semibold text-[#488a5c]">
        {logo?.title}
      </h2>
      <p className="mt-1 text-sm font-semibold text-center">{logo?.desc}</p>
    </div>
  );
};

export default LogoItem;
