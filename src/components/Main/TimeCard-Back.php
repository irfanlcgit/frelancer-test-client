import React , { Component } from "react";
import { API, Storage } from "aws-amplify";
import $ from 'jquery';
import Dropzone from 'react-dropzone'
import { TimePicker, DatePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';
import '../../antd_custom.css';
import base64Img from "base64-img";

export default class TimeCard extends Component {


  constructor(props)
  {
    super();
    this.state = {
        dateFormat:"DD/MM/YYYY",
        format:"HH:mm",
        errormessage:"",
        isLoading: true,
        isUploading: false,
        previewLoading: false,
        onHold: false,
        SubView: "List",
        Update: false,
        ItemIndex: false,
        timecards: [],
        companies: [],
        formValid: false,
        CompanyValid: true,
        SubmitEmail: '',
        SubmitEmailValid: true,
        DeleteId: false,
        DeleteIndex: false,
        Preview: "",
        HideTravel: false,
        InsertedId: "",

        Production: "",
        Activity: "",
        Company: "",
        CompanyIndex: "0",
        CustomTimeCardFields: [],
        Dept: "",
        FileAttachments: [],
        PayFrequency: "Weekly",
        PayEnding: "",
        PeriodEnding: "",
        PeriodEndingMoment: "",
        Position: "",
        Times: [],
        TotalHours: "0.00",
        Type: "Draft",

        DailyTimes: [],
        TimesCustomTimeFields: [],
        TimesTotalHours: '0.00',
        files: [],
        mrtFile: "default",

        PayasDefault: [
          {"Flag": "CON", "Value": "Worked"},
          {"Flag": "NW", "Value": "Not Worked"},
          {"Flag": "SIC", "Value": "Sick"},
          {"Flag": "HOL", "Value": "Holiday Pay" },
          {"Flag": "TIL", "Value": "Time in Lieu"},
          {"Flag": "PUB", "Value": "Public Holiday"},
          {"Flag": "PHW", "Value": "Pub Hol Worked"}
        ],

        Payas: [
          {"Flag": "CON", "Value": "Worked"},
          {"Flag": "NW", "Value": "Not Worked"},
          {"Flag": "SIC", "Value": "Sick"},
          {"Flag": "HOL", "Value": "Holiday Pay" },
          {"Flag": "TIL", "Value": "Time in Lieu"},
          {"Flag": "PUB", "Value": "Public Holiday"},
          {"Flag": "PHW", "Value": "Pub Hol Worked"}
        ],

        TotalMBDedDisabled:false,
        DailyTimesIndex: 0,
        DailyTimesCopyIndex: 0,
        DayTimeIndex: 0,
        DayTimeCopyIndex: 0,
        DayTimeDateMoment: moment(),
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
        DayTimePayas: "0",
        DayTimeStart: moment("00:00", "HH:mm"),
        DayTimeStartMeal: moment("00:00", "HH:mm"),
        DayTimeStartMeal2: moment("00:00", "HH:mm"),
        DayTimeStartMeal3: moment("00:00", "HH:mm"),
        TimeStamp: "1523884860",
        DayTimeTotalHours: "0.00",
        DayTimeTotalMBDed: moment("00:00", "HH:mm"),
        DayTimeTravel1: moment("00:00", "HH:mm"),
        DayTimeTravel2: moment("00:00", "HH:mm"),

        DayTimeMBDed1: "0.00",
        DayTimeMBDed2: "0.00",
        DayTimeMBDed3: "0.00",

        UserSignatureImage: "",
        SaveDayTimeError: "",

    };

    //this.validateForm = this.validateForm.bind(this);
    //this.handleChangeDayTimeFinish = this.handleChangeDayTimeFinish.bind(this);
    this.updateTotalHours = this.updateTotalHours.bind(this)
    this.disabledDate = this.disabledDate.bind(this)
    this.getBase64Img = this.getBase64Img.bind(this)

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
        console.log(e);
    }

    try {
      const result = await this.companies();
      //console.log(companies);
      if(result.status){
        this.setState({ companies: result.items, items: result.items, isLoading: false });
      }
    } catch (e) {
        console.log("Get Companies: "+e);
    }

    Storage.vault.get('SignatureFile.jpg', {level: 'private'})
            .then(result => {
            //var url = "https://freelance-app-uploads.s3.amazonaws.com/private/us-east-1%3Acbb02b4b-8dc2-4930-831a-dd6ae1ad264b/SignatureFile.jpg";  
            var url = result.split('?');
            this.getBase64Img(url[0]);
            
            //this.setState({ UserSignatureImage: body})
              
    }).catch(err => console.log("SignatureFile: "+err));

  }

  getBase64Img(url){
    var result = false;
    base64Img.requestBase64(url, function(err, res, body) {
      if(err)
          result  =  false;
      else  
        result = body;
    });
    
    setTimeout(function() {
      if(result)
        this.setState({ UserSignatureImage: result}); 
    }.bind(this),5000);
    //console.log(result);
  }

  onDrop(files) {
    var selected_files = this.state.files;
    files.forEach(file => {
       //selected_files.push(file);
      var ext = file.name.split('.').pop();
      var file_name = new Date().getTime()+'-'+file.name+'.'+ext;
      var key = "timecards/"+file_name;
       //console.log(file_name); return false;
      Storage.put(key, file)
          .then (result => {
              //console.log(result);
              var uploadedObj = {
                "ContentType": file.type,
                "DocDesc": "Timecard Doccument",
                "DoumentType": ext.toUpperCase(),
                "Encrypted": "No",
                "filename": file.name,
                "PWHash": "a7e7ef%^%*&(7ke834",
                "Salt": "HFHHGVHJBJB",
                "Timestamp": new Date().getTime(),
                "url": result.key
              }
              this.state.FileAttachments.push(uploadedObj);
              this.setState({ FileAttachments: this.state.FileAttachments });
              console.log(this.state.FileAttachments);

      }).catch(err => console.log(err)); 
    });
    //var selected_files = files;
    /*this.setState({
      files : selected_files
    });*/
    //console.log(this.state.files);
    //setTimeout(function() { this.handleUploadFiles; }.bind(this),1000);
  }

  handleDeleteAttachment = (index) => async event => {
    //alert(index);
    var FileAttachments = this.state.FileAttachments;
    //delete FileAttachments[index];
    FileAttachments.splice(index, 1);
    this.setState({ FileAttachments: FileAttachments });
  }

  handleCalendar = (element) => event => {
    $(element +' div input').click();
  }

  handleUploadFiles = event => {
    this.setState({ isUploading: true });
    var files = this.state.files;
    var total_files = files.length;
    var files_count = 0;
    files.forEach(file => {
      //console.log(file); return false;
      files_count++;

      var ext = file.name.split('.').pop();
      var file_name = new Date().getTime()+'-'+file.name+'.'+ext;
      var key = "timecards/"+file_name;
        Storage.put(key, file)
            .then (result => {
              var uploadedObj = {
                "ContentType": file.type,
                "DocDesc": "Timecard Doccument",
                "DoumentType": ext.toUpperCase(),
                "Encrypted": "No",
                "filename": file.name,
                "PWHash": "a7e7ef%^%*&(7ke834",
                "Salt": "HFHHGVHJBJB",
                "Timestamp": new Date().getTime(),
                "url": result.key
              }
              //console.log(uploadedObj);
              this.state.FileAttachments.push(uploadedObj);
              
              if(files_count === total_files)
                this.setState({ isUploading: false });

        }).catch(err => console.log(err));
    });

    //this.setState({ isUploading: false });

  }

  handleCustomTimeCardFields = (index) => async event => {
    var CustomTimeCardFields = this.state.CustomTimeCardFields;
    
    if(CustomTimeCardFields[index].Type === "Checkbox"){
      CustomTimeCardFields[index].Value = CustomTimeCardFields[index].Value? 0 : 1;
      this.setState({ CustomTimeCardFields: CustomTimeCardFields });
    }

    if(CustomTimeCardFields[index].Type === "CheckBox"){
      CustomTimeCardFields[index].Value = CustomTimeCardFields[index].Value? 0 : 1;
      this.setState({ CustomTimeCardFields: CustomTimeCardFields });
    }

    if(CustomTimeCardFields[index].Type === "Entry"){
      CustomTimeCardFields[index].Value = event.target.value;
      this.setState({ CustomTimeCardFields: CustomTimeCardFields });
    }

    if(CustomTimeCardFields[index].Type === "DropList"){
      CustomTimeCardFields[index].Value = event.target.value;
      this.setState({ CustomTimeCardFields: CustomTimeCardFields });
    }
  }

  handleTimesCustomTimeFields = (index) => async event => {
    var TimesCustomTimeFields = this.state.TimesCustomTimeFields;
    
    if(TimesCustomTimeFields[index].Type === "Checkbox"){
      TimesCustomTimeFields[index].Value = TimesCustomTimeFields[index].Value? 0 : 1;
      this.setState({ TimesCustomTimeFields: TimesCustomTimeFields });
    }

    if(TimesCustomTimeFields[index].Type === "CheckBox"){
      TimesCustomTimeFields[index].Value = TimesCustomTimeFields[index].Value? 0 : 1;
      this.setState({ TimesCustomTimeFields: TimesCustomTimeFields });
    }

    if(TimesCustomTimeFields[index].Type === "Entry"){
      TimesCustomTimeFields[index].Value = event.target.value;
      this.setState({ TimesCustomTimeFields: TimesCustomTimeFields });
    }

    if(TimesCustomTimeFields[index].Type === "DropList"){
      TimesCustomTimeFields[index].Value = event.target.value;
      this.setState({ TimesCustomTimeFields: TimesCustomTimeFields });
    }
  }

  handleChange = async event => {

    const name = event.target.name;
    const value = event.target.value;
    const ValidStateName = name+'Valid';
    this.setState({[ValidStateName]: true });
    if(name === "CompanyIndex"){
      if(value === ""){
        //console.log(this.state.companies[value]);
        var company = this.state.companies[value];
        var comp = ""
        this.setState({[name]: value, Company: comp, Production: "", Dept: "", Position:"",PayFrequency: "Weekly",PayEnding: "",SubmitEmail: "",CustomTimeCardFields: [], TimesCustomTimeFields: [], HideTravel:false, mrtFile: "default"}, 
                  () => { this.validateField("Company", comp, "CompanyValid") });


      }else{
        var company = this.state.companies[value];
        //console.log(this.state.companies[value]);
        if(company.SysCoyGuid){
          try {
            
            const item = await this.getSysCopmany(company.SysCoyGuid);
            if(item.status){
              //console.log(item.result);
              this.setState({
                CustomTimeCardFields: item.result.CustomFields? item.result.CustomFields : [],
                TimesCustomTimeFields: item.result.CustomTimeFields? item.result.CustomTimeFields : [],
                HideTravel: item.result.HideTravel === 1? true : false,
                mrtFile:item.result.Timesheet? item.result.Timesheet : "default",
                Payas: item.result.Payas? item.result.Payas : this.state.PayasDefault,
              });
            }else{
              console.log('Error in fatching Syscompany: Invalid ID')
            }

          }catch (e) {
            console.log("Error in fatching Syscompany: "+ e);
          }
        }else{
          this.setState({CustomTimeCardFields: [], TimesCustomTimeFields: [], HideTravel: false, Payas: this.state.PayasDefault, mrtFile: "default"});
        }
        var comp = [
          {
            "Guid": company.Guid? company.Guid : '',
            "Name": company.Name? company.Name : '',
            "Payas": this.state.Payas,
            "Production": company.Production? company.Production : ''
          }
        ]
        //console.log(comp);
        this.setState({
          [name]: value, 
          Company: comp, 
          Production: company.Production? company.Production : '', 
          Dept: company.Dept? company.Dept : '', 
          Position: company.Position? company.Position : '',
          PayFrequency: company.PayFreq? company.PayFreq : 'Weekly',
          PayEnding: company.PayEnding? company.PayEnding : 'Sunday',
          SubmitEmail: company.EmailAddress? company.EmailAddress : ''
        }, 
                  () => { this.validateField("Company", comp, "CompanyValid") });

      }
      
    }else if(name === "SubmitEmail"){

      this.setState({[name]: value}, () => { this.validateSubmitEmail(value) });
    
    }else{
      this.setState({[name]: value}, 
                () => { this.validateField(name, value, ValidStateName) });
    }
  }

  handleChangeDayTime = event => {
    this.setState({'SaveDayTimeError': ''});
    const name = event.target.name;
    const value = event.target.value;
    //alert(name);
    if(name === 'DayTimeMB1ND' || name === 'DayTimeMB2ND' || name === 'DayTimeMB3ND'){
      this.setState({[name]: event.target.checked});
      setTimeout(function() { this.updateMealBreakTime(); }.bind(this),1000);
    }
    /*else if(name === 'DayTimeDate'){
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
    }*/
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

  validateSubmitEmail() {
    let valid = true;

    if(this.state.SubmitEmail.length === 0){
      valid = false;
    }

    this.setState({SubmitEmailValid:valid});
  }

  handleSubmitSuccessModal = async event => {
    event.preventDefault();
    
      $('#SubmitSuccessModalClose').click();
      this.clearTimeCardStats();

  }

  handleSubmitEmail = async event => {
    //console.log(this.state.InsertedId)
    //event.preventDefault();
    this.setState({isLoading: true });

    if(this.state.SubmitEmailValid && this.state.SubmitEmail.length > 0){
      //var DailyTimes = this.state.DailyTimes;
      //var DailyTimesLenght = DailyTimes.length;
      //var LastDailyTimes = [];
      var file_name = this.state.InsertedId+'.pdf';
      var url = 'documents/'+new Date().getTime()+'-'+file_name;
      var SubmitEmail = this.state.SubmitEmail;

      var docItem = {
          "Company": this.state.Company[0].Name,
          "ContentType": "application/pdf",
          "DocDesc": "Crew Timesheet",
          "DocumentType": "PDF",
          "Encrypted": "No",
          "Filename": file_name,
          "Production": this.state.Production,
          "PWHash": "f56e46w#3fefew",
          "Salt": "GYUFYDTFKHFYV",
          "url": url
      }
      
      /*if(DailyTimesLenght > 0 ){
        for (var i = DailyTimesLenght - 1; i >= DailyTimesLenght - 7; i--) {
          LastDailyTimes[DailyTimes[i].Day] = DailyTimes[i];
        };
      }

      const item = {
        "Data":{
          "UserFirstName":localStorage.getItem('UserFirstName')? localStorage.getItem('UserFirstName') : '',
          "UserLastName":localStorage.getItem('UserLastName')? localStorage.getItem('UserLastName') : "",
          "EmployeeSig":this.state.UserSignatureImage? this.state.UserSignatureImage : "",
          "UserDepartment":this.state.Dept,
          "UserPosition":this.state.Position,
          "UserPayDate":this.state.PeriodEnding,
          "PayOutYes":"True",
          "SecurityPassReturned":"True",
          "PCFloatReturned":"",
          
          "DateMon":DailyTimesLenght && LastDailyTimes['Monday'].Date? moment( new Date(LastDailyTimes['Monday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateTue":DailyTimesLenght && LastDailyTimes['Tuesday'].Date? moment( new Date(LastDailyTimes['Tuesday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateWed":DailyTimesLenght && LastDailyTimes['Wednesday'].Date? moment( new Date(LastDailyTimes['Wednesday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateThu":DailyTimesLenght && LastDailyTimes['Thursday'].Date? moment( new Date(LastDailyTimes['Thursday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateFri":DailyTimesLenght && LastDailyTimes['Friday'].Date? moment( new Date(LastDailyTimes['Friday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateSat":DailyTimesLenght && LastDailyTimes['Saturday'].Date? moment( new Date(LastDailyTimes['Saturday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateSun":DailyTimesLenght && LastDailyTimes['Sunday'].Date? moment( new Date(LastDailyTimes['Sunday'].Date*1000) ).format("DD/MM/YYYY") : "",
          
          "StartMon":DailyTimesLenght && LastDailyTimes['Monday'].Start? LastDailyTimes['Monday'].Start : "",
          "StartTue":DailyTimesLenght && LastDailyTimes['Tuesday'].Start? LastDailyTimes['Tuesday'].Start : "",
          "StartWed":DailyTimesLenght && LastDailyTimes['Wednesday'].Start? LastDailyTimes['Wednesday'].Start : "",
          "StartThu":DailyTimesLenght && LastDailyTimes['Thursday'].Start? LastDailyTimes['Thursday'].Start : "",
          "StartFri":DailyTimesLenght && LastDailyTimes['Friday'].Start? LastDailyTimes['Friday'].Start : "",
          "StartSat":DailyTimesLenght && LastDailyTimes['Saturday'].Start? LastDailyTimes['Saturday'].Start : "",
          "StartSun":DailyTimesLenght && LastDailyTimes['Sunday'].Start? LastDailyTimes['Sunday'].Start : "",
          
          "EndMon":DailyTimesLenght && LastDailyTimes['Monday'].Finish? LastDailyTimes['Monday'].Finish : "",
          "EndTue":DailyTimesLenght && LastDailyTimes['Tuesday'].Finish? LastDailyTimes['Tuesday'].Finish : "",
          "EndWed":DailyTimesLenght && LastDailyTimes['Wednesday'].Finish? LastDailyTimes['Wednesday'].Finish : "",
          "EndThu":DailyTimesLenght && LastDailyTimes['Thursday'].Finish? LastDailyTimes['Thursday'].Finish : "",
          "EndFri":DailyTimesLenght && LastDailyTimes['Friday'].Finish? LastDailyTimes['Friday'].Finish : "",
          "EndSat":DailyTimesLenght && LastDailyTimes['Saturday'].Finish? LastDailyTimes['Saturday'].Finish : "",
          "EndSun":DailyTimesLenght && LastDailyTimes['Sunday'].Finish? LastDailyTimes['Sunday'].Finish : "",
          
          "BreakMon":DailyTimesLenght && LastDailyTimes['Monday'].TotalMBDed? LastDailyTimes['Monday'].TotalMBDed : "",
          "BreakTue":DailyTimesLenght && LastDailyTimes['Tuesday'].TotalMBDed? LastDailyTimes['Tuesday'].TotalMBDed : "",
          "BreakWed":DailyTimesLenght && LastDailyTimes['Wednesday'].TotalMBDed? LastDailyTimes['Wednesday'].TotalMBDed : "",
          "BreakThu":DailyTimesLenght && LastDailyTimes['Thursday'].TotalMBDed? LastDailyTimes['Thursday'].TotalMBDed : "",
          "BreakFri":DailyTimesLenght && LastDailyTimes['Friday'].TotalMBDed? LastDailyTimes['Friday'].TotalMBDed : "",
          "BreakSat":DailyTimesLenght && LastDailyTimes['Saturday'].TotalMBDed? LastDailyTimes['Saturday'].TotalMBDed : "",
          "BreakSun":DailyTimesLenght && LastDailyTimes['Sunday'].TotalMBDed? LastDailyTimes['Sunday'].TotalMBDed : "",

          "HoursMon":DailyTimesLenght && LastDailyTimes['Monday'].TotalHours? LastDailyTimes['Monday'].TotalHours : "",
          "HoursTue":DailyTimesLenght && LastDailyTimes['Tuesday'].TotalHours? LastDailyTimes['Tuesday'].TotalHours : "",
          "HoursWed":DailyTimesLenght && LastDailyTimes['Wednesday'].TotalHours? LastDailyTimes['Wednesday'].TotalHours : "",
          "HoursThu":DailyTimesLenght && LastDailyTimes['Thursday'].TotalHours? LastDailyTimes['Thursday'].TotalHours : "",
          "HoursFri":DailyTimesLenght && LastDailyTimes['Friday'].TotalHours? LastDailyTimes['Friday'].TotalHours : "",
          "HoursSat":DailyTimesLenght && LastDailyTimes['Saturday'].TotalHours? LastDailyTimes['Saturday'].TotalHours : "",
          "HoursSun":DailyTimesLenght && LastDailyTimes['Sunday'].TotalHours? LastDailyTimes['Sunday'].TotalHours : "",

          "TotalHours":DailyTimesLenght? this.calculateTotalHours(LastDailyTimes) : '',

          "mrtFile": this.state.mrtFile,
        }
      }*/

      var DailyTimesLenght = this.state.DailyTimes.length;
      var PreviewDailyTimes = [];
      
      if(DailyTimesLenght > 0 ){
        for (var i = 0; i < DailyTimesLenght; i++) {
          var DTime = {"Date": "","Day": "","Finish": "00:00","FinishMeal1": "00:00","FinishMeal2": "00:00","FinishMeal3": "00:00","MB1ND": "0","MB2ND": "0","MB3ND": "0","Note": "","Payas": "","Start": "00:00","StartMeal": "00:00","StartMeal2": "0:00","StartMeal3": "00:00","TimeStamp": "1523884860","TotalHours": "00:00","TotalMBDed": "00:00","Travel1": "00:00","Travel2": "00:00"}
          DTime.Date = this.state.DailyTimes[i].Date? moment( new Date(this.state.DailyTimes[i].Date*1000) ).format("DD/MM/YYYY") : '';
          DTime.Day = this.state.DailyTimes[i].Day? this.state.DailyTimes[i].Day : '';
          DTime.Finish = this.state.DailyTimes[i].Finish? this.state.DailyTimes[i].Finish : '00:00';
          DTime.FinishMeal1 = this.state.DailyTimes[i].FinishMeal1? this.state.DailyTimes[i].FinishMeal1 : '00:00';
          DTime.FinishMeal2 = this.state.DailyTimes[i].FinishMeal2? this.state.DailyTimes[i].FinishMeal2 : '00:00';
          DTime.FinishMeal3 = this.state.DailyTimes[i].FinishMeal3? this.state.DailyTimes[i].FinishMeal3 : '00:00';
          DTime.MB1ND = this.state.DailyTimes[i].MB1ND? this.state.DailyTimes[i].MB1ND : '00:00';
          DTime.MB2ND = this.state.DailyTimes[i].MB2ND? this.state.DailyTimes[i].MB2ND : '00:00';
          DTime.MB3ND = this.state.DailyTimes[i].MB3ND? this.state.DailyTimes[i].MB3ND : '00:00';
          DTime.Note = this.state.DailyTimes[i].Note? this.state.DailyTimes[i].Note : '';
          DTime.Payas = this.state.DailyTimes[i].Payas? this.state.DailyTimes[i].Payas : '';
          DTime.Start = this.state.DailyTimes[i].Start? this.state.DailyTimes[i].Start : '00:00';
          DTime.StartMeal = this.state.DailyTimes[i].StartMeal? this.state.DailyTimes[i].StartMeal : '00:00';
          DTime.StartMeal23 = this.state.DailyTimes[i].StartMeal2? this.state.DailyTimes[i].StartMeal2 : '00:00';
          DTime.StartMeal = this.state.DailyTimes[i].StartMeal3? this.state.DailyTimes[i].StartMeal3 : '00:00';
          DTime.TimeStamp = this.state.DailyTimes[i].TimeStamp? this.state.DailyTimes[i].TimeStamp : '';
          DTime.TotalHours = this.state.DailyTimes[i].TotalHours? this.state.DailyTimes[i].TotalHours : '';
          DTime.TotalMBDed = this.state.DailyTimes[i].TotalMBDed? this.state.DailyTimes[i].TotalMBDed : '';
          DTime.Travel1 = this.state.DailyTimes[i].Travel1? this.state.DailyTimes[i].Travel1 : '';
          DTime.Travel2 = this.state.DailyTimes[i].Travel2? this.state.DailyTimes[i].Travel2 : '';
          PreviewDailyTimes.push(DTime);
        };
      }
//      console.log(PreviewDailyTimes);
//return false;
      var Times = [{
        "CustomTimeFields":this.state.TimesCustomTimeFields,
        "DailyTimes": PreviewDailyTimes,
        "TotalHours": this.state.TimesTotalHours
      }];
      //console.log(this.state.Times); return false;
      var UserFirstName = localStorage.getItem('UserFirstName')? localStorage.getItem('UserFirstName') : "";
      var UserLastName = localStorage.getItem('UserLastName')? localStorage.getItem('UserLastName') : "";
      var subject = UserFirstName+' '+UserLastName+' '+moment( new Date(this.state.PeriodEnding) ).format("DDMMMMYYYY")+' '+this.state.Position;  
      const item = {
        "mrtFile": this.state.mrtFile,
        "UserFirstName":localStorage.getItem('UserFirstName')? localStorage.getItem('UserFirstName') : "",
        "UserLastName":localStorage.getItem('UserLastName')? localStorage.getItem('UserLastName') : "",
        "Signature": "https://s3.amazonaws.com/freelance-app-uploads/public/SignatureFile.png",
        "status": true,
        "items" : [
          {
            "Signature": "https://s3.amazonaws.com/freelance-app-uploads/public/SignatureFile.png",
            "Activity": this.state.Activity,
            "Company": this.state.Company? [{
              "Guid": this.state.Company[0].Guid,
              "Name": this.state.Company[0].Name? this.state.Company[0].Name : '',
              "Payas": this.state.Payas? this.state.Payas : '',
              "Production": this.state.Production? this.state.Production : null
            }] : [],
            
            "CustomTimeCardFields": this.state.CustomTimeCardFields,
            "Dept": this.state.Dept? this.state.Dept : '',
            "FileAttachments": this.state.FileAttachments,
            "PayFrequency" : this.state.PayFrequency,
            "PeriodEnding": this.state.PeriodEnding,
            //"Pos": this.state.Pos,
            "Position": this.state.Position? this.state.Position : '',
            //"Times": this.state.Times,
            "Times": Times,   
            "TotalHours": this.state.TotalHours,
            "Type": this.state.SubView === 'Submit'? "submitted" : "Draft",
          }
      ]
    }

      try {
          const response = await this.createPreview(item);
          var EmailData = {
            to:SubmitEmail,
            subject:subject,
            message:"Timecard attached",
            Preview: "data:application/pdf;base64,"+response.pdfData
          };

          try {
            //console.log(EmailData); return false;
              const response = await this.sendEmail(EmailData);

              //console.log('email',response); return false;
              this.setState({isLoading: false, SubmitEmailValid:false});

          }catch (e) {
              console.log("Email "+e);
              this.setState({isLoading: false, SubmitEmailValid:false});
          }
//return false;
          const base64Data = new Buffer(response.pdfData, 'base64');
          
          Storage.put(url, base64Data, { contentType: 'application/pdf' })
          .then (result => {   
            try{
              this.createDocuments(docItem);
            }catch (e) {
              console.log("Save Document "+e);
            }
          }).catch(err => console.log(err));


      }catch (e) {
          console.log("Preview "+e);
          this.setState({isLoading: false, SubmitEmailValid:false});
      }



    }else{
      this.setState({isLoading: false, SubmitEmailValid:false});
    }

  }

  handlePreview = async event => {
    event.preventDefault();
    this.setState({onHold: true, previewLoading: true });
//console.log(this.state.mrtFile);
    if(this.state.formValid){

/*      var DailyTimes = this.state.DailyTimes;
      var DailyTimesLenght = DailyTimes.length;
      var LastDailyTimes = [];
      
      if(DailyTimesLenght > 0 ){
        for (var i = DailyTimesLenght - 1; i >= DailyTimesLenght - 7; i--) {
          LastDailyTimes[DailyTimes[i].Day] = DailyTimes[i];
        };
      }

      const item = {
        "Data":{
          "UserFirstName":localStorage.getItem('UserFirstName')? localStorage.getItem('UserFirstName') : '',
          "UserLastName":localStorage.getItem('UserLastName')? localStorage.getItem('UserLastName') : "",
          "EmployeeSig":this.state.UserSignatureImage? this.state.UserSignatureImage : "",
          "UserDepartment":this.state.Dept,
          "UserPosition":this.state.Position,
          "UserPayDate":this.state.PeriodEnding,
          "PayOutYes":"True",
          "SecurityPassReturned":"True",
          "PCFloatReturned":"",
          
          "DateMon":DailyTimesLenght && LastDailyTimes['Monday'].Date? moment( new Date(LastDailyTimes['Monday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateTue":DailyTimesLenght && LastDailyTimes['Tuesday'].Date? moment( new Date(LastDailyTimes['Tuesday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateWed":DailyTimesLenght && LastDailyTimes['Wednesday'].Date? moment( new Date(LastDailyTimes['Wednesday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateThu":DailyTimesLenght && LastDailyTimes['Thursday'].Date? moment( new Date(LastDailyTimes['Thursday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateFri":DailyTimesLenght && LastDailyTimes['Friday'].Date? moment( new Date(LastDailyTimes['Friday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateSat":DailyTimesLenght && LastDailyTimes['Saturday'].Date? moment( new Date(LastDailyTimes['Saturday'].Date*1000) ).format("DD/MM/YYYY") : "",
          "DateSun":DailyTimesLenght && LastDailyTimes['Sunday'].Date? moment( new Date(LastDailyTimes['Sunday'].Date*1000) ).format("DD/MM/YYYY") : "",
          
          "StartMon":DailyTimesLenght && LastDailyTimes['Monday'].Start? LastDailyTimes['Monday'].Start : "",
          "StartTue":DailyTimesLenght && LastDailyTimes['Tuesday'].Start? LastDailyTimes['Tuesday'].Start : "",
          "StartWed":DailyTimesLenght && LastDailyTimes['Wednesday'].Start? LastDailyTimes['Wednesday'].Start : "",
          "StartThu":DailyTimesLenght && LastDailyTimes['Thursday'].Start? LastDailyTimes['Thursday'].Start : "",
          "StartFri":DailyTimesLenght && LastDailyTimes['Friday'].Start? LastDailyTimes['Friday'].Start : "",
          "StartSat":DailyTimesLenght && LastDailyTimes['Saturday'].Start? LastDailyTimes['Saturday'].Start : "",
          "StartSun":DailyTimesLenght && LastDailyTimes['Sunday'].Start? LastDailyTimes['Sunday'].Start : "",
          
          "EndMon":DailyTimesLenght && LastDailyTimes['Monday'].Finish? LastDailyTimes['Monday'].Finish : "",
          "EndTue":DailyTimesLenght && LastDailyTimes['Tuesday'].Finish? LastDailyTimes['Tuesday'].Finish : "",
          "EndWed":DailyTimesLenght && LastDailyTimes['Wednesday'].Finish? LastDailyTimes['Wednesday'].Finish : "",
          "EndThu":DailyTimesLenght && LastDailyTimes['Thursday'].Finish? LastDailyTimes['Thursday'].Finish : "",
          "EndFri":DailyTimesLenght && LastDailyTimes['Friday'].Finish? LastDailyTimes['Friday'].Finish : "",
          "EndSat":DailyTimesLenght && LastDailyTimes['Saturday'].Finish? LastDailyTimes['Saturday'].Finish : "",
          "EndSun":DailyTimesLenght && LastDailyTimes['Sunday'].Finish? LastDailyTimes['Sunday'].Finish : "",
          
          "BreakMon":DailyTimesLenght && LastDailyTimes['Monday'].TotalMBDed? LastDailyTimes['Monday'].TotalMBDed : "",
          "BreakTue":DailyTimesLenght && LastDailyTimes['Tuesday'].TotalMBDed? LastDailyTimes['Tuesday'].TotalMBDed : "",
          "BreakWed":DailyTimesLenght && LastDailyTimes['Wednesday'].TotalMBDed? LastDailyTimes['Wednesday'].TotalMBDed : "",
          "BreakThu":DailyTimesLenght && LastDailyTimes['Thursday'].TotalMBDed? LastDailyTimes['Thursday'].TotalMBDed : "",
          "BreakFri":DailyTimesLenght && LastDailyTimes['Friday'].TotalMBDed? LastDailyTimes['Friday'].TotalMBDed : "",
          "BreakSat":DailyTimesLenght && LastDailyTimes['Saturday'].TotalMBDed? LastDailyTimes['Saturday'].TotalMBDed : "",
          "BreakSun":DailyTimesLenght && LastDailyTimes['Sunday'].TotalMBDed? LastDailyTimes['Sunday'].TotalMBDed : "",

          "HoursMon":DailyTimesLenght && LastDailyTimes['Monday'].TotalHours? LastDailyTimes['Monday'].TotalHours : "",
          "HoursTue":DailyTimesLenght && LastDailyTimes['Tuesday'].TotalHours? LastDailyTimes['Tuesday'].TotalHours : "",
          "HoursWed":DailyTimesLenght && LastDailyTimes['Wednesday'].TotalHours? LastDailyTimes['Wednesday'].TotalHours : "",
          "HoursThu":DailyTimesLenght && LastDailyTimes['Thursday'].TotalHours? LastDailyTimes['Thursday'].TotalHours : "",
          "HoursFri":DailyTimesLenght && LastDailyTimes['Friday'].TotalHours? LastDailyTimes['Friday'].TotalHours : "",
          "HoursSat":DailyTimesLenght && LastDailyTimes['Saturday'].TotalHours? LastDailyTimes['Saturday'].TotalHours : "",
          "HoursSun":DailyTimesLenght && LastDailyTimes['Sunday'].TotalHours? LastDailyTimes['Sunday'].TotalHours : "",

          "TotalHours":DailyTimesLenght? this.calculateTotalHours(LastDailyTimes) : '',

          "mrtFile": this.state.mrtFile
        }
      }*/

      //var PreviewDailyTimes = this.state.DailyTimes;
      var DailyTimesLenght = this.state.DailyTimes.length;
      var PreviewDailyTimes = [];
      
      if(DailyTimesLenght > 0 ){
        for (var i = 0; i < DailyTimesLenght; i++) {
          var DTime = {"Date": "","Day": "","Finish": "00:00","FinishMeal1": "00:00","FinishMeal2": "00:00","FinishMeal3": "00:00","MB1ND": "0","MB2ND": "0","MB3ND": "0","Note": "","Payas": "","Start": "00:00","StartMeal": "00:00","StartMeal2": "0:00","StartMeal3": "00:00","TimeStamp": "1523884860","TotalHours": "00:00","TotalMBDed": "00:00","Travel1": "00:00","Travel2": "00:00"}
          DTime.Date = this.state.DailyTimes[i].Date? moment( new Date(this.state.DailyTimes[i].Date*1000) ).format("DD/MM/YYYY") : '';
          DTime.Day = this.state.DailyTimes[i].Day? this.state.DailyTimes[i].Day : '';
          DTime.Finish = this.state.DailyTimes[i].Finish? this.state.DailyTimes[i].Finish : '00:00';
          DTime.FinishMeal1 = this.state.DailyTimes[i].FinishMeal1? this.state.DailyTimes[i].FinishMeal1 : '00:00';
          DTime.FinishMeal2 = this.state.DailyTimes[i].FinishMeal2? this.state.DailyTimes[i].FinishMeal2 : '00:00';
          DTime.FinishMeal3 = this.state.DailyTimes[i].FinishMeal3? this.state.DailyTimes[i].FinishMeal3 : '00:00';
          DTime.MB1ND = this.state.DailyTimes[i].MB1ND? this.state.DailyTimes[i].MB1ND : '00:00';
          DTime.MB2ND = this.state.DailyTimes[i].MB2ND? this.state.DailyTimes[i].MB2ND : '00:00';
          DTime.MB3ND = this.state.DailyTimes[i].MB3ND? this.state.DailyTimes[i].MB3ND : '00:00';
          DTime.Note = this.state.DailyTimes[i].Note? this.state.DailyTimes[i].Note : '';
          DTime.Payas = this.state.DailyTimes[i].Payas? this.state.DailyTimes[i].Payas : '';
          DTime.Start = this.state.DailyTimes[i].Start? this.state.DailyTimes[i].Start : '00:00';
          DTime.StartMeal = this.state.DailyTimes[i].StartMeal? this.state.DailyTimes[i].StartMeal : '00:00';
          DTime.StartMeal23 = this.state.DailyTimes[i].StartMeal2? this.state.DailyTimes[i].StartMeal2 : '00:00';
          DTime.StartMeal = this.state.DailyTimes[i].StartMeal3? this.state.DailyTimes[i].StartMeal3 : '00:00';
          DTime.TimeStamp = this.state.DailyTimes[i].TimeStamp? this.state.DailyTimes[i].TimeStamp : '';
          DTime.TotalHours = this.state.DailyTimes[i].TotalHours? this.state.DailyTimes[i].TotalHours : '';
          DTime.TotalMBDed = this.state.DailyTimes[i].TotalMBDed? this.state.DailyTimes[i].TotalMBDed : '';
          DTime.Travel1 = this.state.DailyTimes[i].Travel1? this.state.DailyTimes[i].Travel1 : '';
          DTime.Travel2 = this.state.DailyTimes[i].Travel2? this.state.DailyTimes[i].Travel2 : '';
          PreviewDailyTimes.push(DTime);
        };
      }
//      console.log(PreviewDailyTimes);
//return false;
      var Times = [{
        "CustomTimeFields":this.state.TimesCustomTimeFields,
        "DailyTimes": PreviewDailyTimes,
        "TotalHours": this.state.TimesTotalHours
      }];
      //console.log(this.state.Times); return false;
      
      const item = {
        "mrtFile": this.state.mrtFile,
        "UserFirstName":localStorage.getItem('UserFirstName')? localStorage.getItem('UserFirstName') : "",
        "UserLastName":localStorage.getItem('UserLastName')? localStorage.getItem('UserLastName') : "",
        "Signature": "https://s3.amazonaws.com/freelance-app-uploads/public/SignatureFile.png",
        "status": true,
        "items" : [
          {
            "Signature": "https://s3.amazonaws.com/freelance-app-uploads/public/SignatureFile.png",
            "Activity": this.state.Activity,
            "Company": this.state.Company? [{
              "Guid": this.state.Company[0].Guid,
              "Name": this.state.Company[0].Name? this.state.Company[0].Name : '',
              "Payas": this.state.Payas? this.state.Payas : '',
              "Production": this.state.Production? this.state.Production : null
            }] : [],
            
            "CustomTimeCardFields": this.state.CustomTimeCardFields,
            "Dept": this.state.Dept? this.state.Dept : '',
            "FileAttachments": this.state.FileAttachments,
            "PayFrequency" : this.state.PayFrequency,
            "PeriodEnding": this.state.PeriodEnding,
            //"Pos": this.state.Pos,
            "Position": this.state.Position? this.state.Position : '',
            //"Times": this.state.Times,
            "Times": Times,   
            "TotalHours": this.state.TotalHours,
            "Type": this.state.SubView === 'Submit'? "submitted" : "Draft",
          }
      ]
    }


    //console.log(item); return false;
          var pdfWindow = window.open();
          pdfWindow.document.open().write("<html><head><title>Preview</title></head><body style='margin:0; text-align: center;'><h1 class='previewLoading'>Loading.....</h1></body></html>")
      try {
          const response = await this.createPreview(item);
          //console.log(response); return false;
          if(response.pdfData){
            pdfWindow.document.open().write("<html><head><title>Preview</title></head><body style='margin:0; text-align: center;'><style>body{margin:0;} .previewLoading { display:none; } </style><iframe width='100%'  height='1000' style='border:0;' src='data:application/pdf;base64, " + encodeURI(response.pdfData)+"'></iframe></body></html>")
          }
          //pdfWindow.write("<html><head></head><body style='margin:0;'><iframe width='100%'  height='1000' style='border:0;' src='data:application/pdf;base64, " + encodeURI(response.pdfData)+"'></iframe></iframe></body></html>")
          //$("#pdf-content").html("<html><head></head><body style='margin:0;'><iframe width='100%'  height='1000' style='border:0;' src='data:application/pdf;base64, " + encodeURI(response.pdfData)+"'></iframe></iframe></body></html>")
          //$("#modalFullScreenBtn").click();
          //this.setState({Preview: "data:application/pdf;base64, " + encodeURI(response.pdfData) });
          //console.log(response);

      }catch (e) {
          console.log("Preview "+e);
      }

      this.setState({onHold: false, previewLoading: false });

    }else{
      this.setState({onHold: false, previewLoading: false, CompanyValid:false });
    }
    
  }

  handleSubmitView = async event => {
    event.preventDefault();
    this.setState({isLoading: true });

    if(this.state.formValid){

      //alert('abc d');
      this.setState({isLoading: false, SubView: 'Submit'});

    }else{
      this.setState({isLoading: false, CompanyValid:false});
    }
    
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({isLoading: true });
//alert(this.state.formValid); return false;
//console.log(this.state.Company); return false;
//this.handleSubmitEmail(); return false;

    if(this.state.formValid){

      var Times = this.state.Times;
      Times[this.state.DailyTimesIndex] = {CustomTimeFields:this.state.TimesCustomTimeFields, DailyTimes: this.state.DailyTimes, TotalHours: this.state.TimesTotalHours};
      
      const item = {
          "Activity": this.state.Activity,
          "Company": this.state.Company? [{
            "Guid": this.state.Company[0].Guid,
            "Name": this.state.Company[0].Name? this.state.Company[0].Name : '',
            "Payas": this.state.Payas? this.state.Payas : '',
            "Production": this.state.Production? this.state.Production : null
          }] : [],
          
          "CustomTimeCardFields": this.state.CustomTimeCardFields,
          "Dept": this.state.Dept? this.state.Dept : '',
          "FileAttachments": this.state.FileAttachments,
          "PayFrequency" : this.state.PayFrequency,
          "PeriodEnding": this.state.PeriodEnding,
          //"Pos": this.state.Pos,
          "Position": this.state.Position? this.state.Position : '',
          //"Times": this.state.Times,
          "Times": Times,   
          "TotalHours": this.state.TotalHours,
          "Type": this.state.SubView === 'Submit'? "submitted" : "Draft",
      }
//alert('ddd');
//console.log(item);
//return false;
//alert(this.state.Update);
      if(this.state.SubView === 'Submit'){
        if(!this.state.SubmitEmailValid && this.state.SubmitEmail.length === 0){
          this.setState({isLoading: false });
          return false;
        }
      }
//console.log('continue');
      try {

        if(!this.state.Update){
          const response = await this.createTimeCard(item);

          if(response.status){
            this.saveActivity("Timecard has been created");
            this.setState({InsertedId: response.result.Guid });
            if(this.state.SubView === 'Submit'){
              const items = this.state.timecards;
              items.push(response.result);
              this.setState({ timecards: items});
              this.handleSubmitEmail();
              $('#SubmitSuccessModalBtn').click();
            
            }else{
              
              const items = this.state.timecards;
              items.push(response.result);
              this.setState({ timecards: items});
              console.log('Successfully saved.');
              this.clearTimeCardStats();
            
            }
            
          }
        }else{
          const response = await this.updateTimeCard(item);
          //console.log(response);
          //return false;
          if(response.status){
            var timecards = this.state.timecards;
            this.setState({InsertedId: response.result.Guid });
            if(this.state.SubView === 'Submit'){
              this.handleSubmitEmail();
              delete timecards[this.state.ItemIndex];
              this.setState({timecards: timecards});
              $('#SubmitSuccessModalBtn').click();
            }else{
              timecards[this.state.ItemIndex] = response.result;
              this.setState({timecards: timecards});
              console.log('Successfully updated.');
              this.clearTimeCardStats();
            }
            
          }
        }

      }catch (e) {
          //alert(e);
          console.log("Timecaed "+e);
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
      if (companies[i].Guid === needle){
        // we found it
        return i;
      }
    }
     return 0;
  }

  async setMrtFile(SysCoyGuid){
    try {
            
        const item = await this.getSysCopmany(SysCoyGuid);
        if(item.status){
          //console.log(item.result);
          this.setState({
              mrtFile:item.result.Timesheet? item.result.Timesheet : "default",
          });
        }else{
          this.setState({ mrtFile: "default" });
          console.log('Error in fatching Syscompany: Invalid ID')
        }

      }catch (e) {
        console.log("Set Mrt File: "+ e);
      }
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
    //console.log(item);
    var formValid = false;
    var company = "";
    var production = "";
    var SubmitEmail = "";
    var cindex = this.findCompany(item.Company[0].Guid);

    if(this.state.companies.length > 0){
      //console.log(this.state.companies[cindex]);
      if(this.state.companies[cindex].SysCoyGuid){
        this.setMrtFile(this.state.companies[cindex].SysCoyGuid);
      }else{
        this.setState({ mrtFile: "default" });
      }
      //var citem = this.state.companies[cindex];
      var citem = item.Company[0];
      //console.log(citem);
      var company = [
        {
          "Guid": citem.Guid,
          "Name": citem.Name,
          "Payas": citem.Payas,
          "Production": citem.Production
        }
      ]
      //console.log(company);
      var payas = citem.Payas? citem.Payas : this.state.PayasDefault;
      var production = citem.Production? citem.Production : '';
      var formValid = true;
      var SubmitEmail = this.state.companies[cindex].EmailAddress? this.state.companies[cindex].EmailAddress : '';
      var PayEnding = this.state.companies[cindex].PayEnding? this.state.companies[cindex].PayEnding : '';

    }

    var DailyTimesIndex = item.Times.length-1;
    var DailyTimes = item.Times[DailyTimesIndex].DailyTimes? item.Times[DailyTimesIndex].DailyTimes : [];
//console.log(item.Times);
    this.setState({
      SubView: 'Add',
      SubmitEmail: SubmitEmail,
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
      CustomTimeCardFields: item.CustomTimeCardFields? item.CustomTimeCardFields : [],
      Dept: item.Dept? item.Dept : "",
      FileAttachments: item.FileAttachments? item.FileAttachments : "",
      PayFrequency: item.PayFrequency? item.PayFrequency : "",
      PeriodEndingMoment: item.PeriodEnding? moment(String(new Date(item.PeriodEnding).getDate()).padStart(2,0)+"/"+String((new Date(item.PeriodEnding).getMonth()+1)).padStart(2,0)+'/'+ new Date(item.PeriodEnding).getFullYear(), this.state.dateFormat) : "",
      PeriodEnding: item.PeriodEnding? new Date(item.PeriodEnding).getFullYear()+"-"+String((new Date(item.PeriodEnding).getMonth()+1)).padStart(2,0)+"-"+String(new Date(item.PeriodEnding).getDate()).padStart(2,0) : "",
      //Pos: item.Pos? item.Pos : "",
      Position: item.Position? item.Position : "",
      Times: item.Times? item.Times : "",
      TotalHours: item.TotalHours? item.TotalHours : "",
      Type: item.Type? item.Type : "",
      PayEnding:PayEnding,
      Payas: payas,

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
        console.log('Ooopsss....');
       }
    } catch (e) {
        console.log("Delete Timecard "+e);
    }
    $('#exampleModalDeleteClose').click();
  }

  handleDayTime = (index, SubView) => async event => {
      //alert(index);
      let day = this.state.DailyTimes[index];
      //console.log(day.Note);
      //console.log(moment(day.Finish, this.state.format));

      this.setState({
        SaveDayTimeError: "",
        SubView: SubView,
        DayTimeIndex: index,
        DayTimeCopyIndex: index,
        DayTimeDateMoment: day.Date? moment(this.getDateFormate(day.Date, 2), this.state.dateFormat) : "",
        DayTimeDate: day.Date? this.getDateFormate(day.Date, 1) : "",
        DayTimeDay: day.Day,
        DayTimeFinish: day.Finish? moment(day.Finish, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal1: day.FinishMeal1? moment(day.FinishMeal1, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal2: day.FinishMeal2? moment(day.FinishMeal2, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal3: day.FinishMeal3? moment(day.FinishMeal3, this.state.format) : moment("00:00", this.state.format),
        DayTimeMB1ND: day.MB1ND === '0'? false : true,
        DayTimeMB2ND: day.MB2ND === '0'? false : true,
        DayTimeMB3ND: day.MB3ND === '0'? false : true,
        DayTimeNote: day.Note? day.Note : null,
        DayTimePayas: day.Payas? day.Payas : '0',
        DayTimeStart: day.Start? moment(day.Start, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal: day.StartMeal? moment(day.StartMeal, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal2: day.StartMeal2? moment(day.StartMeal2, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal3: day.StartMeal3? moment(day.StartMeal3, this.state.format) : moment("00:00", this.state.format),
        DayTimeTimeStamp: day.TimeStamp,
        DayTimeTotalHours: day.TotalHours? day.TotalHours : "00:00",
        DayTimeTotalMBDed: day.TotalMBDed? moment(day.TotalMBDed, this.state.format) : moment("00:00", this.state.format),
        DayTimeTravel1: day.Travel1? moment(day.Travel1, this.state.format) : moment("00:00", this.state.format),
        DayTimeTravel2: day.Travel2? moment(day.Travel2, this.state.format) : moment("00:00", this.state.format)
      });
      
      setTimeout(function() { this.updateTotalMBDedDisabledState(); }.bind(this),1000);

      if(SubView === 'Add')
        $('#WeekTimesModalCenterBtn').click();
  }

  handleSaveDayTime = (index, SubView) => async event => {
    //alert(index);
      //alert(index);
      //console.log(this.state.DayTimeFinish._i); return false;
      this.setState({SaveDayTimeError: ""});
      if(this.state.DayTimePayas !== "0"){
        
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
          "TotalMBDed": this.state.DayTimeTotalMBDed.format('HH:mm'),
          "Travel1": this.state.DayTimeTravel1.format('HH:mm'),
          "Travel2": this.state.DayTimeTravel2.format('HH:mm')
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
      }else{
        this.setState({SaveDayTimeError: "Payas is required."});
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
      CustomTimeCardFields: [],
      Dept: "",
      FileAttachments: [],
      PayFrequency: "Weekly",
      PeriodEndingMoment: "",
      PeriodEnding: "",
      Position: "",
      Times: [],
      TotalHours: "0.00",
      Type: "Draft",
      InsertedId: "",
      PayEnding:"",
    });

  }
handlePeriodEnding(value, dateString){
  //console.log(value);
  //console.log(value.format('MM/DD/YYYY'));
  this.setState({PeriodEndingMoment: value, PeriodEnding: value.format('YYYY-MM-DD')});
  setTimeout(function() { this.setState({DailyTimes: this.setDailyTimes()}); }.bind(this),1000);
  
}

handleDayTimeDate(value, dateString){
  var d = new Date(dateString);
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
      
  this.setState({DayTimeDateMoment: value, DayTimeDate: dateString, DayTimeDay:weekday[d.getDay()]});
}

handleChangeDayTimeTravel1(time, timeString){
    var Travel1Duration = moment.duration(timeString, "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }

    if(this.state.TotalMBDedDisabled){
      if(!this.state.DayTimeMB1ND){
        var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
        var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
        if(startTimeMB1 > endTimeMB1){
          endTimeMB1.add(24, 'hours')
        }
        var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
        //console.log(durationMB1);
      }

      if(!this.state.DayTimeMB2ND){
        var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
        var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
        if(startTimeMB2 > endTimeMB2){
          endTimeMB2.add(24, 'hours')
        }
        var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }
      
      if(!this.state.DayTimeMB3ND){  
        var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
        var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
        if(startTimeMB3 > endTimeMB3){
          endTimeMB3.add(24, 'hours')
        }
        var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }
    }else{
      var TotalMBDedDuration = moment.duration(this.state.DayTimeTotalMBDed.format('HH:mm'), "HH:mm");
      //console.log(TotalMBDedDuration);
      endTime.subtract(TotalMBDedDuration);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    this.setState({DayTimeTravel1: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours});
}

handleChangeDayTimeTravel2(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(timeString, "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }

    if(this.state.TotalMBDedDisabled){
      if(!this.state.DayTimeMB1ND){
        var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
        var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
        if(startTimeMB1 > endTimeMB1){
          endTimeMB1.add(24, 'hours')
        }
        var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
        //console.log(durationMB1);
      }

      if(!this.state.DayTimeMB2ND){
        var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
        var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
        if(startTimeMB2 > endTimeMB2){
          endTimeMB2.add(24, 'hours')
        }
        var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }
      
      if(!this.state.DayTimeMB3ND){  
        var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
        var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
        if(startTimeMB3 > endTimeMB3){
          endTimeMB3.add(24, 'hours')
        }
        var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }
    }else{
      var TotalMBDedDuration = moment.duration(this.state.DayTimeTotalMBDed.format('HH:mm'), "HH:mm");
      //console.log(TotalMBDedDuration);
      endTime.subtract(TotalMBDedDuration);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    this.setState({DayTimeTravel2: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours});
}

handleChangeDayTimeStart(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(timeString, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }

    if(this.state.TotalMBDedDisabled){
      if(!this.state.DayTimeMB1ND){
        var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
        var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
        if(startTimeMB1 > endTimeMB1){
          endTimeMB1.add(24, 'hours')
        }
        var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
        //console.log(durationMB1);
      }

      if(!this.state.DayTimeMB2ND){
        var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
        var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
        if(startTimeMB2 > endTimeMB2){
          endTimeMB2.add(24, 'hours')
        }
        var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }
      
      if(!this.state.DayTimeMB3ND){  
        var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
        var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
        if(startTimeMB3 > endTimeMB3){
          endTimeMB3.add(24, 'hours')
        }
        var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }
    }else{
      var TotalMBDedDuration = moment.duration(this.state.DayTimeTotalMBDed.format('HH:mm'), "HH:mm");
      //console.log(TotalMBDedDuration);
      endTime.subtract(TotalMBDedDuration);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    this.setState({DayTimeStart: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours});
}

handleChangeDayTimeFinish(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(timeString, "HH:mm");

    if(startTime > endTime){
      endTime.add(24, 'hours')
    }
    
    if(this.state.TotalMBDedDisabled){
      if(!this.state.DayTimeMB1ND){
        var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
        var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
        if(startTimeMB1 > endTimeMB1){
          endTimeMB1.add(24, 'hours')
        }
        var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
        endTime.subtract(durationMB1);
        //console.log(durationMB1);
      }

      if(!this.state.DayTimeMB2ND){
        var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
        var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
        if(startTimeMB2 > endTimeMB2){
          endTimeMB2.add(24, 'hours')
        }
        var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
        endTime.subtract(durationMB2);
      }
      
      if(!this.state.DayTimeMB3ND){  
        var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
        var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
        if(startTimeMB3 > endTimeMB3){
          endTimeMB3.add(24, 'hours')
        }
        var durationMB3 = moment.duration(endTimeMB3.diff(startTimeMB3));
        endTime.subtract(durationMB3);
      }

    }else{
      var TotalMBDedDuration = moment.duration(this.state.DayTimeTotalMBDed.format('HH:mm'), "HH:mm");
      //console.log(TotalMBDedDuration);
      endTime.subtract(TotalMBDedDuration);
    }
    
    var duration = moment.duration(endTime.diff(startTime));
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    this.setState({DayTimeFinish: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours});
}

handleChangeDayTimeStartMeal(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(timeString, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    if(startTimeMB1 > endTimeMB1){
      endTimeMB1.add(24, 'hours')
    }
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    if(startTimeMB2 > endTimeMB2){
        endTimeMB2.add(24, 'hours')
    }
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);


    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    if(startTimeMB3 > endTimeMB3){
      endTimeMB3.add(24, 'hours')
    }
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
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours(), 10);
    var minutesmbded = parseInt(TotalMBDed.asMinutes(), 10)%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeStartMeal: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: moment(DayTimeTotalMBDed, this.state.format)});

    setTimeout(function() { this.updateTotalMBDedDisabledState(); }.bind(this),1000);
}

handleChangeDayTimeFinishMeal1(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(timeString, "HH:mm");
    if(startTimeMB1 > endTimeMB1){
      endTimeMB1.add(24, 'hours')
    }
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    if(startTimeMB2 > endTimeMB2){
      endTimeMB2.add(24, 'hours')
    }
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);
    

    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    if(startTimeMB3 > endTimeMB3){
      endTimeMB3.add(24, 'hours')
    }
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
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours(), 10);
    var minutesmbded = parseInt(TotalMBDed.asMinutes(), 10)%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeFinishMeal1: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: moment(DayTimeTotalMBDed, this.state.format)});
    
    setTimeout(function() { this.updateTotalMBDedDisabledState(); }.bind(this),1000);

}


handleChangeDayTimeStartMeal2(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    if(startTimeMB1 > endTimeMB1){
      endTimeMB1.add(24, 'hours')
    }
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(timeString, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    if(startTimeMB2 > endTimeMB2){
      endTimeMB2.add(24, 'hours')
    }
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);


    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    if(startTimeMB3 > endTimeMB3){
      endTimeMB3.add(24, 'hours')
    }
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
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours(), 10);
    var minutesmbded = parseInt(TotalMBDed.asMinutes(), 10)%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeStartMeal2: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: moment(DayTimeTotalMBDed, this.state.format)});
    
    setTimeout(function() { this.updateTotalMBDedDisabledState(); }.bind(this),1000);

}

handleChangeDayTimeFinishMeal2(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    if(startTimeMB1 > endTimeMB1){
      endTimeMB1.add(24, 'hours')
    }
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(timeString, "HH:mm");
    if(startTimeMB2 > endTimeMB2){
      endTimeMB2.add(24, 'hours')
    }
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);
    

    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    if(startTimeMB3 > endTimeMB3){
      endTimeMB3.add(24, 'hours')
    }
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
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours(), 10);
    var minutesmbded = parseInt(TotalMBDed.asMinutes(), 10)%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeFinishMeal2: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: moment(DayTimeTotalMBDed, this.state.format)});
    
    setTimeout(function() { this.updateTotalMBDedDisabledState(); }.bind(this),1000);

}

