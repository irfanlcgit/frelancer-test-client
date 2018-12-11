<?php
// echo"<pre>"; print_r($updated_price);exit;
  $this->load->view('header'); 
 $this->load->view('login'); 
$nprice = 0;
if(isset($listings->nprice)){
  $nprice=$listings->nprice;
}

// echo '<pre>';print_r($listings);die();
?>

<style>

#calendar_event td{
    border: 1px solid #b4b7b7 !important;
  height: 78px;
  cursor: pointer;
}

#calendar_event{
  margin-bottom:0px;
}

.disable_date{
  background: #DCE0E0;
}

#calendar_event .active{
  box-shadow: 1px 1px 7px 4px #ccc8c8;
  background: #fff;
}

.disable_date {
    opacity: 0.4;
}  

</style>




	<Section id="terms_tab">
		<div class="container p0">
			<ul id="myTab" class="nav nav-tabs navbar-right">
				<li><a class="navbar_back" href="<?php echo base_url('your-listing');?>"><span><i class="fa fa-chevron-left" aria-hidden="true"></i></span>&nbsp; BACK &nbsp; &nbsp; |</a></li>
				<li><a class="navbar_view" href="<?php echo base_url().'detailpage?listing_id='.$this->uri->segment('2');?>" target="_blank">&nbsp; &nbsp; <span><i class="fa fa-eye" aria-hidden="true"></i></span>&nbsp; VIEW</a></li>
			</ul>
		</div>
	</Section>
<br />
<br />
	<div class="col-sm-12 dashboard_content">
		<div class="container p0"> 
			<div class="row">
                <div class="col-sm-12 p0">
                    <div id="myTabContent" class="tab-content user_car_profile">
                        <div class="col-sm-12 tab-pane fade in active profile_user_dashboard p0" id="home">
                          
							<div class="col-sm-12">
								<div class="col-sm-3 p0 padding_xs">
									<?php
										$this->load->view('left_menu'); 
									 ?>
									<div class="col-sm-12 p0">
										<div class="nav_circle_dropdown">
											<?php
											if($listings->is_active== 0){?>
												<img id="image" src="<?php echo $this->config->base_url();?>assets/frontend/images/red.png" width="17" height="17" alt="" />

											<?php }else{ ?>

												<img id="image" src="<?php echo $this->config->base_url();?>assets/frontend/images/green.png" width="17" height="17" alt="" />

											<?php }
											?>
											<select attrh="<?php echo $listings->listing_id; ?>" class="terms_listed" id="is_active" name="is_active">
												<option value="0" <?php if($listings->is_active == 0){?> selected="selected" <?php } ?>>Unlisted</option>
												<option value="1" <?php if($listings->is_active == 1){?> selected="selected" <?php } ?>>Listed</option>
											</select>
										</div>
									</div>
								</div>
                                <div class="col-sm-9 p0">
								<div class="col-md-9 p0_res p_right_none">

                  <button type="button" class="btn btn-sm btn-primary" id="prev_month">prev</button>
                  <button type="button" class="btn btn-sm btn-primary" id="next_month">next</button>

                  <p id="month-year">MAY 2018</p>
									<div id=''>
                    <table class="table" id="calendar_event">
                      <thead>
                        <tr>
                          <th width="14%">Mon</th>
                          <th width="14%">Tue</th>
                          <th width="14%">Wed</th>
                          <th width="14%">Thu</th>
                          <th width="14%">Fri</th>
                          <th width="14%">Sat</th>
                          <th width="14%">Sun</th>
                        </tr>
                      </thead>
                      <tbody id="calendarHTML">
                      	<?php
//                       		$d = new DateTime('first day of this month');
                      		
