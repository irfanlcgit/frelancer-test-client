import React , { Component } from "react";
import SignaturePad from "../../components/SignaturePad/index";
import { API } from "aws-amplify";
import { s3Upload } from "../../libs/awsLib";

export default class SignatureSettings extends Component {

	constructor(props)
	{
		super();
		this.file = null;
        this.state = {
          SignatureImage: "",
          DisplayPad: "block"
        };
	}

	async componentDidMount() {
	  try {
		   const user = await this.getUser();
		   //console.log(user);
		   if(user.status){
		   		this.setState({ SignatureImage: user.result.SignatureFile, DisplayPad: "none" });
		   }
		} catch (e) {
		    alert(e);
		    this.setState({ isLoading: false });
		}
	}

	handleFileChange = async event => {
		this.file = event.target.files[0];
		console.log(this.file);
		//alert('abc');
		/*if (this.file) {
		    alert("Please pick a file smaller than 5MB");
		    return;
		}*/

		try {
		    const attachment = this.file
		      ? await s3Upload(this.file)
		      : null;
		      alert('file uploded successfully.'+attachment)
		} catch (e) {
		    alert(e);
		//    this.setState({ isLoading: false });
		}
	}

	

	clearSignature = async event => {
		const signature = this.refs.Signature;
		signature.clear();
		this.setState({ SignatureImage: "", DisplayPad: "block" });
	}

	saveSignature = async event => {
		const signature = this.refs.Signature;
		this.setState({ SignatureImage: signature.toDataURL(), DisplayPad: "none" });
		//this.setState({ SignatureImage: signature.fromDataURL(base64String), DisplayPad: "none" });
		//console.log(this.state.SignatureImage);
		try {
		    //await this.createUsers({"body": {"SignatureFile":"image.jpg"}});
		    //const users = await this.users();
		    const user = await this.getUser();   
		    if(user.status){
		    	//console.log(user.result);
		    	const response = await this.updateUser({"SignatureFile": this.state.SignatureImage});
		    	if(response.status){
		    		alert('Action Successfull.')
		    	}

		    }else{
		    	const response = await this.createUsers({"SignatureFile":this.state.SignatureImage});
		    	if(response.status){
		    		alert('Action Successfull.')
		    	}
		    }


		    //this.props.history.push("/");
		} catch (e) {
		    alert(e);
		    this.setState({ isLoading: false });
		}
	}

	clearSignatureMobile = async event => {
		const signatureMobile = this.refs.SignatureMobile;
		signatureMobile.clear();
		this.setState({ SignatureImage: "", DisplayPad: "block" });
	}

	saveSignatureMobile = async event => {
		const signatureMobile = this.refs.SignatureMobile;
		this.setState({ SignatureImage: signatureMobile.toDataURL(), DisplayPad: "none" });
		try {
		    //await this.createUsers({"body": {"SignatureFile":"image.jpg"}});
		    //const users = await this.users();
		    const user = await this.getUser();   
		    if(user.status){
		    	//console.log(user.result);
		    	const response = await this.updateUser({"SignatureFile": this.state.SignatureImage});
		    	if(response.status){
		    		alert('Action Successfull.')
		    	}

		    }else{
		    	const response = await this.createUsers({"SignatureFile":this.state.SignatureImage});
		    	if(response.status){
		    		alert('Action Successfull.')
		    	}
		    }


		    //this.props.history.push("/");
		} catch (e) {
		    alert(e);
		    //this.setState({ isLoading: false });
		}
	}

	users() {
	  return API.get("users", "/users");
	}

	getUser() {
    	return API.get("users", `/users/${"HGJGJGJUYGJUGSJY"}`);
  	}

	createUsers(note) {
	  return API.post("users", "/users", {
	    body: note
	  });
	}

	updateUser(note) {
	  return API.put("users", `/users/${"HGJGJGJUYGJUGSJY"}`, {

  		"body": note
 
	  });
	}

