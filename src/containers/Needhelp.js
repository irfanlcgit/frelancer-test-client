import React , { Component } from "react";
import "./Needhelp.css";

export default class Needhelp extends Component {
	
	constructor(props)
	{
		super();		
	}
	
	render()
	{
		return (
			
	<div className="col-sm-12 p0" style={{height:"100%"}}>
        <div className="container login_container need_help_container p0">
          <div className="col-sm-12 col-md-12">
            <div className="contact_bg">
				<a href="/" className="arrow_getintoiuch">
					<img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" width="20px" height="20" alt="back image"/>
				</a>
              <div className="col-sm-5 p0">
                <div className="panel-body help_body_box getin_box_mtg">
                  <h2 className="hd_get_gelp_getin">GET IN TOUCH</h2>
                  <div className="clear20" />
                  <div className="col-sm-12 help_img_contact">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10048 7569.276 16 16.809">
                      <path id="ic_person_outline_24px" className="cls-1" d="M12,6A2.155,2.155,0,0,1,14.1,8.2a2.1,2.1,0,1,1-4.2,0A2.155,2.155,0,0,1,12,6m0,9.455c2.97,0,6.1,1.534,6.1,2.206v1.156H5.9V17.658c0-.672,3.13-2.206,6.1-2.206M12,4A4.1,4.1,0,0,0,8,8.2a4.1,4.1,0,0,0,4,4.2,4.1,4.1,0,0,0,4-4.2A4.1,4.1,0,0,0,12,4Zm0,9.455c-2.67,0-8,1.408-8,4.2v3.152H20V17.658C20,14.863,14.67,13.455,12,13.455Z" transform="translate(-10052 7565.276)" />
                    </svg>
                    <input className="form-control help_input_contact" placeholder="Name" />
                  </div>
                  <div className="clear10" />
                  <div className="col-sm-12 help_img_contact">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-7956 7441 30 24">
                      <path id="ic_mail_outline_24px" className="cls-1" d="M29,4H5A3,3,0,0,0,2.015,7L2,25a3.009,3.009,0,0,0,3,3H29a3.009,3.009,0,0,0,3-3V7A3.009,3.009,0,0,0,29,4Zm0,21H5V10l12,7.5L29,10ZM17,14.5,5,7H29Z" transform="translate(-7958 7437)" />
                    </svg>
                    <input className="form-control help_input_contact" placeholder="Email" />
                  </div>
                  <div className="clear10" />
                  <div className="col-sm-12 help_img_contact">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10048 7722.143 16 16">
                      <path id="ic_edit_24px" className="cls-1" d="M3,15.665V19H6.333l9.83-9.83L12.83,5.835ZM18.74,6.59a.885.885,0,0,0,0-1.253l-2.08-2.08a.885.885,0,0,0-1.253,0L13.781,4.884l3.333,3.333L18.74,6.59Z" transform="translate(-10051 7719.146)" />
                    </svg>
                    <textarea className="form-control help_input_contact" placeholder="Message" defaultValue={""} />
                  </div>
                  <div className="clear20" />
                  <div className="col-sm-12 text-center">
                    <input className="btn_send_msg_help" style={{width: '100%'}} defaultValue="Send Message" type="button" />
                  </div>
                </div>
              </div>
              <div className="col-sm-2">
                <div className="sep_get_in" />
              </div>
              <div className="col-sm-5 pull-right p0">
                <div className="tabbable-panel">
                  <div className="tabbable-line">
                    <ul className="nav nav-tabs ">
                      <li className="active">
                        <a href="#tab_default_1" data-toggle="tab">
                          Australia
                        </a>
                      </li>
                      <li>
                        <a href="#tab_default_2" data-toggle="tab">
                          United Kingdom
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content tab_label_help">
                      <div className="tab-pane active" id="tab_default_1">
                        <table width="100%" border={0} align="center" cellPadding={2} cellSpacing={2}>
                          <tbody><tr>
                              <td height={30} colSpan={2} align="center" valign="middle" className="text-center">
                                <p className="post_adrs_label" style={{color: '#707070'}}>Postal Address:	</p>
                              </td>
                            </tr>
                            <tr>
                              <td width="10%" height={40} align="left" valign="middle">
                                <img src="images/support/ic_place_24px.svg" width={13} height={19} alt="place" />
                              </td>
                              <td width="95%" align="left" valign="middle">
                                PO Box 6145, SouthYarra, Victoria 3141 Australia
                              </td>
                            </tr>
                            <tr>
                              <td height={10} colSpan={2} valign="middle">&nbsp;</td>
                            </tr>
                            <tr>
                              <td height={40} colSpan={2} align="center" valign="middle" className="text-center">
                                <p className="post_adrs_label" style={{color: '#707070'}}>
                                  Head Office Address:
                                </p>
                              </td>
                            </tr>
                            <tr>
                              <td height={40} align="left" valign="middle">
                                <img src="images/support/ic_place_24px.svg" width={13} height={19} alt="support" />
                              </td>
                              <td align="left" valign="middle">
                                Suite 8 25 Claremont Street, South Yarra, Victoria 3141 Australia
                              </td>
                            </tr>
                            <tr>
                              <td height={40} align="left" valign="middle">
                                <img src="images/support/ic_local_phone_24px.svg" width={16} height={16} alt="phone" />
                              </td>
                              <td align="left" valign="middle">
                                Phone: +613 9829 2300
                              </td>
                            </tr>
                            <tr>
                              <td height={40} align="left" valign="middle">
                                <img src="images/support/ic_local_printshop_24px.svg" width={16} height={14} alt="printshop" />
                              </td>
                              <td align="left" valign="middle">
                                Fax: +613 9827 4310
                              </td>
                            </tr>
                          </tbody></table>
                        <p />
                        <p />
                      </div>
                      <div className="tab-pane" id="tab_default_2">
                        <table width="90%" border={0} align="center" cellPadding={2} cellSpacing={2}>
                          <tbody><tr>
                              <td height={50} colSpan={2} align="center" valign="middle" className="text-center">
                                <p className="post_adrs_label">Head Office Address:</p>
                              </td>
                            </tr>
                            <tr>
                              <td width="10%" height={40} align="left" valign="top">
                                <img src="images/support/ic_place_24px.svg" style={{marginTop: 5}} width={13} height={19} alt="place" />
                              </td>
                              <td width="90%" align="left" valign="middle">
                                The River Unit, Phoenix Wharf, Eel Pie Island, Twickenham TW1 3DY United Kingdon
                              </td>
                            </tr>
                            <tr>
                              <td height={40} align="left" valign="middle">
                                <img src="images/support/ic_local_phone_24px.svg" width={16} height={16} alt="phone" />
                              </td>
                              <td align="left" valign="middle">
                                Phone: +44(0) 333 6000 113
                              </td>
                            </tr>
                            <tr>
                              <td height={40} align="left" valign="middle">
                                <img src="images/support/ic_local_phone_24px.svg" width={16} height={16} alt="phone" />
                              </td>
                              <td align="left" valign="middle"> Support: +44(0) 020 3286 6726</td>
                            </tr>
                          </tbody></table>
                      </div>
                      <div className="col-sm-12 p0"><img src="images/map.jpg" className="img-responsive" alt="map" /></div>
                      <div className="clearfix" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="clearfix" />
            </div>
          </div>
          <div className="clear40" />
          <div className="clearfix" />
        </div>
        <div className="clear40"></div>
    <div className="clearfix"></div>
    <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res p0">
		<a href="/">
			<img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" alt="chevron" width={15} height={23} />
		</a>
        <div className="clear40"></div>
        <h2 className="hd_get_gelp_res">GET IN TOUCH</h2>
        <div className="clear20"></div>
        <div className="col-sm-12 help_img_contact">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10048 7569.276 16 16.809">
				<path id="ic_person_outline_24px" className="cls-1" d="M12,6A2.155,2.155,0,0,1,14.1,8.2a2.1,2.1,0,1,1-4.2,0A2.155,2.155,0,0,1,12,6m0,9.455c2.97,0,6.1,1.534,6.1,2.206v1.156H5.9V17.658c0-.672,3.13-2.206,6.1-2.206M12,4A4.1,4.1,0,0,0,8,8.2a4.1,4.1,0,0,0,4,4.2,4.1,4.1,0,0,0,4-4.2A4.1,4.1,0,0,0,12,4Zm0,9.455c-2.67,0-8,1.408-8,4.2v3.152H20V17.658C20,14.863,14.67,13.455,12,13.455Z" transform="translate(-10052 7565.276)" />
            </svg>
            <input className="form-control help_input_contact" placeholder="Name" />
        </div>
        <div className="clear10"></div>
        <div className="col-sm-12 help_img_contact">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-7956 7441 30 24">
              <path id="ic_mail_outline_24px" className="cls-1" d="M29,4H5A3,3,0,0,0,2.015,7L2,25a3.009,3.009,0,0,0,3,3H29a3.009,3.009,0,0,0,3-3V7A3.009,3.009,0,0,0,29,4Zm0,21H5V10l12,7.5L29,10ZM17,14.5,5,7H29Z" transform="translate(-7958 7437)" />
            </svg>
            <input className="form-control help_input_contact" placeholder="Email" />
        </div>
        <div className="clear10"></div>
        <div className="col-sm-12 help_img_contact">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="-10048 7722.143 16 16">
				<path id="ic_edit_24px" className="cls-1" d="M3,15.665V19H6.333l9.83-9.83L12.83,5.835ZM18.74,6.59a.885.885,0,0,0,0-1.253l-2.08-2.08a.885.885,0,0,0-1.253,0L13.781,4.884l3.333,3.333L18.74,6.59Z" transform="translate(-10051 7719.146)" />
            </svg>
            <textarea className="form-control help_input_contact" placeholder="Message"></textarea>
        </div>
        <div className="clear20"></div>
        <div className="col-sm-12 text-center">
			<input className="btn_send_msg_help" style={{width: '100%'}} defaultValue="Send Message" type="button" />
		</div>
    </div>
    <div className="clear40"></div>
    <div className="clear40"></div>
		<a href="/address-map" className="adres_map_label">
			Address &amp; Map
			<div className="clear10" ></div>
			<img src="images/arow_bottom_Res.png" width={28} height={18} alt="arrow" />
		</a>
    <style dangerouslySetInnerHTML={{__html: ` .login_bg { background: url(../images/web_landingpage.png) no-repeat center center fixed #000; } .tabbable-line > .nav-tabs > li.open, .tabbable-line > .nav-tabs > li:hover {
  border-bottom: 1.5px solid #02477C;
} .tabbable-line > .nav-tabs > li.active {
  border-bottom: 1.5px solid #02477C;
} `}} />
</div>
		);
	}
}