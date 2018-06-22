var row_count = 0;
var row_y_start = 10;
var row_height = 2.3;
var selected_row_number = 0;
var key_array = [""];
var local_delete = false;

var config = {
    apiKey: "AIzaSyDGeYzD0avN2nmNwUbAPBN7mDmYiXB_3V0",
    authDomain: "classworkjune12.firebaseapp.com",
    databaseURL: "https://classworkjune12.firebaseio.com",
    projectId: "classworkjune12",
    storageBucket: "classworkjune12.appspot.com",
    messagingSenderId: "793923721105"
 };
    
firebase.initializeApp(config);
    
var database = firebase.database();

$( document ).ready(function() {

	$(".col-8-value").on("click", key_add);
	$(".col-8-label").on("click", key_add);
	$(".col-9-value").on("click", key_delete);
	$(".col-9-label").on("click", key_delete);

	$("#input-submit").on("click", function(e) {
		e.preventDefault();
		add_row();
	});

	database.ref().on("child_added", function(snapshot) {

	var row_name = snapshot.val().name;
	var row_dest = snapshot.val().dest;
	var row_init = snapshot.val().init;
	var row_freq = snapshot.val().freq;

	key_array.push(snapshot.key);

	row_count++;
	row_y_start = row_y_start + row_height;
	$("body").append('<div class="table-row" id="row-' + row_count + '" style="top: ' + row_y_start + 'vw;">' +
					'<div class="table-row-cell cell-1">' +
						row_name +
					'</div>' +
					'<div class="table-row-cell cell-2">' +
						row_dest +
					'</div>' +
					'<div class="table-row-cell cell-3">' +
						row_freq +
					'</div>' +
					'<div class="table-row-cell cell-4">' +
						'9:00 AM' +
					'</div>' +
					'<div class="table-row-cell cell-5">' +
						'60' +
					'</div>' +
			     '</div>');      

	$("#row-" + row_count).on("click", function () { var clicked_row_number = this.id.substring(4, this.id.length); highlight_row(clicked_row_number); });

	}, function(errorList) { console.log(errorList.code);});

	database.ref().on("child_removed", function(snapshot) {

		var key_to_remove = key_array.indexOf(snapshot.key);

		key_array.splice(key_to_remove, 1);

		rebuild_from_key_array();
	
	}, function(errorList) { console.log(errorList.code);});
});

window.onkeydown = function(e) {

	var function_keyCodes = [112,115,117,118,119,120,121];

	if(function_keyCodes.indexOf(e.keyCode) !== -1)
	{
		e.preventDefault();

		switch(e.keyCode)
		{
			case 112: // Help
				console.log("Help");
			break;

			case 115: // Search
				console.log("Search");
			break;

			case 117: // Filter
				console.log("Filter");
			break;

			case 118: // Sort
				console.log("Sort");
			break;

			case 119: // Add
				key_add();
			break;

			case 120: // Delete
				key_delete();
			break;

			case 121: // Quit
				key_quit();
			break;

			default:
				console.log(e.keyCode);
			break;
		}
	}
	else if(e.keyCode === 27)
	{
		key_escape();
	}
	else if(e.keyCode === 40)
	{
		var increment_row_number = selected_row_number !== row_count ? selected_row_number + 1 : selected_row_number;
		highlight_row(increment_row_number);
	}
	else if(e.keyCode === 38)
	{
		var decrement_row_number = selected_row_number !== 0 ? selected_row_number - 1 : selected_row_number;
		highlight_row(decrement_row_number);
	}

};

function highlight_row(row_number)
{
	if(selected_row_number !== 0)
	{
		$("#row-" + selected_row_number).css("background-color", "black");
		$("#row-" + selected_row_number).css("color", "rgb(176, 176, 176)");
	}

	selected_row_number = row_number;

	$("#row-" + selected_row_number).css("color", "black");
	$("#row-" + selected_row_number).css("background-color", "rgb(176, 176, 176)");
}

function key_add()
{
	$(".train-add-form-container").css("visibility", "visible");
	$("#key-value-pressed").text("F8");
	$("#key-label-pressed").text("Add a train to the database. {ESC} to cancel");
	$(".footer-text").css("visibility", "visible");
	$("#name-input").focus();
}

