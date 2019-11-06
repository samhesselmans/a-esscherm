
$(function(){
	setInterval(updateTime,500)


})
	function updateTime(){
	var today = new Date();
	var time = "";
	var h = today.getHours().toString();
	var m = today.getMinutes().toString();
	
	if(h.length ==1 )
		h = "0"+h;
	if(m.length ==1)
		m = "0"+m
	
	time = h+":"+m;
	var t = document.getElementById("text--clock");
	t.textContent = time;
}
