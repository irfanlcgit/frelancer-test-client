import React , { Component } from "react";
import { API, Storage } from "aws-amplify";
import $ from 'jquery';
import Dropzone from 'react-dropzone'

export default class Company extends Component {

  constructor(props)
  {
    super();
    this.state = {
      errormessage:"",
      isLoading: true,
      isSaving: false,
      SubView: "List",
      Documents: [],
      items: [],
      DeleteId: false,
      DeleteIndex: false,
      files: false,

      Company: "",
      ContentType: "",
      DocDesc: "",
      DocumentType: "",
      Encrypted: "",
      Filename: "",
      Production: "",
      PWHash: "",
      Salt: "",
      url: "",

      formValid: false,
      DocDescValid: true,
      fileError: false,

    };

    this.reloadDocuments = this.reloadDocuments.bind(this);

  }

  async componentDidMount() {
    try {
      const result = await this.documents();
      //console.log(result);
      if(result.status){
        this.setState({ Documents: result.items, items: result.items, isLoading: false });
      }
    } catch (e) {
        console.log("Documents "+e);
    }
  }

  onDrop(files) {
    //console.log(files);

    files.forEach(file => {
       //selected_files.push(file);
       this.setState({ files: file, fileError: false });
    });

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
    this.setState({formValid: this.state.DocDescValid});
  }

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({isSaving: true, fileError: false });

