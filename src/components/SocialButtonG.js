import React from 'react';
import SocialLoginG from 'react-social-login';

const Button = ({ children, triggerLogin, ...props }) => (
  <button onClick={triggerLogin} {...props} className="socialbuttons" type="button">
    { children }
  </button>
)
 
export default SocialLoginG(Button)