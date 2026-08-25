interface IProps {
  kind: string;
}

const Loading = (props: IProps) => {
  const { kind } = props;
  return (
    <div
      className={`w-5 h-5 mx-auto border-2 rounded-full border-b-transparent animate-spin ${
        kind === "colorWhite"
          ? "border-white"
          : kind === "colorBlue"
          ? "border-blue-500"
          : ""
      }`}
    ></div>
  );
};

export default Loading;
