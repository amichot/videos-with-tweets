"use strict";


let server;

const express = require('express'),
	app = express(),
	path = require('path'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	http = require('http').Server(app),
	uuid = require('uuid'),
	request = require('request'),
	_ = require('lodash'),
	Sentiment = require('sentiment'),
	config = require('./config.json'),
	Twitter = require('twitter-node-client').Twitter;

app.use(morgan('dev'))
	.use(express.static(path.join(__dirname, 'src'))).use(bodyParser.json()).use(bodyParser.urlencoded({
		extended: true
	}));

app.route('/').get(function (req, res) {
	res.render('./src/index.html');
});

app.route('/youtube').get(function (req, res) {
	const searchURL = config.youtube.searchURL;
	let userSearch = req.query.search;
	const params = {
		key: config.youtube.key,
		q: userSearch,
		part: "snippet",
		maxResults: 10,
		type: "video"
	};

	const queryString = formatQueryParams(params);
	const url = searchURL + "?" + queryString;

	request.get(url, function (err, response, body) {
		res.send(body)
	});
});

app.route('/twitter').get(function (req, res) {
	let userSearch = req.query.search;
	var error = function (err, response, body) {
		res.send(err);
	};
	var success = function (data) {
		res.send(data);
	};
	var twitter = new Twitter({
		"consumerKey": config.twitter.consumerKey,
		"consumerSecret": config.twitter.consumerSecret,
		"accessToken": config.twitter.accessToken,
		"accessTokenSecret": config.twitter.accessTokenSecret,
		"callBackUrl": config.twitter.callBackUrl
	});

	twitter.getSearch({
		'q': userSearch,
		'count': 100
	}, error, success);
});



app.route('/youtubeComments').get(function (req, res) {
	const commentsURL = "https://www.googleapis.com/youtube/v3/commentThreads";
	let vidId = req.query.vidId
	const param = {
		part: "snippet\%2Creplies",
		maxResults: 100,
		textFormat: "plainText",
		videoId: vidId,
		fields: "items(replies\%2Fcomments\%2Fsnippet\%2FtextOriginal\%2Csnippet\%2FtopLevelComment\%2Fsnippet\%2FtextOriginal)",
		key: config.youtube.key
	};

	const queryString = formatCommentParams(param);
	const url = commentsURL + "?" + queryString;


	request.get(url, function (err, response, body) {
		let positive = 0;
		let neutral = 0;
		let negative = 0;
		let sentiment = new Sentiment();
		body = JSON.parse(body)
		body.items.forEach(function (comment) {
			let commentText = comment.snippet["topLevelComment"]["snippet"].textOriginal
			let result = sentiment.analyze(commentText)
			if (result.score > 0) {
				positive += 1;
			} else if (result.score === 0) {
				neutral += 1;
			} else if (result.score < 0) {
				negative += 1
			}

		})
		let totalComments = positive + neutral + negative;
		let positivePercent = Math.round(positive / totalComments * 100);
		let neutralPercent = Math.round(neutral / totalComments * 100);
		let negativePercent = Math.round(negative / totalComments * 100);
		let commentsPercentage = [positivePercent, neutralPercent, negativePercent]
		body.commentsPercentage = commentsPercentage;


		res.send(body)
	})
})

function formatCommentParams(params) {
	const queryItems = Object.keys(params).map(
		key => `${key}=${params[key]}`
	);
	return queryItems.join("&");
}

server = http.listen(process.env.PORT || 1738, process.env.IP || "0.0.0.0", function () {
	var addr = server.address();
	console.log("Server listening at", addr.address + ":" + addr.port);
});

function formatQueryParams(params) {
	const queryItems = Object.keys(params).map(
		key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
	);
	return queryItems.join("&");
}