handleChangeDayTimeStartMeal3(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    if(startTimeMB1 > endTimeMB1){
      endTimeMB1.add(24, 'hours')
    }
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    if(startTimeMB2 > endTimeMB2){
      endTimeMB2.add(24, 'hours')
    }
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);


    var startTimeMB3 = moment(timeString, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    if(startTimeMB3 > endTimeMB3){
      endTimeMB3.add(24, 'hours')
    }
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
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours(), 10);
    var minutesmbded = parseInt(TotalMBDed.asMinutes(), 10)%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeStartMeal3: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: moment(DayTimeTotalMBDed, this.state.format)});
    
    setTimeout(function() { this.updateTotalMBDedDisabledState(); }.bind(this),1000);

}

handleChangeDayTimeFinishMeal3(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }
    var TotalMBDed = moment.duration(moment("00:00", "HH:mm"));
    

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    if(startTimeMB1 > endTimeMB1){
      endTimeMB1.add(24, 'hours')
    }
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);


    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    if(startTimeMB2 > endTimeMB2){
      endTimeMB2.add(24, 'hours')
    }
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);
    

    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(timeString, "HH:mm");
    if(startTimeMB3 > endTimeMB3){
      endTimeMB3.add(24, 'hours')
    }
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
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours(), 10);
    var minutesmbded = parseInt(TotalMBDed.asMinutes(), 10)%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({DayTimeFinishMeal3: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: moment(DayTimeTotalMBDed, this.state.format)});
    
    setTimeout(function() { this.updateTotalMBDedDisabledState(); }.bind(this),1000);

}

