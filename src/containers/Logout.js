import React , { Component } from "react";
import { Auth } from "aws-amplify";

export default class Logout extends Component {
	
	constructor(props)
	{
		super();
	}

    async componentDidMount() {
       localStorage.removeItem("loggedin")
       localStorage.removeItem("View")
       localStorage.removeItem("flLastActivity")
       localStorage.removeItem("SocialLoggedin");
        await Auth.signOut();
      //this.userHasAuthenticated(false);
      this.props.history.push("/");
    }

	render(){
        return('');
	}
}