$(window).load(function() {
		// Animate loader off screen
		$(".se-pre-con").fadeOut("slow");;
	});
	
	$(".under_construction_alert").click(function() {
                    swal({
               title: "Under Construction!",
               text: "This Page is Under construction.Please Visit Later",
               imageUrl: 'images/under_construction.png'
             });
    });