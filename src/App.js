//import { LinkContainer } from "react-router-bootstrap";
import React, { Component } from "react";
//import { Link } from "react-router-dom";
//import { Nav, Navbar, NavItem } from "react-bootstrap";
import Routes from "./Routes";
import { Auth, Analytics } from "aws-amplify";
import { withRouter } from "react-router-dom";


// var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'us-east-1_wRR9s216a'});
// var myConfig = new AWS.Config({
  // credentials: myCredentials, region: 'us-east-1'
// });
 
 // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  // IdentityPoolId: 'us-east-1:fea03007-9dfb-4689-991b-747a1b7fb1c1',
  // Logins: { // optional tokens, used for authenticated login
    // 'graph.facebook.com': '1800795016641507'
  // }
// });

class App extends Component {
	constructor(props)
	{
		super(props);
		this.state = {
			isAuthenticated: false,
			isAuthenticating: true
		};
	}
	async componentDidMount()
	{
		try
		{
			if (await Auth.currentSession())
			{
				this.userHasAuthenticated(true);
			}
		}
		catch(e)
		{
			if (e !== 'No current user')
			{
				alert(e);
			}
		}
		this.setState({ isAuthenticating: false });
	}
	
	userHasAuthenticated = authenticated => {
		this.setState({ isAuthenticated: authenticated });
	}
	
	render()
	{
		Analytics.record('appRender');
		const childProps = {
			isAuthenticated: this.state.isAuthenticated,
			userHasAuthenticated: this.userHasAuthenticated
		};

		return (
			 !this.state.isAuthenticating &&
			<Routes childProps={childProps} />
		);
	}
}

export default withRouter(App);