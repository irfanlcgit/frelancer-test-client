import React , { Component } from "react";
//import "./Header.css";
export default class Header extends Component {
	render()
	{
		return (
			<div>
				<div className="col-sm-12 dashboard_main_shadow">
					<div className="col-sm-3 p0">
						<a href="/dashboard" >
							<img src='images/dashboardlogo.svg' alt="Freelance Portal Logo" className="headerLogoMain"/>
						</a>
					</div>
					<div className="clearfix"></div>
				</div>
				<div className="clearfix"></div>
			</div>
		);
	}
}