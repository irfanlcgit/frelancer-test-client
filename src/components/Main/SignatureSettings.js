import React , { Component } from "react";
import SignaturePad from "../../components/SignaturePad/index";
import { API, Storage } from "aws-amplify";
import $ from 'jquery';
//import { s3Upload } from "../../libs/awsLib";

export default class SignatureSettings extends Component {

	constructor(props)
	{
		super();
		this.file = null;
        this.state = {
          isLoading: true,
      	  isSaving: false,
          SignatureImage: "",
          SignatureText: "",
          SignatureTyped: "",
          DisplayPad: "block",
          SignatureInput: "block",
          CurrentTab: "Draw",
          CurrentTabMobile: "DrawMobile",
          SignaturePad: ""
        };
	}

	async componentDidMount() {

		Storage.vault.get('SignatureFile.jpg', {level: 'private'})
		    .then(result => {
		    	this.setState({ SignatureImage: result, DisplayPad: "none" })
			}).catch(err => console.log(err));

		try {
		   const user = await this.getUser();
		   if(user.status){
		   	    if(user.result.SignatureTyped){
		   			this.setState({ SignatureTyped: user.result.SignatureTyped, SignatureInput: "none" });
		   	    }else{
		   			this.setState({ SignatureTyped: "", SignatureInput: "block" });
		   		}
		   }
		} catch (e) {
		    console.log(e);
		}
	}

	handleChange = event => {
		this.setState(
		{
			[event.target.id]: event.target.value
		});
	}

	
	clearSignature = async event => {
		if(this.state.CurrentTab === "Draw"){
			this.setState({ SignatureImage: "", DisplayPad: "block" });
			const signature = this.refs.Signature;
			signature.clear();

			//document.getElementsByTagName("canvas")[0].width = 'auto';
			//document.getElementsByTagName("canvas")[0].height = 'auto';
		}

		if(this.state.CurrentTab === "Typed"){
			this.setState({ SignatureTyped: "", SignatureInput: "block" });
		}
	}

	saveSignature = async event => {
		this.setState({isSaving: true});
		if(this.state.CurrentTab === "Draw"){
			const signature = this.refs.Signature;
		    
		    if(signature.isEmpty()){
		    	Storage.vault.remove('SignatureFile.jpg', {level: 'private'})
			    .then(result => {
			    		console.log(result)
			    		this.setState({isSaving: false})
			    	}
			    ).catch(err => {
			    		console.log(err)
			    		this.setState({isSaving: false})
			    	}
			    );
		    }else{
				const base64 = signature.toDataURL();
			
				const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
				
				Storage.vault.put('SignatureFile.jpg', base64Data, { contentType: 'image/jpeg' })
	  			.then (result => {
	  				$('#HomeBtn').click();
	  				console.log('Successfully saved.');
	  				this.setState({ isSaving: false, SignatureImage: base64, DisplayPad: "none" });

	  			}).catch(err => { 
	  				console.log(err);
	  				this.setState({isSaving: false})
	  			});									
  			}
		}

		if(this.state.CurrentTab === "Typed"){
			try {

		    	const response = await this.updateUser({"SignatureTyped": this.state.SignatureText});
			    if(response.status){
			    	console.log('Successfully saved.');
			    	$('#HomeBtn').click();
			    	this.setState({ isSaving: false, SignatureTyped: this.state.SignatureText, SignatureInput: "none" });
			    }
			} catch (e) {
		    	console.log(e);
		    	this.setState({isSaving: false});
			}
		}
	}

	clearSignatureMobile = async event => {

		if(this.state.CurrentTabMobile === "DrawMobile"){
			const signatureMobile = this.refs.SignatureMobile;
			signatureMobile.clear();
			this.setState({ SignatureImage: "", DisplayPad: "block" });
		}

		if(this.state.CurrentTabMobile === "TypedMobile"){
			this.setState({ SignatureTyped: "", SignatureInput: "block" });
		}
	}

