import React , { Component } from "react";
import { API } from "aws-amplify";

export default class Company extends Component {

	constructor(props)
	{
		super();
		this.state = {
      errormessage:"",
      isLoading: true,
      SubView: "List",
      Update: false,
      ItemIndex: false,
      companies: [],
      items: [],
      Name: "",
      Production: "",
      TaxID: "",
      EmailAddress: "",
      Add1: "",
      Add2: "",
      City: "",
      State: "",
      PCode: "",
      Country: "",
      PayFreq: "",
      PayEnding: "",
      Dept: "",
      Position: "",
      SysCoyGuid: "",

      NameValid: true,
    };

    //this.validateForm = this.validateForm.bind(this);
	}

    async componentDidMount() {

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

  handleSearch = async event => {
    event.preventDefault();
    if(event.target.value !== ""){
      
      var updatedList = this.state.items;
      updatedList = updatedList.filter(function(item){
        return item.Name.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
      });
      this.setState({companies: updatedList});
    
    }else{
      this.setState({ companies: this.state.items });
    }
  }

  handleSort = async event => {
    event.preventDefault();
    //alert(event.target.value);

    //var sortedList = this.state.companies;
    this.state.companies.sort(function(a, b){
    var nameA=a.Name.toLowerCase(), nameB=b.Name.toLowerCase();
    if(event.target.value === "ASC"){
      if (nameA < nameB) //sort string ascending
        return -1;
      if (nameA > nameB)
        return 1;
      return 0; //default return value (no sorting)
    }else{
      
      if (nameA > nameB) //sort string descending
        return -1;
      if (nameA < nameB)
        return 1;
      return 0; //default return value (no sorting)
    }
    
    });

    this.setState({ companies: this.state.companies });
  }

  handleChange = event => {
    
    if(event.target.value !== ''){
      var FieldName = event.target.name+'Valid';
      this.setState({
        [FieldName]: true 
      });
    }

    this.setState(
    {
      [event.target.name]: event.target.value
    });
  }

  validateForm()
  {
    return (this.state.Name.length > 0? '' : 'Name is required.');
  }

  handleFetch = async event => {
    event.preventDefault();

    this.setState(
    {
      Name: "Fatch Name",
      Production: "Fatch Pos",
      TaxID: "Fatch TaxID",
      EmailAddress: "Fatch Email",
      Add1: " Fatch add1",
      Add2: "add2",
      City: "city",
      State: "state",
      PCode: "2323",
      Country: "USA",
      PayFreq: "Monthly",
      PayEnding: "Monday",
      Dept: "IT",
      Position: "ABC",
      SysCoyGuid: "",
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({NameValid: true });
    
    if(this.state.Name.length > 0){
      this.setState({isLoading: true });
      const item = {
          "Name": this.state.Name,
          "Production": this.state.Production,
          "TaxID": this.state.TaxID,
          "EmailAddress": this.state.EmailAddress,
          "Add1": this.state.Add1,
          "Add2": this.state.Add2,
          "City": this.state.City,
          "State": this.state.State,
          "PCode": this.state.PCode,
          "Country": this.state.Country,
          "PayFreq": this.state.PayFreq,
          "PayEnding": this.state.PayEnding,
          "Dept": this.state.Dept,
          "Position": this.state.Position,
          "SysCoyGuid": this.state.SysCoyGuid,
      }

      try {
        
        if(!this.state.Update){
          const response = await this.createCompany(item);
        
          if(response.status){
            this.saveActivity(this.state.Name+" has been created");
            //console.log(response.result);
            const companies = this.state.companies;
            companies.push(response.result);
            this.setState({ companies: companies });
            alert('Successfully saved.');
            this.setState({
              SubView: 'List',
              companies: companies,
              Update: false,
              Name: "",
              Production: "",
              TaxID: "",
              EmailAddress: "",
              Add1: "",
              Add2: "",
              City: "",
              State: "",
              PCode: "",
              Country: "",
              PayFreq: "",
              PayEnding: "",
              Dept: "",
              Position: "",
              SysCoyGuid: "",
            });

          }
        }else{
          const response = await this.updateCompany(item);
        
          if(response.status){
            this.saveActivity(this.state.Name+" has been edit");
            console.log(response);
            alert('Successfully updated.');
            this.setState({
              SubView: 'List',
              Update: false,
              Name: "",
              Production: "",
              TaxID: "",
              EmailAddress: "",
              Add1: "",
              Add2: "",
              City: "",
              State: "",
              PCode: "",
              Country: "",
              PayFreq: "",
              PayEnding: "",
              Dept: "",
              Position: "",
              SysCoyGuid: "",
              
              NameValid: true,
            });
          }
        }

      
      } catch (e) {
          alert(e);
      }
      this.setState({isLoading: false });

    }else{
      //alert('Company name is required.');
      this.setState({NameValid: false });
    }
  }


  handleUpdate = (Id, index) => async event => {
    //alert(index);
    try {
       const item = await this.getCopmany(Id);
       if(item.status){
          console.log(item.result);
          this.setState({
            SubView: 'Add',
            Update: item.result.Guid? item.result.Guid : "",
            Name: item.result.Name? item.result.Name : "",
            Production: item.result.Production? item.result.Production : "",
            TaxID: item.result.TaxID? item.result.TaxID : "",
            EmailAddress: item.result.EmailAddress? item.result.EmailAddress : "",
            Add1: item.result.Add1? item.result.Add1 : "",
            Add2: item.result.Add2? item.result.Add2 : "",
            City: item.result.City? item.result.City : "",
            State: item.result.State? item.result.State : "",
            PCode: item.result.PCode? item.result.PCode : "",
            Country: item.result.Country? item.result.Country : "",
            PayFreq: item.result.PayFreq? item.result.PayFreq : "",
            PayEnding: item.result.PayEnding? item.result.PayEnding : "",
            Dept: item.result.Dept? item.result.Dept : "",
            Position: item.result.Position? item.result.Position : "",
            Position: item.result.Position? item.result.Position : "",
            SysCoyGuid: item.result.SysCoyGuid? item.result.SysCoyGuid : "",
          });
       }else{
        alert('Ooopsss....');
       }
    } catch (e) {
        alert(e);
    }
  }

	companies() {
	  return API.get("company", "/company?search="+this.state.Search);
	}

  getCopmany(id) {
      return API.get("company", `/company/${id}`);
  }

	createCompany(note) {
	  return API.post("company", "/company", {
	    body: note
	  });
	}

  updateCompany(note) {
    return API.put("company", `/company/${this.state.Update}`, {
      "body" : note
    });
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
          "Type": "COMPANY"  
        }
        try {
            const response = this.createActivitylog(item);
            console.log("Add Activity Response:"+response);
        }catch (e) {
            console.log("Add Activity Error:"+e);
        }
  }

  handleSubView = (element, clear) => async event => {
      event.preventDefault();
      this.setState({ SubView: element });
      if(clear){
        this.setState({ 
          Update: false,
          Name: "",
          Production: "",
          TaxID: "",
          EmailAddress: "",
          Add1: "",
          Add2: "",
          City: "",
          State: "",
          PCode: "",
          Country: "",
          PayFreq: "",
          PayEnding: "",
          Dept: "",
          Position: "",
          SysCoyGuid: "",
        });
      }
  }

  renderList(companies, view) {
    
    if(view === 'mobile'){
      return companies.map((company, i) =>
        <tr key={i}>
          <td align="center">{company.Name}</td>
          <td align="right"> 
            <div className="col-sm-12 p0 text-center timecard_edit6">
              <a href="javascript:void(0)" onClick={this.handleUpdate(company.Guid, i)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
                  <path id="ic_create_24px12" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
                </svg>
              </a>
            </div>
          </td>
        </tr>
      );
    }

    else{
      return companies.map((company, i) =>
        <tr key={i}>
          <td align="center">{company.Name}</td>
          <td align="center">{company.Production}</td>
          <td align="center">{company.EmailAddress}</td>
          <td align="right"> 
            <div className="col-sm-12 p0 text-center timecard_edit6">
              <a href="javascript:void(0)" onClick={this.handleUpdate(company.Guid, i)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="1656.776 299 17.515 18.003">
                  <path id="ic_create_24px12" className="cls-1" d="M3,17.25V21H6.648L17.409,9.94,13.761,6.19ZM20.23,7.04a1.016,1.016,0,0,0,0-1.41L17.954,3.29a.95.95,0,0,0-1.372,0L14.8,5.12,18.45,8.87l1.78-1.83Z" transform="translate(1653.776 296.002)"/>
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
             <div className="col-xs-8 text-center">Production Companies</div>
             <div className="col-xs-2">
              <button type="button" className="btn btn-primary pull-right btn_add_res_time" style={{backgroundColor: 'transparent'}}   onClick={this.handleSubView('Add', true)}>+</button>
             </div>

           </div>
          
          <div className="clear10"></div>

          <div className="company_label_res">
            <div className="clear20"></div>
            <div className="col-xs-4" style={{ paddingLeft: '0px' }}>
              <select name="" className="form-control pro_input_pop" onChange={this.handleSort}>
                <option>Sort</option>
                <option value="DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>
            <div className="col-xs-8 company_search p0">
              <input name="Search" type="text" className="form-control pro_input_pop" placeholder="What are you looking for" onChange={this.handleSearch} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="652.903 5794.335 18 18">
                <path id="ic_search_24px" className="cls-1" d="M15.864,14.321h-.813l-.288-.278a6.7,6.7,0,1,0-.72.72l.278.288v.813L19.467,21,21,19.467Zm-6.175,0A4.631,4.631,0,1,1,14.321,9.69,4.625,4.625,0,0,1,9.69,14.321Z" transform="translate(649.903 5791.335)"/>
              </svg>
            </div>
            
            <div className="clear10"></div>
            
            <table className="table table-bordered table-sm timecard_table_res">
              <thead>
                <tr>
                  <th width="70%" align="left" className="text-left" 
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('text-align', 'left', 'important');
                    }
                }} >
                Company Name</th>
                  <th width="20%" align="center">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {!this.state.isLoading ? this.state.companies.length === 0? 
                  <tr key="empty"><td align="center" colSpan="2">No data found.</td></tr> : 
                  this.renderList(this.state.companies, view) : <tr key="empty"><td align="center" colSpan="2"><strong>Loading....</strong></td></tr>}
              </tbody>
            </table>
          </div></div>
        );

    }else{
      return (
        <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
        <div className="col-xs-4 col-sm-3  col-md-2" style={{ paddingLeft: '0px' }}>
                <select name="" className="form-control pro_input_pop" onChange={this.handleSort}>
                  <option>Sort</option>
                  <option value="DESC">Descending</option>
                  <option value="ASC">Ascending</option>
                </select>
              </div>
              
              <div className="col-xs-5 col-sm-7  col-md-5 company_search">
                <input name="Search" type="text" className="form-control pro_input_pop" placeholder="What are you looking for" type="text" onChange={this.handleSearch} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="652.903 5794.335 18 18">
                  <path id="ic_search_24px" className="cls-1" d="M15.864,14.321h-.813l-.288-.278a6.7,6.7,0,1,0-.72.72l.278.288v.813L19.467,21,21,19.467Zm-6.175,0A4.631,4.631,0,1,1,14.321,9.69,4.625,4.625,0,0,1,9.69,14.321Z" transform="translate(649.903 5791.335)"/>
                </svg>
              </div>
          
              <div className="col-xs-3 col-sm-2 pull-right">
                <button type="button" className="btn btn-primary pull-right plus_icon_table" onClick={this.handleSubView('Add', true)}>+</button>
              </div>
          
            <div className="clear10"></div>
            
            <table className="table table-bordered table-sm timecard_table">
                <tbody>
                <tr className="table_blue_hdr">
                  <td width="30%" align="center">Company Name</td>
                  <td width="35%" align="center">Production Name</td>
                  <td width="25%" align="center">Email</td>
                  <td width="10%" align="center">&nbsp;</td>
                </tr>
              
                
                {!this.state.isLoading ? this.state.companies.length === 0? 
                  <tr key="empty"><td align="center" colSpan="4">No data found.</td></tr> : 
                  this.renderList(this.state.companies, view) : <tr key="empty"><td align="center" colSpan="4"><strong>Loading....</strong></td></tr>}
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
               <a href="javascript:void(0)" onClick={this.handleSubView('List')}>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
                 <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"/>
               </svg>
               </a> </div>
             <div className="col-xs-8 text-center">Production Companies</div>
             <div className="col-xs-2">
              <button type="button" className="btn btn-primary pull-right btn_add_res_time" style={{backgroundColor: 'transparent'}}   onClick={this.handleSubView('Add', true)}>+</button>
             </div>

           </div>
          
        <div className="clear10"></div>
        <div className="company_label_res">

    <div className="clear20"></div>
          
          
        
          

           <div className="col-sm-9 profile_setting_pop company_form">
      
  <form className="form-horizontal" onSubmit={this.handleSubmit}>
  {!this.state.errormessage?('') : (
    <div className="alert alert-danger text-uppercase">{this.state.errormessage}</div>
    )
  }

  {!this.state.Update?
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Company">Company ID:</label>
    <div className="col-xs-5">
    <input className="form-control pro_input_pop" id="" placeholder="" type="" />
   
    
    </div>
  
        
  <div className="col-xs-3">  <input className="btn_fetch pull-left" value="Fetch" type="button" onClick={this.handleFetch} /></div>
      <div className="clearfix"></div>
   
  </div>
  : ''}
  
  
  <div className={!this.state.NameValid? 'form-group field_required' : 'form-group' }>
    <label className="control-label col-xs-4" htmlFor="Company">Company Name</label>
    <div className="col-xs-8">
    <input className="form-control pro_input_pop" name="Name" id="" placeholder="" type="text" value={this.state.Name} onChange={this.handleChange} />
    
    </div>
    
    
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Production">Production Name</label>
      <div className="col-xs-8">
    <input className="form-control pro_input_pop" name="Production" id="" placeholder="" type="text"  value={this.state.Production} onChange={this.handleChange}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">TaxID</label>
      <div className="col-xs-8">
     <input className="form-control pro_input_pop" name="TaxID" id="" placeholder="" type="text"  value={this.state.TaxID} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Email Address</label>
      <div className="col-xs-8">
     <input className="form-control pro_input_pop" name="EmailAddress" id="" placeholder="" type="text"   value={this.state.EmailAddress} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Address</label>
      <div className="col-xs-8">
 <input className="form-control pro_input_pop" name="Add1" id="" placeholder="" type="text"   value={this.state.Add1} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  
  
  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile"></label>
      <div className="col-xs-8">
      <input className="form-control pro_input_pop" name="Add2" id="" placeholder="" type="text"   value={this.state.Add2} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Suburb/Town</label>
      <div className="col-xs-8">
     <input className="form-control pro_input_pop" name="City" id="" placeholder="" type="text"   value={this.state.City} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">State/Province</label>
      <div className="col-xs-8">
      <input className="form-control pro_input_pop" name="State" id="" placeholder="" type="text"   value={this.state.State} onChange={this.handleChange}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Postcode/Zipcode</label>
      <div className="col-xs-8">
 <input className="form-control pro_input_pop" name="PCode" id="" placeholder="" type="text"   value={this.state.PCode} onChange={this.handleChange}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Country</label>
      <div className="col-xs-8">
  <input className="form-control pro_input_pop" name="Country" id="" placeholder="" type="text"   value={this.state.Country} onChange={this.handleChange}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Pay Frequency</label>
      <div className="col-xs-8">
      <input className="form-control pro_input_pop" name="PayFreq" id="" placeholder="" type="text"   value={this.state.PayFreq} onChange={this.handleChange}/>
    </div>
  </div>

  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Pay Ending</label>
      <div className="col-xs-8">
    <input className="form-control pro_input_pop" name="PayEnding" id="" placeholder="" type="text"   value={this.state.PayEnding} onChange={this.handleChange}/>
  </div>
    
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Department</label>
      <div className="col-xs-8">
    <input className="form-control pro_input_pop" name="Dept" id="" placeholder="" type="text"   value={this.state.Dept} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-xs-4" htmlFor="Mobile">Position</label>
      <div className="col-xs-8">
  <input className="form-control pro_input_pop" name="Position" id="" placeholder="" type="text"   value={this.state.Position} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="clear20"></div>


 






   


<div className="col-sm-6 pull-right" style={{paddingRight: '0'}}>
       
       <input name="" className="btn_save_pro btn_save_pro_5" value={!this.state.isLoading ? !this.state.Update? 'Save' : 'Save' : 'Saving..'}  disabled={this.state.isLoading} type="submit" />
       <input name="" className="btn_cancel_pro nn" value="Cancel" type="button"  onClick={this.handleSubView('List')} />
       
    <div className="clear40"></div>
        </div>
</form> 

         </div>
           
             </div></div>
      );
      

    }else{
      return (
        <div className="col-xs-12 col-sm-12 col-md-11 col-md-offset-1 time_table_mrg">
        <div className="heading_1">Production Company Details</div>
             <div className="clear20"></div>
             
             <div className="col-sm-9 profile_setting_pop company_form">
      
  <form className="form-horizontal" onSubmit={this.handleSubmit}>
    
      {!this.state.errormessage?('') : (
          
            <div className="alert alert-danger text-uppercase">{this.state.errormessage}</div>
                      
          )
      }
  {!this.state.Update?
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Company">Company ID</label>
    
    <div className="col-sm-7">
    <input className="form-control pro_input_pop" id="" placeholder="" type="" />
    
    </div>
    <div className="col-sm-1 mrg_top0"> <input className="btn_save_pro pull-left" value="Fetch" type="button" onClick={this.handleFetch} /> </div>
    
    
  </div>
  : ''}
                         
                         
                         
  <div className={!this.state.NameValid? 'form-group field_required' : 'form-group' }>
    <label className="control-label col-sm-4" htmlFor="Company">Company Name</label>
    
    <div className="col-sm-7">
    <input className="form-control pro_input_pop" name="Name" id="" placeholder="" type="text" value={this.state.Name} onChange={this.handleChange}/>
    
    </div>
    
    
  </div>
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Production">Production Name</label>
      <div className="col-sm-7">
    <input className="form-control pro_input_pop" name="Production" id="" placeholder="" type="text"  value={this.state.Production} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">TaxID</label>
      <div className="col-sm-7">
     <input className="form-control pro_input_pop" name="TaxID" id="" placeholder="" type="text"  value={this.state.TaxID} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Email Address</label>
      <div className="col-sm-7">
     <input className="form-control pro_input_pop" name="EmailAddress" id="" placeholder="" type="text"   value={this.state.EmailAddress} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Address</label>
      <div className="col-sm-7">
 <input className="form-control pro_input_pop" name="Add1" id="" placeholder="" type="text"   value={this.state.Add1} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  
  
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile"></label>
      <div className="col-sm-7">
      <input className="form-control pro_input_pop" name="Add2" id="" placeholder="" type="text"   value={this.state.Add2} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Suburb/Town</label>
      <div className="col-sm-7">
     <input className="form-control pro_input_pop" name="City" id="" placeholder="" type="text"   value={this.state.City} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">State/Province</label>
      <div className="col-sm-7">
      <input className="form-control pro_input_pop" name="State" id="" placeholder="" type="text"   value={this.state.State} onChange={this.handleChange}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Postcode/Zipcode</label>
      <div className="col-sm-7">
 <input className="form-control pro_input_pop" name="PCode" id="" placeholder="" type="text"   value={this.state.PCode} onChange={this.handleChange}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Country</label>
      <div className="col-sm-7">
  <input className="form-control pro_input_pop" name="Country" id="" placeholder="" type="text"   value={this.state.Country} onChange={this.handleChange}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Pay Frequency</label>
      <div className="col-sm-7">
      <input className="form-control pro_input_pop" name="PayFreq" id="" placeholder="" type="text"   value={this.state.PayFreq} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Pay Ending</label>
      <div className="col-sm-7">
      <input className="form-control pro_input_pop" name="PayEnding" id="" placeholder="" type="text"   value={this.state.PayEnding} onChange={this.handleChange}/>
    </div>
  </div>
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Department</label>
      <div className="col-sm-7">
    <input className="form-control pro_input_pop" name="Dept" id="" placeholder="" type="text"   value={this.state.Dept} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="form-group">
    <label className="control-label col-sm-4" htmlFor="Mobile">Position</label>
      <div className="col-sm-7">
  <input className="form-control pro_input_pop" name="Position" id="" placeholder="" type="text"   value={this.state.Position} onChange={this.handleChange}/>
    </div>
  </div>
  
  
  <div className="clear20"></div>

<div className="col-sm-12">
    <div className="btn_cance_save">

      <input name="" className="btn_save_pro"  value={!this.state.isLoading ? !this.state.Update? 'Save' : 'Save' : 'Saving..'} disabled={this.state.isLoading} type="submit" />
      <input name="" className="btn_cancel_pro" value="Cancel" type="button"  onClick={this.handleSubView('List')} />
    </div>
    
        </div>
 

</form> 

         </div>
        </div>
      );
    }
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
            {this.state.SubView === 'Add' ? this.renderAddView('mobile') : ""}
        
          <div className="clearfix"></div>
</div>
        );
    }
}