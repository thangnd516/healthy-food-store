import "../../styles/stylesHeading.scss";

const Heading = (props: { title: string }) => {
  return (
    <h2 className="text-xl heading font-semibold text-center text-[#488a5c] mx-auto mt-10">
      <span className="inline-block py-1 px-2 border border-[#488a5c] bg-white relative z-10 rounded-md">
        {props.title}
      </span>
    </h2>
  );
};

export default Heading;
