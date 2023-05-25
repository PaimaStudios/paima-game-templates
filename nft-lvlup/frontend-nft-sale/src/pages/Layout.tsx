interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return <div className="flex items-center justify-center flex-col p-16">{children}</div>;
};

export default Layout;