    render()
    {
        return (
            <div>
            
                <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
      <div className="clear40"></div>
        <div className="heading_1"><img src="images/ic_create_24px.svg" width="20" height="20" alt="" /> &nbsp; Signature Setting</div>
             <div className="clear20"></div>
             
             
             	<div className="tabbable-panel">
				<div className="tabbable-line">
					<ul className="nav nav-tabs ">
						<li className="active">
							<a href="#tab_default_1" data-toggle="tab">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3800 7611 15 15">
  									<path id="ic_mode_edit_24px" className="cls-1" d="M3,14.873V18H6.125L15.34,8.782,12.215,5.658ZM17.756,6.366a.83.83,0,0,0,0-1.175l-1.95-1.95a.83.83,0,0,0-1.175,0L13.107,4.766l3.125,3.125Z" transform="translate(-3803 7608.002)"/>
								</svg>&nbsp;&nbsp; Drawn 
							</a>
						</li>
						<li>
							<a href="#tab_default_2" data-toggle="tab">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2112 7612 20 14">
  									<path id="ic_keyboard_24px" className="cls-1" d="M20,5H4A2,2,0,0,0,2.01,7L2,17a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V7A2.006,2.006,0,0,0,20,5ZM11,8h2v2H11Zm0,3h2v2H11ZM8,8h2v2H8Zm0,3h2v2H8ZM7,13H5V11H7Zm0-3H5V8H7Zm9,7H8V15h8Zm0-4H14V11h2Zm0-3H14V8h2Zm3,3H17V11h2Zm0-3H17V8h2Z" transform="translate(-2114 7607)"/>
								</svg>&nbsp;&nbsp; Typed 
							</a>

						</li>
						
					</ul>
					<div className="tab-content">
						<div className="tab-pane active" id="tab_default_1">
							<p></p>
						  	<SignaturePad SignaturePad={this.state} ref="Signature" />
							<p><img src={this.state.SignatureImage} alt="" /></p>
							<p></p>
					  	</div>
						<div className="tab-pane" id="tab_default_2">
							<p></p>
							<p> Sign 2 </p>
							<p></p>
						</div>
				  	</div>
				</div>
                
         
			</div>
            <div className="clear40"></div>
            <div className="btn_cance_save">
       			<input name="" className="btn_save_pro" value="Save" type="button" onClick={this.saveSignature} />
       			<input name="" className="btn_cancel_pro" value="Clear" type="button" onClick={this.clearSignature} />
       		</div>
       		<input type="file" onChange={this.handleFileChange} />
       
            </div>
          	<div className="clear40"></div>

{/* mobile view Start. */}            
<div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res p0">
    <div className="res_top_timecard">
        <div className="col-xs-2 chev_res_let">
            <a href="javascript:void(0)" onClick={this.props.handleView('Home')}>
             		<svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
               		<path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"></path>
             	</svg>
            </a>
        </div>
        <div className="col-xs-8 text-center">Signature Setting</div>
        <div className="clearfix"></div>
	</div>
    <div className="clear5"></div>
    
    <div className="col-xs-12 p0">
      	<div className="clear40"></div>
  		<div className="tabbable-panel">
			<div className="tabbable-line">
				<ul className="nav nav-tabs ">
					<li className="active">
						<a href="#tab_default_3" data-toggle="tab">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3800 7611 15 15">
  								<path id="ic_mode_edit_24px" className="cls-1" d="M3,14.873V18H6.125L15.34,8.782,12.215,5.658ZM17.756,6.366a.83.83,0,0,0,0-1.175l-1.95-1.95a.83.83,0,0,0-1.175,0L13.107,4.766l3.125,3.125Z" transform="translate(-3803 7608.002)"/>
							</svg>&nbsp;&nbsp; Drawn
						</a>
					</li>
					<li>
						<a href="#tab_default_4" data-toggle="tab">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2112 7612 20 14">
  								<path id="ic_keyboard_24px" className="cls-1" d="M20,5H4A2,2,0,0,0,2.01,7L2,17a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V7A2.006,2.006,0,0,0,20,5ZM11,8h2v2H11Zm0,3h2v2H11ZM8,8h2v2H8Zm0,3h2v2H8ZM7,13H5V11H7Zm0-3H5V8H7Zm9,7H8V15h8Zm0-4H14V11h2Zm0-3H14V8h2Zm3,3H17V11h2Zm0-3H17V8h2Z" transform="translate(-2114 7607)"/>
							</svg>&nbsp;&nbsp; Typed
						</a>
					</li>
						
				</ul>	
			</div>
        </div>
        <div className="clear40"></div>
        <div className="col-xs-12">
            <div className="tab-content res_tab_box">
				<div className="tab-pane active" id="tab_default_3">
					<p></p>
					<SignaturePad SignaturePad={this.state} ref="SignatureMobile" />
					<p><img src={this.state.SignatureImage} alt="" /></p>
					<p></p>
			  	</div>
				<div className="tab-pane" id="tab_default_4">
					<p></p>
					<p>Sign 2 </p>
					<p></p>
				</div>	
			</div>
        </div>
            
        <div className="clear20"></div>
        <div className="col-sm-12">
      		<input name="" className="btn_submit_time" value="Save" type="button"  onClick={this.saveSignatureMobile}/>
       		<input name="" className="btn_cancel_pro" value="Clear" type="button"  onClick={this.clearSignatureMobile}/>
       	</div>
        <div className="clear20"></div>
	</div>
   	<div className="clear40"></div>
    <div className="clear40"></div>         
</div>
{/* mobile view end. */}
           
            </div>
        );
    }
}