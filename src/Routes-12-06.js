import React from "react";
import { Route, Switch } from "react-router-dom";
//import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";
import Forgot from "./containers/Forgot";
import ForgotCode from "./containers/ForgotCode";
import ResetPassword from "./containers/ResetPassword";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./containers/AppliedRoute";
import Dashboard from "./containers/Main";
import Privacy from "./containers/Privacy";
import Terms from "./containers/Terms";
import Help from "./containers/Help";
import Needhelp from "./containers/Needhelp";
//import SignatureSettings from "./containers/SignatureSettings";
import { Auth } from "aws-amplify";

function shouldLogin(nextState, replace)
{
	Auth.currentSession().then(function(session)
	{
		
	}, function(err)
	{
		window.location.href = "/" ; 
	})
}

function shouldNotLogin(nextState, replace)
{
	console.log('should not login called');
	Auth.currentSession().then(function(session)
	{
		window.location.href = "/dashboard";
	}, function(err)
	{
	})
}


export default ({ childProps }) =>
	<Switch>
		<AppliedRoute path="/" exact component={Login} props={childProps} onEnter={shouldNotLogin} />
		<AppliedRoute path="/login" exact component={Login} props={childProps} onEnter={shouldNotLogin} />
		<AppliedRoute path="/register" exact component={Register} props={childProps} onEnter={shouldNotLogin} />
		<AppliedRoute path="/forgot" exact component={Forgot} props={childProps} onEnter={shouldNotLogin} />
		<AppliedRoute path="/forgot_code" exact component={ForgotCode} props={childProps} onEnter={shouldNotLogin} />
		<AppliedRoute path="/reset_password" exact component={ResetPassword} props={childProps} onEnter={shouldNotLogin} />
		<AppliedRoute path="/privacy-policy" exact component={Privacy} props={childProps} />
		<AppliedRoute path="/terms-conditions" exact component={Terms} props={childProps} />
		<AppliedRoute path="/help" exact component={Help} props={childProps} />
		<AppliedRoute path="/need-help" exact component={Needhelp} props={childProps} />
		<AppliedRoute path="/dashboard" exact component={Dashboard} props={childProps} onEnter={shouldLogin} />
		{ /* Finally, catch all unmatched routes */ }
		<Route component={NotFound} />
	</Switch>;

