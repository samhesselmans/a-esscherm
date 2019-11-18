//This is the main javascript file for the new TV screen. This file handles most of the setup and timings


//Arrays to store the activities and AMO posters
var acts = [];
var amoPosters =[];

var lastUpdated;
var icsUrl = "https://www.a-eskwadraat.nl/Activiteiten/Agenda/ics"
var baseUrl = "https://home.a-eskwadraat.nl/~samh/NewTVScherm/"

var url = new URL(window.location.href);
var aantalActs = url.searchParams.get("aantalActs");
var timePerAct = url.searchParams.get("timePerAct");
var actUpdateTime = url.searchParams.get("actUpdateTime");

var localTest = url.searchParams.get("localTest");

var fallbackPoster = "default.png"


const posterId = "container--poster"
const actId = "container--events"
const highlightId = "container--highlight"
const amoId = "";
const activeClass = "active";
const blurClass = "blur"


//Parse the url parameters
if(aantalActs == null)
	aantalActs = 4;
if(timePerAct == null)
	timePerAct = 10000;
if(actUpdateTime == null)
	actUpdateTime = 600000;
if(localTest)
	icsUrl = "ics.ics"

//Update Activities with callback
function updateActiviteiten(call){
	lastUpdated = new Date();
	console.log("Updating")
	$.get( icsUrl, function( data ) {
		var iData = data;
		var jcalData = ICAL.parse(data);
		var comp = new ICAL.Component(jcalData);
		var actsical = comp.getAllSubcomponents("vevent");
		//Add acts to act list
		for(var i =0; i< actsical.length ; i++){

			acts.push(new activiteit(actsical[i]))
		}
		console.log(acts.length)
		console.log(call)
		//Callback
		call()
	});
}




function getAMO(){

	var exts = ["pdf","png","jpg","gif"]
	console.log(baseUrl + "Posters")
	$.get(window.location.pathname + "Posters/",function(data){
	var pagedocument = $(data);
		var i =0
		for(var index = 0; index < exts.length; index ++){
			pagedocument.find('a[href$=".' + exts[index] + '"').each(function() {
				var pdfName = $(this).text();
				var pdfUrl = $(this).attr('href');
				var img = document.createElement("img")

				console.log(pdfUrl);

				//Setup the image
				img.src =  "Posters/" + pdfUrl;
				img.hidden = true;
				img.classList.add("poster")
				img.id = "amo" + i;

				amoPosters.push(img);
				var imgCont = document.getElementById(posterId)
				imgCont.appendChild(img);
				i++;
			})
		}

    actsPerAmo = aantalActs / amoPosters.length;
	})
}





function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}


function createel(text,el){
	var a = document.createElement(el);
	a.textContent = text;
	return a;
}



function fillacts(){
	console.log("Filling " + aantalActs + " acts")
	var cont = document.getElementById(actId);
	var imgCont = document.getElementById(posterId)
	for(var i =0; i< aantalActs;i++){

		//Add the act and act poster
		var div = acts[i].maakactdiv("act"+i);
		var img = acts[i].maakimg("img"+i);
		img.classList.add("poster")


		img.onerror = function () {
			//The image was not an valid image, change to default poster
			this.src = fallbackPoster;
		};

		cont.appendChild(div);
		imgCont.appendChild(img);
	}

}
var aantalacts = 0

function updateAll(){
	var cont = document.getElementById(actId);
	var imgCont = document.getElementById(posterId);
	cont.innerHTML = "";
	imgCont.innerHTML = "";
	console.log("updating all")
	updateActiviteiten(fillacts);
	getAMO();
}

//Starts the changing of acts and other posters
function startSlideShow(){
	var timer = setInterval(changeAct,timePerAct);
	var updateTimeing = setInterval(updateAll,actUpdateTime);
}

var currentAct = 0
var currentAmo = 0;
var prevWasAmo = false;
var timeSinceLastAmo = 0;
var actsPerAmo = 3;

function hideCurrentImmages(){
	//Get the current immages
	var img = document.getElementById("img"+currentAct)
	var imgamo = document.getElementById("amo"+currentAmo)
	var div = document.getElementById("act"+currentAct)

	//Remove active from activeClass
	div.classList.remove(activeClass)

	//Hide them
	if(img != undefined)
		img.hidden = true;
	if(imgamo != undefined)
		imgamo.hidden = true;

}
//Creates th =e highligh popup and blur
function changeVisual(){
	var actCont = document.getElementById(actId)
	var highlightCont = document.getElementById(highlightId);
	if(highlightCont.style.opacity != "" && actCont.style.filter != ""){
		actCont.style.filter = ""
		actCont.style.webkitFilter = ""

		highlightCont.style.opacity = "";
		highlightCont.style.height= "";
	}else{

		actCont.style.filter += "url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' ><filter id='svgMask'><feGaussianBlur stdDeviation='8' /></filter></svg>#svgMask);"
		actCont.style.webkitFilter = "blur(8px);  -moz-filter: blur(8px); -o-filter: blur(8px);  -ms-filter: blur(8px)"

		highlightCont.style.opacity = 1;
		highlightCont.style.height= "12em";
	}
}

function nextAMO(){
	currentAmo ++;
	var div = document.getElementById(actId)

	var img = document.getElementById("amo"+currentAmo)
	if(img == undefined){
		currentAmo = 0
		img = document.getElementById("amo"+currentAmo)
	}
	changeVisual();
	img.hidden =false;
	timeSinceLastAmo = 0;
}

function nextAct(){
		currentAct ++;
		var img = document.getElementById("img"+currentAct)

		if(img == undefined){
			//We had all the acts, we change back to the first one
			currentAct = 0
			img = document.getElementById("img"+currentAct)
		}
		try{
			var div = document.getElementById("act"+currentAct)
			div.classList.add(activeClass)
			changeVisual();
			img.hidden =false;
			timeSinceLastAmo ++;
		}
		catch(error){
			console.log("No acts")
		}
}

function changeAct(){

	if(timeSinceLastAmo < actsPerAmo && aantalActs > 0 || amoPosters.length == 0){
		console.log("changing act")
		hideCurrentImmages();
		nextAct();
	}
	else{
		//We change the activvity to an AMO poster.
		console.log("changing act to amo")
		hideCurrentImmages();
		nextAMO();

	}
}

var timer;
$(function(){
	//Get and clear the needed containers
	var cont = document.getElementById(actId);
	var imgCont = document.getElementById(posterId);
	cont.innerHTML = "";
	imgCont.innerHTML = "";

	//Add the items
	updateAll();

	//Start the changing
	startSlideShow()
	console.log("starting")

})