handleChangeDayTimeTotalMBDed(time, timeString){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }
    var TotalMBDedDuration = moment.duration(timeString, "HH:mm");
    endTime.subtract(TotalMBDedDuration);

    
    var duration = moment.duration(endTime.diff(startTime));
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    this.setState({DayTimeTotalMBDed: moment(timeString, this.state.format), DayTimeTotalHours: DayTimeTotalHours});
}

updateMealBreakTime(){
    var Travel1Duration = moment.duration(this.state.DayTimeTravel1.format('HH:mm'), "HH:mm");
    var Travel2Duration = moment.duration(this.state.DayTimeTravel2.format('HH:mm'), "HH:mm");
    var startTime = moment(this.state.DayTimeStart, "HH:mm");
    var endTime = moment(this.state.DayTimeFinish, "HH:mm");
    if(startTime > endTime){
      endTime.add(24, 'hours')
    }
    var TotalMBDed = moment.duration("00:00", "HH:mm");

    var startTimeMB1 = moment(this.state.DayTimeStartMeal, "HH:mm");
    var endTimeMB1 = moment(this.state.DayTimeFinishMeal1, "HH:mm");
    if(startTimeMB1 > endTimeMB1){
      endTimeMB1.add(24, 'hours')
    }
    var durationMB1 = moment.duration(endTimeMB1.diff(startTimeMB1));
    TotalMBDed.add(durationMB1);
   
    var startTimeMB2 = moment(this.state.DayTimeStartMeal2, "HH:mm");
    var endTimeMB2 = moment(this.state.DayTimeFinishMeal2, "HH:mm");
    if(startTimeMB2 > endTimeMB2){
      endTimeMB2.add(24, 'hours')
    }
    var durationMB2 = moment.duration(endTimeMB2.diff(startTimeMB2));
    TotalMBDed.add(durationMB2);

    var startTimeMB3 = moment(this.state.DayTimeStartMeal3, "HH:mm");
    var endTimeMB3 = moment(this.state.DayTimeFinishMeal3, "HH:mm");
    if(startTimeMB3 > endTimeMB3){
      endTimeMB3.add(24, 'hours')
    }
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
    duration.add(Travel1Duration);
    duration.add(Travel2Duration);
    //console.log(duration);
    var hours = parseInt(duration.asHours(), 10);
    var minutes = parseInt(duration.asMinutes(), 10)%60;
    var DayTimeTotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
    
    var hoursmbded = parseInt(TotalMBDed.asHours(), 10);
    var minutesmbded = parseInt(TotalMBDed.asMinutes(), 10)%60;
    var DayTimeTotalMBDed = String(hoursmbded).padStart(2,0) + ':'+ String(minutesmbded).padStart(2,0);
    
    this.setState({ DayTimeTotalHours: DayTimeTotalHours, DayTimeTotalMBDed: moment(DayTimeTotalMBDed, this.state.format)});
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
    var hours = parseInt(TotalTime.asHours(), 10);
            var minutes = parseInt(TotalTime.asMinutes(), 10)%60;
            var TotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
            
            this.setState({ TotalHours: TotalHours});
}

