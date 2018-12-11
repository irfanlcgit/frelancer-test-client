import React, { Component } from "react";
import { Modal } from 'react-bootstrap';


//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

import { Auth, Analytics, API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";

export default class Register extends Component {
  
  constructor(props) {
      super(props);

      this.state = {
        username: "",
        pinCode: "",
        newPassword: "",
        confirmPassword: "",
        isLoading: false,
        errormessage:"",
        codeSent: false,
        codeValid: false,
		show: false
      };
	  this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
	  console.log('handle show called');
    this.setState({ show: true });
  }

  validateForgotForm() {
      return this.state.username.length > 0;
  }

  validateCodeForm() {
      return this.state.pinCode.length > 0;
  }

  validateResetPasswordForm() {
    return this.state.newPassword.length > 0 &&
    this.state.newPassword === this.state.confirmPassword
  }

  handleChange = event => {
      this.setState({
        [event.target.id]: event.target.value
      });
  }

	handleForgotForm = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });
		try
		{
			await Auth.forgotPassword(this.state.username);
			//alert('Code sent succsessfully. Please check your cell phone for SMS.');
			this.setState({ isLoading: false, codeSent: true, errormessage:""});
		}
		catch (e)
		{
			alert(e.message);
			this.setState({ isLoading: false , errormessage:e.message});
		}
	}

	handleSubmit = async event => {
		event.preventDefault();
		
		this.setState({ isLoading: true });
		try
		{
			this.setState({errormessage:''});
			await Auth.signIn(this.state.username.toLowerCase(), this.state.newPassword);
			this.props.userHasAuthenticated(true);
			let thisObj = this;
			Auth.currentSession().then(function(session)
			{
				Analytics.record('_userauth.sign_in');
				//console.log(JSON.stringify(session));
        var userData = session.idToken.payload;
        API.put("users", `/users/${"HGJGJGJUYGJUGSJY"}`, {

            "body": {
                "Update": "UpdatePassword",
                "Password": thisObj.state.newPassword,
            }
               
        });
				thisObj.props.history.push("/dashboard");
			}, function(err)
			{
				console.log(err)
			})
		}
		// catch (e)
		// {
			// console.log(e.message);
			
			// this.setState({ isLoading: false, errormessage:e.message });
		// }
		catch (e)
		{
			console.log(e.name);
			if(e.name === 'UserNotConfirmedException'){
				this.setState({ newUser: true });
			}
			this.setState({ isLoading: false });
			this.setState({ isLoading: false, errormessage:e.message });
		}
	}
	
	
  handlePinCodeForm = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      //await Auth.forgotPassword(this.state.mobile);
      //alert('code is valid.');
      this.setState({ isLoading: false, codeSent: true, codeValid: true, errormessage:""});
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false , errormessage:e.message});
    }

  }

  handleResetPasswordForm = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });
    try {
      await Auth.forgotPasswordSubmit(this.state.username, this.state.pinCode, this.state.newPassword);
      //alert('Password reset succsessfully.');

	  this.handleShow();
      //this.setState({ isLoading: false, codeSent: false, codeValid: false, errormessage:""});
      //this.props.history.push("/login");
    } catch (e)
	{
      alert(e.message);
      this.setState({ isLoading: false , errormessage:e.message});
    }

  }

  handleResendCode = async event => {
    event.preventDefault();

    this.setState({ isLoading: true });

    try {
      await Auth.forgotPassword(this.state.mobile);
      //alert('resend succsessfully.');
      this.setState({ isLoading: false, codeSent: true, errormessage:""});
    } catch (e) {
		
      this.setState({ isLoading: false , errormessage:e.message});
    }
  }

  renderForgotForm() {
    return (
      <div className="col-sm-12 forgot_bg">
    <div className="container p0">
      <div className="forgot_box">
            
      
        <a href="/login"><img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" width="15" height="23" alt="" /></a> 
        <div className="clear10"></div>
           <div className="forgot_circle"><img src="images/ic_lock1_outline_24px.svg" alt="" /></div>
            <h2> Forgot Password?</h2>
            
             <div className="clear10"></div>
<div className="register_box_mid register_box_mid2">
               <div className="clear20"></div>
               {!this.state.errormessage?(
                      ''
                    ):
                    (
                      <div>
                        <div className="clear20"></div>
                        <div className="alert alert-danger text-uppercase">{this.state.errormessage}</div>
                      </div>
                      
                    )
                  }
   <form onSubmit={this.handleForgotForm}>
              <div className="col-sm-12 p0">
                    <input name="" id="username" className="frogot_input" style={{width:'100%'}} type="text" placeholder="Enter Email" value={this.state.username} onChange={this.handleChange}/>
                    <img src="images/ic_mail_outline_24px.svg" width="15px" style={{left:'40px'}} height="15px" className="register_icon1" alt="" />
                    </div>
               

                <div className="clear30"></div>
       

                {/*<a href="/forgot_code" className="btn_forogot">Proceed</a>*/}
                
                <LoaderButton
                      block
                      bsSize="small"
                      disabled={!this.validateForgotForm()}
                      type="submit"
                      isLoading={this.state.isLoading}
                      text="Proceed"
                      loadingText="Sending…"
                      className="btn_forogot btn_forogot_new"
                />
</form>
 
  <div className="clear40"></div>
        </div>
            
            
</div>

            <div className="clear40"></div>

         
         
      </div>
	</div>
    );
  }

  renderPinCodeForm() {
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
<div className="register_box_mid register_box_mid2">
               <div className="clear20"></div>
               {!this.state.errormessage?(
                      ''
                    ):
                    (
                      <div>
                        <div className="clear20"></div>
                        <div className="alert alert-danger text-uppercase">{this.state.errormessage}</div>
                      </div>
                      
                    )
                  }
            <form onSubmit={this.handlePinCodeForm}>
              <div className="col-sm-12 p0">
                    <input name="" className="frogot_input" id="pinCode" type="text" placeholder="PIN Code" value={this.state.pinCode} onChange={this.handleChange}/>
                    <img src="images/ic_vpn_key_24px.svg" width="25px" height="15px" className="register_icon1" alt="" />
                    </div>
               
        <div className="clear10"></div>
               <div className="col-sm-12 text-right"> <a href={null} onClick={this.handleResendCode} className="resend_code">Resend code</a></div>
        <div className="clear10"></div>
                
        <LoaderButton
                      block
                      bsSize="small"
                      disabled={!this.validateCodeForm()}
                      type="submit"
                      isLoading={this.state.isLoading}
                      text="Proceed"
                      loadingText="Validate…"
                      className="btn_forogot btn_forogot_new"
                />

</form>
  <div className="clear10"></div>
        </div>
            
            
</div>

            <div className="clear10"></div>

         
         
      </div>
    </div>
    );
  }

    renderResetPasswordForm() {
    return (
      <div className="col-sm-12 forgot_bg">
    <div className="container p0">
      <div className="forgot_box">
            
      
        <a href="/forgot"><img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" width="15" height="23" alt="" /></a> 
        <div className="clear10"></div>
           <div className="forgot_circle"><img src="images/ic_lock1_outline_24px.svg" alt="" /></div>
            <h2> Reset Your Password</h2>
            
             <div className="clear10"></div>
            Please enter the new password and confirm password.
<div className="register_box_mid register_box_mid2">
               <div className="clear20"></div>
               {!this.state.errormessage?(
                      ''
                    ):
                    (
                      <div>
                        <div className="clear20"></div>
                        <div className="alert alert-danger text-uppercase">{this.state.errormessage}</div>
                      </div>
                      
                    )
                  }
            <form onSubmit={this.handleResetPasswordForm}>
              <div className="col-sm-12 p0">
                <input name="newPassword" id="newPassword" className="frogot_input" type="password" placeholder="Password" value={this.state.newPassword} onChange={this.handleChange}/>
                <img src="images/forgot_password/ic_lock_outline_24px.svg" width="25px" height="15px" className="register_icon1" alt="" />
              </div>
                    
              <div className="clear10"></div>
              <div className="col-sm-12 p0">
                <input name="" id="confirmPassword" className="frogot_input" type="password" placeholder="Confirm Password"  value={this.state.confirmPassword} onChange={this.handleChange} />
                <img src="images/forgot_password/ic_lock_outline_24px.svg" width="25px" height="15px" className="register_icon1" alt="" />
              </div>
               
        <div className="clear30"></div>
                
        <LoaderButton
                      block
                      bsSize="small"
                      disabled={!this.validateResetPasswordForm()}
                      type="submit"
                      isLoading={this.state.isLoading}
                      text="Change Password"
                      loadingText="Sending…"
                      className="btn_forogot btn_forogot_new"
                />

</form>
  <div className="clear10"></div>
        </div>
            
            
</div>

            <div className="clear10"></div>

         
         
      </div>
	  
	  
		<Modal id="exampleModalCenter" show={this.state.show} onHide={this.handleClose}>
			<Modal.Header closeButton className="modal_header_register"></Modal.Header>
			<Modal.Body className="register_suc register_popup">
				<img src="images/ic_check_circle_24px.svg" width="47" height="47" alt="" />
				<div className="clearfix"></div>
				<h2> You have changed password successfully</h2>
				<div className="clearfix"></div>
				<button className="btn_ok_reg" onClick={this.handleSubmit}>Ok</button>
			</Modal.Body>
		</Modal>
	  
	  
	 
	  
    </div>
    );
  }

  render() {
    return (
        <div className="Forgot">
          {
            this.state.codeSent && this.state.codeValid
            ? this.renderResetPasswordForm() : this.state.codeSent ? this.renderPinCodeForm()
            : this.renderForgotForm()
          }
        </div>
      );
  }

}