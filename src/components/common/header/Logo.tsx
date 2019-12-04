import React, { FunctionComponent } from "react";


interface IAppProps { }

const Logo: FunctionComponent<IAppProps> = () => {
  return (
    <img className="logo" src={process.env.PUBLIC_URL + '/img/logo.jpg'} />
  );
};

export default Logo;