updateTotalMBDedDisabledState(){
  //TotalMBDedDisabled
  if(
    this.state.DayTimeStartMeal.format('HH:mm') === '00:00' &&
    this.state.DayTimeStartMeal2.format('HH:mm') === '00:00' &&
    this.state.DayTimeStartMeal3.format('HH:mm') === '00:00' &&
    this.state.DayTimeFinishMeal1.format('HH:mm') === '00:00' &&
    this.state.DayTimeFinishMeal2.format('HH:mm') === '00:00' &&
    this.state.DayTimeFinishMeal3.format('HH:mm') === '00:00'
  ){
    this.setState({ TotalMBDedDisabled: false});
  }else{
    this.setState({ TotalMBDedDisabled: true});
  }
}

calculateTotalHours(DailyTimes){
    var TotalTime = moment.duration("00:00", "HH:mm");
    for(var prop in DailyTimes) {
      if (DailyTimes.hasOwnProperty(prop)) {
        var item = DailyTimes[prop];
        var DailyTotalTime = moment.duration(item.TotalHours, "HH:mm");
        TotalTime.add(DailyTotalTime);
      }
    }
    var hours = parseInt(TotalTime.asHours(), 10);
    var minutes = parseInt(TotalTime.asMinutes(), 10)%60;
    var TotalHours = String(hours).padStart(2,0) + ':'+ String(minutes).padStart(2,0);
            
    return TotalHours;
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

createDocuments(item) {
    return API.post("documents-api", "/documents-api", {
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

getSysCopmany(id) {
  return API.get("syscompany", `/syscompany/${id}`);
}

createPreview(item) {
    return API.post("preview", "/preview/pdf", {
      body: item
    });
}


sendEmail(item) {
    return API.post("email", "/email", {
      body: item
    });
}

getDateFormate(date, formate) {
  
  var datestring = date*1000;
  if(formate === 1){
    return new Date(datestring).getFullYear()+'-'+String(new Date(datestring).getMonth()+1).padStart(2,0)+'-'+String(new Date(datestring).getDate()).padStart(2,0);
  }
  if(formate === 2){
    return String(new Date(datestring).getDate()).padStart(2,0)+'/'+String(new Date(datestring).getMonth()+1).padStart(2,0)+'/'+new Date(datestring).getFullYear();
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
          DailyTimes: [],
          TimesCustomTimeFields: [],
          TimesTotalHours: '0.00',
          files: [],
          Production: production,
          Activity: "",
          CompanyIndex: index,
          Company: "",
          CustomTimeCardFields: [],
          Dept: "",
          FileAttachments: [],
          PayFrequency: "Weekly",
          PeriodEndingMoment: "",
          PeriodEnding: "",
          Position: "",
          Times: [],
          TotalHours: "00:00",
          Type: "Draft",
          InsertedId: "",
          PayEnding:"",
          mrtFile: "default",
        });

        const result = await this.timecards();
        //console.log(result.items);
        if(result.status){
          this.setState({ timecards: result.items });
        }
      }
  }

  setDailyTimes(){
    var subtractDays = this.state.PayFrequency === 'Monthly' ? 29 : 
                       this.state.PayFrequency === 'Fortnightly'? 13 :
                       this.state.PayFrequency === '4 Weekly'? 27 : 6;
    var PeriodEnding = moment(this.state.PeriodEnding);
    var PeriodStarting = moment(this.state.PeriodEnding).subtract(subtractDays,'days');
    
    var DailyTimes = [];
    var LastDailyTimes = [];
    while (PeriodStarting <= PeriodEnding) {
      DailyTimes.push({Date:Math.floor(PeriodStarting.valueOf()/1000),Day:PeriodStarting.format('dddd'),Finish:"00:00",FinishMeal1:"00:00",FinishMeal2:"00:00",FinishMeal3:"00:00",MB1ND:"0",MB2ND:"0",MB3ND:"0",Note:null,Payas:"0",Start:"00:00",StartMeal:"00:00",StartMeal2:"00:00",StartMeal3:"00:00",TimeStamp:new Date().getTime()/1000,TotalHours:"00:00",TotalMBDed:"00:00",Travel1:"00:00",Travel2:"00:00"});
      PeriodStarting.add(1,'days');
    }
    return DailyTimes;
  }

  handleCopyYesterdaysTimes = (index) => async event => {
      if(index === 0){
        index = this.state.DailyTimes.length - 1;
      }else{
        index = index - 1;
      }
      let day = this.state.DailyTimes[index];
      //console.log(day); return false;

      this.setState({
        DayTimeCopyIndex: index,
        DayTimeFinish: day.Finish? moment(day.Finish, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal1: day.FinishMeal1? moment(day.FinishMeal1, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal2: day.FinishMeal2? moment(day.FinishMeal2, this.state.format) : moment("00:00", this.state.format),
        DayTimeFinishMeal3: day.FinishMeal3? moment(day.FinishMeal3, this.state.format) : moment("00:00", this.state.format),
        DayTimeMB1ND: day.MB1ND === '0'? false : true,
        DayTimeMB2ND: day.MB2ND === '0'? false : true,
        DayTimeMB3ND: day.MB3ND === '0'? false : true,
        //DayTimeNote: day.Note? day.Note : null,
        DayTimePayas: day.Payas,
        DayTimeStart: day.Start? moment(day.Start, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal: day.StartMeal? moment(day.StartMeal, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal2: day.StartMeal2? moment(day.StartMeal2, this.state.format) : moment("00:00", this.state.format),
        DayTimeStartMeal3: day.StartMeal3? moment(day.StartMeal3, this.state.format) : moment("00:00", this.state.format),
        DayTimeTotalHours: day.TotalHours? day.TotalHours : "00:00",
        DayTimeTotalMBDed: day.TotalMBDed? moment(day.TotalMBDed, this.state.format) : moment("00:00", this.state.format),
        DayTimeTravel1: day.Travel1? moment(day.Travel1, this.state.format) : moment("00:00", this.state.format),
        DayTimeTravel2: day.Travel2? moment(day.Travel2, this.state.format) : moment("00:00", this.state.format)
      });
      
      setTimeout(function() { this.updateTotalMBDedDisabledState(); }.bind(this),1000);
  }

  findTimecard(needle){
    var timecards = this.state.timecards;
    for (var i = timecards.length - 1; i >= 0 ; i--){
      // look for the entry with a matching `code` value
      if (timecards[i].Company[0].Guid === needle && timecards[i].Guid !== this.state.Update){
        // we found it
        return timecards[i];
      }
    }
     return 0;
  }
  
  handleCopyLastWeekTimes = (index) => async event => {
    if(index === 0){
        var TimecardGuid = 0;
    }else{
        var TimecardGuid = this.state.Times[index].Guid;
    }
    
    if(this.state.Company){
      var CompanyGuid = this.state.Company[0].Guid;
      var Timecard = this.findTimecard(CompanyGuid);
      console.log(Timecard);
      if(Timecard){
        var LastWeekTimes = Timecard.Times[0].DailyTimes;
        var CurrentWeekTimes = this.state.DailyTimes;
        
        if(LastWeekTimes.length === CurrentWeekTimes.length){
          
          for (var i = 0; i < LastWeekTimes.length ; i++){
            CurrentWeekTimes[i].Finish = LastWeekTimes[i].Finish,
            CurrentWeekTimes[i].FinishMeal1 = LastWeekTimes[i].FinishMeal1,
            CurrentWeekTimes[i].FinishMeal2 = LastWeekTimes[i].FinishMeal2,
            CurrentWeekTimes[i].FinishMeal3 = LastWeekTimes[i].FinishMeal3,
            CurrentWeekTimes[i].MB1ND = LastWeekTimes[i].MB1ND,
            CurrentWeekTimes[i].MB2ND = LastWeekTimes[i].MB2ND,
            CurrentWeekTimes[i].MB3ND = LastWeekTimes[i].MB3ND,
            CurrentWeekTimes[i].Note = LastWeekTimes[i].Note,
            CurrentWeekTimes[i].Payas = LastWeekTimes[i].Payas,
            CurrentWeekTimes[i].Start = LastWeekTimes[i].Start,
            CurrentWeekTimes[i].StartMeal = LastWeekTimes[i].StartMeal,
            CurrentWeekTimes[i].StartMeal2 = LastWeekTimes[i].StartMeal2,
            CurrentWeekTimes[i].StartMeal3 = LastWeekTimes[i].StartMeal3,
            CurrentWeekTimes[i].TotalHours = LastWeekTimes[i].TotalHours,
            CurrentWeekTimes[i].TotalMBDed = LastWeekTimes[i].TotalMBDed,
            CurrentWeekTimes[i].Travel1 = LastWeekTimes[i].Travel1,
            CurrentWeekTimes[i].Travel2 = LastWeekTimes[i].Travel2
          }

          setTimeout(function() {
            this.setState({
              DailyTimes:CurrentWeekTimes,TotalHours:Timecard.TotalHours
            });
          }.bind(this),1000);

        }else{
          console.log('Company frequency does not match.')
        }
        //console.log(Timecard);
      }else{
        alert('No previous timecard exists for this company.')
      }
    }else{
      console.log('Error: Please select company');
    }
    
    return false;

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

  disabledDate(current) {
    //var d = current.format('dddd');
    if(this.state.PayEnding){
      if(current){
        //console.log(current.format('dddd'));
        return this.state.PayEnding !==  current.format('dddd');
      }
    }else{  
      // Can not select days before today and today
      //return current && current < moment().endOf('day');
      return false;
    }
    //console.log(this.state.PayEnding);
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
  
  renderAttachments() {
    return this.state.FileAttachments.map((f, i) => 
      <div className="attachment_list" href={f.url} key={f.filename} target="_blank" >{f.filename.split('.').slice(0, -1).join('.')}<span className="attachment_delete" onClick={this.handleDeleteAttachment(i)}>x</span></div>
      );
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

  handleCustomTimeFields = event => {

    const name = event.target.name;
    const value = event.target.value;
  }

  renderDropdown(values) {
    return values.split("|").map((obj, i) =>
       <option key={i} value={obj}>{obj}</option>
    );
  }

  renderCustomTimeFields(view) {
    var TimesCustomTimeFields = this.state.TimesCustomTimeFields;
    var row = '';
    if(view === 'mobile'){
      row = TimesCustomTimeFields.map(function(obj, i) {
          if(obj.Type === "Checkbox"){
            return <div key={i} className="form-group">
              <label className="control-label col-xs-4">{obj.Prompt}</label>
              <div className="col-xs-8">
              <input className="form-control pro_input_pop" type="checkbox" checked={obj.Value} onChange={this.handleTimesCustomTimeFields(i)} /> 
              </div>
            </div>
          }
          if(obj.Type === "CheckBox"){
            return <div key={i} className="form-group">
              <label className="control-label col-xs-4">{obj.Prompt}</label>
              <div className="col-xs-8">
              <input className="form-control pro_input_pop" type="checkbox" checked={obj.Value} onChange={this.handleTimesCustomTimeFields(i)} /> 
              </div>
            </div>
          }
          if(obj.Type === "Entry"){
            return <div key={i} className="form-group">
              <label className="control-label col-xs-4">{obj.Prompt}</label>
              <div className="col-xs-8">
                <input className="form-control pro_input_pop" type="text" name="" value={obj.Value} onChange={this.handleTimesCustomTimeFields(i)} /> 
              </div>
            </div>
          }
          if(obj.Type === "DropList"){
            return <div key={i} className="form-group">
              <label className="control-label col-xs-4">{obj.Prompt}</label>
              <div className="col-xs-8">
                <select className="form-control pro_input_pop" name="" value={obj.Value} onChange={this.handleTimesCustomTimeFields(i)}>
                  {this.renderDropdown(obj.defaultValue)}
                </select>
              </div>
            </div>
          }

      }.bind(this));
  }else{

        row = TimesCustomTimeFields.map(function(obj, i) {
          if(obj.Type === "Checkbox"){
            return <div key={i} className="form-group">
              <label className="control-label col-sm-4" htmlFor="Mobile">{obj.Prompt}</label>
              <div className="col-sm-1 checkbox_popuptime">
              <input type="checkbox" checked={obj.Value} onChange={this.handleTimesCustomTimeFields(i)}/>
               
              </div>
            </div>
          }
          if(obj.Type === "CheckBox"){
            return <div key={i} className="form-group">
              <label className="control-label col-sm-4" htmlFor="Mobile">{obj.Prompt}</label>
              <div className="col-sm-1 checkbox_popuptime">
              <input type="checkbox" checked={obj.Value}  onChange={this.handleTimesCustomTimeFields(i)} />
               
              </div>
            </div>
          }
          if(obj.Type === "Entry"){
            return <div key={i} className="form-group">
              <label className="control-label col-sm-4">{obj.Prompt}</label>
              <div className="col-sm-8">
                <input className="form-control pro_input_pop" type="text" name="" value={obj.Value}  onChange={this.handleTimesCustomTimeFields(i)} /> 
              </div>
            </div>
          }
          if(obj.Type === "DropList"){
            return <div key={i} className="form-group">
              <label className="control-label col-sm-4">{obj.Prompt}</label>
              <div className="col-sm-8">
                <select className="form-control pro_input_pop" name="" value={obj.Value} onChange={this.handleTimesCustomTimeFields(i)}>
                  {this.renderDropdown(obj.defaultValue)}
                </select>
              </div>
            </div>
          }

      }.bind(this));

  }

    return row;
  }
  

  renderCustomTimeCardFields(view) {
    var CustomTimeCardFields = this.state.CustomTimeCardFields;
    var row = '';
    if(view === 'mobile'){

          row = CustomTimeCardFields.map(function(obj, i) {
          if(obj.Type === "Checkbox"){
            return <div key={i} className="form-group">
              <label className="control-label col-xs-4">{obj.Prompt}</label>
              <div className="col-xs-8">
              <input className="form-control pro_input_pop" type="checkbox" checked={obj.Value} onChange={this.handleCustomTimeCardFields(i)} /> 
              </div>
            </div>
          }
          if(obj.Type === "CheckBox"){
            return <div key={i} className="form-group">
              <label className="control-label col-xs-4">{obj.Prompt}</label>
              <div className="col-xs-8">
              <input className="form-control pro_input_pop" type="checkbox" checked={obj.Value} onChange={this.handleCustomTimeCardFields(i)}/>
              </div>
            </div>
          }
          if(obj.Type === "Entry"){
            return <div key={i} className="form-group">
              <label className="control-label col-xs-4">{obj.Prompt}</label>
              <div className="col-xs-8">
                <input className="form-control pro_input_pop" type="text" name="" value={obj.Value} onChange={this.handleCustomTimeCardFields(i)}/> 
              </div>
            </div>
          }
          if(obj.Type === "DropList"){
            return <div key={i} className="form-group">
              <label className="control-label col-xs-4">{obj.Prompt}</label>
              <div className="col-xs-8">
                <select className="form-control pro_input_pop" name="" value={obj.Value} onChange={this.handleCustomTimeCardFields(i)}>
                  {this.renderDropdown(obj.defaultValue)}
                </select>
              </div>
            </div>
          }

      }.bind(this));

    }else{
      row = CustomTimeCardFields.map(function(obj, i) {
          if(obj.Type === "Checkbox"){
            return <div key={i} className="form-group">
              <label className="control-label col-sm-4 col-md-3">{obj.Prompt}</label>
              <div className="col-sm-7 checkbox_popuptime">
              <input type="checkbox" checked={obj.Value} onChange={this.handleCustomTimeCardFields(i)} /> 
              </div>
            </div>
          }
          if(obj.Type === "CheckBox"){
            return <div key={i} className="form-group">
              <label className="control-label col-sm-4 col-md-3">{obj.Prompt}</label>
              <div className="col-sm-7 checkbox_popuptime">
              <input type="checkbox" checked={obj.Value} onChange={this.handleCustomTimeCardFields(i)}/>
              </div>
            </div>
          }
          if(obj.Type === "Entry"){
            return <div key={i} className="form-group">
              <label className="control-label col-sm-4 col-md-3">{obj.Prompt}</label>
              <div className="col-sm-7">
                <input className="form-control pro_input_pop" type="text" name="" value={obj.Value} onChange={this.handleCustomTimeCardFields(i)}/> 
              </div>
            </div>
          }
          if(obj.Type === "DropList"){
            return <div key={i} className="form-group">
              <label className="control-label col-sm-4 col-md-3">{obj.Prompt}</label>
              <div className="col-sm-7">
                <select className="form-control pro_input_pop" name="" value={obj.Value} onChange={this.handleCustomTimeCardFields(i)}>
                  {this.renderDropdown(obj.defaultValue)}
                </select>
              </div>
            </div>
          }

      }.bind(this));
    }

    return row;
  }
  
  renderSubmitView(view) {

    if(view === 'mobile'){
      return (
        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
        <div className="res_top_timecard">
           
           <div className="col-xs-2 chev_res_let">
             <a href="javascript:void(0)" onClick={this.handleSubView('Add', '')}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
               <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"></path>
             </svg>
             </a> </div>
            <div className="col-xs-10 text-center">Submit Digital Timesheet</div>
            <div className="clear20"></div>

            </div>
          
            <div className="clear5"></div>
                        <div className="submit_timesheet_box">
         
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="8655 7398 52 34.667">
                    <path id="ic_backup_24px" className="cls-1" d="M41.925,17.087a16.234,16.234,0,0,0-30.333-4.333A12.995,12.995,0,0,0,13,38.667H41.167a10.8,10.8,0,0,0,.758-21.58ZM30.333,23.5v8.667H21.667V23.5h-6.5L26,12.667,36.833,23.5Z" transform="translate(8655 7394)"/>
                </svg>
                <div className="clear10"></div>
                <h2 className="heading_submit_timeshhet">Submit Digital Timesheet</h2>
        
                We will send PDF copy TimeCard via email 
        
                <div className="clear20"></div>
        
                <div className={!this.state.SubmitEmailValid? 'col-sm-12 p0 field_required' : 'col-sm-12 p0' }>
                    <input name="SubmitEmail" className="frogot_input" value={this.state.SubmitEmail} type="text" onChange={this.handleChange} />
                    <img src="images/ic_vpn_key_24px.svg" className="register_icon1" alt="" width="25px" height="15px" />
                </div>
                        
                <div className="clear10"></div>
                <span className="blue_color">*By pressing submit I agree that my timesheet is true and correct</span>
                <div className="col-sm-6 text-right pull-right">
                <div className="clear20"></div>
                    <input name="" className="btn_cancel_pro pull-right" value="Cancel" type="button" disabled={this.state.isLoading} onClick={this.handleSubView('Add')}/>
                    <input name="" className="btn_submit_time pull-right" type="button" value={!this.state.isLoading ? 'Submit' : 'Submiting..'} disabled={this.state.isLoading} onClick={this.handleSubmit}/>
                </div>
                <div className="clear10"></div>
            </div>
        
        </div>
        );

    }else{
        return (
<div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg ">
    <div className="clear50"></div>
    <div className="col-sm-12">
        <div className="col-sm-11 p0">
            <div className="submit_timesheet_box">
         
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="8655 7398 52 34.667">
                    <path id="ic_backup_24px" className="cls-1" d="M41.925,17.087a16.234,16.234,0,0,0-30.333-4.333A12.995,12.995,0,0,0,13,38.667H41.167a10.8,10.8,0,0,0,.758-21.58ZM30.333,23.5v8.667H21.667V23.5h-6.5L26,12.667,36.833,23.5Z" transform="translate(8655 7394)"/>
                </svg>
                <div className="clear10"></div>
                <h2 className="heading_submit_timeshhet">Submit Digital Timesheet</h2>
        
                We will send PDF copy TimeCard via email 
        
                <div className="clear20"></div>
        
                <div className={!this.state.SubmitEmailValid? 'col-sm-12 p0 field_required' : 'col-sm-12 p0' }>
                    <input name="SubmitEmail" className="frogot_input" value={this.state.SubmitEmail} type="text" onChange={this.handleChange} />
                    <img src="images/ic_vpn_key_24px.svg" className="register_icon1" alt="" width="25px" height="15px" />
                </div>
                        
                <div className="clear10"></div>
                <span className="blue_color">*By pressing submit I agree that my timesheet is true and correct</span>
                <div className="col-sm-6 text-right pull-right">
                <div className="clear20"></div>
                    <input name="" className="btn_cancel_pro pull-right" value="Cancel" type="button" disabled={this.state.isLoading} onClick={this.handleSubView('Add')}/>
                    <input name="" className="btn_submit_time pull-right" type="button" value={!this.state.isLoading ? 'Submit' : 'Submiting..'} disabled={this.state.isLoading} onClick={this.handleSubmit}/>
                </div>
                <div className="clear10"></div>
            </div>
            <div className="clear40"></div>
        </div>
       
    </div>
</div>
        );
    }
  }

  renderList(timecards, view) {

    var list = '';
    
    if(view === 'mobile'){

      list = timecards.map(function(timecard, i) {

        if(timecard.Type === 'Draft'){

          return <tr  key={i}>
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

        }
      
      }.bind(this));
    }

    else{

      list = timecards.map(function(timecard, i) {

        if(timecard.Type === 'Draft'){

          return <tr key={i}>
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

        }
      
      }.bind(this));

    }

    return list;
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
      <DatePicker allowClear="false" className="calendarPeriodEndingMobile" disabledDate={this.disabledDate} value={this.state.PeriodEndingMoment} format={this.state.dateFormat} onChange={this.handlePeriodEnding.bind(this)}/>
    </div>
    <div className="col-xs-1 calendar_time2">
      <a href="javascript:void(0)" onClick={this.handleCalendar('.calendarPeriodEndingMobile')} >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
          <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
        </svg>
      </a>
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
  {this.state.CustomTimeCardFields.length > 0?this.renderCustomTimeCardFields('mobile') : ''}
  
  
  <div className="clearfix"></div>


 

</form> 


 <div className="clear5"></div>
<div className="col-xs-12 p0 btn_time_time2_svg"><input name="" className="btn_time_time2" value={ this.state.PeriodEnding !== ""? 'Times '+this.state.TotalHours+' Hrs' : 'Times 00:00 Hrs' } type="button" onClick={this.handleSubView('WeekTimes')} />
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
 
     
        
  <input name="" className="btn_submit_res3 pull-right" type="button"  value="Submit" disabled={this.state.onHold || this.state.isLoading} onClick={this.handleSubmitView}/>
  <button className="btn_prview_res3 pull-right"  disabled={this.state.onHold || this.state.isLoading || this.state.isUploading} onClick={this.handlePreview}><i className={this.state.previewLoading? 'fa fa-spinner fa-spin' : '' }></i> Preview</button>
  <input name="" className="btn_save_res3 pull-right" type="button" value={!this.state.isLoading ? 'Save' : 'Saving..'} disabled={this.state.onHold || this.state.isLoading} onClick={this.handleSubmit}  />
   
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
      <DatePicker allowClear="false" className="calendarPeriodEndingWeb" disabledDate={this.disabledDate} value={this.state.PeriodEndingMoment} format={this.state.dateFormat} onChange={this.handlePeriodEnding.bind(this)}/>
    </div>
    <div className="col-sm-1 col-md-1 calendar_time2 timecard_cldr2">
      <a href="javascript:void(0)" onClick={this.handleCalendar('.calendarPeriodEndingWeb')} >
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
  
  {this.state.CustomTimeCardFields.length > 0?this.renderCustomTimeCardFields('web') : ''}
  
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
      {this.state.FileAttachments.length > 0? this.renderAttachments() : <strong>No Records found</strong>}
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
       <input className="btn_save_pro" type="button" value="Save"  value={!this.state.isLoading ? 'Save' : 'Saving..'}  disabled={this.state.onHold || this.state.isLoading || this.state.isUploading} onClick={this.handleSubmit} />
       <input className="btn_cancel_pro" value="Cancel" type="button"  onClick={this.handleSubView('List', 'Yes')} />
    </div>
  </div>
  
  <div className="col-sm-6">
    <div className="btn_cance_save pull-right">
      <input name="" className="btn_submit_time" type="button" value="Submit" disabled={this.state.onHold || this.state.isLoading || this.state.isUploading} onClick={this.handleSubmitView}/>
      <button className="btn_prview_time"  disabled={this.state.onHold || this.state.isLoading || this.state.isUploading} onClick={this.handlePreview}><i className={this.state.previewLoading? 'fa fa-spinner fa-spin' : '' }></i> Preview</button>
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
      <option value="0">Select</option>
      {this.renderPayasDropdown()}
    </select>
    <span className="doc_file_error" style={{position:'initial'}}>{this.state.SaveDayTimeError? this.state.SaveDayTimeError : '' }</span>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Email">Date</label>
    <div className="col-xs-6">
      <DatePicker allowClear="false" className="calendarDayTimeDateMobile" value={this.state.DayTimeDateMoment} format={this.state.dateFormat} onChange={this.handleDayTimeDate.bind(this)} disabled/>
    </div>
    <div className="col-xs-1 calendar_time2">
    <a href="javascript:void(0)" onClick={this.handleCalendar('.calendarDayTimeDateMobile')} >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
        <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
        </svg>
    </a>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Day</label>
    <div className="col-xs-8" style={{paddingTop: '5px'}}>
      {this.state.DayTimeDay}
    </div>
  </div>
  
  {!this.state.HideTravel?
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Travel To</label>
    <div className="col-xs-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeTravel2} format={this.state.format} onChange={this.handleChangeDayTimeTravel2.bind(this)}/>
    </div>
  </div>
  :""}

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Start Work</label>
    <div className="col-xs-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeStart} format={this.state.format} onChange={this.handleChangeDayTimeStart.bind(this)}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-5" htmlFor="Email">Meal Break</label>
    <div className="col-xs-7">
      <div className="col-xs-12 p0 btn_time_time2_svg">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeTotalMBDed} format={this.state.format} onChange={this.handleChangeDayTimeTotalMBDed.bind(this)} disabled={this.state.TotalMBDedDisabled} />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4690 1327 10 16.19" style={{ top: '11',cursor: 'pointer'}} onClick={this.handleSubView('BreakTimes')}>
        <path id="ic_chevron_right_24px" className="cls-1" d="M10.493,6,8.59,7.9l6.181,6.193L8.59,20.288l1.9,1.9,8.1-8.1Z" transform="translate(-4698.59 1321)"/>
      </svg>
      </div>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Email">Finish Work:</label>
    <div className="col-xs-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeFinish} format={this.state.format} onChange={this.handleChangeDayTimeFinish.bind(this)}/>
    </div>
  </div>

  {!this.state.HideTravel?
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Email">Travel From:</label>
    <div className="col-xs-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeTravel1} format={this.state.format}  onChange={this.handleChangeDayTimeTravel1.bind(this)}/>
    </div>
  </div>
  : ""}

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
  {this.state.TimesCustomTimeFields.length > 0?this.renderCustomTimeFields('mobile') : ''}
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
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeStartMeal} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Finish MB1</label>
    <div className="col-xs-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeFinishMeal1} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal1.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Start MB2</label>
    <div className="col-xs-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeStartMeal2} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal2.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Finish MB2</label>
    <div className="col-xs-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeFinishMeal2} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal2.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Start MB3</label>
    <div className="col-xs-8">
    <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeStartMeal3} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal3.bind(this)}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Finish MB3</label>
    <div className="col-xs-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeFinishMeal3} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal3.bind(this)}/>
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
            {this.state.SubView === 'Submit' ? this.renderSubmitView('mobile') : ""}
        
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
      <div className="modal-body register_suc timecard2_popup register_suc_scrol">
      
      <button type="button" className="btn_copytime"  onClick={this.handleCopyYesterdaysTimes(this.state.DayTimeCopyIndex)}><span>Copy Yesterdays Times</span></button>
      
       <div className="clear20"></div>
       
       

       <div className="col-sm-12 profile_setting_pop">
      
                         <form className="form-horizontal" action="/action_page.php">
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Pay As">Pay As</label>
    <div className="col-sm-8">
     <select  className="form-control pro_input_pop" name="DayTimePayas" value={this.state.DayTimePayas} onChange={this.handleChangeDayTime}>
       <option value="0">Select</option>
       {this.renderPayasDropdown()}
     </select>
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Last Name">Date</label>
    <div className="col-sm-6" style={{textAlign: "left"}}>
      <DatePicker allowClear="false" className="calendarDayTimeDateWeb" value={this.state.DayTimeDateMoment} format={this.state.dateFormat} onChange={this.handleDayTimeDate.bind(this)} disabled/>
    </div>
    <div className="col-sm-2 time_card_popup3">
      <a href="javascript:void(0)" onClick={this.handleCalendar('.calendarDayTimeDateWeb')} >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="2936.352 349.176 18.501 23.145">
          <path id="ic_date_range_24px" className="cls-1" d="M9.167,12.415H7.111V14.73H9.167Zm4.111,0H11.223V14.73h2.056Zm4.111,0H15.334V14.73H17.39Zm2.056-8.1H18.418V2H16.362V4.314H8.139V2H6.084V4.314H5.056A2.188,2.188,0,0,0,3.01,6.629L3,22.83a2.2,2.2,0,0,0,2.056,2.314h14.39A2.2,2.2,0,0,0,21.5,22.83V6.629A2.2,2.2,0,0,0,19.446,4.314Zm0,18.516H5.056V10.1h14.39Z" transform="translate(2933.352 347.176)"/>
        </svg>
      </a>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Email">Day</label>
    <div className="col-sm-8 text-left" style={{paddingTop: '7px'}}>
     {this.state.DayTimeDay}
    </div>
  </div>
  {!this.state.HideTravel?
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Travel To</label>
    <div className="col-sm-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeTravel2} format={this.state.format} onChange={this.handleChangeDayTimeTravel2.bind(this)}/>
    </div>
  </div>
  :""}

  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Start Work</label>
    <div className="col-sm-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeStart} format={this.state.format} onChange={this.handleChangeDayTimeStart.bind(this)}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Meal Break</label>
    <div className="col-sm-3">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeTotalMBDed} format={this.state.format} onChange={this.handleChangeDayTimeTotalMBDed.bind(this)} disabled={this.state.TotalMBDedDisabled} />
    </div>

    <div className="col-sm-2 p0">
          
            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true" style={{width: '37px'}}>
              
                <div className="panel panel-default" style={{boxShadow: 'none', height: '34px'}}>
                    <span className="side-tab" data-target="#tab2" data-toggle="tab" role="tab" aria-expanded="false">
                        <div className="panel-heading" role="tab" id="headingTwo" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo" style={{paddingTop: '7px'}}>
                            <h4 className="panel-title collapsed">
                            <img src="images/popup_down.png" id="chevronUp" style={{marginLeft: '-3px', marginTop: '2px'}} width="10" alt="" />
                            <img src="images/popup_top.png" id="chevronDown" style={{marginLeft: '-3px', marginTop: '2px', display: 'none'}} width="10" alt="" />
                            </h4>
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
        <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeStartMeal} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal.bind(this)}/>
      </div>
  </div>
  
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Finish MB1</label>
    <div className="col-sm-8">
    
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeFinishMeal1} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal1.bind(this)}/>  
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Start MB2</label>
    <div className="col-sm-8">

      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeStartMeal2} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal2.bind(this)}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Finish MB2</label>
    <div className="col-sm-8">
    
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeFinishMeal2} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal2.bind(this)}/></div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Start MB3</label>
    <div className="col-sm-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeStartMeal3} format={this.state.format} onChange={this.handleChangeDayTimeStartMeal3.bind(this)}/>
    </div>
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Finish MB3</label>
    <div className="col-sm-8">
    
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeFinishMeal3} format={this.state.format} onChange={this.handleChangeDayTimeFinishMeal3.bind(this)}/></div>
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
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeFinish} format={this.state.format} onChange={this.handleChangeDayTimeFinish.bind(this)}/>
    </div>
  </div>
  {!this.state.HideTravel?
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Travel From</label>
    <div className="col-sm-8">
      <TimePicker inputReadOnly="true" allowEmpty="false" value={this.state.DayTimeTravel1} format={this.state.format}  onChange={this.handleChangeDayTimeTravel1.bind(this)}/>
    </div>
  </div>
  : ""}
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Total Hours</label>
    <div className="col-sm-8 text-left"  style={{paddingLeft: '27px',paddingTop: '7px'}}>
      {this.state.DayTimeTotalHours}
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Note</label>
    <div className="col-sm-8">
     <textarea name="DayTimeNote" className="form-control pro_input_pop" rows="" onChange={this.handleChangeDayTime} value={this.state.DayTimeNote? this.state.DayTimeNote : ''}></textarea>
    </div>
  </div>

  {this.state.TimesCustomTimeFields.length > 0? this.renderCustomTimeFields('web') : ''}
  
  
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
  <span className="doc_file_error" style={{position:'initial'}}>{this.state.SaveDayTimeError? this.state.SaveDayTimeError : '' }</span>

       
      </div>
      
    </div>
  </div>
