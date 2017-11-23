'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');
var _ = require('underscore');

//Helper function to extract additional information for heatmap data structure
function getDateDetails(detailsArray) {
    var details = [];
    for(var i = 0; i < detailsArray.length; i ++){
        details.push(detailsArray[i]["details"])
    }
    return details;
}

/* GET home page. */
//Requests all tweets from back-end application and formats the data for heatmap
router.get('/', function(req, res, next) {
    
    request('http://trumpgret-araizaga-yael.c9users.io/tweets', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var tweets = JSON.parse(body);
            
            var tweetData = [];
            //Obtains all tweets and pre-formats as heatmap object
            for(var i = 0; i < tweets.length; i++){
                var data = {};
                data["date"] = tweets[i][1].split(" ")[0];
                data["total"] = 1;
                data["details"] = {"name": String(tweets[i][0]), "date": tweets[i][1], "value": 1 };
                tweetData.push(data);
            }
            //Groups tweets by day and calculates total value of tweets per day
            var groupedArray = _.groupBy(tweetData, 'date');
            var dateKeys = _.keys(groupedArray);
            var finalData = [];
            for(var j = 0; j <dateKeys.length; j++){
                var data = {};
                data["date"] = dateKeys[j];
                data["total"] = groupedArray[dateKeys[j]].length;
                data["details"] = getDateDetails(groupedArray[dateKeys[j]])
                finalData.push(data);
            }

            res.render('index', { title: 'Trump Regret heatmap', finalData: JSON.stringify(finalData) });
        }
        else{
            res.render('error', { message: "An error ocurred. Check if back-end application is running at: http://trumpgret-araizaga-yael.c9users.io/." });
        }
    });
});

module.exports = router;