import React , { Component } from "react";
import { API, Storage } from "aws-amplify";
import $ from 'jquery';
import Dropzone from 'react-dropzone'
import { TimePicker, DatePicker } from 'antd';
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
        CompanyIndex: "0",
        CustomTimeCardFields: "",
        Dept: "",
        FileAttachments: [],
        PayFrequency: "Monthly",
        PeriodEnding: "",
        Position: "",
        Times: [],
        TotalHours: "0.00",
        Type: "Draft",

        DailyTimes: [],
        TimesCustomTimeFields: [],
        TimesTotalHours: '0.00',
        files: [],

        Payas: [
          {"Flag": "CON", "Value": "Worked"},
          {"Flag": "NW", "Value": "Not Worked"},
          {"Flag": "SIC", "Value": "Sick"},
          {"Flag": "HOL", "Value": "Holiday Pay" },
          {"Flag": "TIL", "Value": "Time in Lieu"},
          {"Flag": "PUB", "Value": "Public Holiday"},
          {"Flag": "PHW", "Value": "Pub Hol Worked"}
        ],
        DailyTimesIndex: 0,
        DailyTimesCopyIndex: 0,
        DayTimeIndex: 0,
        DayTimeCopyIndex: 0,
        DayTimeDate: "",
        DayTimeDay: "",
        DayTimeFinish: moment("00:00", "HH:mm"),
        DayTimeFinishMeal1: moment("00:00", "HH:mm"),
        DayTimeFinishMeal2: moment("00:00", "HH:mm"),
        DayTimeFinishMeal3: moment("00:00", "HH:mm"),
        DayTimeMB1ND: false,
        DayTimeMB2ND: false,
        DayTimeMB3ND: false,
        DayTimeNote: "",
        DayTimePayas: "",
        DayTimeStart: moment("00:00", "HH:mm"),
        DayTimeStartMeal: moment("00:00", "HH:mm"),
        DayTimeStartMeal2: moment("00:00", "HH:mm"),
        DayTimeStartMeal3: moment("00:00", "HH:mm"),
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
    this.updateTotalHours = this.updateTotalHours.bind(this)
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

  handleCalendar = event => {
    //alert('Calendar');
    //$(this).siblings('[type="date"]').removeClass('hidden').focus().click();
    //$(this).remove();
    //document.getElementById("calendar").click().focus();
    //$('input[type="date"]:focus::-webkit-calendar-picker-indicator').click();

    /*var date = new Date("2018, 07, 27");
    var setDate = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-"+("0" + date.getDate()).slice(-2);
    console.log(setDate);
    this.setState({ PeriodEnding: setDate });*/
    //document.getElementById("calendar").style.visibility="visible";
    //$("#calendar").val(setDate);
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
    if(name === "CompanyIndex"){
      if(value === ""){
        //console.log(this.state.companies[value]);
        var company = this.state.companies[value];
        var comp = ""
        this.setState({[name]: value, Company: comp, Production: "", Dept: "", Position:""}, 
                  () => { this.validateField("Company", comp, "CompanyValid") });

      }else{
        //console.log(this.state.companies[value]);
        var company = this.state.companies[value];
        var comp = [
          {
            "Guid": company.Guid,
            "Name": company.Name,
            "Payas": this.state.Payas,
            "Production": company.Production
          }
        ]
        //console.log(comp);
        this.setState({[name]: value, Company: comp, Production: company.Production, Dept: company.Dept, Position: company.Position}, 
                  () => { this.validateField("Company", comp, "CompanyValid") });

      }
      
    }else{
      this.setState({[name]: value}, 
                () => { this.validateField(name, value, ValidStateName) });
    }
  }

  handleChangeDayTime = event => {

    const name = event.target.name;
    const value = event.target.value;
    //alert(name);
    if(name === 'DayTimeMB1ND' || name === 'DayTimeMB2ND' || name === 'DayTimeMB3ND'){
      this.setState({[name]: event.target.checked});
      setTimeout(function() { this.updateMealBreakTime(); }.bind(this),1000);
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
//console.log(this.state.Company); return false;

    if(this.state.formValid){

      var Times = this.state.Times;
      Times[this.state.DailyTimesIndex] = {CustomTimeFields:this.state.TimesCustomTimeFields, DailyTimes: this.state.DailyTimes, TotalHours: this.state.TimesTotalHours};
      
      const item = {
          "Production": this.state.Production,
          "Activity": this.state.Activity,
          "Company": this.state.Company? [{"Guid": this.state.Company[0].Guid,"Name": this.state.Company[0].Name,"Payas": this.state.Payas,"Production": this.state.Production}] : [],
          "CustomTimeCardFields": this.state.CustomTimeCardFields,
          "Dept": this.state.Dept,
          "FileAttachments": this.state.FileAttachments,
          "PayFrequency" : this.state.PayFrequency,
          "PeriodEnding": this.state.PeriodEnding,
          //"Pos": this.state.Pos,
          "Position": this.state.Position,
          //"Times": this.state.Times,
          "Times": Times,   
          "TotalHours": this.state.TotalHours,
          "Type": this.state.Type,
      }
//alert('ddd');
console.log(item);
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
          console.log(e);
      }
      this.setState({isLoading: false });

    }else{
      this.setState({isLoading: false, CompanyValid:false});
    }
    
  }

  findCompany(needle){
    var companies = this.state.companies;
    for (var i = 0; i < companies.length; i++){
      // look for the entry with a matching `code` value
      if (companies[i].Guid == needle){
        // we found it
        return i;
      }
    }
     return 0;
  }

  handleUpdate = (Id, index) => async event => {
  //alert(Id);
    //var currentDayDate = Math.floor(new Date().getTime()/1000);
    //console.log(currentDayDate);
    const item = this.state.timecards[index];
    /*var LastDayDate = item.Times[0].DailyTimes[6].Date;
    if(currentDayDate > LastDayDate){
      alert('yes');
    }else{
      alert('no');
    }*/
    //console.log(item.Company);
    var formValid = false;
    var company = "";
    var production = "";
    var cindex = this.findCompany(item.Company[0].Guid);
    if(this.state.companies.length > 0){
      //var citem = this.state.companies[cindex];
      var citem = item.Company[0];
      var company = [
        {
          "Guid": citem.Guid,
          "Name": citem.Name,
          "Payas": this.state.Payas,
          "Production": citem.Production
        }
      ]
      var production = citem.Production? citem.Production : '';
      var formValid = true;
    }

    var DailyTimesIndex = item.Times.length-1;
    var DailyTimes = item.Times[DailyTimesIndex].DailyTimes? item.Times[DailyTimesIndex].DailyTimes : [];
console.log(item.Times);
    this.setState({
      SubView: 'Add',
      formValid: formValid,
      Update: item.Guid? item.Guid : "",
      ItemIndex: index,
      DailyTimesIndex: DailyTimesIndex,
      DailyTimesCopyIndex: DailyTimesIndex,
      DailyTimes: DailyTimes,
      TimesCustomTimeFields: item.Times[DailyTimesIndex].CustomTimeFields? item.Times[DailyTimesIndex].CustomTimeFields : [],
      TimesTotalHours: item.Times[DailyTimesIndex].TotalHours? item.Times[DailyTimesIndex].TotalHours : "0.00",
      Production: production,
      Activity: item.Activity? item.Activity : "",
      CompanyIndex: cindex,
      Company: company,
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
      //console.log(moment(day.Finish, this.state.format));

      this.setState({
        SubView: SubView,
        DayTimeIndex: index,
        DayTimeCopyIndex: index,
        DayTimeDate: day.Date? this.getDateFormate(day.Date, 1) : "",
        DayTimeDay: day.Day,
        DayTimeFinish: day.Finish? moment(day.Finish, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal1: day.FinishMeal1? moment(day.FinishMeal1, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal2: day.FinishMeal2? moment(day.FinishMeal2, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal3: day.FinishMeal3? moment(day.FinishMeal3, this.state.format) : moment("00:00", this.state.format),
        DayTimeMB1ND: day.MB1ND === '0'? false : true,
        DayTimeMB2ND: day.MB2ND === '0'? false : true,
        DayTimeMB3ND: day.MB3ND === '0'? false : true,
        DayTimeNote: day.Note? day.Note : '',
        DayTimePayas: day.Payas,
        DayTimeStart: day.Start? moment(day.Start, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal: day.StartMeal? moment(day.StartMeal, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal2: day.StartMeal2? moment(day.StartMeal2, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal3: day.StartMeal3? moment(day.StartMeal3, this.state.format) : moment("00:00", this.state.format),
        DayTimeTimeStamp: day.TimeStamp,
        DayTimeTotalHours: day.TotalHours? day.TotalHours : "00:00",
        DayTimeTotalMBDed: day.TotalMBDed? day.TotalMBDed : "00:00",
        DayTimeTravel1: day.Travel1,
        DayTimeTravel2: day.Travel2
      });
      
      if(SubView === 'Add')
        $('#WeekTimesModalCenterBtn').click();
  }

  handleSaveDayTime = (index, SubView) => async event => {
    //alert(index);
      //alert(index);
      //console.log(this.state.DayTimeFinish._i); return false;
      let DailyTimes = this.state.DailyTimes;
      //console.log(day.Day);

      var dayTimeObj = {
        "Date": this.state.DayTimeDate? new Date(this.state.DayTimeDate).getTime()/1000 : '',
        "Day": this.state.DayTimeDay,
        "Finish": this.state.DayTimeFinish._i,
        "FinishMeal1": this.state.DayTimeFinishMeal1.format('HH:mm'),
        "FinishMeal2": this.state.DayTimeFinishMeal2.format('HH:mm'),
        "FinishMeal3": this.state.DayTimeFinishMeal3.format('HH:mm'),
        "MB1ND": this.state.DayTimeMB1ND? '1' : '0',
        "MB2ND": this.state.DayTimeMB2ND? '1' : '0',
        "MB3ND": this.state.DayTimeMB3ND? '1' : '0',
        "Note": this.state.DayTimeNote,
        "Payas": this.state.DayTimePayas,
        "Start": this.state.DayTimeStart._i,
        "StartMeal": this.state.DayTimeStartMeal.format('HH:mm'),
        "StartMeal2": this.state.DayTimeStartMeal2.format('HH:mm'),
        "StartMeal3": this.state.DayTimeStartMeal3.format('HH:mm'),
        "TimeStamp": new Date().getTime()/1000,
        "TotalHours": this.state.DayTimeTotalHours,
        "TotalMBDed": this.state.DayTimeTotalMBDed,
        "Travel1": "0.00",
        "Travel2": "0.00"
      };

      DailyTimes[index] = dayTimeObj;

      //console.log(DailyTimes);
      this.setState({DailyTimes: DailyTimes});
      
      this.updateTotalHours();

      if(SubView === 'Add'){
        $('#WeekTimesModalCenterClose').click();
      }
      else{
        this.setState({SubView: SubView});
      }
  }

  clearTimeCardStats(){

    this.setState({
      DailyTimesIndex: 0,
      DailyTimesCopyIndex: 0,
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

handleChangeDayTimeStart(time, timeString){
    var startTime = moment(timeString, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(!this.state.DayTimeMB1ND){
      var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
      var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
      var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
      endTime.subtract(durationMB1);
      //console.log(durationMB1);
    }

    if(!this.state.DayTimeMB2ND){
      var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
      var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
      var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
      endTime.subtract(durationMB2);
    }
    
    if(!this.state.DayTimeMB3ND){  
      var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
      var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
      var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
      endTime.subtract(durationMB3);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    //console.log(duration);
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    this.setState({DayTimeStart: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours});
}

handleChangeDayTimeFinish(time, timeString){
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(timeString, "HH:mm");
    
    if(!this.state.DayTimeMB1ND){
      var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
      var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
      var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
      endTime.subtract(durationMB1);
      //console.log(durationMB1);
    }

    if(!this.state.DayTimeMB2ND){
      var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
      var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
      var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
      endTime.subtract(durationMB2);
    }
    
    if(!this.state.DayTimeMB3ND){  
      var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
      var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
      var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
      endTime.subtract(durationMB3);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    //console.log(duration);
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    this.setState({DayTimeFinish: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours});
}

handleChangeDayTimeStartMeal(time, timeString){
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(timeString, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);


    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    TotalMBDed.add(durationMB3);

    if(!this.state.DayTimeMB1ND){
      endTime.subtract(durationMB1);
    }

    if(!this.state.DayTimeMB2ND){
      endTime.subtract(durationMB2);
    }
    if(!this.state.DayTimeMB3ND){
      endTime.subtract(durationMB3);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    //console.log(duration);
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours());
    var minutesmbded = parseInt(TotalMBDed.asMinutes())%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeStartMeal: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: DayTimeTotalMBDed});
}

handleChangeDayTimeFinishMeal1(time, timeString){
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(timeString, "HH:mm");
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);
    

    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    TotalMBDed.add(durationMB3);

    if(!this.state.DayTimeMB1ND){
      endTime.subtract(durationMB1);
    }

    if(!this.state.DayTimeMB2ND){
      endTime.subtract(durationMB2);
    }
    if(!this.state.DayTimeMB3ND){ 
      endTime.subtract(durationMB3);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    //console.log(duration);
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours());
    var minutesmbded = parseInt(TotalMBDed.asMinutes())%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeFinishMeal1: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: DayTimeTotalMBDed});
}


handleChangeDayTimeStartMeal2(time, timeString){
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeFinishMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(timeString, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);


    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    TotalMBDed.add(durationMB3);

    if(!this.state.DayTimeMB1ND){
      endTime.subtract(durationMB1);
    }

    if(!this.state.DayTimeMB2ND){
      endTime.subtract(durationMB2);
    }
    if(!this.state.DayTimeMB3ND){
      endTime.subtract(durationMB3);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    //console.log(duration);
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours());
    var minutesmbded = parseInt(TotalMBDed.asMinutes())%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeStartMeal2: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: DayTimeTotalMBDed});
}

handleChangeDayTimeFinishMeal2(time, timeString){
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(timeString, "HH:mm");
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);
    

    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    TotalMBDed.add(durationMB3);

    if(!this.state.DayTimeMB1ND){
      endTime.subtract(durationMB1);
    }

    if(!this.state.DayTimeMB2ND){
      endTime.subtract(durationMB2);
    }
    if(!this.state.DayTimeMB3ND){ 
      endTime.subtract(durationMB3);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    //console.log(duration);
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours());
    var minutesmbded = parseInt(TotalMBDed.asMinutes())%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeFinishMeal2: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: DayTimeTotalMBDed});
}

handleChangeDayTimeStartMeal3(time, timeString){
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeFinishMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);


    var startTimeMB3 = moment(timeString, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    TotalMBDed.add(durationMB3);

    if(!this.state.DayTimeMB1ND){
      endTime.subtract(durationMB1);
    }

    if(!this.state.DayTimeMB2ND){
      endTime.subtract(durationMB2);
    }
    if(!this.state.DayTimeMB3ND){
      endTime.subtract(durationMB3);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    //console.log(duration);
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours());
    var minutesmbded = parseInt(TotalMBDed.asMinutes())%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeStartMeal3: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: DayTimeTotalMBDed});
}

handleChangeDayTimeFinishMeal3(time, timeString){
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);
    

    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(timeString, "HH:mm");
    var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    TotalMBDed.add(durationMB3);

    if(!this.state.DayTimeMB1ND){
      endTime.subtract(durationMB1);
    }

    if(!this.state.DayTimeMB2ND){
      endTime.subtract(durationMB2);
    }
    if(!this.state.DayTimeMB3ND){ 
      endTime.subtract(durationMB3);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    //console.log(duration);
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours());
    var minutesmbded = parseInt(TotalMBDed.asMinutes())%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeFinishMeal3: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: DayTimeTotalMBDed});
}

