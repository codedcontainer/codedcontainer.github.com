var projects_offset_top, projects_div_height,
	projects_offset_bottom, scroll_from_top,
	window_size, window_height;

setScrollHeight();
setLengthsOnResize();
document.getElementsByClassName('current-year')[0].innerHTML = currentYear();

window.addEventListener('scroll', function () {
	setScrollHeight();

	if (scroll_from_top >= projects_offset_top - window_height &&
		scroll_from_top <= projects_offset_bottom) {

		var bkg_offset = scroll_from_top - projects_offset_top * -1;
		document.getElementById('projects').style['background-position-y'] = bkg_offset + "px";
	}
	else {
		document.getElementById('projects').style['background-position-y'] = "0px";
	}
});

window.addEventListener('resize', function () {
	setLengthsOnResize();
});

function setScrollHeight() {
	scroll_from_top = document.getElementsByTagName('html')[0].scrollTop;
}
function setLengthsOnResize() {
	projects_offset_top = document.getElementById('projects').offsetTop;
	projects_div_height = document.getElementById('projects').clientHeight;
	projects_offset_bottom = projects_offset_top + projects_div_height;
	window_height = window.innerHeight;
}
function scrollToTop() {
	document.getElementByTagName('html')[0].scroll(0, 0);
}
function currentYear() {
	return new Date().getFullYear();
}
function yearsExperienceJson(callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			return callback(JSON.parse(this.response));
		}
	};
	xhttp.open("GET", 'yearsExperience.json', true);
	xhttp.send();
}
yearsExperienceJson(function (jsonResponse) {

	function range(obj) {
		var isRange = obj.indexOf("-") != -1;
		if (isRange) {
			var isCurrent = obj.indexOf('-') == obj.length - 1;
			if (isCurrent) {
				var yearCount = new Date().getFullYear() - parseInt(obj.slice(0, obj.length - 1));
				return yearCount;
			}
			else {
				var yearRange = obj.split('-');
				return parseInt(yearRange[1]) - parseInt(yearRange[0]);
			}
		}
		else {
			return 1;
		}
	}

	function mapper(object) {
		var objProps = Object.keys(object);
		objProps.map(function (value) {

			if (typeof (object[value]) == "string") {
				object[value] = range(object[value]);
			}
			else {
				mapper(object[value]);
				if (object[value].length == 1) {
					object[value] = object[value][0];
				}
				else if (object[value].length > 1 && isNaN(object[value])) {
					object[value].map(function (value, index) {
						if (value > 1000) {
							object[index] = 1;
						}
					});
					object[value] = object[value].reduce(function (a, b) {
						return a + b;
					}, 0);
				}
				else {
					if (!isNaN(object[value])) {
						object[value] = 1;
					}
				}
			}
		});
	}
	mapper(jsonResponse);

	const source = document.getElementById('template-test').innerHTML;
	const template = Handlebars.compile(source);
	var html = template(jsonResponse);

	var yearsExperienceRegEx = new RegExp('.*years-experience.*\n\s*.*\n\s*.*', 'gm');

	html = html.replaceAll(yearsExperienceRegEx, function (m) {
		var number = parseFloat(m.match('[0-9]+')[0]);
		var progressLength = m.match('<div.*$');
		console.log(progressLength);

		if (number > 1) {
			m = m.replace('</span>', 'years</span>');
			var progressLength = new RegExp('<div.*$');
		}
		else {
			m = m.replace('</span>', 'year</span>');
		}

		m = progressBarLength(number, m, progressLength);

		return m;
	});

	const destination = document.getElementById('skills');
	destination.innerHTML = html;
});

function progressBarLength(number, m, progressLength) {
		if( number >= 1 && number <= 3){
			m = m.replace(progressLength, '<div class="progress-bar__low"></div>');
			}
		if( number >= 4 && number <= 5){
			m = m.replace(progressLength, '<div class="progress-bar__low-medium"></div>');
			}
		if( number >= 6 && number <= 7){
			m = m.replace(progressLength, '<div class="progress-bar__medium"></div>');
			}
		if( number >= 8 && number <= 9){
			m = m.replace(progressLength, '<div class="progress-bar__medium-high"></div>');
			}
		if( number >= 10){
			m = m.replace(progressLength, '<div class="progress-bar__high"></div>');
			}
	
	return m;
}

