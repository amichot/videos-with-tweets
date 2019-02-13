let vidId = "";
let userSearch = ""


function postTweets(responseJson) {
	console.log(responseJson)
	$("#video-results").append(`
	<h2>Related Tweets</h2>
		<ul id="popular_tweets"></ul>
	`)
	$("#popular_tweets").append(`
			<li class="positiveTweet"> Positive Tweet <p>${responseJson.mostPositive.text}<span>${responseJson.mostPositive.screenName}</span></p></li>
			<li class="negativeTweet">Negative Tweet <p>${responseJson.mostNegative.text}<span>${responseJson.mostNegative.screenName}</span></p></li>
			<li class="positiveTweet">Positive Tweet <p>${responseJson.secondMostPositive.text}<span>${responseJson.secondMostPositive.screenName}</span></p></li>
			<li class="negativeTweet">Negative Tweet <p>${responseJson.secondMostNegative.text}<span>${responseJson.secondMostNegative.screenName}</span></p></li>
			<li class="famousTweet">Famous Tweet <p>${responseJson.mostFamous.text}<span>${responseJson.mostFamous.screenName}</span></p></li>
			<li class="famousTweet">Famous Tweet <p>${responseJson.secondMostFamous.text}<span>${responseJson.secondMostFamous.screenName}</span></p></li>
		`)
}

function buildTwitterRequest(userSearch) {
	console.log("what the " + userSearch)
	fetch(`/twitter?search=${userSearch}`)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.json());
		})
		.then(responseJson => postTweets(responseJson))
		.catch(err => {
			$("#error-message").text(`Something went wrong: ${err.message}`);
		});
}

function displayCommentsSentiment(responseJson) {
	let commentsPercentage = responseJson.commentsPercentage;
	$("#video-results").append(`
	<h2>Comments</h2>
		<ul id="public-sentiment">
			<li class="positive"><span>${commentsPercentage[0]}\%</span></li>
			<li class="neutral"><span>${commentsPercentage[1]}\%</span></li>
			<li class="negative"><span>${commentsPercentage[2]}\%</span></li>
		</ul>
	`)
	buildTwitterRequest(userSearch)
}

function getComments() {
	fetch(`/youtubeComments?vidId=${vidId}`)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			throw new Error(response.json());
		})
		.then(responseJson => displayCommentsSentiment(responseJson))
		.catch(err => {
			$("#error-message").text(`Something went wrong: ${err.message}`);
		});
}

function video(videoId) {
	$("#video-results").append(`<div>
 <iframe title="YouTube video player" class="youtube-player" type="text/html" 
width="640" height="390" src="https://www.youtube.com/embed/${videoId}"
frameborder="0" allowFullScreen></iframe>
 </div>`);
}


//displays video page to view video clicked
function displayVideo(videoId) {
	$("main").html(
		`<section id="video-results"><header><nav></nav></header></section>`
	);
	video(videoId);
	$("#results").removeClass("hide", "Remove");
	watchBackButton(userSearch);
	getComments();
}

function watchBackButton(userSearch) {
	$("input[value='Back']").on("click", function (event) {
		$("#video-results").empty();
		buildYoutubeRequest(userSearch);
		$("#results").addClass("hide");
	});
}

function clickResult() {
	$("#list-results").on("click", "li", function (event) {
		vidId = event.currentTarget;
		vidId = $(vidId).attr("id");
		displayVideo(vidId);
	});
}

function displayResults(responseJson) {
	// Change html body's CSS
	$("body").attr("id", "body-results");
	// ADD Section, Header, and Return Home Button
	$("main").html(
		`<section id="search-results"><header><h1>Select Youtube Video</h1></header></section>`
	);
	$("#js-navlist").removeClass("hide");
	// Add Search Results Content
	$("#search-results").append(`<ul id="list-results"></ul>`);
	for (let i = 0; i < responseJson.items.length; i++) {
		$("#list-results").append(
			`<li id="${responseJson.items[i].id.videoId}"><img src='${
				responseJson.items[i].snippet.thumbnails.default.url
			}'>
      <h2>${responseJson.items[i].snippet.title}</h2>
      </li>`
		);
	}
	clickResult();
}

function renderHome() {
	$("main").html(`
    <section id="home">
    <header role="banner">
			<h1>Videos with Sentimental Comments and Tweets</h1>
			<p>
				Search for your favorite Youtube video and receive a summary of the comments sentiment along with
				related tweets!
			</p>
    </header>
    <form id="js-form">
      <label for="Search">Search</label>
      <input type="text" name="Search" id="js-search">

      <input type="submit" value="Search">
    </form>
    <p id="error-message"></p>
  </section>
    `);
}


function watchHomeButton() {
	$("input[value='Home']").on("click", function (event) {
		$("body").removeAttr("id");
		renderHome();
		watchForm();
		$("#js-navlist").addClass("hide");
	});
}

function buildYoutubeRequest(userSearch) {
	fetch(`/youtube?search=${userSearch}`)
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
		buildYoutubeRequest(userSearch)
	});
}

function launchHomeScreen() {
	watchHomeButton()
	$('#home').trigger('click')
	watchForm()
}

launchHomeScreen()