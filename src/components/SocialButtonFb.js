import React from 'react';
import SocialLoginFb from 'react-social-login';
 
const Button = ({ children, triggerLogin, ...props }) => (
  <button onClick={triggerLogin} {...props} className="socialbuttons" type="button">
    { children }
  </button>
)
 
export default SocialLoginFb(Button)