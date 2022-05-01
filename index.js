var projects_offset_top = 0; 
var projects_div_height = 0; 
var projects_offset_bottom = 0; 
var scroll_from_top = 0; 
var window_size = 0;

window.addEventListener('scroll', function(){
    setScrollHeights();
    if(scroll_from_top >= projects_offset_top - window_height &&
	scroll_from_top <= projects_offset_bottom){
	//add parallax animation logic here
	console.log('page scroll in area');
}
    else{
	console.log('page scroll not in area');
	//set background top to 0
    }
}); 
window.addEventListener('resize', function(){
    setScrollHeights();
}); 
function setScrollHeights(){
	projects_offset_top = document.getElementById('projects').offsetTop; 
	projects_div_height = document.getElementById('projects').clientHeight;
	projects_offset_bottom = projects_offset_top + projects_div_height; 
	scroll_from_top = document.getElementsByTagName('html')[0].scrollTop;
	window_height = window.innerHeight; 
}
function scrollToTop(){
	document.getElementByTagName('html')[0].scroll(0,0); 
}
