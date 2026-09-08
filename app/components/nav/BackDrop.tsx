interface BackDropProps {
  onClick: () => void;
}
const BackDrop: React.FunctionComponent<
  BackDropProps
> = ({
  onClick,
}) => {
  return (
    <div
      onClick={
        onClick
      }
      className="z-20 bg-slate-200 opacity-50 fixed 
      inset-0 w-screen h-screen top=0 left-0"></div>
  );
};

export default BackDrop;