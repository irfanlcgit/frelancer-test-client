//import { LinkContainer } from "react-router-bootstrap";
import React, { Component } from "react";
//import { Link } from "react-router-dom";
//import { Nav, Navbar, NavItem } from "react-bootstrap";
import Routes from "./Routes";
import { Auth } from "aws-amplify";
import { withRouter } from "react-router-dom";


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