    if(this.state.formValid){
      
      if(!this.state.files){
        this.setState({isSaving: false, fileError: "file is required."});
        return false;
      }

      var files = this.state.files;

      //console.log(files);
      var ext = files.name.split('.').pop();
      var file_name = new Date().getTime()+'.'+ext;
      var key = "documents/"+file_name;
      var docItem = {
          "Company": "//",
          "ContentType": files.type,
          "DocDesc": this.state.DocDesc,
          "DocumentType": ext.toUpperCase(),
          "Encrypted": "No",
          "Filename": files.name,
          "Production": "//",
          "PWHash": "",
          "Salt": "GYUFYDTFKHFYV",
          "Timestamp": new Date().getTime(),
          "url": key
      }
      //console.log(docItem);
      const Documents = this.state.Documents;
      Storage.put('documents/'+file_name, files, { contentType: files.type })
          .then (result => {   
            try{
              var res = this.createDocuments(docItem);
              Documents.push(docItem);
              //console.log(res);
              /*res.then(function(result) {
                if(result.status){
                  Documents.push(result.result);
                } 
              })*/
              this.setState({
                Documents:Documents,
                items:Documents,
                isSaving: false,
                fileError: false, 
                files: false, 
                DocDesc:"",
                formValid: false,
                DocDescValid: true,
              });

              $('#AddDocumentModalClose').click();            
            
            }catch (e) {
              console.log("Save Document "+e);
              this.setState({isSaving: false, fileError: 'Error in saving try again.'});
            }
      }).catch(err => console.log(err));

      /*setTimeout(function() {
        this.setState({ Documents: Documents, items: Documents });
      }.bind(this),3000);*/

    }else{
      this.setState({isSaving: false, DocDescValid:false});
    }
    
  }

  handlePreview = (src) => async event => {
    event.preventDefault();
    Storage.get(src)
            .then(result => {
              console.log(result);
              var preview = window.open();
              preview.document.open().write("<html><head><title>Document Preview | Frelance Portal</title></head><body style='margin:0; text-align: center;'><iframe width='100%'  height='1000' style='border:0;' src='"+result+"'></iframe></iframe></body></html>");
              
    }).catch(err => console.log("SignatureFile: "+err));
    
    console.log(src); return false;
    var preview = window.open();
    preview.document.open().write("<html><head><title>Document Preview | Frelance Portal</title></head><body style='margin:0; text-align: center;'><iframe width='100%'  height='1000' style='border:0;' src='"+src+"'></iframe></iframe></body></html>");
//preview.close();

//    $("#pdf-content").html("<html><head></head><body style='margin:0; text-align: center;'><iframe width='100%'  height='1000' style='border:0;' src='"+src+"'></iframe></iframe></body></html>")
//    $("#modalFullScreenBtn").click(); 
  }

  handleSearch = async event => {
    event.preventDefault();
    if(event.target.value !== ""){
      
      var updatedList = this.state.items;
      updatedList = updatedList.filter(function(item){
        return item.DocDesc.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
      });
      this.setState({Documents: updatedList});
    
    }else{
      this.setState({ Documents: this.state.items });
    }
  }

  handleSort = async event => {
    event.preventDefault();

    this.state.Documents.sort(function(a, b){
    var nameA=a.Timestamp, nameB=b.Timestamp;
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

    this.setState({ Documents: this.state.Documents });
  }

  getDateFormate(date, formate) {
  
    var datestring = date;
    if(formate === 1){
      return new Date(datestring).getFullYear()+'-'+String(new Date(datestring).getMonth()+1).padStart(2,0)+'-'+String(new Date(datestring).getDate()).padStart(2,0);
    }
    if(formate === 2){
      return String(new Date(datestring).getDate()).padStart(2,0)+'/'+String(new Date(datestring).getMonth()+1).padStart(2,0)+'/'+new Date(datestring).getFullYear();
    }
    return date;

  }


  handleDeleteBtn = (id, index) => async event => {
    this.setState({DeleteId: id, DeleteIndex: index});
    $('#exampleModalDeleteBtn').click()
  }

  handleDelete = async event => {
    //alert(this.state.DeleteId);
    try {
       const item = await this.deleteDocument();
       if(item.status){
          //alert('Successfully Deleted.');
          var items = this.state.Documents;
          delete items[this.state.DeleteIndex];
          this.setState({DeleteId: false, DeleteIndex: false, Documents: items, items: items});
       }else{
        alert('Ooopsss....');
       }
    } catch (e) {
        alert(e);
    }
    $('#exampleModalDeleteClose').click();
  }

  async reloadDocuments(){
    try {
      console.log('rr loading..');
      const result = await this.documents();
      //console.log(result);
      if(result.status){
        this.setState({ Documents: result.items, items: result.items, isLoading: false });
      }
    } catch (e) {
      console.log("Documents "+e);
    }
  }

  documents() {
    return API.get("documents", "/documents");
  }

  createDocuments(item) {
      return API.post("documents-api", "/documents-api", {
        body: item
      });
  }

  deleteDocument() {
      return API.del("documents", `/documents/${this.state.DeleteId}`);
  }

  renderAttachments() {
    //console.log(this.state.files)
    if(this.state.files){
      var f = this.state.files;
      return <div className="attachment_list" href={f.preview} key={f.name} target="_blank" >{f.name.split('.').slice(0, -1).join('.')}</div>
     
    }
  }

  renderList(documents, view) {
    
    if(view === 'mobile'){
      return documents.map((document, i) =>
        <tr key={i}>
          <td align="center">{this.getDateFormate(document.Timestamp, 2)}</td>
          <td align="center" style={{textAlign: 'center'}}>{document.DocDesc !== ''? document.DocDesc : '//'}</td>
          <td align="center">
            <div className="col-xs-6 p0 text-center timecard_dele">
              <a href={null}  onClick={this.handlePreview(document.url)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="7143 5940 15 18.75">
                  <path id="ic_description_24px" className="cls-1" d="M13.375,2h-7.5A1.872,1.872,0,0,0,4.009,3.875L4,18.875A1.872,1.872,0,0,0,5.866,20.75H17.125A1.881,1.881,0,0,0,19,18.875V7.625ZM15.25,17H7.75V15.125h7.5Zm0-3.75H7.75V11.375h7.5ZM12.437,8.563V3.406l5.156,5.156Z" transform="translate(7139 5938)"/>
                </svg>
              </a>
            </div>
            <div className="col-xs-6 p0 text-center timecard_dele">
              <a href={null} onClick={this.handleDeleteBtn(document.Guid, i)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1700 296 15 19.286">
                <path id="ic_delete_24px2" className="cls-1" d="M6.071,20.143a2.149,2.149,0,0,0,2.143,2.143h8.571a2.149,2.149,0,0,0,2.143-2.143V7.286H6.071ZM20,4.071H16.25L15.179,3H9.821L8.75,4.071H5V6.214H20Z" transform="translate(1695 293)"/>
              </svg>
              </a>
            </div>
          </td>
        </tr>
      );
    }

    else{
      return documents.map((document, i) =>

      <tr key={i}>
        <td align="left">{this.getDateFormate(document.Timestamp, 2)}</td>
        <td align="left">{document.DocDesc}</td>
        <td align="left">{document.Company} </td>
        <td align="center">
          <div className="col-xs-6 p0 text-center timecard_dele">
            <a href={null} onClick={this.handlePreview(document.url)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="7143 5940 15 18.75">
              <path id="ic_description_24px" className="cls-1" d="M13.375,2h-7.5A1.872,1.872,0,0,0,4.009,3.875L4,18.875A1.872,1.872,0,0,0,5.866,20.75H17.125A1.881,1.881,0,0,0,19,18.875V7.625ZM15.25,17H7.75V15.125h7.5Zm0-3.75H7.75V11.375h7.5ZM12.437,8.563V3.406l5.156,5.156Z" transform="translate(7139 5938)"/>
            </svg>
            </a>
          </div>
          
          <div className="col-xs-6 p0 text-center timecard_dele">
            <a href={null} onClick={this.handleDeleteBtn(document.Guid, i)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="1700 296 15 19.286">
                <path id="ic_delete_24px2" className="cls-1" d="M6.071,20.143a2.149,2.149,0,0,0,2.143,2.143h8.571a2.149,2.149,0,0,0,2.143-2.143V7.286H6.071ZM20,4.071H16.25L15.179,3H9.821L8.75,4.071H5V6.214H20Z" transform="translate(1695 293)"/>
              </svg>
            </a>
          </div>
        </td>
      </tr>

      );
    }
  }



  render()
    {
        return (
          <div className="col-xs-12  col-sm-9 col-md-10 pull-right mrg_dashboard_right">
            <div className="clear40"></div>
           

           
          <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg">
          
          <div className="col-xs-4 col-sm-3  col-md-2" style={{ paddingLeft: '0px' }}>
        <select name="" className="form-control pro_input_pop" onChange={this.handleSort}>
          <option>Sort</option>
          <option value="DESC">Descending</option>
          <option value="ASC">Ascending</option>
        </select>
          
          </div>
          
          
          <div className="col-xs-5 col-sm-7  col-md-5 company_search">
          <input name="" type="text" className="form-control pro_input_pop" placeholder="What are you looking for" onChange={this.handleSearch} />
          
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="652.903 5794.335 18 18">
  <path id="ic_search_24px" className="cls-1" d="M15.864,14.321h-.813l-.288-.278a6.7,6.7,0,1,0-.72.72l.278.288v.813L19.467,21,21,19.467Zm-6.175,0A4.631,4.631,0,1,1,14.321,9.69,4.625,4.625,0,0,1,9.69,14.321Z" transform="translate(649.903 5791.335)"/>
</svg>

          
          
          </div>
          
           <div className="col-xs-3 col-sm-2 pull-right" style={{paddingRight: '0px'}}>
          <button type="button" className="btn btn-primary pull-right plus_icon_table" data-toggle="modal" data-target="#exampleModalCenter2">+</button> </div>
          
<div className="clear10"></div>
           <table className="table table-bordered table-sm timecard_table document_left">
    <tbody>
      <tr className="table_blue_hdr">
        <td width="30%" align="left" >Date</td>
        <td width="35%" align="left" >Description</td>
        <td width="25%" align="left" >Company</td>
        <td width="10%" align="left" >&nbsp;</td>
      </tr>
    
    
      {!this.state.isLoading ? this.state.Documents.length === 0? 
                  <tr key="empty"><td align="center" colSpan="4">No data found.</td></tr> : 
                  this.renderList(this.state.Documents, 'web') : <tr key="empty"><td align="center" colSpan="4"><strong>Loading....</strong></td></tr>}
    </tbody>
  </table>
           
           
           </div>
           
           
           
           
           
           
           <div className="col-xs-12 col-sm-12 col-md-10 col-md-offset-1 time_table_mrg_res">
     
           <div className="res_top_timecard">
           
           <div className="col-xs-2 chev_res_let">
             <a  href="javascript:void(0)" onClick={this.props.handleView('Home','List')}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="2398 1881 13 19.418">
               <path id="ic_chevron_left_24px" className="cls-1" d="M21,8.282,18.526,6,8,15.709l10.526,9.709L21,23.136l-8.035-7.427Z" transform="translate(2390 1875)"/>
             </svg>
             </a> </div>
           <div className="col-xs-8 text-center">Documents List</div>
           <div className="col-xs-2">
            <button type="button" className="btn btn-primary pull-right btn_add_res_time" data-toggle="modal" data-target="#exampleModalCenter2">+</button>
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
          <input name="" type="text" className="form-control pro_input_pop" placeholder="What are you looking for" onChange={this.handleSearch}/>
          
          
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="652.903 5794.335 18 18">
  <path id="ic_search_24px" className="cls-1" d="M15.864,14.321h-.813l-.288-.278a6.7,6.7,0,1,0-.72.72l.278.288v.813L19.467,21,21,19.467Zm-6.175,0A4.631,4.631,0,1,1,14.321,9.69,4.625,4.625,0,0,1,9.69,14.321Z" transform="translate(649.903 5791.335)"/>
</svg>

          
          
          </div>
        
          
<div className="clear10"></div>
           <table className="table table-bordered table-sm timecard_table_res">
    <thead>
      <tr>
        <th width="25%" align="left" className="text-left" ref={(el) => {
                    if (el) {
                      el.style.setProperty('text-align', 'left', 'important');
                    }
                }}>Date</th>
        <th width="50%" align="center">Description</th>
        <th width="25%" align="center">&nbsp;</th>
      </tr>
    </thead>
    <tbody>
      {!this.state.isLoading ? this.state.Documents.length === 0? 
                  <tr key="empty"><td align="center" colSpan="3">No data found.</td></tr> : 
                  this.renderList(this.state.Documents, 'mobile') : <tr key="empty"><td align="center" colSpan="3"><strong>Loading....</strong></td></tr>}
    </tbody>
  </table>
           
             </div>
           </div>
           
           
           
           
           
           
           
           
           
           
          

          
          <div className="clearfix"></div>




<div className="modal fade" id="exampleModalCenter2" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered timecard_2popup" role="document">
    <div className="modal-content">
      <div className="modal-header modal_header_register">
       
        <button type="button" className="close" data-dismiss="modal" aria-label="Close" id="Close" id="AddDocumentModalClose">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body register_suc register_popup">
      
              
      

       
       

       <div className="col-sm-12 profile_setting_pop">
      
 <form className="form-horizontal" action="/action_page.php">
  
 
  
  <div className="form-group"  className={!this.state.DocDescValid? 'form-group field_required' : 'form-group' }>
    <label className="control-label col-xs-4 col-sm-4" ref={(el) => {
                    if (el) {
                      el.style.setProperty('padding-left', '15px', 'important');
                      el.style.setProperty('font-size', '17px', 'important');
                    }
                }}>Description</label>
    <div className="col-xs-8 col-sm-8">
      <input type="text" className="form-control pro_input_pop"  name="DocDesc" value={this.state.DocDesc} onChange={this.handleChange} />
    </div>
  </div>
  {this.state.files? this.renderAttachments() : ''}
    <div className="clear20"></div>
  
  <div className="col-sm-12 p0">
  
  <Dropzone onDrop={this.onDrop.bind(this)} style={{position: "relative", cursor: 'pointer'}}>    
      <div className="drag_drop_box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="8655 7398 52 34.667">
          <path id="ic_backup_24px" className="cls-1" d="M41.925,17.087a16.234,16.234,0,0,0-30.333-4.333A12.995,12.995,0,0,0,13,38.667H41.167a10.8,10.8,0,0,0,.758-21.58ZM30.333,23.5v8.667H21.667V23.5h-6.5L26,12.667,36.833,23.5Z" transform="translate(8655 7394)"></path>
        </svg>
        <div className="clear10"></div>
          <span className="dropzone_text">Drag files in or click to upload</span>
          <span className="dropzone_text2">Click to upload</span>
      </div>
  </Dropzone>
      <div className="clear40"></div>
  <span className="doc_file_error">{this.state.fileError? this.state.fileError : '' }</span>
  </div>
  
  
  <div className="clear20"></div>

<div className="btn_cance_save">
    <input name="" className="btn_save_pro_pop" value="Save" type="button" value={!this.state.isSaving ? 'Save' : 'Saving..'} disabled={this.state.isSaving} onClick={this.handleSubmit} />
    <input name="" className="btn_cancel_pro_pop" value="Cancel" type="button" data-dismiss="modal" aria-label="Close" />
</div>
      
</form> 

<div className="btn_cance_save2">
    <input name="" type="button" className="btn_save_pro" value={!this.state.isSaving ? 'Save' : 'Saving..'} disabled={this.state.isSaving} onClick={this.handleSubmit} />
    <input name="" type="button" className="btn_cancel_pro" value="Cancel" type="button" data-dismiss="modal" aria-label="Close" />
</div>

</div>
<div className="clear10"></div>

       
      </div>
      
    </div>
  </div>
</div>

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
       
       
       Do you want to delete the Document?
         <div className="clear40"></div>
         
         <div className="col-sm-offset-3">
    <div className="">
        <input name="" className="btn_cancel_pro" value="Cancel" type="button" data-dismiss="modal" aria-label="Close" />
        <input name="" className="btn_delete_error" value="Delete" type="button" onClick={this.handleDelete} />
       </div></div>
       
          </div>
       
       
       
       
       
       
       
       
       
       
       
      
    
    
      
    

<div className="clear10"></div>

       
      </div>
      
    </div>
  </div>
</div>

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

<input name="" className="btn_prview_time" value="Preview" type="button"  data-toggle="modal" data-target="#modal-fullscreen" data-backdrop="static" data-keyboard="false" id="modalFullScreenBtn" style={{display:'none'}}/>
<button data-dismiss="modal" data-toggle="modal" data-target="#exampleModalDelete" id="exampleModalDeleteBtn" style={{display:'none'}}>Delete Modal</button>
<button data-dismiss="modal" data-toggle="modal" data-target="#exampleModalDeleteClose" id="exampleModalDeleteCloseBtn" style={{display:'none'}}>Close Delete Modal</button>

</div>
        );
    }
}