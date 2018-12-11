import React , { Component } from "react";
import { Auth, API } from "aws-amplify";
import Header from '../components/Header';
import $ from 'jquery';
import Home from '../components/Main/Home';
import TimeCard from '../components/Main/TimeCard';
import Company from '../components/Main/Company';
import Document from '../components/Main/Document';
import Setting from '../components/Main/Setting';
import SignatureSettings from '../components/Main/SignatureSettings';
import Help from '../components/Main/Help';

export default class Main extends Component {
	
	constructor(props)
	{
		super();
		
        if(localStorage.getItem("loggedin")==="yes")
        {
            //window.location.href = "/login";
        }
        else
        {
            Auth.currentSession().then(function(session)
            {
                //console.log(JSON.stringify(session));
            }, function(err)
            {
                window.location.href = "/" ; 
            })
        }

        this.state = {
          toggle: true,
          View: "Home",
          SubView: "List",
          FirstName: "",
          Settings: [],

        };
	}

    async componentDidMount() {
        if(localStorage.getItem("View")){
            this.setState({View: localStorage.getItem("View")});
        }

        try {
           const user = await this.getUser();
           if(user.status){
                localStorage.setItem('UserFirstName', user.result.FirstName);
                localStorage.setItem('UserLastName', user.result.LastName);
           }
        } catch (e) {
            console.log("Main Fatch User: "+e);
        }

        try {
            const result = await this.settings();
            
            if(result.status){
              let items = result.items;

              if(items.length === 0){
                this.createSettings({"Key":"NotifyNewDocument","Value":this.state.toggleActive1});
                this.createSettings({"Key":"StoreDataDigitalForms","Value":this.state.toggleActive2});
                this.createSettings({"Key":"UseDataDigitalForms","Value":this.state.toggleActive3});   
              }else{
                console.log(result.items);
              }
            }
        } catch (e) {
            console.log("Settings "+e);
        }
    }
	
	handleLogout = async event => {
        localStorage.removeItem("loggedin")
        localStorage.removeItem("SocialLoggedin");
        localStorage.removeItem("View");
        localStorage.removeItem("flLastActivity")
        await Auth.signOut();
      //this.userHasAuthenticated(false);
      this.props.history.push("/");
    }

    toggleSidebar = async event => {
        event.preventDefault();
        $("#wrapper").toggleClass("toggled");
        //$(".mrg_dashboard_right").css('width','92%');
        if (this.state.toggle) {
                $(".mrg_dashboard_right").css('width','92%');
                $('.headerLogoMain').attr('src','images/logo2.svg');
                $('.headerLogoMain').addClass('second_logo_small');
                $('#wrapper span').hide(300);
            }
            
            else {
                if($( window ).width() >= 786 && $( window ).width() < 992){
                    
                    $(".mrg_dashboard_right").css('width','75%');
                }else if($( window ).width() >= 992 && $( window ).width() < 1024){
                    
                    $(".mrg_dashboard_right").css('width','80%');
                }
                else{
                   $(".mrg_dashboard_right").css('width','83%'); 
                }
                
                $('.headerLogoMain').attr('src','images/dashboardlogo.svg');
                $('.headerLogoMain').removeClass('second_logo_small');
                $('#wrapper span').show(300);
            }
            this.setState({ toggle: !this.state.toggle });
            
    }

    handleView = (element, subview) => async event => {
      event.preventDefault();
      this.setState({ View: element, SubView: subview });
      localStorage.setItem('View', element);
    }

    getUser() {
        return API.get("users", `/users/${"HGJGJGJUYGJUGSJY"}`);
    }

    updateUser(note) {
      return API.put("users", `/users/${"HGJGJGJUYGJUGSJY"}`, {

        "body": note
 
      });
    }

    settings() {
        return API.get("settings", "/settings");
    }

    createSettings(item) {
        return API.post("settings", "/settings", {
          body: item
        });
    }

