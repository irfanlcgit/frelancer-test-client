import React, { Component } from "react";
import { Auth, Analytics } from "aws-amplify";
//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import SocialButtonLWA from '../components/SocialButtonLWA';
import SocialButtonFb from '../components/SocialButtonFb';
import SocialButtonG from '../components/SocialButtonG';
import MediaQuery from 'react-responsive';
//import FacebookLogin from 'react-facebook-login';
//import AWS from "aws-sdk";

const handleSocialLogin = (response) => {
	console.log(response);
	let token;
	if(response._provider==="google")
	{
		//console.log("in if");
		token=response._token.idToken;
	}
	else
	{
		//console.log("in else");
		token=response._token.accessToken;
	}
	//console.log(token);
	Auth.federatedSignIn(response._provider,{token:token,expires_at:response._token.expiresAt},response._profile)
		.then(result => {
			//console.log(result);
			localStorage.setItem("loggedin", "yes");
			window.location.href = "/dashboard";
			
		})
		.catch(err =>{
			alert(err);
		})
}
 
const handleSocialLoginFailure = (err) => {
	alert(err)
}

export default class Login extends Component {
	constructor(props)
	{
		super(props);
		if(localStorage.getItem("loggedin")==="yes")
		{
			window.location.href = "/dashboard";
		}
		else
		{
			Auth.currentSession().then(function(session)
			{
				window.location.href = "/dashboard";
			}, function(err)
			{
				////no error
			})
		}
		
		this.state = {
			email: "",
			password: "",
			confirmationCode: "",
			isLoading: false,
			errormessage:"",
			newUser: null
		};
		this.validateForm = this.validateForm.bind(this);
	}
	
	
	validateForm()
	{
		return (this.state.email.length > 0 && this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && this.state.password.length > 0);
	}
	
	validateConfirmationForm() {
	    return this.state.confirmationCode.length > 0;
	}
	
