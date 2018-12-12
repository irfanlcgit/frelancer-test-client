import React, { Component } from "react";
import { Auth, Analytics, API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import SocialButtonLWA from '../components/SocialButtonLWA';
import SocialButtonFb from '../components/SocialButtonFb';
import SocialButtonG from '../components/SocialButtonG';
import CountryCode from '../components/CountryCode';
import config from "../config";

const handleSocialLogin = (response) => {
	
	if(response._provider==="amazon"){
		token=response._token.accessToken;
		Auth.federatedSignIn(response._provider,{token:token,expires_at:response._token.expiresAt},response._profile)
		.then(result => {
			//console.log(result);
			console.log(response);
			console.log(response._profile.firstName);
		})
		.catch(err =>{
			alert(err);
		})
		return false;
	}
	//console.log(response);
	//return false;
	let token;
	if(response._provider==="google")
	{
		token=response._token.idToken;
	}
	else
	{
		token=response._token.accessToken;
	}
	Auth.federatedSignIn(response._provider,{token:token,expires_at:response._token.expiresAt},response._profile)
		.then(result => {
			
			const res = getUserSocial();
			res.then(function(user) {
                if(!user.status){
		        	//console.log(response._profile.firstName);
		        	API.put("users", `/users/${"HGJGJGJUYGJUGSJY"}`, {

	                    "body": {
	                        "Update": "UpdateUserAtLogin",
	                        "FirstName": response._profile.firstName? response._profile.firstName : '',
	                        "LastName": response._profile.lastName? response._profile.lastName : '',
	                        "EmailAddress": response._profile.email? response._profile.email : '',
	                        "MobileNumber": '',
	                    }
	             
	                });

					localStorage.setItem("loggedin", "yes");
					localStorage.setItem("SocialLoggedin", "yes");
					setTimeout(function() { window.location.href = "/dashboard"; },3000);
		            
		        }else{
		        	//console.log(user.result);
		        	API.put("users", `/users/${"HGJGJGJUYGJUGSJY"}`, {

		                "body": {
		                    "Update": "UpdateUserAtLogin",
		                    "FirstName": user.result.FirstName,
		                    "LastName": user.result.LastName,
		                    "EmailAddress": user.result.EmailAddress,
		                    "MobileNumber": user.result.MobileNumber,
		                }
		             
		            });

					localStorage.setItem("loggedin", "yes");
					localStorage.setItem("SocialLoggedin", "yes");
					setTimeout(function() { window.location.href = "/dashboard"; },3000);
		        } 
            }).catch(err => console.log(err));
			//return false
		})
		.catch(err =>{
			alert(err);
		})
}

const handleSocialLoginFailure = (err) => {
	alert(err)
}

const getUserSocial = () => {
        return API.get("users", `/users/${"HGJGJGJUYGJUGSJY"}`);
}

export default class Register extends Component
{
	constructor(props)
	{
		super(props);
	    this.state = {
	      firstName: "",
	      lastName: "",
	      email: "",
	      mobile: "",
	      password: "",
	      confirmPassword: "",
	      confirmationCode: "",
	      newUser: null,
		  emailValid:'',
		  phoneValid:'',
		  passwordValid:'',
		  errormessage:'',
	      isLoading: false,
	      CountryCode:'',
	    };
	}

	validateForm()
	{
		return (
			this.state.email.length > 0 &&
			this.state.password.length > 0 &&
			this.state.mobile.length > 0 &&
			this.state.password === this.state.confirmPassword
		);
	}

	validatePassword()
	{
		if(this.state.password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?'";:`~^()-_+=\\|\]}\[{.<>&]{8,}$/i))
		{
			this.setState({passwordValid:''});
			return true;
		}
		else
		{
			this.setState({passwordValid:'Password must contain eight characters, at least one capital letter, one number, and a special character.'});
			return false;
		}
	}

	validateEmail()
	{
		if(this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i))
		{
			this.setState({emailValid:''});
			return true;
		}
		else
		{
			this.setState({emailValid:'Email address is invalid. Please re-check.'});
			return false;
		}
	}
	
	validatePhone()
	{
		var countrycode = document.getElementById("phoneDropDown").value;
		let phoneN = "+"+document.getElementById("phoneDropDown").value+this.state.mobile;
		if(phoneN.match(/^\+\d+$/))
		{
			this.setState({phoneValid:'',CountryCode:countrycode});
			return true;
		}
		else
		{
			this.setState({phoneValid:'Phone number is invalid'});
			return false;
		}
	}
	
	validateConfirmationForm()
	{
	    return this.state.confirmationCode.length > 0;
	}

	handleChange = event => {
		if(event.target.id==="mobile")
		{
			if(event.target.value.match(/^\d+$/))
			{
				this.setState({
					[event.target.id]: event.target.value
				});
			}
			else if(event.target.value==0)
			{
				this.setState({
					[event.target.id]: event.target.value
				});
			}
			else
			{
				console.log("false condition");
			}
		}
		else
		{
			this.setState({
				[event.target.id]: event.target.value
			});
		}
	}

	handleSubmit = async event => {
		event.preventDefault();
		let validatePassword = this.validatePassword();
		let validateEmail   = this.validateEmail();
		let validatePhone  = this.validatePhone();
		if(validatePassword && validateEmail && validatePhone )
		{
			this.setState({errormessage:''});
			this.setState({ isLoading: true });
			try
			{
				const newUser = await Auth.signUp(
				{
					username: this.state.email,
					password: this.state.password,
					attributes: {
						email: this.state.email,
						'phone_number':"+"+document.getElementById("phoneDropDown").value+this.state.mobile,//this.state.mobile,
						//'custom:firstname':this.state.firstName,
						//'custom:lastname':this.state.lastName,
					}
				});
				this.setState(
				{
				  newUser
				});
				console.log(newUser);
			}
			catch (e)
			{
				Analytics.record('_userauth.auth_fail');
				this.setState({errormessage:e.message});
				///////alert(e.message);
			}
			this.setState({ isLoading: false });
		}
	}
	

	handleConfirmationSubmit = async event => {
	event.preventDefault();
	this.setState({ isLoading: true });
	try
	{
		var mobile_number = this.state.CountryCode+'-'+this.state.mobile;
		await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
		Analytics.record('_userauth.sign_up');
		await Auth.signIn(this.state.email, this.state.password);
	    this.props.userHasAuthenticated(true);
	    const user = await this.getUser();
	    if(!user.status){
	        Auth.currentSession().then(function(session)
	        { 
	                var userData = session.idToken.payload;
	                var fname = userData['custom:firstname'];
	                API.put("users", `/users/${"HGJGJGJUYGJUGSJY"}`, {

	                    "body": {
	                        "Update": "UpdateUserAtLogin",
	                        "FirstName": userData['custom:firstname'],
	                        "LastName": userData['custom:lastname'],
	                        "EmailAddress": userData.email,
	                        //"MobileNumber": userData.phone_number,
	                        "MobileNumber": mobile_number,
	                        "Password": this.state.password,
	                    }
	             
	                });
	                //console.log(userData.auth_time)
	        }, function(err){
	                    //window.location.href = "/" ; 
	        })
	    }
	    setTimeout(function(){ this.props.history.push("/dashboard"); }.bind(this), 5000);
	}
	catch (e)
	{
		alert(e.message);
		Analytics.record('_userauth.auth_fail');
	    this.setState({errormessage:e.message});
	    this.setState({ isLoading: false });
	}
}

	handleResendConfirmationCode = async event => {
		event.preventDefault();
		this.setState({ isLoading: true });
		try
		{
			await Auth.resendSignUp(this.state.email);
			//alert('resend succsessfully.');
			this.setState({ isLoading: false });
		}
		catch (e)
		{
			alert(e.message);
			this.setState({ isLoading: false });
		}
	}

	getUser() {
        return API.get("users", `/users/${"HGJGJGJUYGJUGSJY"}`);
    }

	renderConfirmationForm()
	{
		return (
	    	<div className="col-sm-12 forgot_bg">
				<div className="container p0">
					<div className="forgot_box">
						<a href="/login">
							<img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" width="15" height="23" alt="" />
						</a> 
						<div className="clear10"></div>
						<div className="forgot_circle">
							<img src="images/ic_lock1_outline_24px.svg" alt="" />
						</div>
						<h2> Verify Account</h2>
						<div className="clear10"></div>
							If you didn't receive the PIN Code, click on "Resend",<br />otherwise fill in the code and click on "Verify".
							<div className="register_box_mid">
								<div className="clear20"></div>
									<form onSubmit={this.handleConfirmationSubmit}>
										<div className="col-sm-12 p0">
											<input name="" id="confirmationCode" className="frogot_input" type="text" placeholder="PIN Code"  value={this.state.confirmationCode} onChange={this.handleChange}/>
											<img src="images/ic_vpn_key_24px.svg" width="25px" height="15px" className="register_icon1" alt="" />
										</div>
										<div className="clear10"></div>
										<div className="col-sm-12 text-right">
											<a href="javascript:void(0)" onClick={this.handleResendConfirmationCode} className="resend_code">
												Resend code
											</a>
										</div>
										<div className="clear10"></div>
										<LoaderButton
											block
											bsSize="large"
											disabled={!this.validateConfirmationForm()}
											type="submit"
											isLoading={this.state.isLoading}
											text="Verify"
											loadingText="Verifying…"
											className="btn_forogot"
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
			renderForm()
			{
				return (
					<form onSubmit={this.handleSubmit}>
						<div>
							<div className="col-sm-12 register_bg">
								<div className="container p0">
									<div className="register_box">
										<h2> SIGN UP </h2>
											<a href="/login">
												<img src="images/ic_chevron_left1_24px.svg" className="back_signup" width="15" height="23" alt="" />
											</a>
											<hr />
											<div className="register_box_mid">
												<div className="clearfix"></div>
												<div className="register_with_scial"> Sign up with your social account</div>
												<div className="clear20"></div>
												{!this.state.errormessage?(
													''
												):
												(
													<div>
														<div className="clear10"></div>
														<div className="alert alert-danger">{this.state.errormessage}</div>
													</div>
												)
												}
												{!this.state.emailValid?(
													''
												):
												(
													<div>
														<div className="clear10"></div>
														<div className="alert alert-danger">{this.state.emailValid}</div>
													</div>
												)
												}
												{!this.state.phoneValid?(
													''
										):
										(
											<div>
												<div className="clear10"></div>
												<div className="alert alert-danger">{this.state.phoneValid}</div>
											</div>

										)
									}
									{!this.state.passwordValid?(
										''
										):
										(
											<div>
												<div className="clear10"></div>
												<div className="alert alert-danger">{this.state.passwordValid}</div>
											</div>

										)
									}
									<div className="col-xs-12 register_social_icon">
									{/*<a href="/register"><img src="images/fb.svg" width="35" height="35" alt="" /></a>*/}
									<SocialButtonFb
									  provider='facebook'
									  appId={config.facebookAppId}
									  onLoginSuccess={handleSocialLogin}
									  onLoginFailure={handleSocialLoginFailure}
									>
									  <img src="images/fb.png" width="35" height="35" alt="" />
									</SocialButtonFb>
									{/*<a href="/register"><img src="images/google.svg" width="33" height="36" alt="" /></a>*/}
									<SocialButtonG
									  provider='google'
									  appId={config.googleAppId}
									  onLoginSuccess={handleSocialLogin}
									  onLoginFailure={handleSocialLoginFailure}
									>
										<img src="images/google.png" width="33" height="36" alt="" />
									</SocialButtonG>
									{/*<a href="/register"><img src="images/amazon.svg" width="35" height="35" alt="" /></a>*/}
									<SocialButtonLWA
								  provider='amazon'
								  appId={config.awsAppId}
								  onLoginSuccess={handleSocialLogin}
								  onLoginFailure={handleSocialLoginFailure}
								>
								  <img src="images/Amazon_alt.png" width="35" height="35" alt="" />
								</SocialButtonLWA>
									</div>
									<div className="clear20"></div>
									<div className="strike_signup">
										<span>or</span>
									</div>
									<div className="clear20"></div>
									<div className="col-sm-12 p0 text-center">
										<div className="col-sm-12 p0">
											<input name="" id="firstName" className="register_input_top" type="text" placeholder="First Name" value={this.state.firstName}  onChange={this.handleChange} />
											<img src="images/ic_person_outline_24px.svg" width="18px" height="16px" className="register_icon1" alt="" />
										</div>
										<div className="col-sm-12 p0">
											<input name="" id="lastName" className="register_input" type="text" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} />
											<img src="images/ic_person_outline_24px.svg" width="18px" height="16px" className="register_icon1" alt="" />
										</div>
										<div className="col-sm-12 p0">
											<input name="" id="email" className="register_input" type="text" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
											<img src="images/ic_mail_outline_24px.svg" width="18px" height="16px" className="register_icon1" alt="" />
										</div>
										<div className="col-sm-12 p0">
											<CountryCode/>
											<input name="" id="mobile" className="register_input" type="text" placeholder="Mobile" value={this.state.mobile} onChange={this.handleChange} style={{width:"56%"}}/>
											
												{/*<img src="images/ic_phone_24px.svg" width="18px" height="16px" className="register_icon1"  alt="" /> */}
										</div>
										<div className="col-sm-12 p0">
											<input name="" id="password" className="register_input" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
											<img src="images/ic_lock_outline_24px.svg" width="18px" height="16px" className="register_icon1" alt="" />
										</div>
										<div className="col-sm-12 p0">
											<input name="" id="confirmPassword" className="register_input_bottom" type="password" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleChange} />
											<img src="images/ic_lock_outline_24px.svg" width="18px" height="16px" className="register_icon1" alt="" />
										</div>                  
									</div>
									<div className="clear30"></div>
									{/*<a href="" className="btn_register" data-toggle="modal" data-target="#exampleModalCenter">
										Create New Account
									</a>*/}
									<LoaderButton
											block
											bsSize="large"
											
											type="submit"
											isLoading={this.state.isLoading}
											text="Signup"
											loadingText="Signing up…"
											className="btn_register"
										/>
									<div className="clear10"></div>
									<div className="col-xs-12 p0 text-right lable_already_user">
										Already user?
										<a href="/login">Click here</a>
									</div>
									<div className="clear20"></div>
									<div className="col-sm-12 text-center register">
										I accept the <strong><a href="/terms-conditions" target="_blank">Terms of Use</a></strong> and <strong><a href="/privacy-policy" target="_blank">Privacy Policy</a></strong>
									</div>
									<div className="clearfix"></div>
								</div>
							</div>
							<div className="clear40"></div>
						</div>
					</div>
					<div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
									<h2> You have signed up successfully</h2>
									<div className="clearfix"></div>
									Thank you for chossing Digital Form.
									<div className="clear40"></div>
									<a href="/" className="btn_ok_reg">OK</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		);
	}

	render() {
    return (
	      <div className="Signup">
	        {this.state.newUser === null
	          ? this.renderForm()
	          : this.renderConfirmationForm()}
	      </div>
	    );
	}
}