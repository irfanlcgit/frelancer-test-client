import React , { Component } from "react";
import "./Help.css";
import { API } from "aws-amplify";

export default class Help extends Component {

  constructor(props)
  {
    super();
    this.state = {
      errormessage:"",
      isLoading: false,
      isSaving: false,
      SubView: "List",
      companies: [],

      Name:"",
      Email:"",
      Message:"",

      NameValid: true,
      EmailValid: true,
      MessageValid: true,
      formValid: false,
    };

  }

  handleChange = async event => {

    const name = event.target.name;
    const value = event.target.value;
    const ValidStateName = name+'Valid';
    this.setState({[ValidStateName]: true });

    this.setState({[name]: value}, 
                () => { this.validateField(name, value, ValidStateName) });
  }

  validateField(fieldName, value, ValidStateName)
  {
    let valid = true;

    if(value.length === 0){
      valid = false;
    }

    this.setState({[ValidStateName]:valid}, this.validateForm);
  }

  validateForm() {
    var formValid = !this.state.NameValid? false :
                    !this.state.EmailValid? false : 
                    !this.state.MessageValid? false :  true ;
    this.setState({formValid: formValid});
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({isSaving: true });

    if(this.state.formValid){
      var EmailData = {
            from:this.state.Email,
            name:this.state.Name,
            subject:"Feedback Frelance Portal",
            message:this.state.Message,
            Preview:false,
      };

      try {
        const response = await this.sendEmail(EmailData);
        //console.log(response);
        console.log('Successfully sent.');
        this.setState({
          isSaving: false,

          Name: "",
          Email: "",
          Message: "",

          NameValid: true,
          EmailValid: true,
          MessageValid: true,
          formValid: false,
        });

      }catch (e) {
          console.log("Email "+e);
          alert('Sending failed.');
          this.setState({isSaving: false});
      }

    }else{
      this.setState({
        isSaving: false,
        NameValid: this.state.Name? true : false,
        EmailValid: this.state.Email? true : false,
        MessageValid: this.state.Message? true : false,
      });
    }
  } 
  
  handleSubView = (element) => async event => {
      event.preventDefault();
      this.setState({ SubView: element });
  }

  sendEmail(item) {
      return API.post("email", "/email", {
        body: item
      });
  }


