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
import Dashboard from "./containers/Dashboard";
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
		<AppliedRoute path="/dashboard" exact component={Dashboard} props={childProps} onEnter={shouldLogin} />
		{ /* Finally, catch all unmatched routes */ }
		<Route component={NotFound} />
	</Switch>;