	saveSignatureMobile = async event => {
		this.setState({isSaving: true});
		if(this.state.CurrentTabMobile === "DrawMobile"){
			const signatureMobile = this.refs.SignatureMobile;
			if(signatureMobile.isEmpty()){
		    	Storage.vault.remove('SignatureFile.jpg', {level: 'private'})
			    .then(result => {
			    		console.log(result)
			    		this.setState({isSaving: false})
			    	}
			    ).catch(err => {
			    		console.log(err)
			    		this.setState({isSaving: false})
			    	}
			    );
		    }else{
				const base64 = signatureMobile.toDataURL();
				
				const base64Data = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

				Storage.vault.put('SignatureFile.jpg', base64Data, { contentType: 'image/jpeg' })
		  		.then (result => {
		  			console.log('Successfully saved.');
		  			$('#HomeBtn').click();
		  			this.setState({ isSaving: false, SignatureImage: base64, DisplayPad: "none" });

		  		}).catch(err => {
		  			console.log(err);
		  			this.setState({isSaving: false})
		  		});
	  		}
		}

		if(this.state.CurrentTabMobile === "TypedMobile"){
			try {

		    	const response = await this.updateUser({"SignatureTyped": this.state.SignatureText});
			    if(response.status){
			    	console.log('Successfully saved.');
			    	$('#HomeBtn').click();
			    	this.setState({ isSaving: false, SignatureTyped: this.state.SignatureText, SignatureInput: "none" });
			    }
			} catch (e) {
		    	console.log(e);
		    	this.setState({isSaving: false})
			}
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

	handleTab = (element) => async event => {
		event.preventDefault();
		this.setState({ CurrentTab: element });
	}

	handleTabMobile = (element) => async event => {
		event.preventDefault();
		this.setState({ CurrentTabMobile: element });
	}

	handleImageError = async event => {
		this.setState({ SignatureImage: "", DisplayPad: "block" });
	}


    render()
    {
        return (
            <div>
            <div className="col-xs-12 col-sm-9 col-md-10 pull-right mrg_dashboard_right" style={{width:'75%'}}>
                
                <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
      <div className="clear40"></div>
        <div className="heading_1 svg_sign5 setting_icon5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10048 7722.143 16 16">
  
  <path id="ic_edit_24px" className="cls-1 " d="M3,15.665V19H6.333l9.83-9.83L12.83,5.835ZM18.74,6.59a.885.885,0,0,0,0-1.253l-2.08-2.08a.885.885,0,0,0-1.253,0L13.781,4.884l3.333,3.333L18.74,6.59Z" transform="translate(-10051 7719.146)"/>
</svg>

         &nbsp; Signature Setting</div>
             <div className="clear20"></div>
             
             <div className="col-xs-12 col-sm-10 mrg_left_sign">
             	<div className="tabbable-panel">
				<div className="tabbable-line">
					<ul className="nav nav-tabs ">
						<li className="active">
							<a href="#tab_default_1" data-toggle="tab" onClick={this.handleTab('Draw')}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3800 7611 15 15">
  									<path id="ic_mode_edit_24px" className="cls-1" d="M3,14.873V18H6.125L15.34,8.782,12.215,5.658ZM17.756,6.366a.83.83,0,0,0,0-1.175l-1.95-1.95a.83.83,0,0,0-1.175,0L13.107,4.766l3.125,3.125Z" transform="translate(-3803 7608.002)"/>
								</svg>&nbsp;&nbsp; Drawn 
							</a>
						</li>
						<li>
							<a href="#tab_default_2" data-toggle="tab" onClick={this.handleTab('Typed')}>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2112 7612 20 14">
  									<path id="ic_keyboard_24px" className="cls-1" d="M20,5H4A2,2,0,0,0,2.01,7L2,17a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V7A2.006,2.006,0,0,0,20,5ZM11,8h2v2H11Zm0,3h2v2H11ZM8,8h2v2H8Zm0,3h2v2H8ZM7,13H5V11H7Zm0-3H5V8H7Zm9,7H8V15h8Zm0-4H14V11h2Zm0-3H14V8h2Zm3,3H17V11h2Zm0-3H17V8h2Z" transform="translate(-2114 7607)"/>
								</svg>&nbsp;&nbsp; Typed 
							</a>

						</li>
						
					</ul>
					<div className="tab-content">
						<div className="tab-pane active" id="tab_default_1" style={{padding: '5px'}}>
							<p></p>
						  	<SignaturePad SignaturePad={this.state} ref="Signature" />
							<p><img className="img-responsive" src={this.state.SignatureImage} alt="" onError={this.handleImageError} /></p>
							
					  	</div>
						<div className="tab-pane" id="tab_default_2" style={{color: '#aaaaaa'}}>
							<p></p>
							<p> {this.state.SignatureTyped} </p>
							<p style={{display:this.state.SignatureInput}}>
								<input name="SignatureText" id="SignatureText" className="" onChange={this.handleChange} type="text" placeholder="Type Here"  defaultValue="" />
							</p>
							<p></p>
						</div>
				  	</div>
				</div>
                
         
			</div>
            <div className="clear40"></div>
            <div className="btn_cance_save">
       			<input name="" className="btn_save_pro" value={!this.state.isSaving ? "Save" : "Saving.."} disabled={this.state.isSaving} type="button" onClick={this.saveSignature} />
       			<input name="" className="btn_cancel_pro" value="Clear" type="button" onClick={this.clearSignature} />
       		</div>
       		
<input value="Home" type="button" id="HomeBtn" style={{display:'none'}} onClick={this.props.handleView('Home','List')} />
            </div>
            </div>
          	<div className="clear40"></div>
    </div>
{/* mobile view Start. */}            
<div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res p0">
    <div className="res_top_timecard">
        <div className="col-xs-2 chev_res_let">
            <a href="javascript:void(0)" onClick={this.props.handleView('Home','List')}>
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
						<a href="#tab_default_3" data-toggle="tab" onClick={this.handleTabMobile('DrawMobile')}>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3800 7611 15 15">
  								<path id="ic_mode_edit_24px" className="cls-1" d="M3,14.873V18H6.125L15.34,8.782,12.215,5.658ZM17.756,6.366a.83.83,0,0,0,0-1.175l-1.95-1.95a.83.83,0,0,0-1.175,0L13.107,4.766l3.125,3.125Z" transform="translate(-3803 7608.002)"/>
							</svg>&nbsp;&nbsp; Drawn
						</a>
					</li>
					<li>
						<a href="#tab_default_4" data-toggle="tab" onClick={this.handleTabMobile('TypedMobile')} style={{color: '#aaaaaa'}}>
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
					<p><img className="img-responsive" src={this.state.SignatureImage} alt=""  onError={this.handleImageError} /></p>
					
			  	</div>
				<div className="tab-pane" id="tab_default_4" style={{color: '#aaaaaa'}}>
					<p></p>
					<p> {this.state.SignatureTyped} </p>
					<p style={{display:this.state.SignatureInput}}>
						<input name="SignatureText" id="SignatureText" className="" onChange={this.handleChange} type="text" placeholder="Type Here"  defaultValue="" />
					</p>
					<p></p>
				</div>	
			</div>
        </div>
            
        <div className="clear20"></div>
        <div className="col-sm-12">
      		<input name="" className="btn_submit_time" value={!this.state.isSaving ? "Save" : "Saving.."} disabled={this.state.isSaving} type="button"  onClick={this.saveSignatureMobile}/>
       		<input name="" className="btn_cancel_pro" value="Clear" type="button"  onClick={this.clearSignatureMobile}/>
       	</div>
        <div className="clear20"></div>
	</div>
   	<div className="clear40"></div>
          
</div>
{/* mobile view end. */}           
            </div>
        );
    }
}