updateMealBreakTime(){
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    var TotalMBDed = moment.duration("00:00", "HH:mm");

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);
   
    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);

    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
    TotalMBDed.add(durationMB3);

    if(!this.state.DayTimeMB1ND){
      endTime.subtract(durationMB1);
    }

    if(!this.state.DayTimeMB2ND){
      endTime.subtract(durationMB2);
    }

    if(!this.state.DayTimeMB3ND){
      endTime.subtract(durationMB3);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    //console.log(duration);
    var hours = parseInt(duration.asHours());
    var minutes = parseInt(duration.asMinutes())%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours());
    var minutesmbded = parseInt(TotalMBDed.asMinutes())%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({ DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: DayTimeTotalMBDed});
}

updateTotalHours(){
    var TotalTime = moment.duration("00:00", "HH:mm");
    //console.log(TotalTime);
    if(this.state.DailyTimes.length > 0){
      var items = this.state.DailyTimes;
      for (var key in items) {
        if (items.hasOwnProperty(key)) {
            var item = items[key];
            //console.log(item.TotalHours);
            var DailyTotalTime = moment.duration(item.TotalHours, "HH:mm");
            TotalTime.add(DailyTotalTime);
            //console.log(DailyTotalTime); 
            
        }
      }
    }
    var hours = parseInt(TotalTime.asHours());
            var minutes = parseInt(TotalTime.asMinutes())%60;
            var TotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
            
            this.setState({ TotalHours: TotalHours});
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
        var company = "";
        var production = "";
        var index = "";
        if(this.state.companies.length > 0){
          var item = this.state.companies[0];
          var company = [
            {
              "Guid": item.Guid,
              "Name": item.Name,
              "Payas": this.state.Payas,
              "Production": item.Production
            }
          ]
          var production = '';
        }
      //console.log(comp);

        this.setState({
          DailyTimesIndex: 0,
          DailyTimesCopyIndex: 0, 
          SubView: element,
          formValid: false,
          Update: false,
          ItemIndex: false,
          DailyTimes: this.setDailyTimes(),
          TimesCustomTimeFields: [],
          TimesTotalHours: '0.00',
          files: [],
          Production: production,
          Activity: "",
          CompanyIndex: index,
          Company: company,
          CustomTimeCardFields: "",
          Dept: "",
          FileAttachments: [],
          PayFrequency: "Monthly",
          PeriodEnding: "",
          Position: "",
          Times: [],
          TotalHours: "56:00",
          Type: "Draft",
        });
      }
  }

  setDailyTimes(){
    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay();
    //var firstday = Math.floor(new Date(curr.setDate(first+1)).getTime()/1000);
    //console.log(firstday);
    var DailyTimes = [
      {Date:Math.floor(new Date(curr.setDate(first)).getTime()/1000),Day:"Sunday",Finish:"17:30",FinishMeal1:"10:30",FinishMeal2:"0.00",FinishMeal3:"0.00",MB1ND:"0",MB2ND:"0",MB3ND:"0",Note:"End of Month Payroll",Payas:"Worked",Start:"09:00",StartMeal:"10:00",StartMeal2:"0.00",StartMeal3:"0.00",TimeStamp:Math.floor(new Date().getTime()/1000),TotalHours:"08:00",TotalMBDed:"00:30",Travel1:"0.00",Travel2:"0.00"},
      {Date:Math.floor(new Date(curr.setDate(first+1)).getTime()/1000),Day:"Monday",Finish:"17:30",FinishMeal1:"10:30",FinishMeal2:"0.00",FinishMeal3:"0.00",MB1ND:"0",MB2ND:"0",MB3ND:"0",Note:"End of Month Payroll",Payas:"Worked",Start:"09:00",StartMeal:"10:00",StartMeal2:"0.00",StartMeal3:"0.00",TimeStamp:Math.floor(new Date().getTime()/1000),TotalHours:"08:00",TotalMBDed:"00:30",Travel1:"0.00",Travel2:"0.00"},
      {Date:Math.floor(new Date(curr.setDate(first+2)).getTime()/1000),Day:"Tuesday",Finish:"17:30",FinishMeal1:"10:30",FinishMeal2:"0.00",FinishMeal3:"0.00",MB1ND:"0",MB2ND:"0",MB3ND:"0",Note:"End of Month Payroll",Payas:"Worked",Start:"09:00",StartMeal:"10:00",StartMeal2:"0.00",StartMeal3:"0.00",TimeStamp:Math.floor(new Date().getTime()/1000),TotalHours:"08:00",TotalMBDed:"00:30",Travel1:"0.00",Travel2:"0.00"},
      {Date:Math.floor(new Date(curr.setDate(first+3)).getTime()/1000),Day:"Wednesday",Finish:"17:30",FinishMeal1:"10:30",FinishMeal2:"0.00",FinishMeal3:"0.00",MB1ND:"0",MB2ND:"0",MB3ND:"0",Note:"End of Month Payroll",Payas:"Worked",Start:"09:00",StartMeal:"10:00",StartMeal2:"0.00",StartMeal3:"0.00",TimeStamp:Math.floor(new Date().getTime()/1000),TotalHours:"08:00",TotalMBDed:"00:30",Travel1:"0.00",Travel2:"0.00"},
      {Date:Math.floor(new Date(curr.setDate(first+4)).getTime()/1000),Day:"Thursday",Finish:"17:30",FinishMeal1:"10:30",FinishMeal2:"0.00",FinishMeal3:"0.00",MB1ND:"0",MB2ND:"0",MB3ND:"0",Note:"End of Month Payroll",Payas:"Worked",Start:"09:00",StartMeal:"10:00",StartMeal2:"0.00",StartMeal3:"0.00",TimeStamp:Math.floor(new Date().getTime()/1000),TotalHours:"08:00",TotalMBDed:"00:30",Travel1:"0.00",Travel2:"0.00"},
      {Date:Math.floor(new Date(curr.setDate(first+5)).getTime()/1000),Day:"Friday",Finish:"17:30",FinishMeal1:"10:30",FinishMeal2:"0.00",FinishMeal3:"0.00",MB1ND:"0",MB2ND:"0",MB3ND:"0",Note:"End of Month Payroll",Payas:"Worked",Start:"09:00",StartMeal:"10:00",StartMeal2:"0.00",StartMeal3:"0.00",TimeStamp:Math.floor(new Date().getTime()/1000),TotalHours:"08:00",TotalMBDed:"00:30",Travel1:"0.00",Travel2:"0.00"},
      {Date:Math.floor(new Date(curr.setDate(first+6)).getTime()/1000),Day:"Saturday",Finish:"17:30",FinishMeal1:"10:30",FinishMeal2:"0.00",FinishMeal3:"0.00",MB1ND:"0",MB2ND:"0",MB3ND:"0",Note:"End of Month Payroll",Payas:"Worked",Start:"09:00",StartMeal:"10:00",StartMeal2:"0.00",StartMeal3:"0.00",TimeStamp:Math.floor(new Date().getTime()/1000),TotalHours:"08:00",TotalMBDed:"00:30",Travel1:"0.00",Travel2:"0.00"},
    ];
    return DailyTimes;
  }

  handleCopyYesterdaysTimes = (index) => async event => {
      
      if(index === 0){
        index = this.state.DailyTimes.length - 1;
      }else{
        index = index - 1;
      }
      let day = this.state.DailyTimes[index];

      this.setState({
        DayTimeCopyIndex: index,
        DayTimeFinish: day.Finish? moment(day.Finish, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal1: day.FinishMeal1? moment(day.FinishMeal1, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal2: day.FinishMeal2? moment(day.FinishMeal2, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal3: day.FinishMeal3? moment(day.FinishMeal3, this.state.format) : moment("00:00", this.state.format),
        DayTimeMB1ND: day.MB1ND === '0'? false : true,
        DayTimeMB2ND: day.MB2ND === '0'? false : true,
        DayTimeMB3ND: day.MB3ND === '0'? false : true,
        DayTimeNote: day.Note? day.Note : '',
        DayTimePayas: day.Payas,
        DayTimeStart: day.Start? moment(day.Start, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal: day.StartMeal? moment(day.StartMeal, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal2: day.StartMeal2? moment(day.StartMeal2, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal3: day.StartMeal3? moment(day.StartMeal3, this.state.format) : moment("00:00", this.state.format),
        DayTimeTotalHours: day.TotalHours? day.TotalHours : "00:00",
        DayTimeTotalMBDed: day.TotalMBDed? day.TotalMBDed : "00:00",
        DayTimeTravel1: day.Travel1,
        DayTimeTravel2: day.Travel2
      });
  }
  
  handleCopyLastWeekTimes = (index) => async event => {
    if(this.state.Times.length > 0){ 
      if(index === 0){
        index = this.state.Times.length - 1;
      }else{
        index = index - 1;
      }
      //console.log(this.state.Times);
      var DailyTimes = this.state.DailyTimes;
      var LastWeekDailyTimes = this.state.Times[index].DailyTimes;
      //console.log(LastWeekDailyTimes);
      for (var i = 0; i < LastWeekDailyTimes.length; i++){
        DailyTimes[i].Finish = LastWeekDailyTimes[i].Finish;
        DailyTimes[i].FinishMeal1 = LastWeekDailyTimes[i].FinishMeal1;
        DailyTimes[i].FinishMeal2 = LastWeekDailyTimes[i].FinishMeal2;
        DailyTimes[i].FinishMeal3 = LastWeekDailyTimes[i].FinishMeal3;
        DailyTimes[i].MB1ND = LastWeekDailyTimes[i].MB1ND;
        DailyTimes[i].MB2ND = LastWeekDailyTimes[i].MB2ND;
        DailyTimes[i].MB3ND = LastWeekDailyTimes[i].MB3ND;
        DailyTimes[i].Note = LastWeekDailyTimes[i].Note;
        DailyTimes[i].Payas = LastWeekDailyTimes[i].Payas;
        DailyTimes[i].Start = LastWeekDailyTimes[i].Start;
        DailyTimes[i].StartMeal = LastWeekDailyTimes[i].StartMeal;
        DailyTimes[i].StartMeal2 = LastWeekDailyTimes[i].StartMeal2;
        DailyTimes[i].StartMeal3 = LastWeekDailyTimes[i].StartMeal3;
        DailyTimes[i].TotalHours = LastWeekDailyTimes[i].TotalHours;
        DailyTimes[i].TotalMBDed = LastWeekDailyTimes[i].TotalMBDed;
        DailyTimes[i].Travel1 = LastWeekDailyTimes[i].Travel1;
        DailyTimes[i].Travel2 = LastWeekDailyTimes[i].Travel2;
      }
      var TimesCustomTimeFields = this.state.Times[index].TimesCustomTimeFields;
      var TimesTotalHours = this.state.Times[index].TimesTotalHours;
      //console.log(LastWeekDailyTimes);
      this.setState({
        //DailyTimesCopyIndex: index,
        DailyTimes: DailyTimes,
        TimesCustomTimeFields: TimesCustomTimeFields? TimesCustomTimeFields : [],
        TimesTotalHours: TimesTotalHours? TimesTotalHours : "0.00",
      });
      setTimeout(function() { this.updateTotalHours(); }.bind(this),1000);
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
       <option key={i} value={obj.Value}>{obj.Value}</option>
    );
  }

  renderCompanyDropdown() {
    return this.state.companies.map((obj, i) =>
       <option key={i} value={i}>{obj.Name}</option>
    );
  }
  
  
  renderSubmitView(view) {
    return (
      <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
      </div>
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
    <select className="form-control pro_input_pop" name="CompanyIndex" value={this.state.CompanyIndex} onChange={this.handleChange}>
      <option value="">Select Company</option>
      {this.renderCompanyDropdown()}
     </select>
     {this.state.companies.length === 0? "<span>Add company via companies menu.</span>" : ""}
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
    <select className="form-control pro_input_pop" name="CompanyIndex" value={this.state.CompanyIndex} onChange={this.handleChange}>
      <option value="">Select Company</option>
      {this.renderCompanyDropdown()}
     </select>
     {this.state.companies.length === 0? "Add company via companies menu." : ""}
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
      <input className="form-control pro_input_pop" type="date" id="calendar" name="PeriodEnding" value={this.state.PeriodEnding} onChange={this.handleChange} />
    </div>
    <div className="col-sm-1 col-md-1 calendar_time2 timecard_cldr2">
      <a href="#" onClick={this.handleCalendar}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
        <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
      </svg>
      </a>
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
      {this.state.PeriodEnding !== "" ? this.state.DailyTimes.length === 0? 
                  <tr key="empty"><td align="center" colSpan="8">No data found.</td></tr> : 
                  this.renderDailyTimesList(this.state.DailyTimes, view) : <tr key="empty"><td align="center" colSpan="8"><strong>Please select period ending date.</strong></td></tr>}
    </tbody>
  </table>
  <div className="clear10"></div>

  <div className="col-sm-6 p0">
    <button type="button" href="#" className="btn_copy_time"  onClick={this.handleCopyLastWeekTimes(this.state.DailyTimesCopyIndex)}><span>Copy Last Weeks Times</span></button>
  </div>
  <div className="col-sm-6 p0">
    <div className="pull-right ">
      <button type="button" href="#" className="btn_price_time2"><span>{this.state.PeriodEnding !== ""? this.state.TotalHours : '00:00'}</span></button>
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
              <button type="button" className="btn_copy_time" onClick={this.handleCopyYesterdaysTimes(this.state.DayTimeCopyIndex)}><span>Copy Yesterdays Times</span></button>
            </div>
            <div className="clear20"></div>

<form className="form-horizontal">
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="DayTimePayas">Pay As</label>
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
      <TimePicker value={this.state.DayTimeStart} format={this.state.format} onChange={this.handleChangeDayTimeStart.bind(this)}/>
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
      <TimePicker value={this.state.DayTimeFinish} format={this.state.format} onChange={this.handleChangeDayTimeFinish.bind(this)}/>
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
      <TimePicker value={this.state.DayTimeStartMeal} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Finish MB1</label>
    <div className="col-xs-8">
      <TimePicker value={this.state.DayTimeFinishMeal1} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal1.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Start MB2</label>
    <div className="col-xs-8">
      <TimePicker value={this.state.DayTimeStartMeal2} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal2.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Finish MB2</label>
    <div className="col-xs-8">
      <TimePicker value={this.state.DayTimeFinishMeal2} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal2.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Start MB3</label>
    <div className="col-xs-8">
    <TimePicker value={this.state.DayTimeStartMeal3} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal3.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Finish MB3</label>
    <div className="col-xs-8">
      <TimePicker value={this.state.DayTimeFinishMeal3} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal3.bind(this)}/>
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
              <button type="button" href="#" className="btn_copy_time"  onClick={this.handleCopyLastWeekTimes(this.state.DailyTimesCopyIndex)}><span>Copy Last Weeks Times</span></button>
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
      {this.state.PeriodEnding !== "" ? this.state.DailyTimes.length === 0? 
                  <tr key="empty"><td align="center" colSpan="4">No data found.</td></tr> : 
                  this.renderDailyTimesList(this.state.DailyTimes, view) : <tr key="empty"><td align="center" colSpan="4"><strong>Please select period ending date.</strong></td></tr>}
    </tbody>
  </table>
       <div className="clear5"></div>
<div className="col-sm-6 p0">
  <div className="pull-right "><div className="pull-right label_timecard2"><span style={{paddingLeft: '20px'}}>{this.state.PeriodEnding !== ""? this.state.TotalHours : '00:00'}</span></div></div>
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
              {this.state.SubView === 'Submit' ? this.renderSubmitView('web') : ""}
           
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
      
      <button type="button" className="btn_copytime"  onClick={this.handleCopyYesterdaysTimes(this.state.DayTimeCopyIndex)}><span>Copy Yesterdays Times</span></button>
      
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
      <TimePicker value={this.state.DayTimeStart} format={this.state.format} onChange={this.handleChangeDayTimeStart.bind(this)}/>
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
        <TimePicker value={this.state.DayTimeStartMeal} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal.bind(this)}/>
      </div>
  </div>
  
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Finish MB1</label>
    <div className="col-sm-8">
    
      <TimePicker value={this.state.DayTimeFinishMeal1} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal1.bind(this)}/>  
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Start MB2</label>
    <div className="col-sm-8">

      <TimePicker value={this.state.DayTimeStartMeal2} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal2.bind(this)}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Finish MB2</label>
    <div className="col-sm-8">
    
      <TimePicker value={this.state.DayTimeFinishMeal2} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal2.bind(this)}/></div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Start MB3</label>
    <div className="col-sm-8">
      <TimePicker value={this.state.DayTimeStartMeal3} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal3.bind(this)}/>
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Finish MB3</label>
    <div className="col-sm-8">
    
      <TimePicker value={this.state.DayTimeFinishMeal3} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal3.bind(this)}/></div>
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
      <TimePicker value={this.state.DayTimeFinish} format={this.state.format} onChange={this.handleChangeDayTimeFinish.bind(this)}/>
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