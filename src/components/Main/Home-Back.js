import React , { Component } from "react";
import { Auth, API, Storage} from "aws-amplify";
import $ from 'jquery';
import LoaderButton from "../../components/LoaderButton";

export default class Dashboard extends Component {

    constructor(props)
    {
        super();
        this.file = null;
        this.state = {
          activitylog:[],
          isLoading: false,
          username: "",
          pinCode: "",
          password: "",
          confirmPassword: "",
          errormessage:"",
          codeSent: false,
          codeValid: false,

          SuccessModalText: "You have changed password successfully",  
          UserData: false,  
          SignatureImage: "",
          FirstName: "",
          LastName: "",
          EmailAddress: "",
          MobileNumber: "",
        };
    }

    async componentDidMount() {

        try {
           const user = await this.getUser();
           if(user.status){
                this.setState({ 
                    UserData: user.result,
                    FirstName: user.result.FirstName,
                    LastName: user.result.LastName,
                    EmailAddress: user.result.EmailAddress,
                    MobileNumber: user.result.MobileNumber
                });
           }
        } catch (e) {
            alert(e);
        }

        try {
           const log = await this.activitylog();
           if(log.status){
            console.log(log.items);
                this.setState({ activitylog: log.items });
           }
        } catch (e) {
            alert(e);
        }
        //this.showModal();
        //this.setState({SuccessModalText: "Oooops"}, this.showModal);
    }

    async showModal() {

        $('#successModalBtn').click();
    }

    handleChange = event => {

        const name = event.target.name;
        const value = event.target.value;
        this.setState({[name]: value});
    }

    handleUpdate = async event => {

        try {

            const response = await this.updateUser({
                "Update": "UserInfo",
                "FirstName": this.state.FirstName,
                "LastName": this.state.LastName,
                "EmailAddress": this.state.EmailAddress,
                "MobileNumber": this.state.MobileNumber,
            });

            if(response.status){
                $('#profileModalClose').click();
                //this.setState({ SignatureTyped: this.state.SignatureText, SignatureInput: "none" });
                this.setState({SuccessModalText: "Successfully Updated"}, this.showModal);
            }
        } catch (e) {
            alert(e);
        }
    }

    handleCancel = event => {

        this.setState({ 
            FirstName: this.state.UserData.FirstName,
            LastName: this.state.UserData.LastName,
            EmailAddress: this.state.UserData.EmailAddress,
            MobileNumber: this.state.UserData.MobileNumber 
        });
    }

    getUser() {
        return API.get("users", `/users/${"HGJGJGJUYGJUGSJY"}`);
    }

    activitylog() {
        return API.get("activitylog", "/activitylog");
    }

    updateUser(note) {
      return API.put("users", `/users/${"HGJGJGJUYGJUGSJY"}`, {

        "body": note
 
      });
    }

    validateForgotForm() {
      return this.state.username.length > 0;
    }

    validateResetPasswordForm() {
        return this.state.password.length > 0 &&
        this.state.password === this.state.confirmPassword
    }

    validateCodeForm() {
        return this.state.pinCode.length > 0;
    }

    handleForgotForm = async event => {
        event.preventDefault();
        this.setState({ isLoading: true });
        try
        {
            await Auth.forgotPassword(this.state.username);
            //alert('Code sent succsessfully. Please check your cell phone for SMS.');
            this.setState({ isLoading: false, codeSent: true, errormessage:""});
            $('#changePasswordModalClose').click();
            $('#changePasswordPinCodeModalBtn').click();
        }
        catch (e)
        {
            alert(e.message);
            this.setState({ isLoading: false , errormessage:e.message});
        }
    }

