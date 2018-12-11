import React , { Component } from "react";
import "./Setting.css";
import Toggle from 'react-bootstrap-toggle';
import { API } from "aws-amplify";

export default class Setting extends Component {

    constructor() {
      super();
      this.state = {
        isLoading: true,
        SubView: "List",
        Update: false,
        settings: [],
        toggleID1: false, 
        toggleID2: false, 
        toggleID3: false, 
        toggleKey1: "NotifyNewDocument", 
        toggleKey2: "StoreDataDigitalForms", 
        toggleKey3: "UseDataDigitalForms", 
        toggleActive1: false, 
        toggleActive2: false, 
        toggleActive3: false 
      };
      this.onToggle1 = this.onToggle1.bind(this);
      this.onToggle2 = this.onToggle2.bind(this);
      this.onToggle3 = this.onToggle3.bind(this);
    }

    async componentDidMount() {

      try {
        const result = await this.settings();
        
        if(result.status){
          
          let items = result.items;
          if(items.length === 0){
            this.createSettings({"Key":"NotifyNewDocument","Value":this.state.toggleActive1});
            this.createSettings({"Key":"StoreDataDigitalForms","Value":this.state.toggleActive2});
            this.createSettings({"Key":"UseDataDigitalForms","Value":this.state.toggleActive3});
          }else{
            
            for (let i = 0; i < items.length; i++) {
              
              if(items[i].Key === 'NotifyNewDocument'){
                let val = items[i].Value;
                let guid = items[i].Guid;
                this.setState({ toggleID1: guid, toggleActive1: val});
              }
              if(items[i].Key === 'StoreDataDigitalForms'){
                let val = items[i].Value;
                let guid = items[i].Guid;
                this.setState({toggleID2: guid, toggleActive2: val});
              }
              if(items[i].Key === 'UseDataDigitalForms'){
                let val = items[i].Value;
                let guid = items[i].Guid;
                this.setState({toggleID3: guid, toggleActive3: val});
              }
            }
          }
          this.setState({ isLoading: false });
        }
      } catch (e) {
          alert(e);
      }
    }

    handleClear = async event => {
      //alert('Clear')
      try {
       const items = await this.metadata();
        if(items.status){
          var items = items.items;
          for (var key in items) {
            if (items.hasOwnProperty(key)) {
              var item = items[key];
              this.deleteMetaData(item.Guid);
            }
          }
        }
        alert('Successfully Cleared.');
      } catch (e) {
          alert(e);
      }
    }

    onToggle1() {
      this.setState({ toggleActive1: !this.state.toggleActive1 });
      this.updateSettings({"Key" : this.state.toggleKey1, "Value" : !this.state.toggleActive1}, this.state.toggleID1)
    }
    onToggle2() {
      this.setState({ toggleActive2: !this.state.toggleActive2 });
      this.updateSettings({"Key" : this.state.toggleKey2, "Value" : !this.state.toggleActive2}, this.state.toggleID2)
    }
    onToggle3() {
      this.setState({ toggleActive3: !this.state.toggleActive3 });
      this.updateSettings({"Key" : this.state.toggleKey3, "Value" : !this.state.toggleActive3}, this.state.toggleID3)
    }

  settings() {
    return API.get("settings", "/settings");
  }

  createSettings(item) {
    return API.post("settings", "/settings", {
      body: item
    });
  }

  updateSettings(item,id) {
    return API.put("settings", `/settings/${id}`, {
      body : item
    });
  }

  metadata() {
      return API.get("metadata", "/metadata");
  }
  
  deleteMetaData(id) {
    return API.del("metadata", `/metadata/${id}`);
  }

