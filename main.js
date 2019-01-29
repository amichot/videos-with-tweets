"use strict";

const apiKey = "AIzaSyCyPfvlKfIkWknSdpqQIGjKPOpVcT6opdg";
const searchURL = "https://www.googleapis.com/youtube/v3/search";
let userSearch = "";

function video(videoId) {
	$("#video-results").append(`
 <iframe title="YouTube video player" class="youtube-player" type="text/html" 
width="640" height="390" src="https://www.youtube.com/embed/${videoId}"
frameborder="0" allowFullScreen></iframe>
 `);
}

function displayVideo(videoId) {
	$("#search-results").remove();
	$("main").append(
		`<section id="video-results"><header><nav></nav></header></section>`
	);
	video(videoId);
	createNavButton("Back");
	createNavButton("Home");
}

function clickResult() {
	$("#list-results").on("click", "li", function (event) {
		let videoId = event.currentTarget;
		videoId = $(videoId).attr("id");
		displayVideo(videoId);
	});
}

function watchBackButton(userSearch) {
	$("input[value='Back']").on("click", function (event) {
		$("#video-results").empty();
		buildYoutubeRequest(userSearch);
	});
}

function watchHomeButton() {
	$("input[value='Home']").on("click", function (event) {
		$("section").remove();
		$("body").removeAttr("id");
		$("main").append(`
    <section id="home">
    <header role="banner">
      <h1>Videos with Tweets</h1>
    </header>
    <form id="js-form">
      <label for="Search">Search</label>
      <input type="text" name="Search" id="js-search">

      <input type="submit" value="Search">
    </form>
    <p id="error-message"></p>
  </section>
    `);
	});
}

function createNavButton(value) {
	$("nav").append(`<input type="button" value=${value}>`);
	if (value === "Back") {
		watchBackButton(userSearch);
	} else {
		watchHomeButton();
	}
}

function displayResults(responseJson) {
	// Remove Home Screen
	$("#home").remove();
	// Change html body's CSS
	$("body").attr("id", "body-results");
	// ADD Section, Header, and Return Home Button
	$("main").append(
		`<section id="search-results"><header><nav></nav><h1>Select Youtube Video</h1></header></section>`
	);
	createNavButton("Home");
	// Add Search Results Content
	$("#search-results").append(`<ul id="list-results"></ul>`);
	for (let i = 0; i < responseJson.items.length; i++) {
		$("#list-results").append(
			`<li id="${responseJson.items[i].id.videoId}"><img src='${
				responseJson.items[i].snippet.thumbnails.default.url
			}'>
      <h2>${responseJson.items[i].snippet.title}</h2>
      <p>${responseJson.items[i].snippet.description}</p>
      </li>`
		);
	}
	// Get Video Clicked
	clickResult();
}

function formatQueryParams(params) {
	const queryItems = Object.keys(params).map(
		key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
	);
	return queryItems.join("&");
}

function buildYoutubeRequest(query) {
	console.log(query);
	const params = {
		key: apiKey,
		q: query,
		part: "snippet",
		maxResults: 10,
		type: "video"
	};
	const queryString = formatQueryParams(params);
	const url = searchURL + "?" + queryString;

	fetch(url)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.json());
		})
		.then(responseJson => displayResults(responseJson))
		.catch(err => {
			$("#error-message").text(`Something went wrong: ${err.message}`);
		});
}

function watchForm() {
	$("#js-form").on("submit", function (event) {
		event.preventDefault();
		userSearch = $("#js-search").val();
		buildYoutubeRequest(userSearch);
	});
}

watchForm();
