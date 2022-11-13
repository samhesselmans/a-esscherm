//This is the main javascript file for the new TV screen. This file handles most of the setup and timings


//Arrays to store the activities and AMO posters
var acts = [];
var amoPosters = [];

var lastUpdated;
var icsUrl = "https://www.a-eskwadraat.nl/Activiteiten/Agenda/ics"
var hefInfoUrl = "https://lustrum.a-eskwadraat.nl/acthook.php"

//Retrieve the URL paramters
var url = new URL(window.location.href);
var aantalActs = url.searchParams.get("aantalActs");
var timePerAct = url.searchParams.get("timePerAct");
var actUpdateTime = url.searchParams.get("actUpdateTime");
var localTest = url.searchParams.get("localTest");
var actsPerAmo = url.searchParams.get("actsPerAmo");
var fallbackPoster = "default.png"

//HTML tags used
const posterId = "container--poster"
const actId = "container--events"
const highlightId = "container--highlight"
const amoId = "";
const activeClass = "active";
const blurClass = "blur"


//Parse the url parameters
if (aantalActs == null)
	aantalActs = 4;
if (timePerAct == null)
	timePerAct = 10000;
if (actUpdateTime == null)
	actUpdateTime = 600000;
if (localTest) {
	icsUrl = "ics.ics"
	hefInfoUrl = "test.txt"
}

//Update Activities with callback
function updateActiviteiten(call) {
	lastUpdated = new Date();
	console.log("Updating")
	//Get the ical from the aes website and parse for the activities
	$.get(icsUrl, function (data) {
		acts = []
		var iData = data;
		var jcalData = ICAL.parse(data);
		var comp = new ICAL.Component(jcalData);
		var actsical = comp.getAllSubcomponents("vevent");
		//Add acts to act list
		for (var i = 0; i < actsical.length; i++) {

			acts.push(new activiteit(actsical[i]))
		}

		//Callback
		call()
	});
}




function getAMO() {
	//The supported indexes of featured posters
	var exts = ["pdf", "png", "jpg", "jpeg", "gif"]
	$.get(window.location.pathname + "Posters/", function (data) {
		var pagedocument = $(data);
		var i = 0
		amoPosters = []
		for (var index = 0; index < exts.length; index++) {

			//Search for links ending in the given exstensions
			pagedocument.find('a[href$=".' + exts[index] + '"').each(function () {
				var pdfName = $(this).text();
				var pdfUrl = $(this).attr('href');
				var img = document.createElement("img")


				//Setup the image
				img.src = "Posters/" + pdfUrl;
				img.hidden = true;
				img.classList.add("poster")
				img.id = "amo" + i;

				amoPosters.push(img);
				var imgCont = document.getElementById(posterId)
				imgCont.appendChild(img);
				i++;
			})
		}
		//If actsPerAmo was not set using parameters set it to once per all activities
		if (!actsPerAmo)
			actsPerAmo = aantalActs;
	})
}




//Download file from given uri
function downloadURI(uri, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}

//Create an element with given text
function createel(text, el) {
	var a = document.createElement(el);
	a.textContent = text;
	return a;
}


//Filling the act div with activities
function fillacts() {

	//Remove the current acts
	var cont = document.getElementById(actId);
	var imgCont = document.getElementById(posterId);
	cont.innerHTML = "";
	imgCont.innerHTML = "";

	//Load the activities
	for (var i = 0; i < aantalActs; i++) {

		//Add the act and act poster
		var div = acts[i].maakactdiv("act" + i);
		var img = acts[i].maakimg("img" + i);
		img.classList.add("poster")


		img.onerror = function () {
			//The image was not an valid image, change to default poster
			this.src = fallbackPoster;
		};

		cont.appendChild(div);
		imgCont.appendChild(img);
		if (i == currentAct) {
			img.hidden = false;
			div.classList.add(activeClass);
			timeSinceLastAmo = 1;
		}
	}
	updating = false;
}
var aantalacts = 0
var updating = false;
var timeLastUpdated = 0;

function updateAll() {
	if (Date.now() - timeLastUpdated > actUpdateTime) {
		updating = true;
		timeLastUpdated = Date.now();
		updateActiviteiten(fillacts);
		getAMO();
	}

}

//Starts the changing of acts and other posters
function startSlideShow() {


	var timer = setInterval(changeAct, timePerAct);
	//var updateTimeing = setInterval(updateAll,actUpdateTime);
}

var currentAct = 0
var currentAmo = 0;
var timeSinceLastAmo = 0;

function hideCurrentImmages() {
	//Get the current immages
	var img = document.getElementById("img" + currentAct)
	var imgamo = document.getElementById("amo" + currentAmo)
	var div = document.getElementById("act" + currentAct)

	//Remove active from activeClass
	div.classList.remove(activeClass)

	//Hide them
	if (img != undefined)
		img.hidden = true;
	if (imgamo != undefined)
		imgamo.hidden = true;

}
//Creates the highlight popup and blur
function changeVisual(blur) {
	var actCont = document.getElementById(actId)
	var highlightCont = document.getElementById(highlightId);
	if (!blur) {
		actCont.style.filter = ""
		actCont.style.webkitFilter = ""

		highlightCont.style.opacity = "";
		highlightCont.style.height = "";
	} else {
		//actCont.style.filter = "url(data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' ><filter id='svgMask'><feGaussianBlur stdDeviation='8' /></filter></svg>#svgMask);"
		actCont.style.filter = "blur(8px)"
		//actCont.style.webkitFilter = "blur(8px);  -moz-filter: blur(8px); -o-filter: blur(8px);  -ms-filter: blur(8px)"
		actCont
		highlightCont.style.opacity = 1;
		highlightCont.style.height = "12em";
	}
}

function nextAMO() {
	currentAmo++;
	var div = document.getElementById(actId)

	var img = document.getElementById("amo" + currentAmo)
	if (img == undefined) {
		currentAmo = 0
		img = document.getElementById("amo" + currentAmo)
	}
	changeVisual(true);
	img.hidden = false;
	timeSinceLastAmo = 0;
}

function nextAct() {
	currentAct++;
	var img = document.getElementById("img" + currentAct)

	if (img == undefined) {
		//We had all the acts, we change back to the first one
		currentAct = 0
		img = document.getElementById("img" + currentAct)
	}
	try {
		var div = document.getElementById("act" + currentAct)
		div.classList.add(activeClass)
		changeVisual(false);
		img.hidden = false;
		timeSinceLastAmo++;
	}
	catch (error) {
		console.log("No acts")
	}
}

function changeAct() {

	updateAll();

	if (updating)
		return

	if (timeSinceLastAmo < actsPerAmo && aantalActs > 0 || amoPosters.length == 0) {
		hideCurrentImmages();
		nextAct();
	}
	else {
		//We change the activvity to an AMO poster.
		hideCurrentImmages();
		nextAMO();

	}
}

function GetBannerInfo() {
	$.getJSON(hefInfoUrl, function (data) {
		var date = document.getElementById('HEF-date')
		var name = document.getElementById('HEF-name')
		var time = document.getElementById('HEF-time')
		var timer = document.getElementById('HEF-timer')

		date.innerHTML = data.date
		name.innerHTML = data.name
		time.innerHTML = data.time
		timer.innerHTML = data.timer
	});
}

var timer;
$(function () {
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