  render()
    {
        return (
          <div>
          <div className="col-xs-12  col-sm-9 col-md-10 pull-right mrg_dashboard_right">
            <div className="help_bg_top">
         <img src="images/logo_help.svg" width="120" height="88" alt="" />
           <div className="clear5"></div>
          SUPPORT CENTER </div>
         
         
         
         
           
          <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
      <div className="clear20"></div>
       
         
             
             
              
            
              <div className="panel-group" id="accordion">
  
        <div className="panel panel-default help_panel_group">
            <div className="panel-heading help_panel_heading">
                <h4 className="panel-title">
                    <a className="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseOne">
                    
                    <img src="images/support/ic_info_outline_24px.svg" width="30" height="30" alt="" /> &nbsp; Guides</a>
                    
                    
                    
                </h4>
          </div>
            <div id="collapseOne" className="panel-collapse collapse">
                <div className="panel-body help_body_box">
                   
                   
                   
                   
  <div id="myCarousel" className="carousel slide" data-ride="carousel">
    
    <ol className="carousel-indicators">
      <li data-target="#myCarousel" data-slide-to="0" className="active"></li>
      <li data-target="#myCarousel" data-slide-to="1"></li>
      <li data-target="#myCarousel" data-slide-to="2"></li>
    </ol>

    
    <div className="carousel-inner help_carsoul_img">

      <div className="item active">
     
 
<div className="carousel-caption help_carsoulcaption">
    <img src="images/support/ic_receipt_24px.svg" width="120" height="133" alt="" />
     <div className="clear10"></div>
  <h3>TimeCards</h3>
          <p>This is the instruction of TimeCards list </p>
      </div>
         <div className="clear10"></div>
      </div>

      <div className="item">
     

<div className="carousel-caption help_carsoulcaption">
     <img src="images/support/ic_business_24px.svg" width="120" height="133" alt="" />
     <div className="clear10"></div>
  <h3>Companies </h3>
          <p>This is the instruction of Companies list  </p>
      </div>
         <div className="clear10"></div>
      </div>
    
      <div className="item">
     

<div className="carousel-caption help_carsoulcaption">
     <img src="images/support/ic_library_books_24px.svg" width="120" height="133" alt="" />
     <div className="clear10"></div>
  <h3>Documents </h3>
          <p>This is the instruction of Document list  </p>
      </div>
         <div className="clear10"></div>
      </div>
  
    </div>

    
    <a className="left carousel-control" href="#myCarousel" data-slide="prev">
     
     <img src="images/support/ic_chevron_left_24px.svg" width="10" height="16" alt="" />
     
      </a>
    <a className="right carousel-control" href="#myCarousel" data-slide="next">
      
        <img src="images/support/ic_chevron_right_24px.svg" width="10" height="16" alt="" />
      
    </a>
  </div>
                   
                   
                   
                   
                   
                </div>
            </div>
        </div>
           <div className="panel panel-default help_panel_group">
            <div className="panel-heading help_panel_heading">
                <h4 className="panel-title">
                    <a className="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTen">
                    <img src="images/support/ic_mail_outline1_24px.svg" width="30" height="30" alt="" /> &nbsp; Contact Us</a>
                </h4>
            </div>
            <div id="collapseTen" className="panel-collapse  col-sm-9 mrg_left_con collapse in">
                <div className="panel-body help_body_box">
                   
                   
            <div className={!this.state.NameValid? 'col-sm-12 help_img_contact field_required' : 'col-sm-12 help_img_contact' }>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10048 7569.276 16 16.809">
                    <path id="ic_person_outline_24px" className="cls-1" d="M12,6A2.155,2.155,0,0,1,14.1,8.2a2.1,2.1,0,1,1-4.2,0A2.155,2.155,0,0,1,12,6m0,9.455c2.97,0,6.1,1.534,6.1,2.206v1.156H5.9V17.658c0-.672,3.13-2.206,6.1-2.206M12,4A4.1,4.1,0,0,0,8,8.2a4.1,4.1,0,0,0,4,4.2,4.1,4.1,0,0,0,4-4.2A4.1,4.1,0,0,0,12,4Zm0,9.455c-2.67,0-8,1.408-8,4.2v3.152H20V17.658C20,14.863,14.67,13.455,12,13.455Z" transform="translate(-10052 7565.276)"/>
                  </svg>
                <input className="form-control help_input_contact" placeholder="Name" type="text" name="Name" value={this.state.Name} onChange={this.handleChange} />
            </div>
    
  <div className="clear10"></div>
  
  <div className={!this.state.EmailValid? 'col-sm-12 help_img_contact field_required' : 'col-sm-12 help_img_contact' }>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-7956 7441 30 24">
      <path id="ic_mail_outline_24px" className="cls-1" d="M29,4H5A3,3,0,0,0,2.015,7L2,25a3.009,3.009,0,0,0,3,3H29a3.009,3.009,0,0,0,3-3V7A3.009,3.009,0,0,0,29,4Zm0,21H5V10l12,7.5L29,10ZM17,14.5,5,7H29Z" transform="translate(-7958 7437)"/>
    </svg>
    <input className="form-control help_input_contact" placeholder="Email" type="text" name="Email" value={this.state.Email} onChange={this.handleChange} />
  </div>

  <div className="clear10"></div>
  
  <div className={!this.state.MessageValid? 'col-sm-12 help_img_contact field_required' : 'col-sm-12 help_img_contact' }>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10048 7722.143 16 16">
      <path id="ic_edit_24px" className="cls-1" d="M3,15.665V19H6.333l9.83-9.83L12.83,5.835ZM18.74,6.59a.885.885,0,0,0,0-1.253l-2.08-2.08a.885.885,0,0,0-1.253,0L13.781,4.884l3.333,3.333L18.74,6.59Z" transform="translate(-10051 7719.146)"/>
    </svg>
    <textarea className="form-control help_input_contact" cols="" rows="" placeholder="Message" type="text" name="Message" value={this.state.Message} onChange={this.handleChange}></textarea>
  </div>
    
    
      <div className="clear20"></div>
                <div className="col-sm-12 text-center">
                <input name="" className="btn_send_msg_help" type="button"  value={!this.state.isSaving ? 'Send Message' : 'Sending....'} disabled={this.state.isSaving} onClick={this.handleSubmit} />
                </div>   
                   
                   
              </div>
            </div>
        </div>
        <div className="clear10"></div>
         <div className="panel panel-default help_panel_group">
            <div className="panel-heading help_panel_heading">
                <h4 className="panel-title">
                    <a className="accordion-toggle collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseEleven">
                    <img src="images/support/ic_place_24px.svg" width="30" height="35" alt="" /> &nbsp; Address and Map</a>
                </h4>
            </div>
            <div id="collapseEleven" className="panel-collapse collapse">
                <div className="panel-body help_body_box" style={{border:'none'}}>
                   <div className="tabbable-panel col-md-7 col-md-offset-2">
        <div className="tabbable-line">
          <ul className="nav nav-tabs ">
            <li className="active">
              <a href="#tab_default_1" data-toggle="tab">
              
Australia </a>
            </li>
            <li>
              <a href="#tab_default_2" data-toggle="tab">
            United Kingdom </a>
            </li>
            
          </ul>
        <div className="tab-content tab_label_help">
            <div className="tab-pane active" id="tab_default_1">
                        
                        <table width="100%" border="0" align="center" cellpadding="2" cellspacing="2">
  <tr>
    <td height="40" colspan="2" align="center" valign="middle" className="text-center">
              <p className="post_adrs_label">Postal Address:  </p>
  </td>
 
  </tr>
  <tr>
    <td width="5%" height="40" align="left" valign="middle"><img src="images/support/ic_place_24px.svg" width="13" height="19" alt="" /></td>
    <td width="95%" align="left" valign="middle">PO Box 6145, SouthYarra, Victoria 3141 Australia</td>
  </tr>
  <tr>
    <td colspan="2" valign="middle">&nbsp;</td>
  </tr>
  <tr>
   <td height="40" colspan="2" align="center" valign="middle" className="text-center">
            <p className="post_adrs_label"> Head Office Address:  </p>
  </td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_place_24px.svg" width="13" height="19" alt="" /></td>
    <td align="left" valign="middle">Suite 8 25 Claremont Street, South Yarra, Victoria 3141 Australia</td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_local_phone_24px.svg" width="16" height="16" alt="" /></td>
    <td align="left" valign="middle">Phone: +613 9829 2300</td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_local_printshop_24px.svg" width="16" height="14" alt="" /></td>
    <td align="left" valign="middle">Fax: +613 9827 4310</td>
  </tr>
</table>

                        
              
              <p>
                           
                           
                            </p>
              <p>
                
              </p>
            </div>
            <div className="tab-pane" id="tab_default_2">
              
              
            <table width="90%" border="0" align="center" cellpadding="2" cellspacing="2">

  <tr>
   <td height="50" colspan="2" align="center" valign="middle" className="text-center">
            <p className="post_adrs_label">Head Office Address:</p>
  </td>
  </tr>
  <tr>
    <td width="5%" height="40" align="left" valign="top"><img src="images/support/ic_place_24px.svg" style={{marginTop:'5px'}} width="13" height="19" alt="" /></td>
    <td width="95%" align="left" valign="middle">The River Unit, Phoenix Wharf, Eel Pie Island, Twickenham TW1 3DY United Kingdon</td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_local_phone_24px.svg" width="16" height="16" alt="" /></td>
    <td align="left" valign="middle">Phone: +44(0) 333 6000 113</td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_local_phone_24px.svg" width="16" height="16" alt="" /></td>
    <td align="left" valign="middle"> Support: +44(0) 020 3286 6726</td>
  </tr>
</table>
            </div>
            
          </div>
        </div>
                
         
      </div>
                </div>
            </div>
        </div>

       
        
        
        
        
        
        

        
        
    </div>
              
              
              
              
              
              
              
                  
              
              
              
              
              
              
              
              
              
  <div classNmae="clear40"></div>
       </div>

          </div>
  <div className="clearfix"></div>
  
  {this.state.SubView === 'AddressMap' ? 

  <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res p0" style={{marginTop: '40px'}}>

     <a href="javascript:void(0)" onClick={this.handleSubView('List')} className="adres_map_label2">
     <img src="images/arrow_top_Res.png" width="20" height="13" alt="" />
        <div className="clear10"></div>
      Get in touch

    </a>
           <a  href="javascript:void(0)" onClick={this.props.handleView('Home','List')}><img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" alt="" width="15" height="23" /></a>
          
        <div className="clear10"></div>   
       
           
             

 
          
            <div className="col-xs-12 p0">
      <div className="clear20"></div>
  
             
             
              <div className="tabbable-panel">
        <div className="tabbable-line">
          <ul className="nav nav-tabs ">
            <li className="active">
              <a href="#tab_default_3" data-toggle="tab">
              
Australia </a>
            </li>
            <li>
              <a href="#tab_default_4" data-toggle="tab">
            United Kingdom  </a>
            </li>
            
          </ul>
          
        </div>
                
         
      </div>
              <div className="clear40"></div>
                  <div className="col-xs-12">
  <div className="tab-content res_tab_box address_map" style={{color: "#aaaaaa"}}>
            <div className="tab-pane active" id="tab_default_3">
              
              <table width="100%" border="0" align="center" cellpadding="2" cellspacing="2">
  <tr>
    <td height="40" colspan="2" align="center" valign="middle" className="text-center">
              <p className="post_adrs_label">Postal Address:  </p>
  </td>
 
  </tr>
  <tr>
    <td width="20%" height="40" align="left" valign="middle"><img src="images/support/ic_place_24px.svg" width="13" height="19" alt="" /></td>
    <td width="80%" align="left" valign="middle">PO Box 6145, SouthYarra, Victoria 3141 Australia</td>
  </tr>
  <tr>
    <td colspan="2" valign="middle">&nbsp;</td>
  </tr>
  <tr>
   <td height="40" colspan="2" align="center" valign="middle" className="text-center">
            <p className="post_adrs_label"> Head Office Address:  </p>
  </td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_place_24px.svg" width="13" height="19" alt="" /></td>
    <td align="left" valign="middle">Suite 8 25 Claremont Street, South Yarra, Victoria 3141 Australia</td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_local_phone_24px.svg" width="16" height="16" alt="" /></td>
    <td align="left" valign="middle">Phone: +613 9829 2300</td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_local_printshop_24px.svg" width="16" height="14" alt="" /></td>
    <td align="left" valign="middle">Fax: +613 9827 4310</td>
  </tr>
</table>

            </div>
            <div className="tab-pane" id="tab_default_4">
              <p>
              
              </p>
              <p><table width="100%" border="0" align="center" cellpadding="2" cellspacing="2">

  <tr>
   <td height="50" colspan="2" align="center" valign="middle" className="text-center">
            <p className="post_adrs_label">Head Office Address:</p>
  </td>
  </tr>
  <tr>
    <td width="10%" height="40" align="left" valign="top"><img src="images/support/ic_place_24px.svg" width="13" height="19" alt="" /></td>
    <td width="90%" align="left" valign="middle">The River Unit, Phoenix Wharf, Eel Pie Island, Twickenham TW1 3DY United Kingdon</td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_local_phone_24px.svg" width="16" height="16" alt="" /></td>
    <td align="left" valign="middle">Phone: +44(0) 333 6000 113</td>
  </tr>
  <tr>
    <td height="40" align="left" valign="middle"><img src="images/support/ic_local_phone_24px.svg" width="16" height="16" alt="" /></td>
    <td align="left" valign="middle"> Support: +44(0) 020 3286 6726</td>
  </tr>
</table> </p>
              <p>
         
                
              </p>
            </div>
            
          </div>
            </div>
                <div className="clear20"></div>
            
            <div><img src="images/map.jpg" className="img-responsive" alt="" /></div>
                
             
          

           
  </div>
       
        
        
        
                   
                   
                   
    


    
    
    
  
          
                   
                   
           

           
</div>

   : 

  <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res p0" style={{marginTop: '40px'}}>
    
           <a href="javascript:void(0)" onClick={this.props.handleView('Home','List')}><img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" alt="" width="15" height="23" /></a>
          
        <div className="clear40"></div>   
           <h2 className="hd_get_gelp_res">GET IN TOUCH</h2>
           
             
  <div className="clear20"></div> 
        
        
        
        
                   
                   
  <div className={!this.state.NameValid? 'col-sm-12 help_img_contact field_required' : 'col-sm-12 help_img_contact' }>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10048 7569.276 16 16.809">
      <path id="ic_person_outline_24px" className="cls-1" d="M12,6A2.155,2.155,0,0,1,14.1,8.2a2.1,2.1,0,1,1-4.2,0A2.155,2.155,0,0,1,12,6m0,9.455c2.97,0,6.1,1.534,6.1,2.206v1.156H5.9V17.658c0-.672,3.13-2.206,6.1-2.206M12,4A4.1,4.1,0,0,0,8,8.2a4.1,4.1,0,0,0,4,4.2,4.1,4.1,0,0,0,4-4.2A4.1,4.1,0,0,0,12,4Zm0,9.455c-2.67,0-8,1.408-8,4.2v3.152H20V17.658C20,14.863,14.67,13.455,12,13.455Z" transform="translate(-10052 7565.276)"/>
    </svg>
    <input className="form-control help_input_contact" placeholder="Name"  type="text" name="Name" value={this.state.Name} onChange={this.handleChange} />
  </div>
    
  <div className="clear10"></div>
  
  <div className={!this.state.EmailValid? 'col-sm-12 help_img_contact field_required' : 'col-sm-12 help_img_contact' }>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-7956 7441 30 24">
      <path id="ic_mail_outline_24px" className="cls-1" d="M29,4H5A3,3,0,0,0,2.015,7L2,25a3.009,3.009,0,0,0,3,3H29a3.009,3.009,0,0,0,3-3V7A3.009,3.009,0,0,0,29,4Zm0,21H5V10l12,7.5L29,10ZM17,14.5,5,7H29Z" transform="translate(-7958 7437)"/>
    </svg>
    <input className="form-control help_input_contact" placeholder="Name" type="text" name="Email" value={this.state.Email} onChange={this.handleChange} />
  </div>
  
  <div className="clear10"></div>
  
  <div className={!this.state.MessageValid? 'col-sm-12 help_img_contact field_required' : 'col-sm-12 help_img_contact' }>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10048 7722.143 16 16">
      <path id="ic_edit_24px" className="cls-1" d="M3,15.665V19H6.333l9.83-9.83L12.83,5.835ZM18.74,6.59a.885.885,0,0,0,0-1.253l-2.08-2.08a.885.885,0,0,0-1.253,0L13.781,4.884l3.333,3.333L18.74,6.59Z" transform="translate(-10051 7719.146)"/>
    </svg>
    <textarea className="form-control help_input_contact" cols="" rows="" name="Message" value={this.state.Message} onChange={this.handleChange}>Message</textarea>
  </div>
  
  <div className="clear20"></div>
                
  <div className="col-sm-12 text-center"><input name="" className="btn_send_msg_help" ref={(el) => {
                    if (el) {
                      el.style.setProperty('width', '100%', 'important');
                    }
                }} type="button"   value={!this.state.isSaving ? 'Send Message' : 'Sending....'} disabled={this.state.isSaving} onClick={this.handleSubmit} /></div>   
                   
                   
           
<div className="clear40"></div>
          <div className="clear40"></div>
   <a href="javascript:void(0)" onClick={this.handleSubView('AddressMap')} className="adres_map_label"> Address & Map
   <div className="clear10"></div>
   <img src="images/arow_bottom_Res.png" width="28" height="18" alt="" /> </a>
           
</div>

}

  </div>
        );
    }
}