	render()
	{
		return (
			<div>
            <Header/>
            <div className="col-sm-12 p0">
        <div className="col-sm-2 col-md-3 p0 sm_display_none">
            <div id="wrapper">

               
                <div id="sidebar-wrapper">
                    <ul className="sidebar-nav" style={{marginLeft:"0"}}>
                        <li className="sidebar-brand">
                            <span style={{marginLeft:"10px"}} className="navi_hdg"> Navigation</span>
                             
                            <a className="menu_toggle_mrg" id="menu-toggle" style={{float:'right', cursor:'pointer'}} onClick={this.toggleSidebar}  >
                            <svg className="svg-inline--fa fa-bars fa-w-14" style={{fontSize:'20px'}} aria-hidden="true" data-prefix="fa" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path></svg>
            </a>

                        </li>

                        <li className={this.state.View === 'Home' ? 'sidebar_active' : ''}>
                            <a  href={null}  onClick={this.handleView('Home','List')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 759 13.333 11.333">
                                    <path id="ic_home_24px" className="cls-1" d="M7.333,14.333v-4H10v4h3.333V9h2L8.667,3,2,9H4v5.333Z" transform="translate(-5380 756)"></path>
                                </svg>
                                <span style={{marginLeft:"10px"}}> Home </span>
                            </a>
                        </li>
                        <li className={this.state.View === 'TimeCard' ? 'sidebar_active' : ''}>
                            <a href={null}  onClick={this.handleView('TimeCard','List')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 806 13.333 10.909">
                                    <defs>
                                    </defs>
                                    <path id="ic_picture_in_picture_alt_24px" className="cls-1" d="M11.909,7.848H7.061v3.636h4.848ZM14.333,12.7V4.2A1.205,1.205,0,0,0,13.121,3H2.212A1.205,1.205,0,0,0,1,4.2v8.5a1.216,1.216,0,0,0,1.212,1.212H13.121A1.216,1.216,0,0,0,14.333,12.7Zm-1.212.012H2.212V4.194H13.121Z" transform="translate(-5379 803)"></path>
                                </svg>
                                <span style={{marginLeft:"10px"}}> TimeCard</span> </a>
                        </li>
                        <li className={this.state.View === 'Company' ? 'sidebar_active' : ''}>
                            <a href={null}  onClick={this.handleView('Company','List')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 850 13.333 14.074">
                                    <defs>
                                    </defs>
                                    <path id="ic_location_city_24px" className="cls-1" d="M11.889,8.667V4.222L9.667,2,7.444,4.222V5.7H3v10.37H16.333V8.667ZM5.963,14.593H4.481V13.111H5.963Zm0-2.963H4.481V10.148H5.963Zm0-2.963H4.481V7.185H5.963Zm4.444,5.926H8.926V13.111h1.481Zm0-2.963H8.926V10.148h1.481Zm0-2.963H8.926V7.185h1.481Zm0-2.963H8.926V4.222h1.481Zm4.444,8.889H13.37V13.111h1.481Zm0-2.963H13.37V10.148h1.481Z" transform="translate(-5381 848)"></path>
                                </svg> <span style={{marginLeft:"10px"}}> Company</span> </a>
                        </li>
                        <li className={this.state.View === 'Document' ? 'sidebar_active' : ''}>
                            <a href={null}  onClick={this.handleView('Document','List')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5377.333 896 12 15">
                                    <defs>
                                    </defs>
                                    <path id="ic_description_24px" className="cls-1" d="M11.5,2h-6A1.5,1.5,0,0,0,4.008,3.5L4,15.5A1.5,1.5,0,0,0,5.492,17H14.5A1.5,1.5,0,0,0,16,15.5v-9ZM13,14H7V12.5h6Zm0-3H7V9.5h6ZM10.75,7.25V3.125L14.875,7.25Z" transform="translate(-5381.333 894)"></path>
                                </svg> <span style={{marginLeft:"10px"}}>Document </span> </a>
                        </li>
                        <li className={this.state.View === 'Setting' ? 'sidebar_active' : ''}>
                            <a href={null}  onClick={this.handleView('Setting','List')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 945 13.333 13.707">
                                    <defs>
                                    </defs>
                                    <path id="ic_settings_24px" className="cls-1" d="M14.031,9.525a4.726,4.726,0,0,0,0-1.343l1.446-1.131a.346.346,0,0,0,.082-.439L14.189,4.241a.344.344,0,0,0-.418-.151l-1.707.685A5.007,5.007,0,0,0,10.906,4.1l-.26-1.816A.334.334,0,0,0,10.31,2H7.568a.334.334,0,0,0-.336.288L6.972,4.1a5.266,5.266,0,0,0-1.158.672L4.107,4.09a.334.334,0,0,0-.418.151L2.318,6.613a.338.338,0,0,0,.082.439L3.847,8.182a5.435,5.435,0,0,0-.048.672,5.435,5.435,0,0,0,.048.672L2.4,10.656a.346.346,0,0,0-.082.439l1.371,2.371a.344.344,0,0,0,.418.151l1.707-.685a5.007,5.007,0,0,0,1.158.672l.26,1.816a.334.334,0,0,0,.336.288H10.31a.334.334,0,0,0,.336-.288l.26-1.816a5.266,5.266,0,0,0,1.158-.672l1.707.685a.334.334,0,0,0,.418-.151l1.371-2.371a.346.346,0,0,0-.082-.439ZM8.939,11.252a2.4,2.4,0,1,1,2.4-2.4A2.4,2.4,0,0,1,8.939,11.252Z" transform="translate(-5380.271 943)"></path>
                                </svg> <span style={{marginLeft:"10px"}}> Setting</span> </a>
                        </li>
                        <li className={this.state.View === 'SignatureSettings' ? 'sidebar_active' : ''}>
                            <a href={null}  onClick={this.handleView('SignatureSettings','List')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4935 7662 20 20">
                                    <defs>
                                    </defs>
                                    <path id="ic_mode_edit_24px" className="cls-1" d="M3,18.831V23H7.166L19.453,10.71,15.287,6.544ZM22.675,7.489a1.106,1.106,0,0,0,0-1.566l-2.6-2.6a1.106,1.106,0,0,0-1.566,0L16.476,5.356l4.166,4.166Z" transform="translate(-4938 7659.002)"></path>
                                </svg> <span style={{marginLeft:"10px"}}> Signature Setting</span> </a>
                        </li>
                        <li className={this.state.View === 'Help' ? 'sidebar_active' : ''}>
                            <a  href={null}  onClick={this.handleView('Help','List')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10829 7335 20 20">
                                    <defs>
                                    </defs>
                                    <path id="ic_info_outline_24px" className="cls-1" d="M11,17h2V11H11ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.011,8.011,0,0,1,12,20ZM11,9h2V7H11Z" transform="translate(-10831 7333)"></path>
                                </svg> <span style={{marginLeft:"10px"}}> Help</span> </a>
                        </li>
                        <li>
                            <a href={null} onClick={this.handleLogout}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5377.499 1091.267 13.573 11.709">
                                    <defs>
                                    </defs>
                                    <path id="ic_keyboard_tab_24px" className="cls-1" d="M6.717,1.284l2.253,3.4-9,.078-.011,1.9,9-.078-2.3,3.439.894,1.335L11.4,5.614,7.62-.066ZM12.065-.105,12,11.322l1.27-.011L13.335-.116Z" transform="matrix(-1, 0.017, -0.017, -1, -5363.967, 1102.627)"></path>
                                </svg>
                                <span style={{marginLeft:"10px"}}> Logout</span> </a>
                        </li>
                    </ul>
                </div>

            </div>

            <div className="clearfix"></div>

        </div>

        
            
            {this.state.View === 'Home' ? <Home handleView={this.handleView} /> : ""}
            {this.state.View === 'TimeCard' ? <TimeCard main={this.state} handleView={this.handleView} /> : ""}
            {this.state.View === 'Company' ? <Company handleView={this.handleView} /> : ""}
            {this.state.View === 'Document' ? <Document handleView={this.handleView} /> : ""}
            {this.state.View === 'Setting' ? <Setting handleView={this.handleView} /> : ""}
            {this.state.View === 'SignatureSettings' ? <SignatureSettings handleView={this.handleView} /> : ""}
            {this.state.View === 'Help' ? <Help handleView={this.handleView} /> : ""}


        <div className="clear40"></div>

        <div className="clearfix"></div>

    </div>

<style dangerouslySetInnerHTML={{__html: `
      .login_bg { background: none }
    `}} />


{/* mobile menue Start. */} 
<div>
{this.state.View === 'Help' ? '' :
    <ul id="responsive_menu">
        <li className={this.state.View === 'Home' ? 'responsive_menu_active' : ''}>
            <a href={null}  onClick={this.handleView('Home','List')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 759 13.333 11.333">
                    <path id="ic_home_24px" className="cls-1" d="M7.333,14.333v-4H10v4h3.333V9h2L8.667,3,2,9H4v5.333Z" transform="translate(-5380 756)" />
                </svg>
                <span> Home </span>
            </a>
        </li>
        <li className={this.state.View === 'TimeCard' ? 'responsive_menu_active' : ''}>
            <a  href={null}  onClick={this.handleView('TimeCard','List')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 806 13.333 10.909">
                    <defs></defs>
                    <path id="ic_picture_in_picture_alt_24px" className="cls-1" d="M11.909,7.848H7.061v3.636h4.848ZM14.333,12.7V4.2A1.205,1.205,0,0,0,13.121,3H2.212A1.205,1.205,0,0,0,1,4.2v8.5a1.216,1.216,0,0,0,1.212,1.212H13.121A1.216,1.216,0,0,0,14.333,12.7Zm-1.212.012H2.212V4.194H13.121Z" transform="translate(-5379 803)" />
                </svg>
                <span> TimeCard</span>
            </a>
        </li>
        <li className={this.state.View === 'Company' ? 'responsive_menu_active' : ''}>
            <a href={null}  onClick={this.handleView('Company','List')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 850 13.333 14.074">
                    <defs></defs>
                    <path id="ic_location_city_24px" className="cls-1" d="M11.889,8.667V4.222L9.667,2,7.444,4.222V5.7H3v10.37H16.333V8.667ZM5.963,14.593H4.481V13.111H5.963Zm0-2.963H4.481V10.148H5.963Zm0-2.963H4.481V7.185H5.963Zm4.444,5.926H8.926V13.111h1.481Zm0-2.963H8.926V10.148h1.481Zm0-2.963H8.926V7.185h1.481Zm0-2.963H8.926V4.222h1.481Zm4.444,8.889H13.37V13.111h1.481Zm0-2.963H13.37V10.148h1.481Z" transform="translate(-5381 848)" />
                </svg>
                <span> Company</span>
            </a>
        </li>
        <li  className={this.state.View === 'Document' ? 'responsive_menu_active' : ''}>
            <a href={null}  onClick={this.handleView('Document','List')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5377.333 896 12 15">
                    <defs></defs>
                    <path id="ic_description_24px" className="cls-1" d="M11.5,2h-6A1.5,1.5,0,0,0,4.008,3.5L4,15.5A1.5,1.5,0,0,0,5.492,17H14.5A1.5,1.5,0,0,0,16,15.5v-9ZM13,14H7V12.5h6Zm0-3H7V9.5h6ZM10.75,7.25V3.125L14.875,7.25Z" transform="translate(-5381.333 894)" />
                </svg> <span>Document </span>
            </a>
        </li>
        <li className=" dropup">
            <div className="dropup" style={{ left: "-2px", bottom: "38px"}}>
                <div className="dropup-content">
                    <a href={null} onClick={this.handleView('Setting','List')} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 945 13.333 13.707">
                            <defs></defs>
                            <path id="ic_settings_24px" className="cls-1" d="M14.031,9.525a4.726,4.726,0,0,0,0-1.343l1.446-1.131a.346.346,0,0,0,.082-.439L14.189,4.241a.344.344,0,0,0-.418-.151l-1.707.685A5.007,5.007,0,0,0,10.906,4.1l-.26-1.816A.334.334,0,0,0,10.31,2H7.568a.334.334,0,0,0-.336.288L6.972,4.1a5.266,5.266,0,0,0-1.158.672L4.107,4.09a.334.334,0,0,0-.418.151L2.318,6.613a.338.338,0,0,0,.082.439L3.847,8.182a5.435,5.435,0,0,0-.048.672,5.435,5.435,0,0,0,.048.672L2.4,10.656a.346.346,0,0,0-.082.439l1.371,2.371a.344.344,0,0,0,.418.151l1.707-.685a5.007,5.007,0,0,0,1.158.672l.26,1.816a.334.334,0,0,0,.336.288H10.31a.334.334,0,0,0,.336-.288l.26-1.816a5.266,5.266,0,0,0,1.158-.672l1.707.685a.334.334,0,0,0,.418-.151l1.371-2.371a.346.346,0,0,0-.082-.439ZM8.939,11.252a2.4,2.4,0,1,1,2.4-2.4A2.4,2.4,0,0,1,8.939,11.252Z" transform="translate(-5380.271 943)" />
                        </svg>
                        <span> Setting</span>
                    </a>
                    
                    <a href={null}  onClick={this.handleView('SignatureSettings','List')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4935 7662 20 20">
                            <defs></defs>
                            <path id="ic_mode_edit_24px" className="cls-1" d="M3,18.831V23H7.166L19.453,10.71,15.287,6.544ZM22.675,7.489a1.106,1.106,0,0,0,0-1.566l-2.6-2.6a1.106,1.106,0,0,0-1.566,0L16.476,5.356l4.166,4.166Z" transform="translate(-4938 7659.002)" />
                        </svg>
                        <span> Signature Setting</span>
                    </a>
                                
                    <a href={null}  onClick={this.handleView('Help','List')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10829 7335 20 20">
                            <defs></defs>
                            <path id="ic_info_outline_24px" className="cls-1" d="M11,17h2V11H11ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.011,8.011,0,0,1,12,20ZM11,9h2V7H11Z" transform="translate(-10831 7333)" />
                        </svg>
                        <span> Help</span>
                    </a>
                       
                    <a href={null} onClick={this.handleLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5377.499 1091.267 13.573 11.709">
                            <defs></defs>
                            <path id="ic_keyboard_tab_24px" className="cls-1" d="M6.717,1.284l2.253,3.4-9,.078-.011,1.9,9-.078-2.3,3.439.894,1.335L11.4,5.614,7.62-.066ZM12.065-.105,12,11.322l1.27-.011L13.335-.116Z" transform="matrix(-1, 0.017, -0.017, -1, -5363.967, 1102.627)" />
                        </svg>
                        <span> Logout</span>
                    </a>
                       
                </div>
            </div>
            <a href={null} className={this.state.View === 'Setting' || this.state.View === 'SignatureSettings' || this.state.View === 'Help' ? 'dropbtn responsive_menu_active' : 'dropbtn'}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 945 13.333 13.707">
                    <defs></defs>
                    <path id="ic_settings_24px" className="cls-1" d="M14.031,9.525a4.726,4.726,0,0,0,0-1.343l1.446-1.131a.346.346,0,0,0,.082-.439L14.189,4.241a.344.344,0,0,0-.418-.151l-1.707.685A5.007,5.007,0,0,0,10.906,4.1l-.26-1.816A.334.334,0,0,0,10.31,2H7.568a.334.334,0,0,0-.336.288L6.972,4.1a5.266,5.266,0,0,0-1.158.672L4.107,4.09a.334.334,0,0,0-.418.151L2.318,6.613a.338.338,0,0,0,.082.439L3.847,8.182a5.435,5.435,0,0,0-.048.672,5.435,5.435,0,0,0,.048.672L2.4,10.656a.346.346,0,0,0-.082.439l1.371,2.371a.344.344,0,0,0,.418.151l1.707-.685a5.007,5.007,0,0,0,1.158.672l.26,1.816a.334.334,0,0,0,.336.288H10.31a.334.334,0,0,0,.336-.288l.26-1.816a5.266,5.266,0,0,0,1.158-.672l1.707.685a.334.334,0,0,0,.418-.151l1.371-2.371a.346.346,0,0,0-.082-.439ZM8.939,11.252a2.4,2.4,0,1,1,2.4-2.4A2.4,2.4,0,0,1,8.939,11.252Z" transform="translate(-5380.271 943)" />
                </svg>
                <span> Setting</span>
            </a>
        </li>
    </ul>
}
</div> {/* mobile menue end. */}
</div>
		);
	}
}