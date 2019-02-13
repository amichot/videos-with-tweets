# Videos with Sentimental Comments and Tweets


## Links
* [Live App](https://amichot.github.io/videoswithtweets)
* [Github Repo](https://github.com/amichot/videoswithtweets)

## App Photos
### Home Page
![Home Page](https://i.imgur.com/XHtiCdx.png "Home Page")
### Results Page
![Results Page](https://i.imgur.com/hGeH8Jf.png "Results Page")
### Video Page
![Video Page](https://i.imgur.com/KPBfumi.png "Video Page")

## Description
  At the home page the user searches for a YouTube video exactly as he would on Youtube. The results page is also similar,
The users search will return a list of related videos. After the user finds and clicks the video he wants the app returns
the YouTube video, a summary of the video's comments sentiment, and tweets related to the user's search.
  The app uses a sentiment library (AFINN-based sentiment analysis for Node.js) to go through each word in the comments and
asigns it a value. If the comment has an overall positive value it counts as a positive comment. If it has a negative value
it counts as a negative comment. The app sums up the results and returns the user a percentage of positive comments, neutral
comments, and negative comments.
  The tweets presented at the bottom of the page also use the sentiment library. The user's original search is used on Twitter's
API. The results are put into the sentiment library to return the most positive tweets, most negative tweets, and tweets by
tweeters with the most followers (famous tweets).

## Technologies Used

* HTML
* CSS
* Javascript
* jQuery
* Node JS

## Library Used

[sentiment library](https://github.com/thisandagain/sentiment)