//                       		$date = $d->format('m/d/Y');
//                       		echo $dayofweek = date('w', strtotime($date)); echo '<br>';
// //$result    = date('Y-m-d', strtotime(($day - $dayofweek).' day', strtotime($date)));
// //echo $result;
//                       		echo date('Y-m-01');
                      	?>
                        
                      </tbody>
                    </table>
                  </div>


                                     <div class="clear20"></div>
                                    
										<a class="terms_back_btn pull-left" href="<?php echo base_url().'pricing/'.$this->uri->segment('2');?>">Back</a>

                                        	<a class="terms_back_btn pull-right" href="<?php echo base_url().'booking/'.$this->uri->segment('2');?>">Next</a>
								</div>
                                <div class="col-md-3 p0_res p_right_none">
									
                                    <div id="price_of_car_section" class="right_box_calendar3">
                                    <div class="calendar_bgtop_rgiht">
                                    <a href="#" class="btn_avail_clndr">Available</a>
                                     <a href="#" class="btn_block_clndr">Blocked</a>
                                    </div>
                                    <form method="POST">
                                    <div class="clear20"></div>
                                    <h2 style="color: #35B729;">Price for Car</h2>
                                     <div class="clear20"></div>
                                   <div class="col-sm-12 text-center">
										<!-- <span class="dollar_span" style="color: #35B729;"><i class="fa fa-usd" aria-hidden="true"></i></span> -->
										<input ber" max="100000" min="1" title="Price" required="required" class="qty calndr_righnt_select" id="price_of_car" name="price_of_car" size="4" placeholder="$0" style="text-align:center;">
								   </div>
                                    
                                   <div class="clear40"></div>
                                    <div class="col-sm-12 text-center">
                                      <label class="calndr_righnt_select2">Add note</label>
                                      <textarea id="add_note" name="add_note" placeholder="Add Note" value="this stest"></textarea>
									</div>
                  <input type="hidden" name="pre_date" required="select the date" id="pre_date">
                                     <div class="clear40"></div>
                                     <a href="#" class="btn_cancel_clndr">Cancel</a>
                                     
                                      <a type="submit" href="#" id="save_changes_button" class="btn_savechange_clndr">Save Changes</a>
                                      </form>
                                     
                                     
                                   <div class="clear40"></div>
                                   <div class="clear40"></div>
                                   
                                    </div>
                                    
                                    
                                    
                          
								</div></div>
							</div>
							
                        </div>
					
					</div>
				
                </div>
            
            </div>  

        </div>
	</div>
	
	<div class="clear20"></div>

		
<?php
  $this->load->view('footer');  
 ?>
 


<script type="text/javascript">

/*****************UMER SURKHAIL FOR CALENDAR********************/

//Get number of days in any month
function daysInMonth (month, year)
{
    return new Date(year, month, 0).getDate();
}


var currentDate = new Date();

//get current month number on load
var currentMonthNum = currentDate.getMonth()+1;

//get current year on load
var currentYear = currentDate.getFullYear();

//get current date on load
var currentDateDay = currentDate.getDate();

var numberOfDaysInMonth = daysInMonth(currentMonthNum,currentYear);
var numberOfDaysInPrevMonth = daysInMonth((currentMonthNum-1),currentYear);

var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

//get the day of the week of firstDay
var dayOfWeekOffirstDay = firstDay.getDay();


var calanderHTML = '<tr>';
var totalLoopRan = 0;
var defaultCost = 77;
var remainingBoxes = 0;
for(i=dayOfWeekOffirstDay-1; i>0; i--)
{
	calanderHTML = calanderHTML + '<td class="disable_date"><span class="dated">'+((numberOfDaysInPrevMonth-i)+1)+'</span><div class="clear20"></div><span>$ '+defaultCost+'</span></td>';
	totalLoopRan++;
}

for(i=1; i<=numberOfDaysInMonth; i++)
{
	var ifDisable = '';
	if(totalLoopRan%7==0)
	{
		calanderHTML = calanderHTML + '</tr><tr>'
	}
	if(i < currentDateDay)
	{
		ifDisable ='disable_date';
	}
	calanderHTML = calanderHTML + '<td class="'+ifDisable+'"><span class="dated">'+i+'</span><div class="clear20"></div><span>$ '+defaultCost+'</span></td>';
	totalLoopRan++;
}