    handleResendCode = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
          await Auth.forgotPassword(this.state.username);
          //alert('resend succsessfully.');
          this.setState({ isLoading: false, codeSent: true, errormessage:""});
        } catch (e) {
            
          this.setState({ isLoading: false , errormessage:e.message});
        }
    }

    handlePinCodeForm = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
          //await Auth.forgotPassword(this.state.mobile);
          //alert('code is valid.');
          this.setState({ isLoading: false, codeSent: true, codeValid: true, errormessage:""});
          $('#changePasswordPinCodeModalClose').click();
          $('#changePasswordFieldsCodeModalBtn').click();
        } catch (e) {
          alert(e.message);
          this.setState({ isLoading: false , errormessage:e.message});
        }

    }

    handleResetPasswordForm = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });
        try {
          await Auth.forgotPasswordSubmit(this.state.username, this.state.pinCode, this.state.password);
          //alert('Password reset succsessfully.');
          $('#changePasswordFieldsCodeModalClose').click();
          this.setState({SuccessModalText: "You have changed password successfully"}, this.showModal);
          //this.handleShow();
          //this.setState({ isLoading: false, codeSent: false, codeValid: false, errormessage:""});
          //this.props.history.push("/login");
        } catch (e)
        {
          alert(e.message);
          this.setState({ isLoading: false , errormessage:e.message});
        }

      }

    render()
    {
        return (
            <div className="col-xs-12 col-sm-9 col-md-10 pull-right mrg_dashboard_right">
            
               <div className="dahboard_hdg">Dashboard</div>
            <div className="clearfix"></div>

            <div className="col-sm-12 col-md-9">

                <div className="clear20 sm_display_none"></div>
                <div className="col-sm-12 col-md-9 p0">
                    <div className="welcome_box">
                        <div className="col-xs-4 col-sm-4 p0">
                            <div className="col-sm-12 p0 text-center"> <img src="images/profile_pic.png" className="profile_img" alt=""/></div>
                            <div className="clear20"></div>
                            <a href="#" className="btn_edit_profile" data-toggle="modal" data-target="#profileModal">Edit Profile</a>

                        </div>

                        <div className="col-xs-8 col-sm-8 p0 label_weclome_admin">

                            <h2> Welcome, {this.state.FirstName} {this.state.LastName}</h2> Last Login: February 26, 2018

                        </div>
                        <div className="clearfix"></div>
                    </div>

                </div>

                <div className="col-sm-12 col-md-3 p0_sm_Res">

                    <div className="timecard_box" style={{cursor: 'pointer'}} onClick={this.props.handleView('TimeCard','Add')}>

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
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simplyLorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since
                                                
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
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simplyLorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since
                                                
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
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simplyLorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since
                                                
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
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simplyLorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since
                                                
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
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simplyLorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since
                                                
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
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simplyLorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since
                                                
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
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simplyLorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since
                                                
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
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simplyLorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since
                                                
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
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simplyLorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since the when an Lorem Ipsum is simply. Lorem Ipsum is simply Lorem Ipsum has been the industry's standard dummy text ever since
                                                
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

        </div>
{/* Profile Modal Start. */} 
<div className="clear40"></div>
 <div className="modal fade  modal_res_forg" id="profileModal" tabIndex="-1" role="dialog" aria-labelledby="profileModalTitle" aria-hidden="true" style={{display: "none"}}>
  <div className="modal-dialog modal-dialog-centered modla_edit_profile" role="document">
    <div className="modal-content">
      <div className="modal-header modal_header_register">
       
        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCancel} id="profileModalClose">
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
       <input name="" type="button" className="btn_save_pro" value="Save" onClick={this.handleUpdate} />
       <input name="" type="button" className="btn_cancel_pro" value="Cancel"  data-dismiss="modal" aria-label="Close" onClick={this.handleCancel} />
       </div>
          </div>
       
       
       
       
       
       
       <div className="col-sm-8 profile_setting_pop">
      
    <form className="form-horizontal" >
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="First Name">First Name</label>
    <div className="col-sm-8">
      <input type="First Name" className="form-control pro_input_pop" name="FirstName" value={this.state.FirstName} onChange={this.handleChange}/>
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Last Name">Last Name</label>
    <div className="col-sm-8">
      <input type="Last Name" className="form-control pro_input_pop" name="LastName" value={this.state.LastName} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Email">Email</label>
    <div className="col-sm-8">
      <input type="Email" className="form-control pro_input_pop" placeholder="example@gmail.com" name="EmailAddress" value={this.state.EmailAddress} onChange={this.handleChange}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Mobile</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" placeholder="123456789" name="MobileNumber" value={this.state.MobileNumber} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  
  <div className="clear20"></div>

<div className="col-sm-8">
         <button type="button" href="#" className="btn_change_pass_pro">
                            
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-9022 -414 13 17.063">
  <path id="ic_lock_24px" className="cls-1" d="M15.375,6.688h-.812V5.063a4.063,4.063,0,0,0-8.125,0V6.688H5.625A1.63,1.63,0,0,0,4,8.313v8.125a1.63,1.63,0,0,0,1.625,1.625h9.75A1.63,1.63,0,0,0,17,16.438V8.313A1.63,1.63,0,0,0,15.375,6.688ZM10.5,14a1.625,1.625,0,1,1,1.625-1.625A1.63,1.63,0,0,1,10.5,14Zm2.519-7.312H7.981V5.063a2.519,2.519,0,0,1,5.038,0Z" transform="translate(-9026 -415)"></path>
</svg>
                           <span data-dismiss="modal" data-toggle="modal" data-target="#changePasswordModal">Change Password</span>
                        </button>
      </div>
 

</form> 


<div className="btn_cance_save2">
       <input name="" type="button" className="btn_save_pro" value="Save" onClick={this.handleUpdate}/>
       <input name="" type="button" className="btn_cancel_pro" value="Cancel"  data-dismiss="modal" aria-label="Close" onClick={this.handleCancel}/>
       </div>
         </div>
       
       
       
       
      
    
    
      
    

<div className="clear10"></div>

       
      </div>
      
    </div>
  </div>
</div>

<div className="modal fade  modal_res_forg" id="changePasswordModal" tabIndex="-1" role="dialog" aria-labelledby="changePasswordModalTitle" aria-hidden="true" style={{display: "none"}}>
            <div className="modal-dialog modal-dialog-centered modla_edit_profile" role="document">
                <div className="modal-content forgotPasswordModalContent">
                    <div className="modal-header modal_header_register">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="changePasswordModalClose">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body register_suc register_popup forgotPasswordPopupBody">
                        <div className="forgot_box forgotPasswordBoxContainer">
                            <div className="clear10"></div>
                            <div className="forgot_circle">
                                <img src="images/ic_lock1_outline_24px.svg" alt="" />
                            </div>
                            <h2> Forgot Password?</h2>
                            <div className="clear10"></div>
                            Check your phone for the code.
                            <div className="clear10"></div>
                            <div className="register_box_mid register_box_mid2">
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
                                <form onSubmit={this.handleForgotForm}>
                                    <div className="col-sm-12 p0">
                                        <input name="username" id="username" className="frogot_input forgotPasswordInput" type="text" placeholder="Email Address" value={this.state.username} onChange={this.handleChange}/>
                                        <img src="images/ic_mail_outline_24px.svg" width="15px" height="15px" className="register_icon1 forgotPasswordEmailIcon" alt="" />
                                    </div>
                                    <div className="clear30"></div>
                                    {/*<a href="/forgot_code" className="btn_forogot">Proceed</a>*/}
                                    {/*<button className="btn_forogot btn_forogot_new"  data-dismiss="modal" data-toggle="modal" data-target="#changePasswordPinCodeModal">Proceed</button>*/}
                                    <LoaderButton
                                          block
                                          bsSize="small"
                                          disabled={!this.validateForgotForm()}
                                          type="submit"
                                          isLoading={this.state.isLoading}
                                          text="Proceed"
                                          loadingText="Sending…"
                                          className="btn_forogot btn_forogot_new"
                                    />
                                </form>
                                <div className="clear10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

<div className="modal fade  modal_res_forg" id="changePasswordPinCodeModal" tabIndex="-1" role="dialog" aria-labelledby="changePasswordModalTitle" aria-hidden="true" style={{display: "none"}}>
            <div className="modal-dialog modal-dialog-centered modla_edit_profile" role="document">
                <div className="modal-content forgotPasswordModalContent">
                    <div className="modal-header modal_header_register">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="changePasswordPinCodeModalClose">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body register_suc register_popup forgotPasswordPopupBody">
                        <div className="forgot_box forgotPasswordBoxContainer">
                            <div className="clear10"></div>
                            <div className="forgot_circle">
                                <img src="images/ic_lock1_outline_24px.svg" alt="" />
                            </div>
                            <h2> Forgot Password?</h2>
                            <div className="clear10"></div>
                            If you didnt receive the PIN Code, click on "Resend",<br />
                            otherwise fill in the code and click on "Next".
                            <div className="register_box_mid register_box_mid2">
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
                                <form onSubmit={this.handlePinCodeForm}>
                                    <div className="col-sm-12 p0">
                                        <input name="pinCode" id="username2" className="frogot_input forgotPasswordInput" type="text" placeholder="Pin Code" value={this.state.pinCode} onChange={this.handleChange}/>
                                        <img src="images/ic_vpn_key_24px.svg" width="15px" height="15px" className="register_icon1 forgotPasswordEmailIcon" alt="" />
                                    </div>
                                    <div className="clear10"></div>
                                           <div className="col-sm-12 text-right"> <a href="javascript:void(0)" onClick={this.handleResendCode} className="resend_code" style={{marginRight: '0px'}}>Resend code</a></div>
                                    <div className="clear10"></div>
                                    {/*<a href="/forgot_code" className="btn_forogot">Proceed</a>*/}
                                    {/*<button className="btn_forogot btn_forogot_new"  data-dismiss="modal" data-toggle="modal" data-target="#changePasswordFieldsCodeModal">Proceed</button>*/}
                                    <LoaderButton
                                          block
                                          bsSize="small"
                                          disabled={!this.validateCodeForm()}
                                          type="submit"
                                          isLoading={this.state.isLoading}
                                          text="Proceed"
                                          loadingText="Validate…"
                                          className="btn_forogot btn_forogot_new"
                                    />
                                </form>
                                <div className="clear10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade modal_res_forg" id="changePasswordFieldsCodeModal" tabIndex="-1" role="dialog" aria-labelledby="changePasswordModalTitle" aria-hidden="true" style={{display: "none"}}>
            <div className="modal-dialog modal-dialog-centered modla_edit_profile" role="document">
                <div className="modal-content forgotPasswordModalContent">
                    <div className="modal-header modal_header_register">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="changePasswordFieldsCodeModalClose">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body register_suc register_popup forgotPasswordPopupBody">
                        <div className="forgot_box forgotPasswordBoxContainer">
                            <div className="clear10"></div>
                            <div className="forgot_circle">
                                <img src="images/ic_lock1_outline_24px.svg" alt="" />
                            </div>
                            <h2> Reset Your Password</h2>
                            <div className="clear10"></div>
                            Please enter the new password and confirm password.
                            <div className="register_box_mid register_box_mid2">
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
                                <form onSubmit={this.handleResetPasswordForm}>
                                    <div className="col-sm-12 p0">
                                        <input name="password" id="password" className="frogot_input forgotPasswordInput" type="password" placeholder="Password" value={this.state.password} onChange={this.handleChange}/>
                                        <img src="images/ic_lock_outline_24px.svg" width="15px" height="15px" className="register_icon1 forgotPasswordEmailIcon" alt="" />
                                    </div>
                                    <div className="clear10"></div>
                                    <div className="col-sm-12 p0">
                                        <input name="confirmPassword" id="confirmpassword" className="frogot_input forgotPasswordInput" type="password" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleChange}/>
                                        <img src="images/ic_lock_outline_24px.svg" width="15px" height="15px" className="register_icon1 forgotPasswordEmailIcon" alt="" />
                                    </div>
                                    <div className="clear30"></div>
                                    {/*<a href="/forgot_code" className="btn_forogot">Proceed</a>*/}
                                    {/*<button className="btn_forogot btn_forogot_new"  data-dismiss="modal" data-toggle="modal" data-target="#changePasswordSuccessModal">Change Password</button>*/}
                                    <LoaderButton
                                          block
                                          bsSize="small"
                                          disabled={!this.validateResetPasswordForm()}
                                          type="submit"
                                          isLoading={this.state.isLoading}
                                          text="Change Password"
                                          loadingText="Sending…"
                                          className="btn_forogot btn_forogot_new"
                                    />
                                </form>
                                <div className="clear10"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal fade modal_res_forg" id="changePasswordSuccessModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modla_register" role="document">
          <div className="modal-content">
            <div className="modal-header modal_header_register">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body register_suc register_popup">
              <img src="images/ic_check_circle_24px.svg" width={47} height={47} alt="" />
              <div className="clearfix" />
              <h2> {this.state.SuccessModalText}</h2>
              <div className="clearfix" />
              <button className="btn_forogot btn_forogot_new"  data-dismiss="modal">Ok</button>
            </div>
          </div>
        </div>
      </div>
{/* Profile Model End. */}
<button data-dismiss="modal" data-toggle="modal" data-target="#changePasswordSuccessModal" id="successModalBtn" style={{display:'none'}}>Show Modal</button>
<button className="btn_forogot btn_forogot_new"  data-dismiss="modal" data-toggle="modal" data-target="#changePasswordPinCodeModal" id="changePasswordPinCodeModalBtn" style={{display:'none'}}>Proceed</button>
<button className="btn_forogot btn_forogot_new"  data-dismiss="modal" data-toggle="modal" data-target="#changePasswordFieldsCodeModal" id="changePasswordFieldsCodeModalBtn" style={{display:'none'}}>Proceed</button>        
            </div>
        );
    }
}
