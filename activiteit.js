//Used to create date strings
var dagen = ["Zo","Ma","Di","Wo","Do","Vr","Za"]
var maanden = ["jan","feb","mrt","apr","mei","jun","jul","aug","sept","okt","nov","dec"]

class activiteit{

	constructor(data){
		this.naam = data.getFirstPropertyValue("summary");
		this.start = data.getFirstPropertyValue("dtstart");
		this.end = data.getFirstPropertyValue("dtend");
		this.locatie = data.getFirstPropertyValue("location");
		this.posterurl = data.getFirstPropertyValue("url") + "/Actposter";
	}

	getDateStartString(){
		return dagen[this.start.dayOfWeek() - 1] + " " + this.start.day + " " + maanden[this.start.month -1];
	}
	getTimeStartString(){
		var h = (this.start.hour + 1).toString()
		if(h.length ==1){
			h = 0+h
		}
		var m = this.start.minute.toString()
		if(m.length ==1){
			m = 0+m
		}
		return h + ":"+m
	}

	maakactdiv(id){
	var div = document.createElement("div");
	div.id = id;
	div.classList.add("event");
	var maindiv = document.createElement("div");
	maindiv.classList.add("event--main");
	var datediv = document.createElement("div");
	datediv.classList.add("event--date");

	maindiv.appendChild(createel(this.naam,"h1"))
	maindiv.appendChild(createel(this.locatie,"p"))
	datediv.appendChild(createel(this.getDateStartString(),"h3"))
	datediv.appendChild(createel("","span"))
	datediv.appendChild(createel(this.getTimeStartString(),"h3"))
	div.appendChild(maindiv)
	div.appendChild(datediv)
	return div
	}
	maakimg(id){
		var img = document.createElement("img")
		img.src = this.posterurl
		img.id = id
		img.hidden = true;
		return img
	}

}
