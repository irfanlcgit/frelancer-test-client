import React, { Component } from "react";

//import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

export default class Register extends Component {
  
  constructor(props) {
      super(props);

      this.state = {
        mobile: ""
      };
  }

  handleChange = event => {
      this.setState({
        [event.target.id]: event.target.value
      });
  }

  render() {
    return (
      <div className="col-sm-12 forgot_bg">
    <div className="container p0">
      <div className="forgot_box">
            
      
        <a href="/login"><img src="images/ic_chevron_left1_24px.svg" className="back_forgot_circle" width="15" height="23" alt="" /></a> 
        <div className="clear10"></div>
           <div className="forgot_circle"><img src="images/ic_lock1_outline_24px.svg" alt="" /></div>
            <h2> Forgot Password?</h2>
            
             <div className="clear10"></div>
            Check your phone for the code.
<div className="register_box_mid">
               <div className="clear20"></div>
   
              <div className="col-sm-12 p0">
                    <input name="" id="mobile" className="frogot_input" type="text" placeholder="Phone Number" value={this.state.mobile} onChange={this.handleChange}/>
                    <img src="images/ic_local_phone_24px.svg" width="15px" height="15px" className="register_icon1" alt="" />
                    </div>
               

                <div className="clear30"></div>
       

                <a href="/forgot_code" className="btn_forogot">Proceed</a>


  <div className="clear40"></div>
        </div>
            
            
</div>

            <div className="clear40"></div>

         
         
      </div>
    </div>
    );
  }
}