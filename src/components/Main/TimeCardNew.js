import React , { Component } from "react";
import { API } from "aws-amplify";

export default class TimeCard extends Component {


	constructor(props)
	{
		super();
		this.state = {
      	errormessage:"",
      	isLoading: true,
      	SubView: "List",
      	Update: false,
      	timecards: []
    };

    //this.validateForm = this.validateForm.bind(this);
	}

    async componentDidMount() {

    try {
      const result = await this.timecards();
      //console.log(result.items);
      if(result.status){
        this.setState({ timecards: result.items, isLoading: false });
      }
    } catch (e) {
        alert(e);
    }
  }



timecards() {
	  return API.get("timecards", "/timecards");
}


  handleSubView = (element, clear) => async event => {
      event.preventDefault();
      this.setState({ SubView: element });
      if(clear){
        
      }
  }

  renderList(timecards, view) {
    
    if(view === 'mobile'){
      return timecards.map((timecard, i) =>
        <tr  key={i}>
        <td align="center">16/12/2017</td>
        <td align="center">Endemol Shine Australia</td>
        <td align="center">
          <div className="col-xs-6 p0 text-center timecard_dele">
            <a href="javascript:void(0)" onClick={this.handleSubView('Add', true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
                <path id="ic_create_24px" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
  </svg>
  </a>
  </div>
          
          
          <div className="col-xs-6 p0 pull-right text-center timecard_dele">
            <a href="#" data-toggle="modal" data-target="#exampleModalCenter">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1700 296 15 19.286">
                
                <path id="ic_delete_24px" className="cls-1" d="M6.071,20.143a2.149,2.149,0,0,0,2.143,2.143h8.571a2.149,2.149,0,0,0,2.143-2.143V7.286H6.071ZM20,4.071H16.25L15.179,3H9.821L8.75,4.071H5V6.214H20Z" transform="translate(1695 293)"/>
  </svg>
  </a>
  </div>
          
          </td>
      </tr>
      );
    }

    else{
      return timecards.map((timecard, i) =>

      	<tr key={i}>
        <td align="center">{new Date(timecard.PeriodEnding * 1000).getDate()}/{new Date(timecard.PeriodEnding * 1000).getMonth()+1}/{new Date(timecard.PeriodEnding * 1000).getFullYear()}</td>
        <td align="center">{timecard.Company[0].Name}</td>
        <td align="center">{timecard.TotalHours}</td>
        <td align="center">
          <div className="col-sm-6 p0 text-center timecard_edit6">
            <a href="javascript:void(0)" onClick={this.handleSubView('Add', true)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
                <path id="ic_create_24px" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
  </svg>
  </a>
  </div>
          
          
          <div className="col-sm-6 p0 pull-right text-center timecard_dele">
            <a href="#" data-toggle="modal" data-target="#exampleModalCenter">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1700 296 15 19.286">
                
                <path id="ic_delete_24px" className="cls-1" d="M6.071,20.143a2.149,2.149,0,0,0,2.143,2.143h8.571a2.149,2.149,0,0,0,2.143-2.143V7.286H6.071ZM20,4.071H16.25L15.179,3H9.821L8.75,4.071H5V6.214H20Z" transform="translate(1695 293)"/>
  </svg>
  </a>
  </div>
          
          </td>
      </tr>

      );
    }
  }

  renderListView(view) {
    if(view === 'mobile'){

      return (
        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
          <div className="res_top_timecard">
           
             <div className="col-xs-2 chev_res_let">
               <a href="javascript:void(0)" onClick={this.props.handleView('Home')}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
                 <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"/>
               </svg>
               </a> </div>
             <div className="col-xs-8 text-center">Digital Timesheet</div>
             <div className="col-xs-2">
              <button type="button" className="btn btn-primary pull-right btn_add_res_time" style={{backgroundColor: 'transparent'}}   onClick={this.handleSubView('Add', true)}>+</button>
             </div>

           </div>
          
          <div className="clear10"></div>

          <table className="table table-bordered table-sm timecard_table_res">
               <thead>
			      <tr>
			        <th width="30%" align="center">Pay Ending</th>
			        <th width="50%" align="center">Production Name</th>
			        <th width="20%" align="center">&nbsp;</th>
			      </tr>
			    </thead>
              <tbody>

                {!this.state.isLoading ? this.state.timecards.length === 0? 
                  <tr key="empty"><td align="center" colSpan="3">No data found.</td></tr> : 
                  this.renderList(this.state.timecards, view) : <tr key="empty"><td align="center" colSpan="3"><strong>Loading....</strong></td></tr>}

              </tbody>
            </table>
         </div>
        );

    }else{
      return (
        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
        	<button type="button" className="btn btn-primary pull-right plus_icon_table"  onClick={this.handleSubView('Add', true)}>+</button>
        
          
            <div className="clear10"></div>
            
            <table className="table table-bordered table-sm timecard_table">
              
                <tr className="table_blue_hdr">
                  <td width="30%" align="center">Pay Ending</td>
                  <td width="35%" align="center">Production Name</td>
                  <td width="25%" align="center">Total Hours</td>
                  <td width="10%" align="center">&nbsp;</td>
                </tr>
              
              <tbody>
                {!this.state.isLoading ? this.state.timecards.length === 0? 
                  <tr key="empty"><td align="center" colSpan="4">No data found.</td></tr> : 
                  this.renderList(this.state.timecards, view) : <tr key="empty"><td align="center" colSpan="4"><strong>Loading....</strong></td></tr>}
                
                </tbody>
            </table>
        </div>
      );
    }
  }


renderAddView(view) {
    return(
      <div style={{color: '#707070'}}>
       <div className="">
          
          
           
          <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
     
        <div className="heading_1">Digital Timesheet</div>
             <div className="clear20"></div>
             
             <div className="col-sm-8 profile_setting_pop">
      
                         <form className="form-horizontal" action="/action_page.php">
  <div className="form-group">
    <label className="control-label col-sm-4" for="Company">Company:</label>
    <div className="col-sm-8">
    <select className="form-control pro_input_pop" name="" placeholder="Jessie" type="First Name">
      <option>Threadgold Plumer Hood</option>
     </select>
    
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" for="Production">Production:</label>
    <div className="col-sm-8">
      <input className="form-control pro_input_pop" id="Wanted 3" placeholder="Wanted 3" type="Wanted 3" />
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4 col-md-4" htmlFor="Email">Period Ending:</label>
    <div className="col-sm-6 col-md-4">
      <input className="form-control pro_input_pop" id="date" placeholder="07/01/2018" type="date" />
    </div>
    <div className="col-sm-1 col-md-1 calendar_time2 timecard_cldr2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
        <a href="#">
        <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
        </a></svg>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Department:</label>
    <div className="col-sm-8">
      <input className="form-control pro_input_pop" id="Accouting" placeholder="Accouting" type="Accouting" />
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Position:</label>
    <div className="col-sm-8">
      <input className="form-control pro_input_pop" id="Accouting" placeholder="Accouting" type="Accouting" />
    </div>
  </div>
  
  
  
  <div className="clear20"></div>


 

</form> 










         </div>

           
           </div>
          
          
          
          <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg ">
     
           
          
<div className="clear10"></div>
           <table className="table table-bordered table-sm timecard2_table">
    <thead>
      <tr>
        <th width="20%" align="center">Date</th>
        <th width="20%" align="center">Day</th>
        <th width="10%" align="center">Start</th>
        <th width="10%" align="center">Meal</th>
        <th width="10%" align="center">Finish</th>
        <th width="10%" align="center">Hours</th>
        <th width="10%" align="center">Note</th>
        <th width="10%" align="center">&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">notes</td>
        <td align="center">
          <div className="col-sm-12 p0 text-center timecard_dele">
            <a href="timecard_2.html">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
                <path id="ic_create_24px" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
                </svg>
              </a>
            </div>
          
          
          
          
          </td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">notes</td>
        <td align="center"> <div className="col-sm-12 p0 text-center timecard_dele"> <a href="timecard_2.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
            <path id="ic_create_24px2" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
            </svg>
          </a> </div></td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">notes</td>
        <td align="center"> <div className="col-sm-12 p0 text-center timecard_dele"> <a href="timecard_2.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
            <path id="ic_create_24px10" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
            </svg>
          </a> </div></td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">notes</td>
        <td align="center"> <div className="col-sm-12 p0 text-center timecard_dele"> <a href="timecard_2.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
            <path id="ic_create_24px11" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
            </svg>
          </a> </div></td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">notes</td>
        <td align="center"> <div className="col-sm-12 p0 text-center timecard_dele"> <a href="timecard_2.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
            <path id="ic_create_24px12" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
            </svg>
          </a> </div></td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">notes</td>
        <td align="center"> <div className="col-sm-12 p0 text-center timecard_dele"> <a href="timecard_2.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
            <path id="ic_create_24px13" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
            </svg>
          </a> </div></td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">notes</td>
        <td align="center"> <div className="col-sm-12 p0 text-center timecard_dele"> <a href="timecard_2.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
            <path id="ic_create_24px14" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
            </svg>
          </a> </div></td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">notes</td>
        <td align="center"> <div className="col-sm-12 p0 text-center timecard_dele"> <a href="timecard_2.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
            <path id="ic_create_24px15" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
            </svg>
          </a> </div></td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">0:00</td>
        <td align="center">notes</td>
        <td align="center"> <div className="col-sm-12 p0 text-center timecard_dele"> <a href="timecard_2.html">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
            <path id="ic_create_24px16" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
          </svg>
        </a> </div></td>
      </tr>
    </tbody>
  </table>
            <div className="clear10"></div>
                  <div className="col-sm-6 p0">
         <button type="button" href="#" className="btn_copy_time"  data-toggle="modal" data-target="#exampleModalCenter2">
                            
       
                           <span>Copy Last Weeks Times</span></button>
      </div>
      
          <div className="col-sm-6 p0">
          
          <div className="pull-right ">         <button type="button" href="#" className="btn_price_time2">
                            
       
                           <span>29.45</span></button></div>
          
           <div className="pull-right label_timecard2">Total(Hrs):</div>
           
          </div>
          
          
          
            <div className="clear40"></div>






  <div className="col-sm-12">

<div className="heading_1">Attachment</div>
             <div className="clear20"></div>

  <div className="col-sm-12 attchment_bottom_label">

<strong>No Records found</strong>

       <div className="clear20"></div>
       
       
         <div className="col-sm-8 p0">
         
         <div className="drag_drop_box">
         
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="8655 7398 52 34.667">
  <path id="ic_backup_24px" className="cls-1" d="M41.925,17.087a16.234,16.234,0,0,0-30.333-4.333A12.995,12.995,0,0,0,13,38.667H41.167a10.8,10.8,0,0,0,.758-21.58ZM30.333,23.5v8.667H21.667V23.5h-6.5L26,12.667,36.833,23.5Z" transform="translate(8655 7394)"/>
</svg>
  <div className="clear10"></div>
         Drag files in or click to upload
         </div>
            <div className="clear40"></div>
         </div>
       
       

 </div>
 
 
 
 
   <div className="col-sm-6">
            <div className="btn_cance_save">
       <input name="" className="btn_save_pro" value="Save" type="button" />
       <input name="" className="btn_cancel_pro" value="Cancel" type="button"  onClick={this.handleSubView('List')} />
       </div>
    
        </div>
        
        <div className="col-sm-6">
            <div className="btn_cance_save pull-right">
             <input name="" className="btn_submit_time" value="Submit" type="button" />
       <input name="" className="btn_prview_time" value="Preview" type="button" />
      
       </div>
    
        </div>
       
         </div>
       
       
       
       
       
       
       
       
       
       
       
       
           </div>
           
           
            <div className="clear10"></div>
           
   
      
      
      
      
      
      
      
      
        

      

        <div className="clear20"></div>


    </div>


     <div className="clearfix"></div>
    





<div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
     
           <div className="res_top_timecard">
           
           <div className="col-xs-2 chev_res_let">
             <a  href="javascript:void(0)" onClick={this.handleSubView('List')}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
               <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"></path>
             </svg>
             </a> </div>
           <div className="col-xs-8 text-center">Digital Timesheet</div>
                <div className="clear20"></div>

           </div>
          
<div className="clear5"></div>
           
           <div className="col-xs-12 profile_setting_pop p0">
      
                          


 <div className="clear5"></div>


<div className="col-sm-12 p0">



  <div className="col-sm-6 p0">
         <button type="button" href="#" className="btn_copy_time" data-toggle="modal" data-target="#exampleModalCenter2">
                            
       
                           <span>Copy Last Weeks Times</span></button>
      </div>
   <div className="clear20"></div>
  <table className="table table-bordered table-sm timecard2_table res_table_time_svg5">
    <thead>
      <tr>
        <th width="20%" align="center">Date</th>
        <th width="20%" align="center">Day</th>
        <th width="10%" align="center">Hours</th>
        <th width="10%" align="center">&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
</svg>
          
          
          
          
          </td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
</svg>
          </td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
</svg>
          </td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
</svg>
          </td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
</svg>
          </td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
</svg>
          </td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
</svg>
          </td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
</svg>
          </td>
      </tr>
      <tr>
        <td align="center">16/12/2017</td>
        <td align="center">Mon</td>
        <td align="center">0:00</td>
        <td align="center"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
</svg>
          </td>
      </tr>
    </tbody>
  </table>
       <div className="clear5"></div>
  
 <div className="col-sm-6 p0">
          
          <div className="pull-right ">         <button type="button" href="#" className="btn_price_time2">
                            
       
                           <span>29.45</span></button></div>
          
           <div className="pull-right label_timecard2">Total(Hrs):</div>
           
          </div>
 
     
        
  
   
         <div className="clear40"></div>
     <div className="clear20"></div>
       
         </div>



         </div>
   
    
      
      
 
             <div className="clear40"></div>
           </div> </div>

      );
  }

  render()
    {
        return (
          <div className="col-xs-12  col-sm-9 col-md-10 pull-right mrg_dashboard_right">
            <div className="clear40"></div>
          
            
              {this.state.SubView === 'List' ? this.renderListView('web') : ""}
              {this.state.SubView === 'Add' ? this.renderAddView('web') : ""}
           
            {/* Web view End */} 
           
           
          
            
            {this.state.SubView === 'List' ? this.renderListView('mobile') : ""}
            
        

<div className="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered timecard_2popup" role="document">
    <div className="modal-content">
      <div className="modal-header modal_header_register">
       
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body register_suc register_popup">
      
              <button type="button" href="#" className="btn_copytime">
                            
                         
                           <span>Copy Yesterdays Times</span></button>
      
       <div className="clear20"></div>
       
       

       <div className="col-sm-12 profile_setting_pop">
      
                         <form className="form-horizontal" action="/action_page.php">
  <div className="form-group">
    <label className="control-label col-sm-4" for="Pay As">Pay As</label>
    <div className="col-sm-8">
     <select name=""  className="form-control pro_input_pop">
       <option>Work</option>
     </select>
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" for="Last Name">Date</label>
    <div className="col-sm-6">
      <input type="Last Name" className="form-control pro_input_pop" id="Date" placeholder="07/01/2018" />
    </div>
    <div className="col-sm-2 time_card_popup3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
        <a href="#">
        <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
        </a></svg>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Email">Day</label>
    <div className="col-sm-8 text-left">
     Mon
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Start Work</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" />
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Meal Break</label>
    <div className="col-sm-3">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" />
    </div>
    
      <div className="col-sm-2">
          
            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true" ref={(el) => {
                    if (el) {
                      el.style.setProperty('margin-bottom', '0px', 'important');
                    }
                }} >
              
                <div className="panel panel-default">
                    
                    <span className="side-tab" data-target="#tab2" data-toggle="tab" role="tab" aria-expanded="false">
                        <div className="panel-heading" role="tab" id="headingTwo" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            <h4 className="panel-title collapsed"><img src="images/popup_top.png" alt="" /></h4>
                        </div>
                    </span>

                    
                </div>
           
                
            </div> 
             
    
     
     
    </div>
    
    
    
    
  </div>
  
  <div id="collapseTwo" className="panel-collapse collapse box_pop_time5" role="tabpanel" aria-labelledby="headingTwo">
                        <div className="panel-body">
                        
                        
                        <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Start Work</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" />
    </div>
  </div>
  
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Finish MB1</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" />
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Start MB2</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" />
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Finish MB2</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" />
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Start MB3</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" />
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">SFinish MB3</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" />
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-7" for="Mobile">Non Deductible MB1:</label>
    <div className="col-sm-1 checkbox_popuptime">
    <input name="" type="checkbox" value="" />
     
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-7" for="Mobile">Non Deductible MB2:</label>
    <div className="col-sm-1 checkbox_popuptime">
    <input name="" type="checkbox" value="" />
     
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-7" for="Mobile">Non Deductible MB3:</label>
    <div className="col-sm-1 checkbox_popuptime">
    <input name="" type="checkbox" value="" />
     
    </div>
  </div>
                        
                        
                        
                        
                        
                        </div>
                    </div>
  
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Finish Work</label>
    <div className="col-sm-8">
      <input type="Mobile" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" />
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Total Hours</label>
    <div className="col-sm-8 text-left">
      0:00
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" for="Mobile">Note</label>
    <div className="col-sm-8">
     <textarea name="" cols="" className="form-control pro_input_pop" rows=""></textarea>
    </div>
  </div>
  
  
  
  <div className="clear20"></div>

<div className="btn_cance_save">
       <input name="" className="btn_save_pro" value="Save" type="button" />
       <input name="" className="btn_cancel_pro" value="Cancel" type="button" />
       </div>
</form> 

<div className="btn_cance_save2">
       <input name="" type="button" className="btn_save_pro" value="Save" />
       <input name="" type="button" className="btn_cancel_pro" value="Cancel" />
       </div>
         </div>
<div className="clear10"></div>

       
      </div>
      
    </div>
  </div>
</div>


          <div className="clearfix"></div>

          <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modla_error_timecard" role="document">
    <div className="modal-content">
      <div className="modal-header modal_header_register">
       
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body register_suc register_popup">
      
      
      
       <div className="clear20"></div>
       <div className="col-sm-12 p0">
       
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="8680 5966 90 77.727">
  <path id="ic_warning_24px" className="cls-1" d="M1,79.727H91L46,2ZM50.091,67.455H41.909V59.273h8.182Zm0-16.364H41.909V34.727h8.182Z" transform="translate(8679 5964)"/>
</svg>

       
         <div className="clear20"></div>
       
       
       Do you want to delete the Timecard?
         <div className="clear40"></div>
         
         <div className="col-sm-12">
    <div className="center_btn_pop3">
       <input name="" className="btn_cancel_pro" value="Cancel" type="button" />
           <input name="" className="btn_delete_error" value="Delete" type="button" />
       </div></div>
       
          </div>
       
       
       
       
       
       
       
       
       
       
       
      
    
    
      
    

<div className="clear10"></div>

       
      </div>
      
    </div>
  </div>
</div>
		</div>
        );
    }
}