function add_row()
{
	var add_inputs = { name: $("#name-input").val().trim(),
				 dest: $("#dest-input").val().trim(),
				 init: $("#init-input").val().trim(),
				 freq: $("#freq-input").val().trim()
			     };
	
	var leave_early = 0;
	var leave_message = "Can't add train: Please provide ";

	if(add_inputs.name === "")
	{
		leave_message += "a train name";
		leave_early++;
	}

	if(add_inputs.dest === "")
	{
		if(leave_early !== 0) { leave_message += ", and" };
		leave_message += " a destination";
		leave_early++;
	}

	if(add_inputs.init === "")
	{
		if(leave_early !== 0) { leave_message += ", and" };
		leave_message += " a first train time";
		leave_early++;
	}

	if(add_inputs.freq === "")
	{
		if(leave_early !== 0) { leave_message += ", and" };
		leave_message += " a frequency";
		leave_early++;
	}

	if(leave_early !== 0)
	{
		var string_to_find = "and";
		var instances_found = leave_message.match(new RegExp("\\b" + string_to_find + "\\b", "g"));
		instances_found = instances_found === null ? 0 : instances_found.length;

		if(instances_found > 1)
		{
			while(leave_message.match(new RegExp("\\b" + string_to_find + "\\b", "g")).length !== 1)
			{ 
				var string_location = leave_message.indexOf("and");
				leave_message = leave_message.substr(0, string_location) + leave_message.substr(string_location + 4, leave_message.length);
			}
		}
		
		$("#key-label-pressed").text(leave_message);
		return;
	}

	$("#name-input").val('');
	$("#dest-input").val('');
	$("#init-input").val('');
	$("#freq-input").val('');
	
	database.ref().push(add_inputs);
	key_escape();
}

function key_escape()
{
	$(".train-add-form-container").css("visibility", "hidden");
	$(".footer-text").css("visibility", "hidden");
}

function key_quit()
{
	console.log("hi");
	window.close();
}

function key_delete()
{
	if(selected_row_number !== 0)
	{
		local_delete = true;
		database.ref().child(key_array[selected_row_number]).remove();

		var decrement_row_number = selected_row_number !== 0 ? selected_row_number - 1 : selected_row_number;
		highlight_row(decrement_row_number);
	}
	else
	{
		$("#key-value-pressed").text("F9");
		$("#key-label-pressed").text("Cannot delete: No row selected");
		$(".footer-text").css("visibility", "visible");

		setTimeout(function () { if($("#key-label-pressed").text() === "Cannot delete: No row selected") { $(".footer-text").css("visibility", "hidden"); } }, 4000);
	}
}

function rebuild_from_key_array()
{
	selected_row_number = local_delete ? selected_row_number : 0;
	local_delete = false;

	while($(".table-row").length !== 0)
	{
		$(".table-row").remove();
	}

	row_count = 0;
	row_y_start = 10;

	database.ref().once("value", function(snapshot) { 

		for(var build_keys in key_array) 
		{ 
			if(build_keys < key_array.length - 1)
			{
				row_count++;
				row_y_start = row_y_start + row_height;
				var rebuild_child_array = snapshot.val()[key_array[row_count]];

				var row_name = rebuild_child_array.name;
				var row_dest = rebuild_child_array.dest;
				var row_init = rebuild_child_array.init;
				var row_freq = rebuild_child_array.freq;

				$("body").append('<div class="table-row" id="row-' + row_count + '" style="top: ' + row_y_start + 'vw;">' +
								'<div class="table-row-cell cell-1">' +
									row_name +
								'</div>' +
								'<div class="table-row-cell cell-2">' +
									row_dest +
								'</div>' +
								'<div class="table-row-cell cell-3">' +
									row_freq +
								'</div>' +
								'<div class="table-row-cell cell-4">' +
									'9:00 AM' +
								'</div>' +
								'<div class="table-row-cell cell-5">' +
									'60' +
								'</div>' +
					           '</div>');
			
				$("#row-" + row_count).on("click", function () { var clicked_row_number = this.id.substring(4, this.id.length); highlight_row(clicked_row_number); });
			}
		} 
	});
}
