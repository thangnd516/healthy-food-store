const HeadingDashboard = (props: { heading: string }) => {
  return (
    <div className="font-semibold text-2xl pb-2 border-b border-black text-center">
      {props.heading}
    </div>
  );
};

export default HeadingDashboard;
