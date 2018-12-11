import React, { Component } from "react";

//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
//import "./Login.css";

export default class Register extends Component {
 

  render() {
    return (
      <div className="col-sm-12 forgot_bg">
    <div className="container p0">
      <div className="forgot_box">
            
      
        <a href="/forgot"><img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" width="15" height="23" alt="" /></a> 
        <div className="clear10"></div>
           <div className="forgot_circle"><img src="images/ic_lock1_outline_24px.svg" alt="" /></div>
            <h2> Forgot Password?</h2>
            
             <div className="clear10"></div>
            If you didn't receive the PIN Code, click on "Resend",<br />
 otherwise fill in the code and click on "Next".
<div className="register_box_mid">
               <div className="clear20"></div>
   
              <div className="col-sm-12 p0">
                    <input name="" className="frogot_input" type="text" placeholder="PIN Code" />
                    <img src="images/ic_vpn_key_24px.svg" width="25px" height="15px" className="register_icon1" alt="" />
                    </div>
               
        <div className="clear10"></div>
               <div className="col-sm-12 text-right"> <a href="/" className="resend_code">Resend code</a></div>
        <div className="clear10"></div>
                
        <a href="/reset_password" className="btn_forogot_gray">Proceed</a>


  <div className="clear10"></div>
        </div>
            
            
</div>

            <div className="clear10"></div>

         
         
      </div>
    </div>
    );
  }
}