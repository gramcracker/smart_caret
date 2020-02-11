//todo: make nodes selectable by range by using str.split(":"), and changing make selection to use start and stopping nodes 
//expand selection function which goes to next sibling node until some ending is met.


let textNodeArr = [];
let range = document.createRange();
let displayHints = false;
let index = "";
let selectedIndex = 0;
let scrollWindowTop = 0;
let scrollWindowBottom = $( window ).height() + scrollWindowTop;
let selectedNode;
$(document.body).append('<div id="selectionHintMarkerContainer"></div>');


function makeSelectionHints(){
	console.log("making selecions");
	let i = 0;
	let r = document.createRange();
	textNodeArr.forEach(function(d){
		r.selectNodeContents(d);
		let rects = r.getClientRects();
		if (rects.length > 0) {
			if(rects[0].top >= scrollWindowTop && rects[0].top <= scrollWindowBottom){
				selectionHint(rects[0].left, rects[0].top, i);
			}
		}
		i++;
	});
}

function selectionHint(x, y, n) {
	let d = $("#selectionHintMarkerContainer");
	d.append('<div class="selectionHintMarker" style=" display: none; position: absolute; background: black; color: white; box-shadow: 5px 5px 3px #888888; font-size: 12px; border-radius: 2px; left: '+x+'px; top: '+y+'px; z-index:1000">'+n+'</div>');

}

//find all nodes with text and append them to nodeArr.
function getTextNodes(from, to){
	$("body").find(":not(iframe)").addBack().contents().filter(function() {

		//if text node
		if (this.nodeType == 3){
			let s = this.textContent;

			//if node isnt just whitespace
			if ( /\S/.test(s)) {
				textNodeArr.push(this);
			}
	  }
	})
}

//set area for marker hints to be drawn
function setViewArea(){
	scrollWindowTop = $(document).scrollTop();
	scrollWindowBottom = $( window ).height() + scrollWindowTop;
}


function makeSelection( node ){
	selection = window.getSelection();
	selection.removeAllRanges();
	range.selectNodeContents(node);
	selection.addRange(range);
}

function clearSelectionHints(){
	selectedIndex = 0;
	textNodeArr = [];
	selectedNode = undefined;
	$("#selectionHintMarkerContainer").empty();
}

// function stealFocus(){
// 	$("#selectionHintMarkerContainer").focus();
// 	console.log("stole focus");
// 	$(document).keyup(function(event)){
// 		if(event.keycode >= 48 && event.keycode <= 57){
// 			console.log(event.keycode - 48);
// 		}
// 	}

// }


function markerMode() {

	if(textNodeArr.length == 0 || scrollWindowTop != $(document).scrollTop()){

		//clear out old hint markers
		clearSelectionHints();

		//get area for visible space to place hints
		setViewArea();
		
		//fill textNodeArr with new nodes
		getTextNodes();

		//make new hint markers to reflect contents of textNodeArr
		makeSelectionHints();
	}

	//toggle displaying hint markers
	if(displayHints == false){
		$(".selectionHintMarker").css("display", "inline");
		displayHints = true;
	}else{
		$(".selectionHintMarker").css("display", "none");
		displayHints = false;
	}

}

function enterSelection(){
	//if hints are showing, set selectedIndex to index, and hide hints then reset index
	if(displayHints){
		selectedIndex = parseInt(index, 10);
		$(".selectionHintMarker").css("display", "none");
		displayHints = false;
		index = "";
	}
	//select node at selected index
	selectedNode = textNodeArr[selectedIndex];
	makeSelection(selectedNode);
	//iterate for next call
	selectedIndex++;

}

function expandSelection(){

	console.log("+");
	if(!selectedNode) {
		selectedNode = textNodeArr[selectedIndex];
	}
	selectedNode = selectedNode.parentElement;
	makeSelection(selectedNode);

}

function inputNumeric(keycode) {
	if(displayHints){
		let n = keycode - 48;
		index = index + n;
		console.log(index);
	}
}

//start listening for keypress, and iterate over selections


// if(!displayHints){

// 	$(document).keyup(function(event){

// 	});

// }else{

// }




$(document).keyup(function(event){

	let keycode = (event.keyCode ? event.keyCode : event.which);
	
	console.log(keycode);
	//switch true allows us to do comarisons to keycode instead of checking equality
	switch(true){
		//keycode is numeric
		case (keycode >= 48 && keycode <= 57):

			inputNumeric(keycode);

		break;

		//keycode = enter
		case (keycode == 13):

			enterSelection();

		break;

		//keycode = ctrl + space
		case (event.ctrlKey && ( event.which === 32 )):

			markerMode();
		
		break;

		//keycode = equals sign
		case (keycode == 61 ):
			
			expandSelection();
			
		break;


	};

	//todo: else if in keycode select mode goto selection
});
	

