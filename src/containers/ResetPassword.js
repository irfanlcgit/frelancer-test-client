import React, { Component } from "react";

//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

export default class Register extends Component {
 

  render() {
    return (
      <div className="col-sm-12 forgot_bg">
    <div className="container p0">
      <div className="forgot_box">
            
      
        <a href="/forgot_code"><img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" width="15" height="23" alt="" /></a> 
        <div className="clear10"></div>
           <div className="forgot_circle"><img src="images/ic_lock1_outline_24px.svg" alt="" /></div>
            <h2> Reset Your Password</h2>
            
             <div className="clear10"></div>
            Please enter the new password and confirm password.
<div className="register_box_mid">
               <div className="clear20"></div>
   
              <div className="col-sm-12 p0">
                    <input name="" className="frogot_input" type="text" placeholder="Password" />
                    <img src="images/forgot_password/ic_lock_outline_24px.svg" width="25px" height="15px" className="register_icon1" alt="" />
                    </div>
                    
                        <div className="clear10"></div>
                    <div className="col-sm-12 p0">
                    <input name="" className="frogot_input" type="text" placeholder="Confirm Password" />
                    <img src="images/forgot_password/ic_lock_outline_24px.svg" width="25px" height="15px" className="register_icon1" alt="" />
                    </div>
               
        <div className="clear30"></div>
           
                
        <a href="" className="btn_forogot" data-toggle="modal" data-target="#exampleModalCenter">Change Password</a>


  <div className="clear10"></div>
        </div>
            
            
</div>

            <div className="clear10"></div>

         
         
      </div>

      <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modla_register" role="document">
    <div className="modal-content">
      <div className="modal-header modal_header_register">
       
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body register_suc register_popup">
      
      <img src="images/ic_check_circle_24px.svg" width="47" height="47" alt="" />
       <div className="clearfix"></div>
      
      <h2> You have changed password successfully</h2>
        <div className="clearfix"></div>
   
  <a href="/login" className="btn_ok_reg">OK</a>
       
      </div>
      
    </div>
  </div>
</div>

    </div>
    );
  }
}