var projects_offset_top, projects_div_height,
	projects_offset_bottom, scroll_from_top,
	window_size, window_height,
	skills_offset_top, skills_div_height,
	skills_offset_bottom;
	
setScrollHeight();
setLengthsOnResize();
document.getElementsByClassName('current-year')[0].innerHTML = currentYear();
window.addEventListener('scroll', function () {
	setScrollHeight();
	projectsBkgScroll();
	skillsProgressBarAnimations();
});
window.addEventListener('resize', function () {
	setLengthsOnResize();
});
function skillsProgressBarAnimations() {
	var lowPro = document.getElementsByClassName('progress-bar__low-animate');
	var lowMediumPro = document.getElementsByClassName('progress-bar__low-medium-animate');
	var mediumPro = document.getElementsByClassName('progress-bar__medium-animate');
	var mediumHighPro = document.getElementsByClassName('progress-bar__medium-high-animate');
	var highPro = document.getElementsByClassName('progress-bar__high-animate');

	if (scroll_from_top >= skills_offset_top - window_height) {
		if (lowPro[0] == undefined) {
			var lowProgressBars = document.getElementsByClassName('progress-bar__low');
			for (var a = 0; a <= lowProgressBars.length - 1; a++) {
				lowProgressBars[a].className = 'progress-bar__low progress-bar__low-animate';
			}
		}
		if (lowMediumPro[0] == undefined) {
			var lowMediumProgressBars = document.getElementsByClassName('progress-bar__low-medium');
			for (var a = 0; a <= lowMediumProgressBars.length - 1; a++) {
				lowMediumProgressBars[a].className = 'progress-bar__low-medium progress-bar__low-medium-animate';
			}
		}
		if (mediumPro[0] == undefined) {
			var mediumProgressBars = document.getElementsByClassName('progress-bar__medium');
			for (var a = 0; a <= mediumProgressBars.length - 1; a++) {
				mediumProgressBars[a].className = 'progress-bar__medium progress-bar__medium-animate';
			}
		}

		if (mediumHighPro[0] == undefined) {
			var mediumHighProgressBars = document.getElementsByClassName('progress-bar__medium-high');
			for (var a = 0; a <= mediumHighProgressBars.length - 1; a++) {
				mediumHighProgressBars[a].className = 'progress-bar__medium-high progress-bar__medium-high-animate';
			}
		}
		if (highPro[0] == undefined) {
			var highProgressBars = document.getElementsByClassName('progress-bar__high');
			for (var a = 0; a <= highProgressBars.length - 1; a++) {
				highProgressBars[a].className = 'progress-bar__high progress-bar__high-animate';
			}
		}
	}
	else {
		while (lowPro.length > 0) { lowPro[0].className = 'progress-bar__low'; }
		while (lowMediumPro.length > 0) { lowMediumPro[0].className = 'progress-bar__low-medium'; }
		while (mediumPro.length > 0) { mediumPro[0].className = 'progress-bar__medium'; }
		while (mediumHighPro.length > 0) { mediumHighPro[0].className = 'progress-bar__medium-high'; }
		while (highPro.length > 0) { highPro[0].className = 'progress-bar__high'; }
	}
}

function projectsBkgScroll() {
	if (scroll_from_top >= projects_offset_top - window_height &&
		scroll_from_top <= projects_offset_bottom) {
		var bkg_offset = scroll_from_top - projects_offset_top * -1;
		document.getElementById('projects').style['background-position-y'] = bkg_offset + "px";
	}
	else {
		document.getElementById('projects').style['background-position-y'] = "0px";
	}
}

function setScrollHeight() {
	scroll_from_top = document.getElementsByTagName('html')[0].scrollTop;
}
function setLengthsOnResize() {
	projects_offset_top = document.getElementById('projects').offsetTop;
	projects_div_height = document.getElementById('projects').clientHeight;
	projects_offset_bottom = projects_offset_top + projects_div_height;
	skills_offset_top = document.getElementById('skills').offsetTop;
	skills_div_height = document.getElementById('skills').clientHeight;
	skills_offset_bottom = skills_offset_top + skills_div_height;
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
	if (number >= 1 && number <= 3) {
		m = m.replace(progressLength, '<div class="progress-bar__low"></div>');
	}
	if (number >= 4 && number <= 5) {
		m = m.replace(progressLength, '<div class="progress-bar__low-medium"></div>');
	}
	if (number >= 6 && number <= 7) {
		m = m.replace(progressLength, '<div class="progress-bar__medium"></div>');
	}
	if (number >= 8 && number <= 9) {
		m = m.replace(progressLength, '<div class="progress-bar__medium-high"></div>');
	}
	if (number >= 10) {
		m = m.replace(progressLength, '<div class="progress-bar__high"></div>');
	}

	return m;
}
