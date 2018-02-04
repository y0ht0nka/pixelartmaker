/*
 * Udacity - Google Front-End Web Development
 * Project: Pixel Art Maker using jQuery
 * @author Jay
 */

// Declare global variables
const GRID = $('#pixel_canvas');	// the main pixel grid
const COLOR = $('#colorPicker');	// color picker input type
const FORM = $('#sizePicker');		// grid size form
const WHITE = "#fff";				// white color
const GRAY = "#ccc";				// gray color
var isEyeDropper = false;			// flag for the eye-dropper tool


/*
 * Run the following after the document has finished loading
 */
$(document).ready(function() {

	/* Create the default grid by calling the form's submit function.
	 * Takes the default grid height and width values from the HTML form.
	 */
	FORM.submit();


	/* Add event listeners for the User Interface.
	 * These cover all UI elements other than grid cells.
	 * The event listeners for grid cells are added every time the grid size form is submitted.
	 */
	addUIEventListeners();
});



/*
 * Select the grid size
 * Event listener - get the user-input grid size when the form is submitted
 */
FORM.submit(function(e) {

    // Get the height and width values for the grid
	let gridHeight = $('#input_height').val();
	let gridWidth = $('#input_width').val();

	// Check if the height and width values are valid
	//   (i.e. if one or both of the values are NOT blank)
	if (gridHeight === '' || gridWidth === '') {

		// If one, or both, of the values is blank or empty,
		//   show an error message and return false (i.e. do nothing else)
		alert('Grid height and width values must be greater than or equal to 1');

		return false;
	}

    // Create the grid by passing the grid height and width values to the function
    makeGrid(gridHeight, gridWidth);

    // After the grid has been created, add event listeners to the grid cells
    // Note: adding event listeners to grid cells before the grid has been created causes an error
    addGridCellEventListeners();

    // Prevent the form from submitting
    e.preventDefault();
});


/**
 * @description Create the Grid (an HTML table) with the given height and width
 * @param {number} gridHeight - The height of the grid (table rows)
 * @param {number} gridWidth - The width of the grid (table columns)
 */
function makeGrid(gridHeight, gridWidth) {

    // Remove the existing grid from the canvas, if any
	//   Loop through each table row and delete it, until none is found
	while ( GRID.children('tr').length > 0 ) {
		$('#pixel_canvas tr:last').remove();
	}

	// Variable to store the HTML code for the new grid
	var txtGrid = '';

	// Add the HTML code for grid rows and columns
	// Loop through each row until grid height is reached
	for (let i = 0; i < gridHeight; i++) {

		// Add the starting HTML tag of the row
		txtGrid += '<tr>';

		// Loop through each column until grid width is reached
		for (let j = 0; j < gridWidth; j++) {

			// Add the HTML tag for the column
			txtGrid += '<td></td>';
		}

		// Add the closing HTML tag of the row
		txtGrid += '</tr>';
	}

	// Finally, append the newly created grid to the existing (empty) table
    GRID.append(txtGrid);
}


/**
 * @description Add event listeners to the grid cells
 */
function addGridCellEventListeners() {

	// Local variables
	var isMouseDown = false;	// flag to denote if the left mouse button is down


 	/* Mouse over */
 	$('td').mouseover(function() {
 		// Get the mouse cursor
 		getMouseCursor( $(this) );
	});


	/* Mouse double-click */
	$('td').dblclick(function() {
		// Remove the current grid cell's background color
		// i.e. fill the cell with white color
		fillColor( $(this), WHITE );
	});


  	/* Mouse down */
	$('td').mousedown(function(e) {

		// set the mousedown flag to true
		isMouseDown = true;

    	// If the left mouse button is pressed down on a grid cell,
    	// implement the currently selected tool's default action (method).
    	// For e.g., if current tool is paint-brush, the cell is filled with a background color.
		if (isMouseDown) {

			implementTool( $(this) );

			// Prevent the grid cell from being dragged by the mouse
			e.preventDefault();
		}
    })
    .mouseover(function(e) { /* Mouse over */

    	// If the left mouse button is pressed down on a grid cell,
    	// implement the currently selected tool's default action (method).
    	// For e.g., if current tool is paint-brush, the cell is filled with a background color.
		if (isMouseDown) {

			implementTool( $(this) );

			// Prevent the grid cell being dragged by the mouse
			e.preventDefault();
		}
    });


    /* Mouse up */
	$('td').mouseup(function() {
		isMouseDown = false;
	});


	/* Mouse leave */
	GRID.on('mouseleave', function() {
		isMouseDown = false;
	});


	/* Disable the context menu on right-click of the mouse button */
	GRID.bind('contextmenu', function(e) {
	    // Prevent the context menu from being displayed
	    e.preventDefault();
	});
}


/**
 * @description Add event listeners to the HTML elements in grid settings
 */
