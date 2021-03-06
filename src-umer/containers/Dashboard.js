import React , { Component } from "react";
import { Auth } from "aws-amplify";
import "./NotFound.css";

export default class Dashboard extends Component {
	
	constructor(props)
	{
		super();
		Auth.currentSession().then(function(session)
		{
			console.log(JSON.stringify(session))
		}, function(err)
		{
			window.location.href = "/" ; 
		})
	}
	
	handleLogout = async event => {
	  await Auth.signOut();

	  //this.userHasAuthenticated(false);
	  this.props.history.push("/");
	}

	render()
	{
		return (
			<div>
			<div className="col-sm-12 dashboard_main_shadow">
				<div className="col-sm-3 p0">
					<a href="/dashboard">
						<img src='images/dashboardlogo.svg' alt="Freelance Portal Logo"/>
					</a>
				</div>
				<div className="clearfix"></div>
			</div>
			<div className="clearfix"></div>
			<div className="col-sm-12 p0">
        <div className="col-sm-2 col-md-3 p0 sm_display_none">
            <div id="wrapper">

               
                <div id="sidebar-wrapper">
                    <ul className="sidebar-nav" style={{marginLeft:"0"}}>
                        <li className="sidebar-brand">
                            <span style={{marginLeft:"10px"}} className="navi_hdg"> Navigation</span>
                            <a href="#menu-toggle" className="menu_toggle_mrg" id="menu-toggle" style={{marginTop:'20px',float:'right'}}>  
							<svg className="svg-inline--fa fa-bars fa-w-14" style={{fontSize:'20px'}} aria-hidden="true" data-prefix="fa" data-icon="bars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg=""><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path></svg>
			</a>

                        </li>

                        <li className="sidebar_active">
                            <a href="dashboard.html">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 759 13.333 11.333">
                                    <path id="ic_home_24px" className="cls-1" d="M7.333,14.333v-4H10v4h3.333V9h2L8.667,3,2,9H4v5.333Z" transform="translate(-5380 756)"></path>
                                </svg>
                                <span style={{marginLeft:"10px"}}> Home </span>
                            </a>
                        </li>
                        <li>
                            <a href="timecard.html">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 806 13.333 10.909">
                                    <defs>
                                    </defs>
                                    <path id="ic_picture_in_picture_alt_24px" className="cls-1" d="M11.909,7.848H7.061v3.636h4.848ZM14.333,12.7V4.2A1.205,1.205,0,0,0,13.121,3H2.212A1.205,1.205,0,0,0,1,4.2v8.5a1.216,1.216,0,0,0,1.212,1.212H13.121A1.216,1.216,0,0,0,14.333,12.7Zm-1.212.012H2.212V4.194H13.121Z" transform="translate(-5379 803)"></path>
                                </svg>
                                <span style={{marginLeft:"10px"}}> TimeCard</span> </a>
                        </li>
                        <li>
                            <a href="company.html">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 850 13.333 14.074">
                                    <defs>
                                    </defs>
                                    <path id="ic_location_city_24px" className="cls-1" d="M11.889,8.667V4.222L9.667,2,7.444,4.222V5.7H3v10.37H16.333V8.667ZM5.963,14.593H4.481V13.111H5.963Zm0-2.963H4.481V10.148H5.963Zm0-2.963H4.481V7.185H5.963Zm4.444,5.926H8.926V13.111h1.481Zm0-2.963H8.926V10.148h1.481Zm0-2.963H8.926V7.185h1.481Zm0-2.963H8.926V4.222h1.481Zm4.444,8.889H13.37V13.111h1.481Zm0-2.963H13.37V10.148h1.481Z" transform="translate(-5381 848)"></path>
                                </svg> <span style={{marginLeft:"10px"}}> Company</span> </a>
                        </li>
                        <li>
                            <a href="document.html">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5377.333 896 12 15">
                                    <defs>
                                    </defs>
                                    <path id="ic_description_24px" className="cls-1" d="M11.5,2h-6A1.5,1.5,0,0,0,4.008,3.5L4,15.5A1.5,1.5,0,0,0,5.492,17H14.5A1.5,1.5,0,0,0,16,15.5v-9ZM13,14H7V12.5h6Zm0-3H7V9.5h6ZM10.75,7.25V3.125L14.875,7.25Z" transform="translate(-5381.333 894)"></path>
                                </svg> <span style={{marginLeft:"10px"}}>Document </span> </a>
                        </li>
                        <li>
                            <a href="setting.html">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5378 945 13.333 13.707">
                                    <defs>
                                    </defs>
                                    <path id="ic_settings_24px" className="cls-1" d="M14.031,9.525a4.726,4.726,0,0,0,0-1.343l1.446-1.131a.346.346,0,0,0,.082-.439L14.189,4.241a.344.344,0,0,0-.418-.151l-1.707.685A5.007,5.007,0,0,0,10.906,4.1l-.26-1.816A.334.334,0,0,0,10.31,2H7.568a.334.334,0,0,0-.336.288L6.972,4.1a5.266,5.266,0,0,0-1.158.672L4.107,4.09a.334.334,0,0,0-.418.151L2.318,6.613a.338.338,0,0,0,.082.439L3.847,8.182a5.435,5.435,0,0,0-.048.672,5.435,5.435,0,0,0,.048.672L2.4,10.656a.346.346,0,0,0-.082.439l1.371,2.371a.344.344,0,0,0,.418.151l1.707-.685a5.007,5.007,0,0,0,1.158.672l.26,1.816a.334.334,0,0,0,.336.288H10.31a.334.334,0,0,0,.336-.288l.26-1.816a5.266,5.266,0,0,0,1.158-.672l1.707.685a.334.334,0,0,0,.418-.151l1.371-2.371a.346.346,0,0,0-.082-.439ZM8.939,11.252a2.4,2.4,0,1,1,2.4-2.4A2.4,2.4,0,0,1,8.939,11.252Z" transform="translate(-5380.271 943)"></path>
                                </svg> <span style={{marginLeft:"10px"}}> Setting</span> </a>
                        </li>
                        <li>
                            <a href="sign_setting.html">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4935 7662 20 20">
                                    <defs>
                                    </defs>
                                    <path id="ic_mode_edit_24px" className="cls-1" d="M3,18.831V23H7.166L19.453,10.71,15.287,6.544ZM22.675,7.489a1.106,1.106,0,0,0,0-1.566l-2.6-2.6a1.106,1.106,0,0,0-1.566,0L16.476,5.356l4.166,4.166Z" transform="translate(-4938 7659.002)"></path>
                                </svg> <span style={{marginLeft:"10px"}}> Signature Setting</span> </a>
                        </li>
                        <li>
                            <a href="help.html">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10829 7335 20 20">
                                    <defs>
                                    </defs>
                                    <path id="ic_info_outline_24px" className="cls-1" d="M11,17h2V11H11ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.011,8.011,0,0,1,12,20ZM11,9h2V7H11Z" transform="translate(-10831 7333)"></path>
                                </svg> <span style={{marginLeft:"10px"}}> Help</span> </a>
                        </li>
                        <li>
                            <a href="javascript:void" onClick={this.handleLogout}>
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

        <div className="col-xs-12  col-sm-9 col-md-9 pull-right mrg_dashboard_right">
            <div className="dahboard_hdg">Dashboard</div>
            <div className="clearfix"></div>

            <div className="col-sm-12 col-md-9">

                <div className="clear20 sm_display_none"></div>
                <div className="col-sm-12 col-md-9 p0">
                    <div className="welcome_box">
                        <div className="col-xs-4 col-sm-4 p0">
                            <div className="col-sm-12 p0 text-center"> <img src="images/profile_pic.png" className="profile_img" alt=""/></div>
                            <div className="clear20"></div>
                            <a href="#" className="btn_edit_profile" data-toggle="modal" data-target="#exampleModalCenter">Edit Profile</a>

                        </div>

                        <div className="col-xs-8 col-sm-8 p0 label_weclome_admin">

                            <h2> Welcome, SHINE ASMIN</h2> Last Login: February 26, 2018

                        </div>
                        <div className="clearfix"></div>
                    </div>

                </div>

                <div className="col-sm-12 col-md-3 p0_sm_Res">

                    <div className="timecard_box">

                        <img src="images/home/ic_receipt_24px.svg" width="43" height="48" alt=""/>
                        <div className="clear10"></div>
                        Insert TimeCard

                    </div>

                </div>
                <div className="clear20"></div>

                <div className="col-sm-12 p0">
                    <div className="news_heading_bg">News Feed</div>

                    <div className="news_feedbox">

                       
                        <div className="controls hidden-xs col-sm-12">
                            <a className="left news_feed_arrow1" href="#carousel-example" data-slide="prev"><img src="images/home/ic_chevron_left_24px.svg" width="15" height="23" alt=""/></a>
                            <a className="right news_feed_arrow2" href="#carousel-example" data-slide="next">
                                <img src="images/home/ic_chevron_right_24px.svg" width="15" height="23" alt=""/>
                            </a>

                            <div id="carousel-example" className="carousel slide hidden-xs" data-ride="carousel">
                               
                                <div className="carousel-inner">
                                    <div className="item active">

                                        <div className="col-sm-6 col-md-4 news_feed_carsoul">
                                            <div className="col-item">
                                                <div className="photo">
                                                    <img src="images/news_pic1.jpg" className="img-responsive" alt="a"/>
                                                </div>

                                                <h2> Test industry 1 News </h2>
                                                <div className="clearfix"></div>
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply
                                                </p>

                                                <div className="clearfix"></div>

                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 news_feed_carsoul">
                                            <div className="col-item">
                                                <div className="photo">
                                                    <img src="images/news_pic2.jpg" className="img-responsive" alt="a"/>
                                                </div>

                                                <h2> Test industry 1 News </h2>
                                                <div className="clearfix"></div>
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply
                                                </p>

                                                <div className="clearfix"></div>

                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 news_feed_carsoul slider_diplay_none">
                                            <div className="col-item">
                                                <div className="photo">
                                                    <img src="images/news_pic3.jpg" className="img-responsive" alt="a"/>
                                                </div>

                                                <h2> Test industry 1 News </h2>
                                                <div className="clearfix"></div>
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply
                                                </p>

                                                <div className="clearfix"></div>

                                            </div>
                                        </div>

                                    </div>
                                    <div className="item">

                                        <div className="col-sm-6 col-md-4 news_feed_carsoul">
                                            <div className="col-item">
                                                <div className="photo">
                                                    <img src="images/news_pic1.jpg" className="img-responsive" alt="a"/>
                                                </div>

                                                <h2> Test industry 1 News </h2>
                                                <div className="clearfix"></div>
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply
                                                </p>

                                                <div className="clearfix"></div>

                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 news_feed_carsoul">
                                            <div className="col-item">
                                                <div className="photo">
                                                    <img src="images/news_pic2.jpg" className="img-responsive" alt="a"/>
                                                </div>

                                                <h2> Test industry 1 News </h2>
                                                <div className="clearfix"></div>
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply
                                                </p>

                                                <div className="clearfix"></div>

                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4 news_feed_carsoul slider_diplay_none">
                                            <div className="col-item">
                                                <div className="photo">
                                                    <img src="images/news_pic3.jpg" className="img-responsive" alt="a"/>
                                                </div>

                                                <h2> Test industry 1 News </h2>
                                                <div className="clearfix"></div>
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply
                                                </p>

                                                <div className="clearfix"></div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="controls full_hidden_slider_feed col-sm-12">
                        
                 <a className="left news_feed_arrow1" href="#carousel-example" data-slide="prev"><img src="images/home/ic_chevron_left_24px.svg" width="15" height="23" alt=""/></a>
                            <a className="right news_feed_arrow2" href="#carousel-example" data-slide="next">
                                <img src="images/home/ic_chevron_right_24px.svg" width="15" height="23" alt=""/>
                            </a>

                            <div id="carousel-example" className="carousel slide" data-ride="carousel">
                               
                                <div className="carousel-inner">
                                    <div className="item">

                                        <div className="col-xs-12 news_feed_carsoul">
                                            <div className="col-item">
                                                <div className="photo">
                                                    <img src="images/news_pic1.jpg" className="img-responsive" alt="a"/>
                                                </div>

                                                <h2> Test industry 1 News </h2>
                                                <div className="clearfix"></div>
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply
                                                </p>

                                                <div className="clearfix"></div>

                                            </div>
                                        </div>
                                        
                                            </div>
                                    <div className="item">
                                        
                                        <div className="col-xs-12 news_feed_carsoul">
                                            <div className="col-item">
                                                <div className="photo">
                                                    <img src="images/news_pic2.jpg" className="img-responsive" alt="a"/>
                                                </div>

                                                <h2> Test industry 1 News </h2>
                                                <div className="clearfix"></div>
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply
                                                </p>

                                                <div className="clearfix"></div>

                                            </div>
                                        </div>
                                        
                                         </div>
                                           <div className="item active">
                                        <div className="ccol-xs-12 news_feed_carsoul">
                                            <div className="col-item">
                                                <div className="photo">
                                                    <img src="images/news_pic3.jpg" className="img-responsive" alt="a"/>
                                                </div>

                                                <h2> Test industry 1 News </h2>
                                                <div className="clearfix"></div>
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply
                                                </p>

                                                <div className="clearfix"></div>

                                            </div>
                                        </div>

                                  </div>

                                        
                                        
                                        

                                   
                                </div>
                            </div>
                        </div>
                        

                        <div className="clearfix"></div>

                    </div>

                </div>
            </div>

            <div className="col-sm-12 col-md-offset-0 col-md-3 p0 recent_label">
            
            <div className="activity_feed_sm">

                <h2 className="recent_h2">Activity Feed</h2>
                <div className="activity-feed">
                    <div className="feed-item">
                        <div className="date">May 21, 2016</div>
                        <div className="text">
                            EDIT EXISTING PAGE
                            <br/> Production 1 TimeCard has been edit

                        </div>
                    </div>
                    <div className="feed-item">
                        <div className="date">May 21, 2016</div>
                        <div className="text">
                            EDIT EXISTING PAGE
                            <br/> Production 1 TimeCard has been edit

                        </div>
                    </div>
                    <div className="feed-item">
                        <div className="date">May 21, 2016</div>
                        <div className="text">
                            EDIT EXISTING PAGE
                            <br/> Production 1 TimeCard has been edit

                        </div>
                    </div>
                    <div className="feed-item">
                        <div className="date">May 21, 2016</div>
                        <div className="text">
                            EDIT EXISTING PAGE
                            <br/> Production 1 TimeCard has been edit

                        </div>
                    </div>
                    <div className="feed-item">
                        <div className="date">May 21, 2016</div>
                        <div className="text">
                            EDIT EXISTING PAGE
                            <br/> Production 1 TimeCard has been edit

                        </div>
                    </div>
                    <div className="feed-item">
                        <div className="date">May 21, 2016</div>
                        <div className="text">
                            EDIT EXISTING PAGE
                            <br/> Production 1 TimeCard has been edit

                        </div>
                    </div>
                </div>

            </div>

        </div> </div>

        <div className="clear40"></div>

        <div className="clearfix"></div>

    </div>
		<div className="clear40"></div>
		<div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{display: "none"}}>
  <div className="modal-dialog modal-dialog-centered modla_edit_profile" role="document">
    <div className="modal-content">
      <div className="modal-header modal_header_register">
       
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="modal-body register_suc register_popup">
      
      <div className="user_edting_hd">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="1585 5909 17.515 18.002">
  <path id="ic_create_24px" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1582 5906.002)"></path>
</svg>
      