</div>
{/*WeekTimesModalCenter END*/}

{/*SubmitSuccessModal Start*/}
<div className="modal fade" id="SubmitSuccessModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modla_submit_timesheet" role="document">
    <div className="modal-content">
      <div className="modal-header modal_header_register">
       
        <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{display:'none'}} id="SubmitSuccessModalClose">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body register_suc register_popup">
      
      <img src="images/ic_check_circle_24px.svg" width="47" height="47" alt="" />
       <div className="clearfix"></div>
      
      <h2> You have submitted the Timesheet successfully</h2>
    
<div className="clear2"></div>
  <a href="javascript:void(0)" onClick={this.handleSubmitSuccessModal} className="btn_ok_reg">OK</a>
       
      </div>
      
    </div>
  </div>
</div>
{/*SubmitSuccessModal End*/}

{/*modal-fullscreen Start*/}
<div className="modal fade modal-fullscreen" id="modal-fullscreen" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content box_shadow-none_pdf">
      <div className="modal-header" style={{borderBottom:"none"}}>
        <button type="button" className="close" data-dismiss="modal" aria-hidden="true" style={{fontSize:"50"}}>&times;</button>
       
      </div>
      <div className="modal-body" id="pdf-content">
        
        
        
        
      </div>
      
    </div>
  </div>
</div>
{/*modal-fullscreen End*/}
<button data-dismiss="modal" data-toggle="modal" data-target="#SubmitSuccessModal" id="SubmitSuccessModalBtn" style={{display:'none'}}>Show Modal</button>
<button data-dismiss="modal" data-toggle="modal" data-target="#WeekTimesModalCenter" id="WeekTimesModalCenterBtn" style={{display:'none'}}>Show Modal</button>
<button data-dismiss="modal" data-toggle="modal" data-target="#exampleModalDelete" id="exampleModalDeleteBtn" style={{display:'none'}}>Delete Modal</button>
<button data-dismiss="modal" data-toggle="modal" data-target="#exampleModalDeleteClose" id="exampleModalDeleteCloseBtn" style={{display:'none'}}>Close Delete Modal</button>
<input name="" className="btn_prview_time" value="Preview" type="button"  data-toggle="modal" data-target="#modal-fullscreen" data-backdrop="static" data-keyboard="false" id="modalFullScreenBtn" style={{display:'none'}}/>

</div>
        );
    }
}
