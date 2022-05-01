var projects_offset_top, projects_div_height, 
projects_offset_bottom, scroll_from_top, 
window_size, window_height;

setScrollHeight(); 
setLengthsOnResize();

window.addEventListener('scroll', function(){
    setScrollHeight();

    if(scroll_from_top >= projects_offset_top - window_height &&
	scroll_from_top <= projects_offset_bottom){

	var bkg_offset = scroll_from_top - projects_offset_top * -1;
	document.getElementById('projects').style['background-position-y'] = bkg_offset + "px"; 
    }
    else{
	document.getElementById('projects').style['background-position-y'] = "0px";
    }
}); 

window.addEventListener('resize', function(){
    setLengthsOnResize();
});

function setScrollHeight(){
	scroll_from_top = document.getElementsByTagName('html')[0].scrollTop;
}
function setLengthsOnResize(){
	projects_offset_top = document.getElementById('projects').offsetTop; 
	projects_div_height = document.getElementById('projects').clientHeight;
	projects_offset_bottom = projects_offset_top + projects_div_height; 
	window_height = window.innerHeight;

}
function scrollToTop(){
	document.getElementByTagName('html')[0].scroll(0,0); 
}
