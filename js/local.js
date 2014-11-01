//remove comment from these two lines are for production
//var console = {};
//console.log = function(){};

$('#movieInfo').hide();
$("#result").hide();

//this is used to extract data from imdb response
//response is in the form of imdb.rating.run({<jsondata>})
var imdb = {
    rating: {
        run: function (data) {
            temp = data['resource']['rating'];
            if (isNaN(temp)) temp = '-';
            //imdbRating = "<p class = 'text-center'><b>" + temp + "</b></p>";
            imdbRating = temp ;
            temp = data['resource']['title'];
            if (isNaN(temp)) imdbMovieName = temp;
        }
    }
};

//some global variables ... they can be avoided, but I am lazy
var imdbRating = 0;
var imdbMovieName;
var youtubeId = null;
var clickCounter = 0;
var index_counter = 0;
var moviesFoundCounter = 0; //counter for how many movies info have we got
var tableObj = 0;
var stopSearching = 0;
var finalResult = {};
var shareUrl = null;

function hash(s) {
    return s.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a
    });
}

$(document).ready(function () {

    var api_key = "c340d5ff1e32511e4584f70860ab018c";
    var fileNames = []; //used for saving original filenames
    var videoFiles = []; //used for saving videoFiles (again... it could have been in filename itself)
                         // videoFiles = [{index : <index of fileNames>, name : <video name>}]
    var notFoundArr = []; //for debugging

        $("#whyGoogle").click(function (e) {
	    BootstrapDialog.alert({
		title: 'Oops! Only Google Chrome is supported',
            	message: 'Only chrome provides webkitdirectory to select whole folders'
	    }); 
	    e.preventDefault();
        });

    //proxyBtn is used to override default chrome btn
    $("#proxyBtn").click(function (e) {
        
        var is_chrome = !!window.chrome;
        if(!is_chrome)
        {
	    BootstrapDialog.alert({
		title: 'Oops! Only Google Chrome is supported',
            	message: 'Only chrome provides webkitdirectory to select whole folders'
	    });	    
            return;
        }
        e.preventDefault();
        $("#fileURL").trigger("click");
    });

    var input = document.getElementById("fileURL");

    input.addEventListener("change", function (e) {
        stopSearching = 0;
        $("#result").show();

        files = e.target.files;

        var files, extension;

        fileNames = getVideoFileNames(files);
        videoFiles = getVideoFileArray(fileNames);

        if (videoFiles.length == 0) {
            $("#message").html(getMessageNoFile());
            return;
        }
        $("#message").html(getMessage(videoFiles.length));

        $("#stop-search").click(function () {
            $("#stop-search").hide();
	    if(moviesFoundCounter)
		showShareBtn();
            stopLoadingGif();
            stopSearching = 1;
        });

        $("#numFoundText").hide();

        if (!clickCounter++)      //only first time initialize table after then , clear and redraw
            initializeDataTable();
        else
        {
            tableObj.fnClearTable();
	    cleanGlobalVars();
            initializeDataTable();
        }
        startProcessingMovieNames();
    }, false);


    function showShareBtn()
    {
        $("#shareSpan").html('<button class="btn btn-success btn-sm pull-right" id = "shareBtn""><span class="glyphicon glyphicon-send"></span> Share movie list</button>');
        $("#shareBtn").click(function () {
		if(shareUrl)
			displaySharing();
		else
			askForSharing();
        });
    }
    function cleanGlobalVars()
    {
	moviesFoundCounter = 0;
	stopSearching = 0;
	finalResult = {};
	shareUrl = null;
    	index_counter = 0;
    }
    function startLoadingGif() {
        $("#loading").html("<img src='img/load.gif' alt='loading...' />");

    }

    function stopLoadingGif() {
        $("#loading").hide();
    }

    function getMessageNoFile() {
        var msg = '<div class = "alert alert-danger "><button type="button" class="close" data-dismiss="alert" ><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>No video Files found :( </div>';

        return msg;
    }

    function getMessage(num) {
        var msg = '<div class = "alert alert-info ">' + num + ' video files are found in your directory. Now searching for movie info.<span id = "numFoundText" > Movie info found for <span id = "numFound"></span> movies &nbsp;&nbsp;&nbsp; </span> <span id = "loading"></span> <span id = "shareSpan"></span><button class="btn btn-danger btn-sm pull-right" id = "stop-search"><span class="glyphicon glyphicon-remove"></span> Stop Searching</button></div>';

        return msg;

    }

    function initializeDataTable() {
        //this code is for jquery scroll effect
        var divPosition = $('#example_wrapper').offset();
        $('html, body').animate({
            scrollTop: divPosition.top
        }, "slow")

        populateDataTable();
    }

    function getVideoFileNames(files) {
        var videoExts = ["avi", "mp4", "flv", "divx", "mov", "mkv", "webm","m4v","wmv"]; 

        var file, tempFiles = [];
        for (var i = 0, len = files.length; i < len; i++) {
            file = files[i];
            extension = file.name.substr((~ - file.name.lastIndexOf(".") >>> 0) + 2); //get file extension. scary right. stackoverflow ;)
            //if video file then add
            if (extension && (videoExts.indexOf(extension) >= 0)) {
                var filename = file.name.substring(0, file.name.lastIndexOf("."));
                if (tempFiles.indexOf(filename) < 0) tempFiles.push(filename); //check for duplicate video file name
            }
        }
        return tempFiles;
    }

    function getVideoFileArray(fileNames) {
        function getName(fileName) {

            //from here on we'll do some cleanup of file name

            if (fileName.substring(0, 1) == "$") {
                return;
            }

            var rejectWords = ['dvd', 'divx', 'xvid', 'brrip', 'r5', 'unrated', '480p', '720p', 'x264', 'klaxxon', 'axxo', 'br_300', '300mb', 'cd1', 'cd2', ' - ', "\$", " by "];

            //if name has sample in it , ignore this file
            if (fileName.toLowerCase().indexOf("sample") >= 0) return "";


            //remove everything in between braces
            fileName = fileName.replace(/\(.*?\)/g, '');
            fileName = fileName.replace(/\{.*?\}/g, '');
            fileName = fileName.replace(/\[.*?\]/g, '');
            //replace .  and _ by " "
            fileName = fileName.replace(/\./g, ' ');
            fileName = fileName.replace(/_/g, ' ');

            //remove year and following stuff
            fileName = fileName.replace(/ \d\d\d\d.*/, '');

            // remove rejectWords and stuff following it
            for (var i = 0, len = rejectWords.length; i < len; i++) {
                var reg = new RegExp(rejectWords[i] + '.*', 'ig');
                fileName = fileName.replace(reg, '');
            }

            fileName = fileName.replace(/\-/g, ' ');

            return fileName;
        }

        var retVideoFiles = [];
        var hashNames = []; //used for duplicatec detection
        for (var i = 0, len = fileNames.length; i < len; i++) {
            var name = getName(fileNames[i]);
            if (name && (hashNames.indexOf(name) < 0)) {
                retVideoFiles.push({
                    index: i,
                    name: name
                });
                hashNames.push(name);
            }
        }
        return retVideoFiles;
    }

    function startProcessingMovieNames() {
        moviesFoundCounter = 0;
        startLoadingGif();
        console.log(videoFiles);
        if (!index_counter) 
            getMovieInfo(videoFiles[index_counter].name, videoFiles[index_counter].index);
    }

    function getMoreMovieInfo(obj, index, keyword) {
        //check if valid data in json response
        if ((obj['total_pages'] == 0) || (!obj['results'])) {
            notFoundArr.push(keyword);
            console.log("======= no result");
            getMovieInfoRecursive();  //result not found for this movie , start with next video file name
            return;
        }

        var result = obj['results'];
        var title = result[0]["title"];
        console.log("title " + title);
        var tmdb_id = result[0]["id"];
        var imdbId = '';

        //get imdb id , so that we can get imdb rating, TMDb api does not provide imdb rating :(
        $.ajax({
            url: "http://api.themoviedb.org/3/movie/" + tmdb_id + "?api_key=" + api_key,
            dataType: "json",
            dataType: 'jsonp',
            success: function (dataCheck) {
                console.log("getMoreMovieInfo");
                imdbId = dataCheck['imdb_id'];

                if (!imdbId) 
                {
                    console.log("imdbId not fond");
                    notFoundArr.push(keyword);
                    getMovieInfoRecursive();  //result not found for this movie , start with next video file name
                    return;
                }
                var movieStr = '<a target="_blank" href = "http://www.imdb.com/title/' + imdbId + '">' + title + '</a>';
                var genres = '';
                for (var genId in dataCheck['genres'])
                genres += dataCheck['genres'][genId].name + " ";

                //we got imdb id and genres, now get imdb rating
                $.ajax({
                    type: "GET",
                    url: "http://p.media-imdb.com/static-content/documents/v1/title/" + imdbId + "/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json",
                    contentType: 'application/json',
                    dataType: 'jsonp',
                    success: function (dataCheck) {},
                    error: function (data) {
                        //this may be confusing b'coz we are getting result in error. why ?
                        //b'coz imdb response is not valid json. it's wrapped in imdb.rating.run().
                        //we made that function above, that function will set global imdbrating variable
                        console.log("going to push");
                        pushObj_aux(movieStr, genres, imdbId, index);
                    }
                });
            },
            error: function () {
                console.log("error ========= getMoreMovieInfo");
                getMovieInfoRecursive(); //result not found for this movie , start with next video file name
            }
        });
    }

    function pushObj_aux(movieStr, genres, imdbId, index) {
        //url for getting movie trailer from youtube api.
        var url = "http://gdata.youtube.com/feeds/api/videos/?v=2&alt=jsonc";
        url = url + '&paid-content=false';
        url = url + '&duration=short';  //trailers are usually short
        url = url + '&orderby=relevance&time=all_time';
        url = url + '&max-results=1'; //we want only one trailer

        var q = encodeURI("official trailer " + imdbMovieName);
        url = url + "&q=" + q;

        $.ajax({
            url: url,
            dataType: 'jsonp',
            contentType: 'application/json',
            success: function (json) {
                var ret = "";
                console.log("pushObj_aux");
                if (json.data.items) {
                    var items = json.data.items;
                    console.log(items);
                    if (items[0]) 
		    {
		    	ret = '<a target="_blank" href="http://youtu.be/' + items[0].id + '"><img src = "img/youtube.png" alt = "youtube link" title = "Trailer"/></a>';
			youtubeId = items[0].id;
		    }
                }
                pushObj(movieStr, genres, imdbId, index, ret);
            },
            error: function (e) {
                console.log("error==============");
                console.log(e);
                //trailer is not that important , so even if we got error, we will show rest of information
                pushObj(movieStr, genres, imdbId, index, "");
            }
        });
    }

    function pushObj(movieStr, genres, imdbId, index, trailer) {
        console.log("pushObj");
        fileName = fileNames[index]; //get original file name
        tableObj.fnAddData([fileName, movieStr, trailer, imdbRating, genres], false);
        tableObj.fnStandingRedraw(); //this is datatable plugin call to redraw,
                                     //so we table is not returned to page 1, after every row addition
                                     
        $('input[type=search]').css('width', '200');
        $('.dataTables_filter input').attr("placeholder", "Filter by ratings, genres, names");

        moviesFoundCounter++;
        document.title = "("+moviesFoundCounter+") "+"Movies Collection Info";
        $("#numFound").html("<b> " + moviesFoundCounter + " </b>");
        $("#numFoundText").show();

	finalResult[imdbMovieName] = [imdbId, imdbRating, youtubeId, genres];

        getMovieInfoRecursive(); //got all info for one movie , move on to next video file
    }

    function getMovieInfoRecursive() {
        if (stopSearching) return; //if user has clicked on stop searching button, stop
        index_counter++;
        if (index_counter == videoFiles.length) {
            console.log("All videos are processed !!!");
            console.log(notFoundArr); //lesser element here means better
            stopLoadingGif();
            $("#stop-search").hide();
	    showShareBtn();
	    if(moviesFoundCounter)
	    	askForSharing();
	    console.log(finalResult);
            return;
        }
        getMovieInfo(videoFiles[index_counter].name, videoFiles[index_counter].index);
    }
    function displaySharing()
    {
	
            BootstrapDialog.show({
	    title: 'Time to show off',
            message: 'Copy following url to share your movie list<br><pre><a href ="'+shareUrl+'"  target = "_blank">'+shareUrl+'</a></pre',
	    closable: false,
            buttons: [{
                label: 'Close',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
        });

    }

    function askForSharing()
    {
        BootstrapDialog.show({
	    title: 'Sweet',
            message: 'Info found for '+moviesFoundCounter+' movies. Now share your movies list.',
	    closable: false,
            buttons: [{
		id: 'btn-1',
                icon: 'glyphicon glyphicon-send',
                label: 'Get url for sharing movie list',
                cssClass: 'btn-primary',
                autospin: true,
                action: function(dialogRef){
                    dialogRef.enableButtons(false);
                    dialogRef.setClosable(false);
                    dialogRef.getModalBody().html('Wait! generating unique link');
                    /*setTimeout(function(){
                        dialogRef.close();
                    }, 5000);*/
		    $.ajax({
        	    type: "POST",
		    data: {movieData: finalResult},
	            url: "getUniqueUrl.php",
	            success: function (dataCheck) {
			shareUrl = "http://"+window.location.hostname+"/share.php?id="+dataCheck;
		        dialogRef.getModalBody().html('Your unique url is generated, share this<br><pre><a href ="'+shareUrl+'"  target = "_blank">'+shareUrl+'</a></pre>');
			askForSharing_aux(dialogRef);
	            },
	            error: function () {
		        dialogRef.getModalBody().html('Sorry, something went wrong');
			askForSharing_aux(dialogRef);
	            }
	            });
                }
            }, {
                label: 'Close',
                action: function(dialogRef){
                    dialogRef.close();
                }
            }]
        });

    }

    function askForSharing_aux(dialogRef)
    {
	dialogRef.setClosable(true);
	dialogRef.getButton('btn-1') .hide();
	dialogRef.enableButtons(true);
    }

    function populateDataTable() {
        $('#movieInfo').show();

        tableObj = $('#movieInfo').dataTable({
            "bAutoWidth": false,
                "sAjaxDataProp": "",
                "bProcessing": true,
                "bDestroy": true,
                "bAutoWidth": false,
                "oLanguage": {
                "sEmptyTable": "Searching for movie data ..."
            },
                "order": [   
                [3, "desc"]  //short by imdb rating
            ],
                "aoColumns": [{
                "sWidth": "30%"
            }, {
                "sWidth": "30%"
            }, {
                "sWidth": "5%"
            }, {
                "sWidth": "5%"
            }, {
                "sWidth": "30%"
            }, ],
                "aoColumns": [{
                "title": "Video files found"
            }, {
                "title": "Movie"
            }, {
                "title": "Trailer",
                "sClass": "text-center"
            }, {
                "title": "Rating",
                "sClass": "text-center"
            }, {
                "title": "Genres"
            }, ],
        });
    }

    function getMovieInfo(keyword, index) {
        console.log("starting ==", keyword);
        var url = 'http://api.themoviedb.org/3/',
            mode = 'search/movie?query=',
            keyword,
            movieName,
            key = '&api_key=' + api_key;

        movieName = encodeURI(keyword);
        urlStr = url + mode + movieName + key,
        //this ajax call is to get tmdb id, movie name and genres
        $.ajax({
            type: "GET",
            url: urlStr,
            contentType: 'application/json',
            dataType: 'jsonp',
            success: function (dataCheck) {
                console.log("getMovieInfo");
                getMoreMovieInfo(dataCheck, index, keyword);
            },
            error: function () {
                console.log("error ==============");
                getMovieInfoRecursive();
            }
        });
    }
});
