import React , { Component } from "react";
import { API, Storage } from "aws-amplify";
import $ from 'jquery';
import Dropzone from 'react-dropzone'
import { TimePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import '../../antd_custom.css';
export default class TimeCard extends Component {


	constructor(props)
	{
		super();
		this.state = {
        format:"HH:mm",
      	errormessage:"",
        isLoading: true,
      	isUploading: false,
      	SubView: "List",
        Update: false,
      	ItemIndex: false,
      	timecards: [],
        companies: [],
        formValid: false,
        CompanyValid: true,
        DeleteId: false,
        DeleteIndex: false,

        Production: "",
        Activity: "",
        Company: "",
        CustomTimeCardFields: "",
        Dept: "",
        FileAttachments: [],
        PayFrequency: "Monthly",
        PeriodEnding: "",
        Position: "",
        Times: "",
        TotalHours: "0.00",
        Type: "Draft",

        DailyTimes: [],
        TimesCustomTimeFields: [],
        TimesTotalHours: '0.00',
        files: [],
        
        Payas: [
          {"Flag": "CON", "Value": "Worked"},
          {"Flag": null, "Value": "Did Not Work" },
          {"Flag": "SIC", "Value": "Sick"},
          {"Flag": "ANL", "Value": "Annual Leave"},
          {"Flag": "PUB", "Value": "Public Holiday"}
        ],

        DayTimeIndex: 0,
        DayTimeDate: "",
        DayTimeDay: "",
        DayTimeFinish: "0.00",
        DayTimeFinishMeal1: "0.00",
        DayTimeFinishMeal2: "0.00",
        DayTimeFinishMeal3: "0.00",
        DayTimeMB1ND: false,
        DayTimeMB2ND: false,
        DayTimeMB3ND: false,
        DayTimeNote: "",
        DayTimePayas: "",
        DayTimeStart: "0.00",
        DayTimeStartMeal: "0.00",
        DayTimeStartMeal2: "0.00",
        DayTimeStartMeal3: "0.00",
        TimeStamp: "1523884860",
        DayTimeTotalHours: "0.00",
        DayTimeTotalMBDed: "0.00",
        DayTimeTravel1: "0.00",
        DayTimeTravel2: "0.00",

        DayTimeMBDed1: "0.00",
        DayTimeMBDed2: "0.00",
        DayTimeMBDed3: "0.00",

    };

    //this.validateForm = this.validateForm.bind(this);
    //this.handleChangeDayTimeFinish = this.handleChangeDayTimeFinish.bind(this);
	}

  async componentDidMount() {
    
    this.setState({ SubView: this.props.main.SubView });
    try {
      const result = await this.timecards();
      //console.log(result.items);
      if(result.status){
        this.setState({ timecards: result.items, isLoading: false });
      }
    } catch (e) {
        alert(e);
    }

    try {
      const result = await this.companies();
      //console.log(companies);
      if(result.status){
        this.setState({ companies: result.items, items: result.items, isLoading: false });
      }
    } catch (e) {
        alert(e);
    }
  }

  onDrop(files) {
    var selected_files = this.state.files;
    files.forEach(file => {
       selected_files.push(file); 
    });
    //var selected_files = files;
    this.setState({
      files : selected_files
    });
    //console.log(this.state.files);
  }

  handleUploadFiles = event => {
    this.setState({ isUploading: true });
    var files = this.state.files;
    var total_files = files.length;
    var files_count = 0;
    files.forEach(file => {
       //console.log(file);
       files_count++;
        Storage.put('timecards/'+file.name, file)
            .then (result => {
              var uploadedObj = {
                "ContentType": "UTF-8",
                "DocDesc": "Phone Bill",
                "DoumentType": file.type,
                "Encrypted": "No",
                "filename": file.name,
                "PWHash": "a7e7ef%^%*&(7ke834",
                "Salt": "HFHHGVHJBJB",
                "Timestamp": new Date().getTime(),
                "url": "https://s3.amazonaws.com/freelance-app-uploads/public/"+result.key
              }
              console.log(uploadedObj);
              this.state.FileAttachments.push(uploadedObj);
              
              if(files_count === total_files)
                this.setState({ isUploading: false });

        }).catch(err => console.log(err));
    });

    //this.setState({ isUploading: false });

  }

  handleChange = event => {

    const name = event.target.name;
    const value = event.target.value;
    const ValidStateName = name+'Valid';
    this.setState({[ValidStateName]: true });
    this.setState({[name]: value}, 
                () => { this.validateField(name, value, ValidStateName) });
  }

  handleChangeDayTime = event => {

    const name = event.target.name;
    const value = event.target.value;
    //alert(name);
    if(name === 'DayTimeMB1ND' || name === 'DayTimeMB2ND' || name === 'DayTimeMB3ND'){
      this.setState({[name]: event.target.checked});
    }
    else if(name === 'DayTimeDate'){
      var d = new Date(value);
      var weekday = new Array(7);
      weekday[0] = "Sunday";
      weekday[1] = "Monday";
      weekday[2] = "Tuesday";
      weekday[3] = "Wednesday";
      weekday[4] = "Thursday";
      weekday[5] = "Friday";
      weekday[6] = "Saturday";
      
      this.setState({[name]: value, DayTimeDay:weekday[d.getDay()] });
    }
    /*else if(name === 'DayTimeFinish'){
      var WorkingHoure = parseFloat(this.state.DayTimeFinish - this.state.DayTimeStart).toFixed(1);
      //console.log(parseFloat(WorkingHoure).toFixed(2));
      this.setState({[name]: value, DayTimeTotalHours: WorkingHoure });
    }*/
    else{
      this.setState({[name]: value});
    }
    
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
    this.setState({formValid: this.state.CompanyValid});
  }

  handleSubmit = async event => {
    event.preventDefault();
    
    this.setState({isLoading: true });
//alert(this.state.formValid); return false;

    if(this.state.formValid){
      const item = {
          "Production": this.state.Production,
          "Activity": this.state.Activity,
          "Company": this.state.Company,
          "CustomTimeCardFields": this.state.CustomTimeCardFields,
          "Dept": this.state.Dept,
          "FileAttachments": this.state.FileAttachments,
          "PayFrequency" : this.state.PayFrequency,
          "PeriodEnding": this.state.PeriodEnding,
          //"Pos": this.state.Pos,
          "Position": this.state.Position,
          //"Times": this.state.Times,
          "Times": [{CustomTimeFields:this.state.TimesCustomTimeFields, DailyTimes: this.state.DailyTimes, TotalHours: this.state.TimesTotalHours}],   
          "TotalHours": this.state.TotalHours,
          "Type": this.state.Type,
      }
//alert('ddd');
//console.log(item);
//return false;
//alert(this.state.Update);
      try {

        if(!this.state.Update){
          const response = await this.createTimeCard(item);

          if(response.status){
            this.saveActivity("Timecard has been created");
            const items = this.state.timecards;
            items.push(response.result);
            this.setState({ timecards: items });
            alert('Successfully saved.');

            this.clearTimeCardStats();
          }
        }else{
          const response = await this.updateTimeCard(item);
          //console.log(response);
          //return false;
          if(response.status){
            var timecards = this.state.timecards;
            timecards[this.state.ItemIndex] = response.result;
            //this.saveActivity("Timecard has been edit");
            console.log(timecards);
            alert('Successfully updated.');
            this.setState({timecards: timecards });
            this.clearTimeCardStats();
          }
        }

      }catch (e) {
          alert(e);
      }
      this.setState({isLoading: false });

    }else{
      this.setState({isLoading: false, CompanyValid:false});
    }
    
  }

  handleUpdate = (Id, index) => async event => {
  //alert(Id);
    const item = this.state.timecards[index];
    //console.log(item.Times[0].DailyTimes);
    this.setState({
      SubView: 'Add',
      Update: item.Guid? item.Guid : "",
      ItemIndex: index,
      DailyTimes: item.Times[0].DailyTimes? item.Times[0].DailyTimes : [],
      TimesCustomTimeFields: item.Times[0].CustomTimeFields? item.Times[0].CustomTimeFields : [],
      TimesTotalHours: item.Times[0].TotalHours? item.Times[0].TotalHours : "0.00",
      Production: "",
      Activity: item.Activity? item.Activity : "",
      Company: item.Company? item.Company : "",
      CustomTimeCardFields: item.CustomTimeCardFields? item.CustomTimeCardFields : "",
      Dept: item.Dept? item.Dept : "",
      FileAttachments: item.FileAttachments? item.FileAttachments : "",
      PayFrequency: item.PayFrequency? item.PayFrequency : "",
      PeriodEnding: item.PeriodEnding? new Date(item.PeriodEnding).getFullYear()+"-"+String((new Date(item.PeriodEnding).getMonth()+1)).padStart(2,0)+"-"+String(new Date(item.PeriodEnding).getDate()).padStart(2,0) : "",
      //Pos: item.Pos? item.Pos : "",
      Position: item.Position? item.Position : "",
      Times: item.Times? item.Times : "",
      TotalHours: item.TotalHours? item.TotalHours : "",
      Type: item.Type? item.Type : "",

    });
    //console.log(this.state.Times);    
  }

  handleDeleteBtn = (id, index) => async event => {
    this.setState({DeleteId: id, DeleteIndex: index});
    $('#exampleModalDeleteBtn').click()
  }

  handleDelete = async event => {
    //alert(this.state.DeleteId);
    try {
       const item = await this.deleteTimeCard();
       if(item.status){
          //alert('Successfully Deleted.');
          var items = this.state.timecards;
          delete items[this.state.DeleteIndex];
          this.setState({DeleteId: false, DeleteIndex: false, timecards: items});
       }else{
        alert('Ooopsss....');
       }
    } catch (e) {
        alert(e);
    }
    $('#exampleModalDeleteClose').click();
  }

  handleDayTime = (index, SubView) => async event => {
      //alert(index);
      let day = this.state.DailyTimes[index];
      //console.log(this.getDateFormate(day.Date, 1));

      this.setState({
        SubView: SubView,
        DayTimeIndex: index,
        DayTimeDate: day.Date? this.getDateFormate(day.Date, 1) : "",
        DayTimeDay: day.Day,
        DayTimeFinish: day.Finish,
        DayTimeFinishMeal1: day.FinishMeal1,
        DayTimeFinishMeal2: day.FinishMeal2,
        DayTimeFinishMeal3: day.FinishMeal3,
        DayTimeMB1ND: day.MB1ND === '0'? false : true,
        DayTimeMB2ND: day.MB2ND === '0'? false : true,
        DayTimeMB3ND: day.MB3ND === '0'? false : true,
        DayTimeNote: day.Note? day.Note : '',
        DayTimePayas: day.Payas,
        DayTimeStart: day.Start,
        DayTimeStartMeal: day.StartMeal,
        DayTimeStartMeal2: day.StartMeal2,
        DayTimeStartMeal3: day.StartMeal3,
        DayTimeTimeStamp: day.TimeStamp,
        DayTimeTotalHours: day.TotalHours,
        DayTimeTotalMBDed: day.TotalMBDed,
        DayTimeTravel1: day.Travel1,
        DayTimeTravel2: day.Travel2
      });
      
      if(SubView === 'Add')
        $('#WeekTimesModalCenterBtn').click();
  }

  handleSaveDayTime = (index, SubView) => async event => {
    //alert(index);
      //alert(index);
      let DailyTimes = this.state.DailyTimes;
      //console.log(day.Day);

      var dayTimeObj = {
        "Date": this.state.DayTimeDate? new Date(this.state.DayTimeDate).getTime()/1000 : '',
        "Day": this.state.DayTimeDay,
        "Finish": this.state.DayTimeFinish,
        "FinishMeal1": this.state.DayTimeFinishMeal1,
        "FinishMeal2": this.state.DayTimeFinishMeal2,
        "FinishMeal3": this.state.DayTimeFinishMeal3,
        "MB1ND": this.state.DayTimeMB1ND? '1' : '0',
        "MB2ND": this.state.DayTimeMB2ND? '1' : '0',
        "MB3ND": this.state.DayTimeMB3ND? '1' : '0',
        "Note": this.state.DayTimeNote,
        "Payas": this.state.DayTimePayas,
        "Start": this.state.DayTimeStart,
        "StartMeal": this.state.DayTimeStartMeal,
        "StartMeal2": this.state.DayTimeStartMeal2,
        "StartMeal3": this.state.DayTimeStartMeal3,
        "TimeStamp": new Date().getTime()/1000,
        "TotalHours": this.state.DayTimeTotalHours,
        "TotalMBDed": this.state.DayTimeTotalMBDed,
        "Travel1": "0.00",
        "Travel2": "0.00"
      };

      DailyTimes[index] = dayTimeObj;

      //console.log(DailyTimes);
      this.setState({DailyTimes: DailyTimes});
      
      if(SubView === 'Add'){
        $('#WeekTimesModalCenterClose').click();
      }
      else{
        this.setState({SubView: SubView});
      }
  }

  clearTimeCardStats(){

    this.setState({
      SubView: 'List',
      Update: false,
      ItemIndex: false,
      DailyTimes: [],
      TimesCustomTimeFields: [],
      TimesTotalHours: '0.00',
      files: [],
      Production: "",
      Activity: "",
      Company: "",
      CustomTimeCardFields: "",
      Dept: "",
      FileAttachments: [],
      PayFrequency: "Monthly",
      PeriodEnding: "",
      Position: "",
      Times: [],
      TotalHours: "0.00",
      Type: "Draft",
    });

  }

handleChangeDayTimeFinish(time, timeString){
    console.log(timeString);
    this.setState({DayTimeFinish: timeString});
}


timecards() {
	  return API.get("timecards", "/timecards");
}

getTimeCard(id) {
      return API.get("timecards", `/timecards/${id}`);
}

createTimeCard(item) {
    return API.post("timecards", "/timecards", {
      body: item
    });
}

updateTimeCard(item) {
    return API.put("timecards", `/timecards/${this.state.Update}`, {
      body: item
    });
}

deleteTimeCard() {
    return API.del("timecards", `/timecards/${this.state.DeleteId}`);
}

companies() {
  return API.get("company", "/company?search="+this.state.Search);
}

getDateFormate(date, formate) {
  
  var datestring = date*1000;
  if(formate === 1){
    return new Date(datestring).getFullYear()+'-'+String(new Date(datestring).getMonth()+1).padStart(2,0)+'-'+String(new Date(datestring).getDate()).padStart(2,0);
  }
  return date;

}


  handleSubView = (element, clear) => async event => {
      event.preventDefault();
      this.setState({ SubView: element, isLoading: false });
      if(clear === 'Yes'){
        this.setState({ 
          SubView: element,
          formValid: false,
          Update: false,
          ItemIndex: false,
          DailyTimes: [],
          TimesCustomTimeFields: [],
          TimesTotalHours: '0.00',
          files: [],
          Production: "",
          Activity: "",
          Company: "",
          CustomTimeCardFields: "",
          Dept: "",
          FileAttachments: [],
          PayFrequency: "Monthly",
          PeriodEnding: "",
          Position: "",
          Times: [],
          TotalHours: "0.00",
          Type: "Draft",
        });
      }
  }

  createActivitylog(item) {
    return API.post("activitylog", "/activitylog", {
      body: item
    });
  }

  saveActivity(Description){
    const item = {
      "Description": Description,
      "IPAddress": "192.11.98.9",
      "Type": "TIMECARD"  
    }
    try {
        const response = this.createActivitylog(item);
        console.log("Add Activity Response:"+response);
    }catch (e) {
      console.log("Add Activity Error:"+e);
    }
  }
  
  renderPayasDropdown() {
    return this.state.Payas.map((obj, i) =>
       <option value={obj.Value}>{obj.Value}</option>
    );
  }

  renderList(timecards, view) {
    
    if(view === 'mobile'){
      return timecards.map((timecard, i) =>
        <tr  key={i}>
        <td align="center">{String(new Date(timecard.PeriodEnding).getDate()).padStart(2,0)}/{String(new Date(timecard.PeriodEnding).getMonth()+1).padStart(2,0)}/{new Date(timecard.PeriodEnding).getFullYear()}</td>
        <td align="center">{timecard.Company[0].Name}</td>
        <td align="center">
          <div className="col-xs-6 p0 text-center timecard_dele">
            <a href="javascript:void(0)" onClick={this.handleUpdate(timecard.Guid, i)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
                <path id="ic_create_24px" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
              </svg>
            </a>
          </div>
          
          
          <div className="col-xs-6 p0 pull-right text-center timecard_dele">
            <a href="javascript:void(0)" onClick={this.handleDeleteBtn(timecard.Guid, i)}>
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
        <td align="center">{String(new Date(timecard.PeriodEnding).getDate()).padStart(2,0)}/{String(new Date(timecard.PeriodEnding).getMonth()+1).padStart(2,0)}/{new Date(timecard.PeriodEnding).getFullYear()}</td>
        <td align="center">{timecard.Company[0].Name}</td>
        <td align="center">{timecard.TotalHours}</td>
        <td align="center">
          <div className="col-sm-6 p0 text-center timecard_edit6">
            <a href="javascript:void(0)" onClick={this.handleUpdate(timecard.Guid, i)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
                <path id="ic_create_24px" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
  </svg>
  </a>
  </div>
          
          
          <div className="col-sm-6 p0 pull-right text-center timecard_dele">
            <a href="javascript:void(0)" onClick={this.handleDeleteBtn(timecard.Guid, i)}>
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

  renderDailyTimesList(DailyTimes, view) {
    
    if(view === 'mobile'){
      return DailyTimes.map((time, i) =>

      <tr key={i} style={{cursor: 'pointer'}} onClick={ this.handleDayTime(i, 'DayTimes') }>
        <td align="center">{String(new Date(time.Date * 1000).getDate()).padStart(2,0)}/{String(new Date(time.Date * 1000).getMonth()+1).padStart(2,0)}/{new Date(time.Date * 1000).getFullYear()}</td>
        <td align="center">{time.Day}</td>
        <td align="center">{time.TotalHours}</td>
        <td align="center" style={{paddingTop: '12px'}}>
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
            <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"></path>
          </svg>
          
        </td>
      
      </tr>

      );
    }

    else{
      return DailyTimes.map((time, i) =>

      <tr key={i}>
        
        <td align="center">{String(new Date(time.Date * 1000).getDate()).padStart(2,0)}/{String(new Date(time.Date * 1000).getMonth()+1).padStart(2,0)}/{new Date(time.Date * 1000).getFullYear()}</td>
        <td align="center">{time.Day}</td>
        <td align="center">{time.Start}</td>
        <td align="center">{time.TotalMBDed}</td>
        <td align="center">{time.Finish}</td>
        <td align="center">{time.TotalHours}</td>
        <td align="center">{time.Note}</td>
        <td align="center">
          <div className="col-sm-12 p0 text-center timecard_edit6">
          <a href="javascript:void(0)" onClick={this.handleDayTime(i, 'Add')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
              <path id="ic_create_24px2" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
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
               <a href="javascript:void(0)" onClick={this.props.handleView('Home','List')}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
                 <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"/>
               </svg>
               </a> </div>
             <div className="col-xs-8 text-center">Digital Timesheet</div>
             <div className="col-xs-2">
              <button type="button" className="btn btn-primary pull-right btn_add_res_time" style={{backgroundColor: 'transparent'}}   onClick={this.handleSubView('Add', 'Yes')}>+</button>
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
        	<button type="button" className="btn btn-primary pull-right plus_icon_table"  onClick={this.handleSubView('Add', 'Yes')}>+</button>
        
          
            <div className="clear10"></div>
            
            <table className="table table-bordered table-sm timecard_table">
              <tbody>
              <tr className="table_blue_hdr">
                  <td width="30%" align="center">Pay Ending</td>
                  <td width="35%" align="center">Production Name</td>
                  <td width="25%" align="center">Total Hours</td>
                  <td width="10%" align="center">&nbsp;</td>
                </tr>
              
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

    if(view === 'mobile'){

      return (
      <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
      <div className="res_top_timecard">
           
           <div className="col-xs-2 chev_res_let">
             <a href="javascript:void(0)" onClick={this.handleSubView('List', 'Yes')}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
               <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"></path>
             </svg>
             </a> </div>
           <div className="col-xs-8 text-center">Digital Timesheet</div>
                <div className="clear20"></div>

           </div>
          
<div className="clear5"></div>
<div className="clear20"></div>
           
           <div className="col-xs-12 profile_setting_pop p0 profile_setting_pop_5">
      <div className="clear5"></div>

<form className="form-horizontal">
  <div className={!this.state.CompanyValid? 'form-group field_required' : 'form-group' }>
    <label className="control-label col-xs-4" htmlFor="Company">Company:</label>
    <div className="col-xs-8">
    <select className="form-control pro_input_pop" name="Company" defaultValue={this.state.Company} onChange={this.handleChange}>
      <option value="" >Select Company</option>
      <option value="Threadgold Plumer Hood">Threadgold Plumer Hood</option>
     </select>
    
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Production:</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" type="text"  name="Production" value={this.state.Production} onChange={this.handleChange} />
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-xs-5" htmlFor="PeriodEnding">Period Ending:</label>
    <div className="col-xs-5">
      <input className="form-control pro_input_pop" type="date" name="PeriodEnding" value={this.state.PeriodEnding} onChange={this.handleChange} />
    </div>
    <div className="col-xs-1 calendar_time2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
        <a href="#">
        <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
        </a></svg>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Dept">Department:</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" type="text" name="Dept" value={this.state.Dept} onChange={this.handleChange} />
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Position">Position:</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" type="text" name="Position" value={this.state.Position} onChange={this.handleChange} />
    </div>
  </div>
  
  
  
  <div className="clearfix"></div>


 

</form> 


 <div className="clear5"></div>
<div className="col-xs-12 p0 btn_time_time2_svg"><input name="" className="btn_time_time2" value={'Times '+this.state.TotalHours+' Hrs'} type="button" onClick={this.handleSubView('WeekTimes')} />
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19">
  <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"/>
</svg>
</div>
 <div className="clear5"></div>

<div className="col-sm-12 p0">

<div className="heading_1">Attachment</div>
             <div className="clear10"></div>

  <div className="col-sm-12 attchment_bottom_label p0">

       
       
  <div className="col-xs-12 p0">
    <Dropzone onDrop={this.onDrop.bind(this)} style={{position: "relative", cursor: 'pointer'}}>    
      <div className="drag_drop_box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="8655 7398 52 34.667">
          <path id="ic_backup_24px" className="cls-1" d="M41.925,17.087a16.234,16.234,0,0,0-30.333-4.333A12.995,12.995,0,0,0,13,38.667H41.167a10.8,10.8,0,0,0,.758-21.58ZM30.333,23.5v8.667H21.667V23.5h-6.5L26,12.667,36.833,23.5Z" transform="translate(8655 7394)"/>
        </svg>
        <div className="clear10"></div>
          Click to upload
      </div>
      <div className="clear20"></div>
    </Dropzone>
  </div>
       
       

 </div>
 
     
        
  <input name="" className="btn_submit_res3 pull-right" type="button"  value={!this.state.isLoading ? !this.state.Update? 'Submit' : 'Submit' : 'Submiting..'} disabled={this.state.isLoading} onClick={this.handleSubmit}/>
  <input name="" className="btn_prview_res3 pull-right" type="button" value="Preview" />
  <input name="" className="btn_save_res3 pull-right" type="button" value={!this.state.isUploading ? 'Save' : 'Saving..'} disabled={this.state.isUploading} onClick={this.handleUploadFiles}  />
   
         <div className="clear40"></div>
         <div className="clear20"></div>
       
         </div>



         </div>
   
    
      
      
 
             <div className="clear40"></div>
      </div>
      );
      

    }else{
      return (
 
        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
        <div className="heading_1">Digital Timesheet</div>
             <div className="clear20"></div>
             
             <div className="col-sm-8 profile_setting_pop p0">
      
<form className="form-horizontal" >
  <div className={ !this.state.CompanyValid? 'form-group field_required' : 'form-group' }>
    <label className="control-label col-sm-4 col-md-3" htmlFor="Company">Company:</label>
    <div className="col-sm-7">
    <select className="form-control pro_input_pop" name="Company" defaultValue={this.state.Company} onChange={this.handleChange}>
      <option value="">Select Company</option>
      <option value="Threadgold Plumer Hood">Threadgold Plumer Hood</option>
     </select>
    
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4 col-md-3" htmlFor="Production">Production:</label>
    <div className="col-sm-7">
      <input className="form-control pro_input_pop" type="text" name="Production"  value={this.state.Production} onChange={this.handleChange} />
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4 col-md-3" htmlFor="PeriodEnding">Period Ending:</label>
    <div className="col-sm-7 col-md-4">
      <input className="form-control pro_input_pop" type="date" name="PeriodEnding" value={this.state.PeriodEnding} onChange={this.handleChange} />
    </div>
    <div className="col-sm-1 col-md-1 calendar_time2 timecard_cldr2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
        <a href="#">
        <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
        </a></svg>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4 col-md-3" htmlFor="Dept">Department:</label>
    <div className="col-sm-7">
      <input className="form-control pro_input_pop"  type="text" name="Dept" value={this.state.Dept} onChange={this.handleChange} />
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4 col-md-3" htmlFor="Position">Position:</label>
    <div className="col-sm-7">
      <input className="form-control pro_input_pop" type="text" name="Position" value={this.state.Position} onChange={this.handleChange} />
    </div>
  </div>
  
  
  
  <div className="clear20"></div>

</form> 
</div>
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
    <tbody style={{color: '#aaaaaa'}}>
      {this.state.DailyTimes.length === 0? 
                  <tr key="empty"><td align="center" colSpan="8">No data found.</td></tr> : 
                  this.renderDailyTimesList(this.state.DailyTimes, view)}
    </tbody>
  </table>
  <div className="clear10"></div>

  <div className="col-sm-6 p0">
    <button type="button" href="#" className="btn_copy_time"  data-toggle="modal" data-target="#exampleModalCenter"><span>Copy Last Weeks Times</span></button>
  </div>
  <div className="col-sm-6 p0">
    <div className="pull-right ">
      <button type="button" href="#" className="btn_price_time2"><span>{this.state.TotalHours}</span></button>
    </div>
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
      <Dropzone onDrop={this.onDrop.bind(this)} style={{position: "relative", cursor: 'pointer'}}>
        
          <div className="drag_drop_box">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="8655 7398 52 34.667">
              <path id="ic_backup_24px" className="cls-1" d="M41.925,17.087a16.234,16.234,0,0,0-30.333-4.333A12.995,12.995,0,0,0,13,38.667H41.167a10.8,10.8,0,0,0,.758-21.58ZM30.333,23.5v8.667H21.667V23.5h-6.5L26,12.667,36.833,23.5Z" transform="translate(8655 7394)"/>
            </svg>
          <div className="clear10"></div>
          Drag files in or click to upload
          </div>
        
      </Dropzone>
        <div className="clear40"></div>
      </div>
  </div>

  <div className="col-sm-6">
    <div className="btn_cance_save">
       <input className="btn_save_pro" type="button" value="Save"  value={!this.state.isUploading ? 'Save' : 'Saving..'} disabled={this.state.isUploading} onClick={this.handleUploadFiles} />
       <input className="btn_cancel_pro" value="Cancel" type="button"  onClick={this.handleSubView('List', 'Yes')} />
    </div>
  </div>
  
  <div className="col-sm-6">
    <div className="btn_cance_save pull-right">
      <input name="" className="btn_submit_time" type="button" value={!this.state.isLoading ? !this.state.Update? 'Submit' : 'Submit' : 'Submiting..'} disabled={this.state.isLoading || this.state.isUploading} onClick={this.handleSubmit}/>
      <input name="" className="btn_prview_time" value="Preview" type="button" />
    </div>
  </div>

</div>
       
       
</div>

      );
    }
  }

  renderDayTimes(view) {
    return (
      <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
        <div className="res_top_timecard">
           
          <div className="col-xs-2 chev_res_let">
              <a href="javascript:void(0)" onClick={this.handleSubView('WeekTimes')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
                  <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"></path>
                </svg>
              </a>
          </div>
          <div className="col-xs-8 text-center">Digital Timesheet</div>
          <div className="clear20"></div>

        </div>
        <div className="clear5"></div>
        <div className="clear20"></div>
        
        <div className="col-xs-12 profile_setting_pop p0 profile_setting_pop_5">
          <div className="clear5"></div>
          <div className="col-sm-12 p0">
            <div className="col-sm-6 p0">
              <button type="button" href="#" className="btn_copy_time" data-toggle="modal" data-target=""><span>Copy Yesterdays Times</span></button>
            </div>
            <div className="clear20"></div>

<form className="form-horizontal">
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Company">Pay As</label>
    <div className="col-xs-8">
    <select className="form-control pro_input_pop" name="DayTimePayas" value={this.state.DayTimePayas} onChange={this.handleChangeDayTime}>
      {this.renderPayasDropdown()}
    </select>
    
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Email">Date</label>
    <div className="col-xs-6">
      <input className="form-control pro_input_pop" type="date" name="DayTimeDate" value={this.state.DayTimeDate} onChange={this.handleChangeDayTime}/>
    </div>
    <div className="col-xs-1 calendar_time2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
        <a href="#">
        <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
        </a></svg>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Day</label>
    <div className="col-xs-8" style={{paddingTop: '5px'}}>
      {this.state.DayTimeDay}
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Start Work</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" placeholder="0:00" type="text" name="DayTimeStart" value={this.state.DayTimeStart} onChange={this.handleChangeDayTime} />
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-5" htmlFor="Email">Meal Break</label>
    <div className="col-xs-7">
      <div className="col-xs-12 p0 btn_time_time2_svg"><input name="" className="btn_time_time2" value={this.state.DayTimeTotalMBDed} type="button" style={{borderRadius: '0', height: '35px'}} onClick={this.handleSubView('BreakTimes')} />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19" style={{ top: '11'}}>
        <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"/>
      </svg>
      </div>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Email">Finish Work:</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" placeholder="0:00" type="text" name="DayTimeFinish" value={this.state.DayTimeFinish} onChange={this.handleChangeDayTime} />
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Total Hours</label>
    <div className="col-xs-8" style={{paddingTop: '5px'}}>
      {this.state.DayTimeTotalHours}
    </div>
  </div>  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Email">Note:</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" placeholder="" type="text" name="DayTimeNote" value={this.state.DayTimeNote} onChange={this.handleChangeDayTime} />
    </div>
  </div>
  <div className="clear20"></div>
  <div className="col-sm-6 pull-right" style={{paddingRight: '0'}}>
       
       <input name="" className="btn_save_pro btn_save_pro_5" value="Save" type="button" onClick={this.handleSaveDayTime(this.state.DayTimeIndex, 'WeekTimes')} disabled={this.state.isLoading} />
       <input name="" className="btn_cancel_pro nn" value="Cancel" type="button"  onClick={this.handleSubView('WeekTimes')} />
       
    <div className="clear40"></div>
  </div>
  
  
  <div className="clearfix"></div>


 

</form> 


 <div className="clear5"></div>

       
<div className="clear40"></div>
<div className="clear20"></div>

          </div>
        </div>

        </div>
    );
  }

  renderBreakTimes(view) {
    return (
      <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
        <div className="res_top_timecard">
           
          <div className="col-xs-2 chev_res_let">
              <a href="javascript:void(0)" onClick={this.handleSubView('DayTimes')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
                  <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"></path>
                </svg>
              </a>
          </div>
          <div className="col-xs-8 text-center">Meal Break Times</div>
          <div className="clear20"></div>

        </div>
        <div className="clear5"></div>
        <div className="clear20"></div>
        
        <div className="col-xs-12 profile_setting_pop p0 profile_setting_pop_5">
          <div className="clear5"></div>
          <div className="col-sm-12 p0">
            
            

<form className="form-horizontal">
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Start MB1</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" type="text" placeholder="0:00" name="DayTimeStartMeal" value={this.state.DayTimeStartMeal} onChange={this.handleChangeDayTime} />
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Finish MB1</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" type="text" placeholder="0:00" name="DayTimeFinishMeal1" value={this.state.DayTimeFinishMeal1} onChange={this.handleChangeDayTime} />
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Start MB2</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" type="text" placeholder="0:00" name="DayTimeStartMeal2" value={this.state.DayTimeStartMeal2} onChange={this.handleChangeDayTime} />
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Finish MB2</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" type="text" placeholder="0:00" name="DayTimeFinishMeal2" value={this.state.DayTimeFinishMeal2} onChange={this.handleChangeDayTime} />
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Start MB3</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" type="text" placeholder="0:00" name="DayTimeStartMeal3" value={this.state.DayTimeStartMeal3} onChange={this.handleChangeDayTime} />
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Finish MB3</label>
    <div className="col-xs-8">
      <input className="form-control pro_input_pop" type="text" placeholder="0:00" name="DayTimeFinishMeal3" value={this.state.DayTimeFinishMeal3} onChange={this.handleChangeDayTime} />
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-6" htmlFor="Production">Non Deductible MB1</label>
    <div className="col-xs-6" style={{paddingTop: '10px'}}>
      <input type="checkbox" name="DayTimeMB1ND" onChange={this.handleChangeDayTime} checked={this.state.DayTimeMB1ND} />
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-6" htmlFor="Production">Non Deductible MB2</label>
    <div className="col-xs-6" style={{paddingTop: '10px'}}>
      <input type="checkbox" name="DayTimeMB2ND" onChange={this.handleChangeDayTime} checked={this.state.DayTimeMB2ND}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-6" htmlFor="Production">Non Deductible MB3</label>
    <div className="col-xs-6" style={{paddingTop: '10px'}}>
      <input type="checkbox" name="DayTimeMB3ND" onChange={this.handleChangeDayTime} checked={this.state.DayTimeMB3ND} />
    </div>
  </div>
  
  <div className="clear20"></div>
  <div className="col-sm-6 pull-right" style={{paddingRight: '0'}}>
       
       <input name="" className="btn_save_pro btn_save_pro_5" value="Save" type="button"  onClick={this.handleSaveDayTime(this.state.DayTimeIndex, 'DayTimes')} onClick={this.handleSubView('DayTimes')} disabled={this.state.isLoading}/>
       <input name="" className="btn_cancel_pro nn" value="Cancel" type="button"  onClick={this.handleSubView('DayTimes')} />
       
    <div className="clear40"></div>
  </div>
  
  
  <div className="clearfix"></div>


 

</form> 


 <div className="clear5"></div>

       
<div className="clear40"></div>
<div className="clear20"></div>

          </div>
        </div>

        </div>
    );
  }

  renderWeekTimes(view) {
    return (
      <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
        <div className="res_top_timecard">
           
          <div className="col-xs-2 chev_res_let">
              <a href="javascript:void(0)" onClick={this.handleSubView('Add', 'No')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
                  <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"></path>
                </svg>
              </a>
          </div>
          <div className="col-xs-8 text-center">Digital Timesheet</div>
          <div className="clear20"></div>

        </div>
        <div className="clear5"></div>
        <div className="clear20"></div>
        
        <div className="col-xs-12 profile_setting_pop p0">
          <div className="clear5"></div>
          <div className="col-sm-12 p0">
            <div className="col-sm-6 p0">
              <button type="button" href="#" className="btn_copy_time" data-toggle="modal" data-target="#exampleModalCenter2"><span>Copy Last Weeks Times</span></button>
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
      {!this.state.isLoading ? this.state.DailyTimes.length === 0? 
                  <tr key="empty"><td align="center" colSpan="8">No data found.</td></tr> : 
                  this.renderDailyTimesList(this.state.DailyTimes, view) : <tr key="empty"><td align="center" colSpan="8"><strong>Loading....</strong></td></tr>}
    </tbody>
  </table>
       <div className="clear5"></div>
<div className="col-sm-6 p0">
  <div className="pull-right "><div className="pull-right label_timecard2"><span style={{paddingLeft: '20px'}}>{this.state.TotalHours}</span></div></div>
  <div className="pull-right label_timecard2">Total(Hrs):&nbsp;</div>
</div>
<div className="clear40"></div>
<div className="clear20"></div>

          </div>
        </div>

        </div>
    );
  }

  render()
    {
        return (
          <div className="col-xs-12  col-sm-9 col-md-10 pull-right mrg_dashboard_right" style={{color: '#707070'}}>
            <div className="clear40"></div>
          
            
              {this.state.SubView === 'List' ? this.renderListView('web') : ""}
              {this.state.SubView === 'Add' ? this.renderAddView('web') : ""}
           
            {/* Web view End */} 
           
           
            
            
            {this.state.SubView === 'List' ? this.renderListView('mobile') : ""}
            {this.state.SubView === 'Add' ? this.renderAddView('mobile') : ""}
            {this.state.SubView === 'WeekTimes' ? this.renderWeekTimes('mobile') : ""}
            {this.state.SubView === 'DayTimes' ? this.renderDayTimes('mobile') : ""}
            {this.state.SubView === 'BreakTimes' ? this.renderBreakTimes('mobile') : ""}
        
          <div className="clearfix"></div>

<div className="modal fade" id="exampleModalDelete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modla_error_timecard" role="document">
    <div className="modal-content">
      <div className="modal-header modal_header_register">
       
        <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="exampleModalDeleteClose">
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
    <button type="button" className="btn_cancel_pro" data-dismiss="modal" aria-label="Close">
          Cancel
        </button>

       
           <button className="btn_delete_error" onClick={this.handleDelete} >Delete</button>
       </div></div>
       
</div>
       
       
       
       
       
       
       
       
       
       
       
      
    
    
      
    

<div className="clear10"></div>

       
      </div>
      
    </div>
  </div>
</div>

{/*WeekTimesModalCenter Start*/}
<div className="modal fade" id="WeekTimesModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
<div className="modal-dialog modal-dialog-centered timecard_2popup" role="document">
    <div className="modal-content">
      <div className="modal-header modal_header_register">
       
        <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="WeekTimesModalCenterClose">
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
    <label className="control-label col-sm-4" htmlFor="Pay As">Pay As</label>
    <div className="col-sm-8">
     <select  className="form-control pro_input_pop" name="DayTimePayas" value={this.state.DayTimePayas} onChange={this.handleChangeDayTime}>
       {this.renderPayasDropdown()}
     </select>
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Last Name">Date</label>
    <div className="col-sm-6">
      <input className="form-control pro_input_pop" id="Date" placeholder="07/01/2018" type="date" name="DayTimeDate" value={this.state.DayTimeDate} onChange={this.handleChangeDayTime} />
    </div>
    <div className="col-sm-2 time_card_popup3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
        <a href="#">
        <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
        </a></svg>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Email">Day</label>
    <div className="col-sm-8 text-left">
     {this.state.DayTimeDay}
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Start Work</label>
    <div className="col-sm-8">
      <input type="text" className="form-control pro_input_pop" placeholder="0:00" name="DayTimeStart" value={this.state.DayTimeStart} onChange={this.handleChangeDayTime} />
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Meal Break</label>
    <div className="col-sm-3">
      <input type="text" className="form-control pro_input_pop" placeholder="0:00" value={this.state.DayTimeTotalMBDed} onChange={this.handleChangeDayTime} />
    </div>
    
      <div className="col-sm-2">
          
            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true" ref={(el) => {
                    if (el) {
                      el.style.setProperty('margin-bottom', '0px', 'important');
                    }
                }} >
              
                <div className="panel panel-default">
                    
                    <span className="side-tab" data-target="#tab2" data-toggle="tab" role="tab" aria-expanded="false">
                        <div className="panel-heading" role="tab" id="headingTwo" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" style={{paddingLeft: '12px', paddingTop: '10px'}}>
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
    <label className="control-label col-sm-4" htmlFor="Mobile">Start MB1</label>
    <div className="col-sm-8">
      <input type="text" className="form-control pro_input_pop" placeholder="0:00" name="DayTimeStartMeal" value={this.state.DayTimeStartMeal} onChange={this.handleChangeDayTime} />
    </div>
  </div>
  
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Finish MB1</label>
    <div className="col-sm-8">
      <input type="text" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" placeholder="0:00" name="DayTimeFinishMeal1" value={this.state.DayTimeFinishMeal1} onChange={this.handleChangeDayTime}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Start MB2</label>
    <div className="col-sm-8">
      <input type="text" className="form-control pro_input_pop" placeholder="0:00" name="DayTimeStartMeal2" value={this.state.DayTimeStartMeal2} onChange={this.handleChangeDayTime} />
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Finish MB2</label>
    <div className="col-sm-8">
      <input type="text" className="form-control pro_input_pop" placeholder="0:00" name="DayTimeFinishMeal2" value={this.state.DayTimeFinishMeal2} onChange={this.handleChangeDayTime} />
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Start MB3</label>
    <div className="col-sm-8">
      <input type="text" className="form-control pro_input_pop" id="Mobile" placeholder="0:00" name="DayTimeStartMeal3" value={this.state.DayTimeStartMeal3} onChange={this.handleChangeDayTime} />
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">SFinish MB3</label>
    <div className="col-sm-8">
      <input type="text" className="form-control pro_input_pop" placeholder="0:00" name="DayTimeFinishMeal3" value={this.state.DayTimeFinishMeal3} onChange={this.handleChangeDayTime} />
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-7" htmlFor="Mobile">Non Deductible MB1:</label>
    <div className="col-sm-1 checkbox_popuptime">
    <input type="checkbox" name="DayTimeMB1ND" onChange={this.handleChangeDayTime} checked={this.state.DayTimeMB1ND} />
     
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-7" htmlFor="Mobile">Non Deductible MB2:</label>
    <div className="col-sm-1 checkbox_popuptime">
    <input type="checkbox" name="DayTimeMB2ND" onChange={this.handleChangeDayTime} checked={this.state.DayTimeMB2ND} />
     
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-7" htmlFor="Mobile">Non Deductible MB3:</label>
    <div className="col-sm-1 checkbox_popuptime">
    <input type="checkbox" name="DayTimeMB3ND" onChange={this.handleChangeDayTime} checked={this.state.DayTimeMB3ND}/>
     
    </div>
  </div>
                        
                        
                        
                        
                        
                        </div>
                    </div>
  
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Finish Work</label>
    <div className="col-sm-8">
      <input type="text" className="form-control pro_input_pop" placeholder="0:00" name="DayTimeFinish" value={this.state.DayTimeFinish} onChange={this.handleChangeDayTime}/>
      <TimePicker defaultValue={moment(this.state.DayTimeStart, this.state.format)} format={this.state.format} onChange={this.handleChangeDayTimeFinish.bind(this)}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Total Hours</label>
    <div className="col-sm-8 text-left">
      {this.state.DayTimeTotalHours}
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Note</label>
    <div className="col-sm-8">
     <textarea name="DayTimeNote" className="form-control pro_input_pop" rows="" onChange={this.handleChangeDayTime} value={this.state.DayTimeNote}></textarea>
    </div>
  </div>
  
  
  
  <div className="clear20"></div>

<div className="btn_cance_save">
       <input name="" className="btn_save_pro" value="Save" type="button" onClick={this.handleSaveDayTime(this.state.DayTimeIndex, 'Add')} />
       <input name="" className="btn_cancel_pro" data-dismiss="modal" aria-label="Close" value="Cancel" type="button" />
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
{/*WeekTimesModalCenter END*/}

<button data-dismiss="modal" data-toggle="modal" data-target="#WeekTimesModalCenter" id="WeekTimesModalCenterBtn" style={{display:'none'}}>Show Modal</button>
<button data-dismiss="modal" data-toggle="modal" data-target="#exampleModalDelete" id="exampleModalDeleteBtn" style={{display:'none'}}>Delete Modal</button>
<button data-dismiss="modal" data-toggle="modal" data-target="#exampleModalDeleteClose" id="exampleModalDeleteCloseBtn" style={{display:'none'}}>Close Delete Modal</button>
</div>
        );
    }
}