      User Setting
      </div>
      
       <div className="clear20"></div>
       <div className="col-sm-4 p0">
       <div className="user_setting_box">
                            <div className="col-sm-12 p0 text-center"> <img src="images/profile_pic.png" className="profile_img" alt=""/></div>
                            <div className="clear20"></div>
                            <button type="button" href="#" className="btn_changephoto">
                            
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-9284 -445 18 16.2">

  <g id="ic_photo_camera_24px" transform="translate(-9286 -447)">
    <path id="Path_97" data-name="Path 97" className="cls-1" d="M2.88,0A2.88,2.88,0,1,1,0,2.88,2.88,2.88,0,0,1,2.88,0Z" transform="translate(8.12 8.12)"></path>
    <path id="Path_92" data-name="Path 92" className="cls-1" d="M8.3,2,6.653,3.8H3.8A1.805,1.805,0,0,0,2,5.6V16.4a1.805,1.805,0,0,0,1.8,1.8H18.2A1.805,1.805,0,0,0,20,16.4V5.6a1.805,1.805,0,0,0-1.8-1.8H15.347L13.7,2ZM11,15.5A4.5,4.5,0,1,1,15.5,11,4.5,4.5,0,0,1,11,15.5Z"></path>
  </g>
</svg><span>Change photo</span>
                           </button>
          
                               
                               
                               
                               
                           
                           
                           
                           