	handleChange = event => {
		this.setState(
		{
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = async event => {
		event.preventDefault();
		
		this.setState({ isLoading: true });
		try
		{
			this.setState({errormessage:''});
			await Auth.signIn(this.state.email.toLowerCase(), this.state.password);
			this.props.userHasAuthenticated(true);
			let thisObj = this;
			Auth.currentSession().then(function(session)
			{
				Analytics.record('_userauth.sign_in');
				console.log(JSON.stringify(session));
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

	
	handleConfirmationSubmit = async event => {
	  event.preventDefault();

	  this.setState({ isLoading: true });

	  try {
	    await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
	    this.props.history.push("/dashboard");
	  } catch (e) {
	    alert(e.message);
	    this.setState({ isLoading: false });
	  }
	}

	handleResendConfirmationCode = async event => {
	  event.preventDefault();

	  this.setState({ isLoading: true });

	  try {
	    await Auth.resendSignUp(this.state.email);
	    alert('Code resent succsessfully. Please check your cell phone for SMS.');
	    this.setState({ isLoading: false });
	  } catch (e) {
	    alert(e.message);
	    this.setState({ isLoading: false });
	  }
	}
	
	renderConfirmationForm() {
	    return (
	    	<div className="col-sm-12 forgot_bg">
    <div className="container p0">
      <div className="forgot_box">
            
      
        <a href="/login"><img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" width="15" height="23" alt="" /></a>
        <div className="clear10"></div>
           <div className="forgot_circle"><img src="images/ic_lock1_outline_24px.svg" alt="" /></div>
            <h2> Verify Account</h2>
            
             <div className="clear10"></div>
            If you didn't receive the PIN Code, click on "Resend",<br />
 otherwise fill in the code and click on "Verify".
<div className="register_box_mid">
               <div className="clear20"></div>
               
            <form onSubmit={this.handleConfirmationSubmit}>
              <div className="col-sm-12 p0">
                    <input name="" id="confirmationCode" className="frogot_input" type="text" placeholder="PIN Code"  value={this.state.confirmationCode} onChange={this.handleChange}/>
                    <img src="images/ic_vpn_key_24px.svg" width="25px" height="15px" className="register_icon1" alt="" />
                    </div>
               
        <div className="clear10"></div>
               <div className="col-sm-12 text-right"> <a href="javascript:void(0)" onClick={this.handleResendConfirmationCode} className="resend_code">Resend code</a></div>
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
			<div>
				<MediaQuery query="(min-device-width: 768px)">
					<div className="col-sm-12 login_bg full_view">
						<div className="container p0">
							<div className="col-sm-6 text-left middle_sep">
								<a href="/"><img src="images/logo.png" className="logo_left" alt="" /> </a>
								<h2 className="welcome_heading">Welcome to Freelance Portal</h2>
								<p className="welcome_label"> > Lorem ipsul has been the idsustry's standard dummy text ever
									<br />
									> Lorem ipsul has been the idsustry's standard dummy text ever<br />
									> Lorem ipsul has been the idsustry's standard dummy text ever<br />
									> Lorem ipsul has been the idsustry's standard dummy text ever
								</p>
								<h2 className="welcome_heading">Our Expertise</h2>
								<div className="col-xs-6 col-sm-3 icon_1_acess">
									<img src="images/access.png" width="45" height="50" alt="" />
									<br />
									Access
								</div>
								<div className="col-xs-6 col-sm-3 icon_1_acess">
									<img src="images/security.png" width="45" height="50" alt="" /><br />
									Security
								</div>
								<div className="col-xs-6 col-sm-3 icon_1_acess">
									<img src="images/user1.png" width="45" height="50" alt="" /><br />
									User
								</div>
								<div className="col-xs-6 col-sm-3 icon_1_acess">
									<img src="images/timecard.png" width="45" height="50" alt="" /><br />
									TimeCard
								</div>
								<div className="clear20"></div>
							</div>
							<div className="col-sm-6 col-md-4 col-md-offset-1 p0">
								<div className="login_box">
									<h2><img src="images/login.png" alt="" /> Log in</h2>
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
									<form onSubmit={this.handleSubmit}>
										<div className="col-sm-12 p0">
											<input name="" id="email" className="login_input" type="text" onChange={this.handleChange} placeholder="Email Address" defaultValue="" />
											<img src="images/email.png" className="user_icon" alt="" />
										</div>
										<div className="clear20"></div>
										<div className="col-sm-12 p0">
											<input name="" id="password" className="login_input" type="password" onChange={this.handleChange}  placeholder="Password" defaultValue="" />
											<img src="images/psw.png" className="user_icon" alt="" />
										</div>
										<div className="clear15"></div>
										<div className="col-sm-12 p0 text-right">
											<a href="/forgot" className="login_forgot">Forgot Password?</a>
										</div>
										<div className="clear20"></div>
										{/*<button type="submit">Sign In</button>*/}
										<LoaderButton
											block
											bsSize="large"
											disabled={!this.validateForm()}
											type="submit"
											isLoading={this.state.isLoading}
											text="Login"
											loadingText="Logging in…"
											className="btn_login"
										/>
									</form>
									<div className="col-xs-6 p0 text-left">
										<a href="/register" className="login_forgot">Create Acccount</a>
									</div>
									<div className="col-xs-6 p0 text-right">
										<a href="get_in_touch.html" className="login_forgot">Need Help?</a>
									</div>
									<div className="clear20"></div>
									<div className="strike">
										<span>or</span>
									</div>
									<div className="clear20"></div>
									<div className="col-sm-12 text-center register">
										Login with social media
									</div>
									<div className="clear20"></div>
									<div className="col-xs-3 col-sm-offset-2">
										{/*<a href="/"></a>*/}
										<SocialButtonFb
											  provider='facebook'
											  appId='262815534242234'
											  onLoginSuccess={handleSocialLogin}
											  onLoginFailure={handleSocialLoginFailure}
											>
											  <img src="images/fb.png" width="35" height="35" alt="" />
											</SocialButtonFb>
									</div>
									<div className="col-xs-3">
										{/*<a href="/"></a>*/}
										<SocialButtonG
										  provider='google'
										  appId='932734431145-1dtgpjoaipf324kui00uji6k1ci0ls6v.apps.googleusercontent.com'
										  onLoginSuccess={handleSocialLogin}
										  onLoginFailure={handleSocialLoginFailure}
										>
											<img src="images/google.png" width="33" height="36" alt="" />
										</SocialButtonG>
									</div>
									<div className="col-xs-3">
										{/*<a href="/"></a>*/}
										<SocialButtonLWA
											  provider='amazon'
											  appId='amzn1.application-oa2-client.278696a9f4714d7a898d7d1d4ffa4af4'
											  onLoginSuccess={handleSocialLogin}
											  onLoginFailure={handleSocialLoginFailure}
											>
											  <img src="images/Amazon_alt.png" width="35" height="35" alt="" />
											</SocialButtonLWA>
									</div>
									<div className="clear20"></div>
									<div className="col-sm-12 text-center register">
										Copyright TPH Technologies 2018
									</div>
									<div className="clearfix"></div>
								</div>
							</div>
							<div className="clear40"></div>
							<div className="clearfix"></div>
						</div>
					</div>
				</MediaQuery>
				<MediaQuery query="(max-device-width: 767px)">
					<div className="col-sm-12 login_bg mbile_view">
						<div className="login_box">
							<div className="mobile_login_top">Freelance Portal</div>
								<div className="mobile_logo_login"><img src="images/logo2.svg" alt="" />
							</div>
							<div className="clear20"></div>
							<div className="col-sm-12 login_mobile_middle">
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
								<form onSubmit={this.handleSubmit}>
									<div className="col-sm-12 p0">
										<input name="" id="email" className="login_input_mobile" onChange={this.handleChange} type="text" placeholder="Email Address"  defaultValue="" />
										<img src="images/mobile_person.svg" width="16" height="16px" className="user_icon" alt="" />
									</div>
									<div className="clear20"></div>
									<div className="col-sm-12 p0">
										<input name="" id="password" className="login_input_mobile" onChange={this.handleChange} type="password" placeholder="Password"  defaultValue="" />
										<img src="images/mobile_login_lock.svg" width="18" height="16px"  className="user_icon" alt="" />
									</div>
									<div className="clear15"></div>                
									<div className="col-sm-12 p0 text-right">
										<a href="/forgot" className="login_forgot">Forgot Password?</a>
									</div>
									<div className="clear20"></div>
									{/*<a href="dashboard.html" className="btn_login">Sign In</a>*/}
										<LoaderButton
											block
											bsSize="large"
											disabled={!this.validateForm()}
											type="submit"
											isLoading={this.state.isLoading}
											text="Sign in"
											loadingText="Logging in…"
											className="btn_login"
										/>
								</form>
								<div className="col-xs-6 p0 text-left">
									<a href="/register" className="login_forgot">Create Acccount</a>
								</div>
								<div className="col-xs-6 p0 text-right">
									<a href="get_in_touch.html" className="login_forgot">Need Help?</a>
								</div>
								<div className="clear20"></div>
								<div className="strike">
									<span>or</span>
								</div>
								<div className="clear20"></div>
								<div className="col-sm-12 text-center register">
									Login with social media
								</div>
								<div className="clear20"></div>
								<div className="col-xs-3 col-xs-offset-2">
								{/*<a href="/"><img src="images/fb.svg" width="35" height="35" alt="" /></a>*/}
								<SocialButtonFb
											  provider='facebook'
											  appId='262815534242234'
											  onLoginSuccess={handleSocialLogin}
											  onLoginFailure={handleSocialLoginFailure}
											>
											  <img src="images/fb.png" width="35" height="35" alt="" />
											</SocialButtonFb>
								</div>
								<div className="col-xs-3">
								{/*<a href="/"><img src="images/google.svg" width="33" height="36" alt="" /></a>*/}
								<SocialButtonG
									  provider='google'
									  appId='932734431145-1dtgpjoaipf324kui00uji6k1ci0ls6v.apps.googleusercontent.com'
									  onLoginSuccess={handleSocialLogin}
									  onLoginFailure={handleSocialLoginFailure}
									>
										<img src="images/google.png" width="33" height="36" alt="" />
									</SocialButtonG>
								</div>
								<div className="col-xs-3">
								{/*<a href="/"><img src="images/amazon.svg" width="35" height="35" alt="" /></a>*/}
								<SocialButtonLWA
								  provider='amazon'
								  appId='amzn1.application-oa2-client.278696a9f4714d7a898d7d1d4ffa4af4'
								  onLoginSuccess={handleSocialLogin}
								  onLoginFailure={handleSocialLoginFailure}
								>
								  <img src="images/Amazon_alt.png" width="35" height="35" alt="" />
								</SocialButtonLWA>
								</div>
								<div className="clear20"></div>
								<div className="col-sm-12 text-center register">
									Copyright TPH Technologies 2018
								</div>
								<div className="clearfix"></div>
							</div>
							<div className="clear10"></div>
						</div>
					</div>
				</MediaQuery>
			</div>
		);
	}
	render() {
    return (
	      <div className="Signin">
	        {this.state.newUser === null
	          ? this.renderForm()
	          : this.renderConfirmationForm()}
	      </div>
	    );
	}
}