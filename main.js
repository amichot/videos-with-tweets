'use strict'

function video() {
  $(data.settings.contentData).each(function (index, currentData) {
    var html = '<li style="position:relative;float: left">';
    html += '<div id="player"></div>'
    html += "<script type='text/javascript'>"
    html += "var player; "
    html += "var tag = document.createElement('script');"
    html += "tag.src = 'https://www.youtube.com/iframe_api';"
    html += "var firstScriptTag = document.getElementsByTagName('script')[0];"
    html += "firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);"
  
    html += "function onYouTubeIframeAPIReady() { "
    html += "   player = new YT.Player('player', "
    html += "       {height: '390', width: '640',  videoId: '" + $.trim(currentData.images.zoom) + "', "
    html += "       playerVars: {'autoplay':'0','rel':'0','control':'0','fs':'1'}, "
    html += "       events: {'onReady': onPlayerReady}}"
    html += "   ); "
    html += "}; "
    html += "function onPlayerReady(event) { /* your stuff here */ }</script>";
    html += '</li>';
   containerListImage.append(html);
   var containerImage = containerListImage.children().last();
  $('#home').append(containerImage);
})
}

function watchForm() {
  $("#js-form").on("submit", function(event) {
    event.preventDefault();
    $("#home").empty();
    const userSearch = $("#js-search").val()
    //youtubeCall(userSearch);
    video();
  });
}



watchForm();