       </div>
       
         <div className="clear40"></div>
       <div className="btn_cance_save">
       <input name="" type="button" className="btn_save_pro" value="Save"/>
       <input name="" type="button" className="btn_cancel_pro" value="Cancel"/>
       </div>
          </div>
       
       
       
       
       
       
       <div className="col-sm-8 profile_setting_pop">
      
                         <form className="form-horizontal" >
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="First Name">First Name</label>
    <div className="col-sm-8">
      <input type="First Name" className="form-control pro_input_pop" id="First Name" placeholder="Jessie"/>
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Last Name">Last Name</label>
    <div className="col-sm-8">
      <input type="Last Name" className="form-control pro_input_pop" id="Last Name" placeholder="He"/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Email">Email</label>
    <div className="col-sm-8">
      <input type="Email" className="form-control pro_input_pop" id="Email" placeholder="example@gmail.com"/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Mobile</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="123456789"/>
    </div>
  </div>
  
  
  
  <div className="clear20"></div>

<div className="col-sm-8">
         <button type="button" href="#" className="btn_change_pass_pro">
                            
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-9022 -414 13 17.063">
  <path id="ic_lock_24px" className="cls-1" d="M15.375,6.688h-.812V5.063a4.063,4.063,0,0,0-8.125,0V6.688H5.625A1.63,1.63,0,0,0,4,8.313v8.125a1.63,1.63,0,0,0,1.625,1.625h9.75A1.63,1.63,0,0,0,17,16.438V8.313A1.63,1.63,0,0,0,15.375,6.688ZM10.5,14a1.625,1.625,0,1,1,1.625-1.625A1.63,1.63,0,0,1,10.5,14Zm2.519-7.312H7.981V5.063a2.519,2.519,0,0,1,5.038,0Z" transform="translate(-9026 -415)"></path>
</svg>
                           <span>Change Password</span></button>
      </div>
 

</form> 


<div className="btn_cance_save2">
       <input name="" type="button" className="btn_save_pro" value="Save"/>
       <input name="" type="button" className="btn_cancel_pro" value="Cancel"/>
       </div>
         </div>
       
       
       
       
      
    
    
      
    

<div className="clear10"></div>

       
      </div>
      
    </div>
  </div>
</div>
</div>
			//main end 
		);
	}
}