if(totalLoopRan < 35)
{
	remainingBoxes = 35 - totalLoopRan;
	for(i = 1; i <= remainingBoxes ; i++)
	{
		if(totalLoopRan%7==0)
		{
			calanderHTML = calanderHTML + '</tr><tr>'
		}
		calanderHTML = calanderHTML + '<td class=""><span class="dated">'+i+'</span><div class="clear20"></div><span>$ '+defaultCost+'</span></td>';
		totalLoopRan++;
	}
	calanderHTML = calanderHTML + '</tr>';
}
else if(totalLoopRan > 35)
{
	remainingBoxes = 42 - totalLoopRan;
	for(i = 1; i <= remainingBoxes ; i++)
	{
		if(totalLoopRan%7==0)
		{
			calanderHTML = calanderHTML + '</tr><tr>'
		}
		calanderHTML = calanderHTML + '<td class=""><span class="dated">'+i+'</span><div class="clear20"></div><span>$ '+defaultCost+'</span></td>';
		totalLoopRan++;
	}
	calanderHTML = calanderHTML + '</tr>';
}
else
{
	calanderHTML = calanderHTML + '</tr>';
}
setTimeout(function()
{
	console.log('now called');
	//console.log(jQuery('#calendarHTML'))//.append(calanderHTML);
	document.getElementById('calendarHTML').innerHTML = calanderHTML;
}, 1000)


/*****************UMER SURKHAIL FOR CALENDAR********************/


  // Create calendar when document is ready
$(document).ready(function() {
	alert('hi');
$('#price_of_car_section').hide();
$('#save_changes_button').click(function(){
  var price_of_car= $('#price_of_car').val();

// $("#prev_month").prop("disabled",true);

  if (price_of_car!='') {
    $.ajax({
        url: "<?php base_url()?>/Aircnt/per_day_prices",
        type: "POST",
       data : {
            per_day_price : $('#price_of_car').val(),
            date: $('#pre_date').val(),
            notes: $('#add_note').val(),
            listing_id:<?php echo $listings->listing_id;?>
          },
        success: function(result){
          alert(result);
          location.reload();
        }
      });

  }
  else{
    alert('Enter Per day Price of the car');
    return false;
  }
});

var month_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];


// var seletedDate = moment(new Date());


// console.log(seletedDate);
var calendar_date = new Date();
var calendar_month = calendar_date.getMonth();
// alert(calendar_month);return false;
var calendar_year = calendar_date.getFullYear();
$('#month-year').text(month_arr[calendar_month]+' '+calendar_year);

  });



// var curr = '';
// $(document).on('click','tr td ',function(){
//    curr = $(this).closest('td').find('.fc-title').text();
//     $('#price_of_car').val('<?php //echo $nprice;?>'); 
//     // $('#pre_date').val(date_pro);
//    console.log(curr);
//   });

$('table td').on('click',function(){

if(!$(this).hasClass('disable_date')){
  $('#price_of_car_section').show();

  var curr_price = $(this).find('span:eq(1)').text();

  $('#price_of_car').val(curr_price);


  $(this).addClass('active');
  $(this).siblings().removeClass('active');
}
});

$('#next_month').click(function() {
  
  var get_curr = $('#month-year').text();
  get_curr = get_curr.split(" ");

  var month_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  var diff = 0;
  var curr_mnth =0;
  for(var x=0;x<12;x++){
    
    if(get_curr[0] !== month_arr[x]){
      diff += 1;

    }else{
      curr_mnth = x;
      break;
    }
  }

  var calendar_year = parseInt(get_curr[1]);

    if(x+1 <= 11){
      var month_name = month_arr[x+1];
    $('#month-year').text(month_name+' '+get_curr[1]);
  }else{
    var new_calendar_month = (x+1)%12;
    calendar_year = calendar_year + 1;

    $('#month-year').text(month_arr[new_calendar_month]+' '+calendar_year);
  }
});

$("#prev_month").click(function(){
  var get_curr = $('#month-year').text();
  get_curr = get_curr.split(" ");

  var month_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  var diff = 0;
  var curr_mnth =0;

  for(var x=0;x<12;x++){
    if(get_curr[0] !== month_arr[x]){
      diff += 1;

    }else{
      curr_mnth = x;
      break;
    }
  }


});