    render()
    {
        return (
            <div>
 <div className="col-xs-12  col-sm-9 col-md-9 pull-right mrg_dashboard_right">           
<div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
      <div className="clear40"></div>
        <div className="heading_1"><img src="images/ic_settings_24px.svg" width="20" height="20" alt="" /> &nbsp; General Setting</div>
             <div className="clear20"></div>
             
             
             <div className="general_settig_box col-sm-10 col-md-8">
             
             <label className="general_settig_box_label">Notify when I get a new Document</label>
      
      
      <div className="pull-right">
        <Toggle onClick={this.onToggle1} on="Yes" off="No" size="md" onClassName="btn-primary-settings" offClassName="active" active={this.state.toggleActive1} />
      </div>
             </div>
             
             
             

           
           </div>
          <div className="clear40"></div>
          
          
          <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg ">


  <div className="col-sm-12 p0">

<div className="heading_1"><img src="images/ic_description_24px.svg" width="20" height="20" alt="" /> &nbsp; Data Setting</div>
             <div className="clear20"></div>
<div className="general_settig_box col-sm-10 col-md-8">
             
             <label className="general_settig_box_label">Clear Data</label>
      
      
      <div className="pull-right">
<input name="" type="button" className="button_clear" value="Clear" onClick={this.handleClear} />

</div>
      </div>
  
     <div className="clear20"></div>
 <div className="general_settig_box col-sm-10 col-md-8">
             
             <label className="general_settig_box_label">Store Data from Digital Forms</label>
      
      
      <div className="pull-right">
<Toggle onClick={this.onToggle2} on="Yes" off="No" size="md" onClassName="btn-primary-settings" offClassName="active" active={this.state.toggleActive2} />

</div>
             </div>
 
 
        <div className="clear20"></div>
        <div className="general_settig_box col-sm-10 col-md-8">
             
             <label className="general_settig_box_label">Use Data in Digital Forms</label>
      
      
      <div className="pull-right">
<Toggle onClick={this.onToggle3} on="Yes" off="No" size="md" onClassName="btn-primary-settings" offClassName="active" active={this.state.toggleActive3} />

</div>
             </div>
        
       
         </div>
       

       
           </div>
           
           
            <div className="clear10"></div>
</div>
{/* mobile view Start. */}            
<div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res bg_clor_setting">
     
           <div className="res_top_timecard">
           
           <div className="col-xs-2 chev_res_let">
             <a  href="javascript:void(0)" onClick={this.props.handleView('Home','List')}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
               <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"></path>
             </svg>
             </a> </div>
           <div className="col-xs-8 text-center">Setting</div>
                <div className="clearfix"></div>

           </div>
          
<div className="clear5"></div>
           
           <div className="col-xs-12 p0">
      
                          

     
        <div className="heading_1"><img src="images/ic_settings_24px.svg" width="20" height="20" alt="" /> &nbsp; General Setting</div>
             <div className="clear20"></div>
             
             
             
             
             
             
             <div className="general_settig_box col-sm-8">
             
             <label className="general_settig_box_label">Notify when I get a new Document</label>
      
      
      <div className="pull-right">
<label className="switch">
  <input type="checkbox" onChange={this.onToggle1} checked={this.state.toggleActive1} />
  <span className="slider round"></span>
</label>

</div>
             </div>
             

           
         
 <div className="col-sm-12 p0">

<div className="heading_1"><img src="images/ic_description_24px.svg" width="20" height="20" alt="" /> &nbsp; Data Setting</div>
             <div className="clear20"></div>
<div className="general_settig_box col-sm-8">
             
             <label className="general_settig_box_label">Clear Data</label>
      
      
      <div className="pull-right">
<input name="" type="button" className="button_clear" value="Clear" onClick={this.handleClear}/>

</div>
      </div>
  
     <div className="clear20"></div>
 <div className="general_settig_box col-sm-8">
             
             <label className="general_settig_box_label">Store Data from Digital Forms</label>
      
      
      <div className="pull-right">
<label className="switch">
  <input type="checkbox" onChange={this.onToggle2}  checked={this.state.toggleActive2} />
  <span className="slider round"></span>
</label>

</div>
             </div>
 
 
        <div className="clear20"></div>
        <div className="general_settig_box col-sm-8">
             
             <label className="general_settig_box_label">Use Data in Digital Forms</label>
      
      
      <div className="pull-right">
<label className="switch">
  <input type="checkbox" onChange={this.onToggle3} checked={this.state.toggleActive3}  />
  <span className="slider round"></span>
</label>

</div>
             </div>
        
       
         </div>








         </div>
   
    
      
      
 
             <div className="clear40"></div>
              <div className="clear40"></div>
            
           </div>
{/* mobile view end. */}
           
            </div>
        );
    }
}