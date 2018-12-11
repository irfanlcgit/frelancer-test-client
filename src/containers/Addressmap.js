import React , { Component } from "react";
import "./Addressmap.css";

export default class Addressmap extends Component {
	
	constructor(props)
	{
		super();		
	}
	
	render()
	{
		return (
			<div>
        <div className="clear40" />
        <div className="clearfix" />
        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res p0">
          <a href="/need-help" className="adres_map_label2">
            <img src="images/arrow_top_Res.png" width={20} height={13} alt="arrow" />
            <div className="clear10" />
            Address &amp; Map
          </a>
          <a href="/">
            <img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" alt="chevron" width={15} height={23} />
          </a>
          <div className="clear10" />   
          <div className="col-xs-12 p0">
            <div className="clear20" />
            <div className="tabbable-panel">
              <div className="tabbable-line">
                <ul className="nav nav-tabs ">
                  <li className="active">
                    <a href="#tab_default_3" data-toggle="tab">
                      Australia
                    </a>
                  </li>
                  <li>
                    <a href="#tab_default_4" data-toggle="tab">
                      United Kingdom
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="clear40" />
            <div className="col-xs-12">
              <div className="tab-content res_tab_box address_map">
                <div className="tab-pane active" id="tab_default_3">
                  <table width="100%" border={0} align="center" cellPadding={2} cellSpacing={2}>
                    <tbody><tr>
                        <td height={40} colSpan={2} align="center" valign="middle" className="text-center">
                          <p className="post_adrs_label">Postal Address:	</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="20%" height={40} align="left" valign="middle">
                          <img src="images/support/ic_place_24px.svg" width={13} height={19} alt="ic_place" />
                        </td>
                        <td width="80%" align="left" valign="middle">
                          PO Box 6145, SouthYarra, Victoria 3141 Australia
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} valign="middle">&nbsp;</td>
                      </tr>
                      <tr>
                        <td height={40} colSpan={2} align="center" valign="middle" className="text-center">
                          <p className="post_adrs_label">	Head Office Address:	</p>
                        </td>
                      </tr>
                      <tr>
                        <td height={40} align="left" valign="middle">
                          <img src="images/support/ic_place_24px.svg" width={13} height={19} alt="ic_place" />
                        </td>
                        <td align="left" valign="middle">
                          Suite 8 25 Claremont Street, South Yarra, Victoria 3141 Australia
                        </td>
                      </tr>
                      <tr>
                        <td height={40} align="left" valign="middle">
                          <img src="images/support/ic_local_phone_24px.svg" width={16} height={16} alt="ic_phone" />
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
                </div>
                <div className="tab-pane" id="tab_default_4">
                  <p />
                  <p>
                  </p><table width="100%" border={0} align="center" cellPadding={2} cellSpacing={2}>
                    <tbody><tr>
                        <td height={50} colSpan={2} align="center" valign="middle" className="text-center">
                          <p className="post_adrs_label">Head Office Address:</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="10%" height={40} align="left" valign="top">
                          <img src="images/support/ic_place_24px.svg" width={13} height={19} alt="place" />
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
                        <td align="left" valign="middle">
                          Support: +44(0) 020 3286 6726
                        </td>
                      </tr>
                    </tbody></table>
                  <p />
                  <p />
                </div>
              </div>
            </div>
            <div className="clear20" />
            <div>
              <img src="images/map.jpg" className="img-responsive" alt="map" />
            </div>
          </div>
        </div>
        <div className="clearfix" />
		<style dangerouslySetInnerHTML={{__html: ` .login_bg { background: none; } `}} />
      </div>
		);
	}
}