var dt = new Date();

// GET THE MONTH AND YEAR OF THE SELECTED DATE.
var month = dt.getMonth(),
    year = dt.getFullYear();
var FirstDay = new Date(year, month+1, 1);
var LastDay = new Date(year, month + 1, 1);
console.log(LastDay);
// var months_array = [31,28,31,30,31,30,31,31,30,31,30,31];

// var monthIndex = firstDay.getMonth();
// var total_days = months_array[monthIndex];



// $(document).ready(function()
// {
  
// })



// if(calendar_month == )

// var updated_price = <?php //echo json_encode($updated_price); ?>;
// console.log(updated_price[0]['book_date']);
// var base_price = '$'+<?php //echo $nprice;?>;
// var events_array = [];


// var date = new Date();
// var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
// var months_array = [31,28,31,30,31,30,31,31,30,31,30,31];

// var monthIndex = firstDay.getMonth();
// var total_days = months_array[monthIndex];
// var price_index = 0;
// for(i=1;i<=total_days;i++)
// {

// var date = new Date();
// var firstDay = new Date(date.getFullYear(), date.getMonth(), i);
// var months_array = [31,28,31,30,31,30,31,31,30,31,30,31];
// var day = firstDay.getDate();
// var monthIndex = firstDay.getMonth();
// var year = firstDay.getFullYear();
//  if(day<10)
//  {
//   day = '0'+day;
//  }

//  if((monthIndex+1)<10)
//  {
//   monthIndex = '0'+(monthIndex+1)
//  }

// console.log(price_index[7]);
// if(updated_price[7] !== undefined){
//   console.log('true');return false;
// }
// if(updated_price[price_index] !== undefined && updated_price[price_index]['book_date'] == year+'-'+monthIndex+'-'+day){
//   base_price = '$'+updated_price[price_index]['per_day_price'];
//   price_index +=1;
// }else{
//   base_price = '$'+<?php //echo $nprice;?>;
// }

 // events_array.push(
 // {
 //  title  : base_price,
 //  start  : year+'-'+monthIndex+'-'+day
 // });

// }
// console.log("events_array");
// console.log(events_array);

//var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

 // We will refer to $calendar in future code
 // var today =  new Date().toJSON().slice(0,10).replace(/-/g,'-');

 // var $calendar = $("#calendar").fullCalendar({
 //   // Start of calendar options
 //   header: {
 //    left: 'title',
 //    right: 'prev,next'
 //   },
   
 //    events: events_array,

  //   viewDisplay: function(view){
  //       $('.fc-day').filter(
  //         function(index){
  //         return moment( $(this).data('date') ).isBefore(moment(),'day') 
  //       }).addClass('fc-other-month');
  //   }, 
  
  // dayClick: function(date, jsEvent, view, resourceObj) {
  //   var current_selected_value = 0;
  //   if($(jsEvent.target).hasClass('fc-event-container'))
  //   {
  //     current_selected_value = $(jsEvent.target).find('.fc-title').text();
  //   }
  //   else if($(jsEvent.target).hasClass('fc-day-top'))
  //   {
  //     var current_index = ($(jsEvent.target).index())+1;

  //     current_selected_value = $(jsEvent.target).parents('thead').next().find('tr').find(':nth-child('+current_index+')').find('.fc-title').text();
  //   }
  //   console.log(current_selected_value);
    // $('.fc-view-container').css({"opacity": ".7"});
    

  //   $(this).addClass('.active_div'); 
  //   $('#price_of_car_section').show();
  //   var date_pro =  date.format();

  //   $('#calendar').fullCalendar('unselect');
  //   // alert($(this).find('.fc-title').text());
  //   // alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
  // },

// defaultView: 'month', 
//   validRange: {
//     start: today
//   },
  
// //   select: function(start, end) {
// //     if(start.isBefore(moment())) {
// //         $('#calendar').fullCalendar('unselect');
// //         return false;
// //     }
// // },

//    // Make possible to respond to clicks and selections
//    selectable: true,

//   } // End of calendar options
//  );
// });


</script>