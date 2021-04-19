import Header from '@module/header';

type Props = {
  children: React.ReactNode;
};

const Default = ({ children }: Props) => (
  <div className="default clearfix">
    <Header />
    <div className="content clearfix">{children}</div>
  </div>
);

export default Default;
