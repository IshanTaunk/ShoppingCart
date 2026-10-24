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
  w-full min-w-0
  px-4 md:px-8
  ">
      {children}
    </div>
  );
};

export default Container;
