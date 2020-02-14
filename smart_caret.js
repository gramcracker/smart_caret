//todo: make nodes selectable by range by using str.split(":"), and changing make selection to use start and stopping nodes 
//expand selection function which goes to next sibling node until some ending is met.


let textNodeArr = [];
let hintMap = {};
let alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
let range = document.createRange();
let displayHints = false;
let index = "";
let selectedIndex = 0;
let scrollWindowTop = 0;
let scrollWindowBottom = $( window ).height() + scrollWindowTop;
let selectedNode;
$(document.body).append('<div id="selectionHintMarkerContainer"></div>');
let markerClassName = "selectionHintMarker";
let markerContainer = $("#selectionHintMarkerContainer");

function makeSelectionHints(){
	console.log("making selecions");
	let i = 0,
	j = 0;

	let r = document.createRange();
	textNodeArr.forEach(function(d){
		r.selectNodeContents(d);
		let rects = r.getClientRects();
		if (rects.length > 0) {
			if(rects[0].top >= scrollWindowTop && rects[0].top <= scrollWindowBottom){
				let hint = newHint(j);
				hintMap[hint] = i;
				selectionHint(rects[0].left, rects[0].top, hint);
				j++;
			}

		}
		i++;
	});
}

function selectionHint(x, y, hint) {
	markerContainer.append('<div class="'+markerClassName+'" id="'+hint+'" style="left: '+x+'px; top: '+y+'px;">'+hint+'</div>');

}

//produces base 26 number 
	function newHint(j){
			 	let n = j;
			 	let digits = [];
			 	n += 1;
				while (n > 0){
					digits.push(alphabet[((n-1) % 26)]);
					n  = Math.floor(n/26);
					
				}

			 return digits.join("");
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
	markerContainer.empty();
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
		$("."+markerClassName).css("display", "inline");
		displayHints = true;
	}else{
		$("."+markerClassName).css("display", "none");
		displayHints = false;
	}

}

function enterSelection(){
	//if hints are showing, set selectedIndex to index, and hide hints then reset index
	if(displayHints){
		selectedIndex = hintMap[index];
		$("."+markerClassName).css("display", "none");
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

function inputAlpha(keycode) {
	if(displayHints){

		index = index + String.fromCharCode(keycode).toLowerCase();
		//show only hints that match input
		$("."+markerClassName).not('div[id ^= "'+index+'"]').css("display", "none");
		console.log(index);
	}
}

function backspace() {
	input = input.substring(0, str.length - 1);
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
		case (keycode >= 65 && keycode <= 90):

			inputAlpha(keycode);

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
	

