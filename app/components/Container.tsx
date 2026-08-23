interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
  children,
}) => {
  return (
    <div
      className="
  max-w-[1920px]
  min-w-[460px]
  md:min-w-[760px]
  pl-8 pr-8  
  ">
      {children}
    </div>
  );
};

export default Container;