function addUIEventListeners() {

	// Local variables
	var cellHeight = $('tr').height();	// grid cells height
	var cellWidth =  $('td').width();	// grid cells width


	/* The Color Palette
	 * Some browsers (e.g. IE11) doesn't support input color type.
	 * So, the color palette contains 10 pre-selected colors,
	 *    which the users can choose from to make pixel art.
	 */

	/* Set the color of the Color Picker input type
	 *   with the background color of the selected palette button.
	 */
	$('.palette-button').click(function() {
		// Pass the selected palette button to the function to set the bg color
		setColor( $(this) );

	    // If the eye-dropper tool is currently selected, deselect it.
	    // i.e. Change the tool to the default paint-brush tool type.
		deselectEyeDropper();
	});


	/*  Change color using the Color Picker input type
	 */
	COLOR.change(function() {
	    // If the eye-dropper tool is currently selected, deselect it.
	    // i.e. Change the tool to the default paint-brush tool type.
		deselectEyeDropper();
	});



	/* Clear the grid of all the colors
	 * Wipe the grid clean, but don't change the grid size
	 */
	$('.fa-file').click(function() {
		// Fill all the grid cells with white color
		fillColor( $('td'), WHITE );

	    // If the eye-dropper tool is currently selected, deselect it.
	    // i.e. Change the tool to the default paint-brush tool type.
		deselectEyeDropper();
	});


	/* Toggle the grid border
	 * By default, the grid has a border.
	 * But, clicking on this button will hide, or show, the grid border alternately.
	 */
	$('.fa-table').click(function() {
		$('tr, td').toggleClass('grid-without-border');
	});


	/* Zoom-in to the grid
	 * Makes the grid cells larger in small increments
	 */
	$('.fa-search-plus').click(function() {

		if ( (cellWidth + 5) <= 35 ) {

			cellHeight += 5;
			cellWidth += 5;

			$('tr').height(cellHeight);
			$('td').width(cellWidth);
		}
	});


	/* Zoom-out of the grid
	 * Makes the grid cells smaller in small decrements
	 */
	$('.fa-search-minus').click(function() {

		if ( (cellWidth - 5) >= 10 ) {

			cellHeight -= 5;
			cellWidth -= 5;

			$('tr').height(cellHeight);
			$('td').width(cellWidth);
		}
	});


	/* Paint-brush tool */
	$('.fa-paint-brush').click(function() {

		// Reset the tool (i.e. to paint-brush)
		isEyeDropper = false;

		// TODO: a function that selects this tool, and deselects others
	});


	/* Eye-dropper tool */
	$('.fa-eye-dropper').click(function() {

		// Set the tool to eye-dropper
		isEyeDropper = true;

		// TODO: a function that selects this tool, and deselects others
	});

}


/**
 * @description Convert rgb color values to hex
 * @param {string of rgb values} rgb - rgb color value
 * @return {string} - hex color value
 * Source: https://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value
 */
function rgb2hex(rgb) {

	// Some versions of IE (e.g. IE6) returns hex values by default.
	// So, there is no need to run the conversion for these browsers
     if (  rgb.search("rgb") == -1 ) {
          return rgb;
     } else {
          rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
          function hex(x) {
               return ("0" + parseInt(x).toString(16)).slice(-2);
          }
          return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
     }
}


/** Function to set the background color of an object
 *  @param {object} obj - the object whose background color needs to be changed
 *  @param {string} strColor - string hex color value
 */
function fillColor(obj, strColor) {
	$(obj).css('background-color', strColor);
}


/** Function to set the value of the Color Picker input type
 *  @param {object} obj - Color Picker input type
 */
function setColor(obj) {

	// Get the background color of the clicked element.
	// Most browsers return the rgb value instead of the hexadecimal value.
	// Convert rgb to hex by passing it to the "rgb2hex()" funtion
	let newColor = rgb2hex( obj.css('background-color') );

	// Update the value of the color picker input type
    COLOR.val(newColor);
}


/** Function to determine the currently selected tool and execute its default method
 *  @param {object} obj - currently selected grid cell
 */
function implementTool(obj) {

	// Check if the eye-dropper tool is currently selected
	// If it is, set the color picker value to the background color of the current cell.
	if (isEyeDropper) {
		setColor( obj );
	} else {
		// If the tool is not an eye-dropper (i.e. it's paint-brush),
		//   fill the grid cell with selected color
		fillColor( obj, COLOR.val() );
	}
}


/** Function to set the  mouse cursor style of an object on mouse over
 *  @param {object} obj - object for which the mouse cursor style needs to be changed
 */
function getMouseCursor( obj ) {

	obj.css('cursor', (isEyeDropper) ? 'crosshair' : 'pointer');
}


/** Function to deselect the eye-dropper tool, and to revert to the default paint-brush tool
 */
function deselectEyeDropper() {

	// If the eye-dropper tool is currently selected, deselect it.
	// i.e. Change the tool to the default paint-brush tool type.
	if (isEyeDropper) {
		isEyeDropper = false;
	}
}


/* TODO:
 * - Style the tool buttons - active, hover, etc.
 * - Implement a responsive design
 * - Implement color gradient
 * - Use jQuery UI to make a better app interface
 * - Function to Save and Load art work:
 * - Export as a picture (format: jpg, png, etc.)
 */



/*
 * Code Graveyard
 */
/*
	//Eraser tool
	$('.fa-eraser').click(function() {
		// selectTool( $(this) ); // Selects this tool, and deselects others
		$(this).css('background-color', '#ccc'); // TODO: use toggleClass instead!
		lastColor = COLOR.val();	// store the last color
		COLOR.val(WHITE);	// set color picker value to white
		cursorType = 'fa-eraser';
	});

// Selects this tool, and deselects all others
function selectTool(obj) {

	fillColor( $(this), GRAY ); // TODO: use toggleClass instead!

}

*/
