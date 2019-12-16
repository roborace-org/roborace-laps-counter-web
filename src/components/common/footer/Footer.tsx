import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';


export interface IAppProps {
}


const Footer: FunctionComponent<IAppProps> = (props) => {
  return (
    <nav>
      <NavLink exact to="/">Home</NavLink>
      <NavLink to="/login">Login</NavLink>
    </nav>
  );
}
export default Footer;