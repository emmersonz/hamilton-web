// JSON Callback global variable
var diningJSONCallback; 

var diningJSON = null;

// Finds the title element in the song-container div in
// the radio page
var gotSong = function(data) {
  $(data).find("item").first(function() {
    var el = $(this);

    $('#song-container').text(el.find('title'));

  });
};

// Sends a JSON request for the RSS Feed (probably for The Scroll?)
// Checks if there was an error fulfilling the request
// Outputs the error to the console 
var grabRssFeed = function(url, callback, cacheBust, limit) {
  console.log("start");
  var fxurl = url + (cacheBust ? ("&_=" + Math.round(new Date().getTime() / 1000)) : '');
  console.log(fxurl);
  var api = "http" +"://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" +
      encodeURIComponent(fxurl);
  api += "&num=" + ((limit == null) ? 25 : limit);
  api += "&output=json_xml";

  // Send request
  $.getJSON(api, function(data){

      // Check for error
      if (data.responseStatus == 200) {

        callback(data.responseData);

      } else {

        // Handle error if required
        var msg = data.responseDetails;
        console.log(msg);
        //$(e).html('<div class="rssError"><p>'+ msg +'</p></div>');
      }
    }
  );
};

// A function for logging error messages
(function () {
  'use strict';
  var errorConsole;
  window.onerror=function(msg, url, linenumber, column, errorObj){
    errorConsole += msg + " " + url + ":" + linenumber + ":" + column + " (" + errorObj + ")";
    return false;
  };
    
    
// A lot of scrap code
    
  /*function rewriteClass() {
    $('h4 a').addClass("external");
    $('#news').find('.iscroll-content').attr("style", "");
    $('.newsholder').iscrollview('refresh');
  }
  function rewriteClassHamNews() {
    $('h4 a').addClass("external");
    $('#ham-news').find('.iscroll-content').attr("style", "");
    $('#ham-news .newsholder').iscrollview('refresh');
  }*/

  function rewriteClassEvents(name) {
    console.log(name);
    //$(name+" h4 a").addClass("external");
    //$(name).find('.iscroll-content').attr("style", "");
    //$(name+' .eventsholder').iscrollview('refresh');
      
  }
    
    
  // Database global variable
  var db;
  var audDB;

  // Opens the application's database and returns a new database object
  // window.openDatabase(name, version, display name, size)
  // If version is "", database will persist over many versions/audiences
  function setupDB() {
//      second field in opendatabase = version (switch to empty to allow it to persist over multiple versions)
//      can store audience based, even through versions      
    db = window.openDatabase("appContentsDB", "1.0", "HamiltonCollege", 200000);
    audDB = window.openDatabase("appAudience", "", "HamiltonCollege", 200000);
  }

  // Global variable to keep track of the state of JSON and AJAX requests
  var jsonNotLoadedInitially = false;
  var loadDiningAJAXRequest;
    
    
  // Updates the hours and open-closed icons for the dining halls
  var updateDiningHallHours = function(data) {
   
    for (var key in data.days[0].cafes) {
        //TESTING- issue with Date object here
        /*console.log("CAFE: ");
        console.log(key);
        
        console.log("DATA.DAYS[0].length: ");
        console.log(data.days[0].cafes.$110);
        console.log(data.days[0].date);
        */
        
      if (data.days[0].cafes.hasOwnProperty(key)) {
          
        var now = new Date();
        var cafe = data.days[0].cafes[key];
        var cafeElement = $("li[data-bamco-id=\"" + key + "\"]");
        
        var day = now.getDay();
          
        // DINER HOURS
        if (key == 512) {

          // Saturday or Sunday
          if (day == 6 || day == 0) {
                
            // Diner B or after 3pm
            if (now.getHours() < 4 || now.getHours() > 15) {
              cafeElement.find(".open-indicator").addClass("open");
            }
                
            else {
              cafeElement.find(".open-indicator").addClass("closed");
            }
                
            // Diner and Diner B hours inserted into the HTML
            cafeElement.find("a .dining-hall-block .hours-text").text("12:00am - 4:00am | 3:00pm - 12:00am");
            console.log("HERE! SATURDAY OR SUNDAY")
          } 
              
          // Friday 
          else if (day == 5) {
            if (now.getHours() < 4 || now.getHours() > 9) {
              cafeElement.find(".open-indicator").addClass("open");
            } 
            else {
              cafeElement.find(".open-indicator").addClass("closed");   
            }
                
            // Diner and Diner B hours inserted into the HTML
            cafeElement.find("a .dining-hall-block .hours-text").text("12:00am - 4:00am | 9:00am - 12:00am");
            console.log("HERE! FRIDAY")
          }
              
          // Monday-Thursday
          else {
            if (now.getHours() > 9){
              cafeElement.find(".open-indicator").addClass("open");
            }
            else {
              cafeElement.find(".open-indicator").addClass("closed");
            }
                
            // Diner weekday hours inserted into the HTML
              cafeElement.find("a .dining-hall-block .hours-text").text("9:00am - 12:00am");
              console.log("HERE! ANY DAY")
          }
        }
        
        // COMMONS 
        // Currently does NOT include the hours that Commons is closed
        // during the day
        else if (key == 109) {
            cafeElement.find("a .dining-hall-block .hours-text").text("7:30am - 8:00pm");
        }
          
        // MCEWEN
        // Currently does NOT include the hours that Commons is closed
        // during the day
        else if (key == 110) {
            console.log("MCEWENNNNNNNN")
            console.log(day);
            
            // Friday
            if (day == 5) {
                cafeElement.find("a .dining-hall-block .hours-text").text("7:30am - 2:30pm");
            }
            
            // Monday - Thursday
            else if (day <= 5 && day > 0) {
                console.log("weekday!");
                cafeElement.find("a .dining-hall-block .hours-text").text("7:30am - 8:00pm");
            }
            
            // Friday
            else {
                console.log(key, " is closed");
                cafeElement.find("a .dining-hall-block .hours-text").text("Closed Today");
                cafeElement.find("a").addClass("ui-disabled");
            }
        }
        
        // PUB
        else if (key == 598) {
            
            // Monday - Friday lunchtime
            if (day > 0 && day < 6) {
                cafeElement.find("a .dining-hall-block .hours-text").text("11:30am - 1:00pm");
            }
            
            else {
                console.log(key, " is closed");
                cafeElement.find("a .dining-hall-block .hours-text").text("Closed Today");
                cafeElement.find("a").addClass("ui-disabled");
            }
        }
          
        var mealSet = false;
        var endtime12hr = "";

        // TESTING ---------------------------------------------------------  
        //console.log("HERE NOW, TIME TO GO THROUGH MEALS")
        //console.log(cafe.dayparts[0]);
        //------------------------------------------------------------------
          
        // Goes through each meal for a given dining hall on the current day
        $.each(cafe.dayparts[0], function (id, meal) { 
            // For each meal, parse the "dayparts" of the current meal
            // into JavaScript dates 
        
          
            // Convert the time
            var start = moment(meal.starttime,'HH:mma');
            //var starttime12hr = start.format('h:mma');
            var end = moment(meal.endtime,'HH:mma');
            //endtime12hr = end.format('h:mma');


            var xnow = moment();
        
          // Is the current meal being offered now?
          if (start.isBefore(xnow) && end.isAfter(xnow)) {
            mealSet = true;
            console.log("meal has been set");
            return false;
          }
        }); 
          
        
        if (cafe.dayparts[0].length != 0) {
          console.log(key, " not closed");
          //cafeElement.find("a .dining-hall-block .hours-text").append(document.createTextNode(" - " + endtime12hr));
          cafeElement.find("a").removeClass("ui-disabled");
        } 

        // Set the current cafe to closed or open depending on 
        // if the meal has been set
        // Maybe why McEwen and Pub are always closed?
        if (mealSet) {

          cafeElement.find("a .open-indicator").addClass("open");
        } 
          else {

          cafeElement.find("a .open-indicator").addClass("closed");
        }
      }
    }

  };
    
  // PRE: Data is JSON to check <- Old comment, I don't know what this means
  // POST: Determines whether menu data should be stored 
  //       (i.e it is up to date, etc.)
  //       Updates warnings/error to reflect the data retrieved
  var diningDataCheck = function(data) {
    console.log("starting checks");
      
    if (data.hasOwnProperty("status") && data.status === false) {
      $(".menu-not-loaded").fadeIn();
      return false;
    } else {
      $(".menu-not-loaded").fadeOut();
    }

    var menuCurrentDate = true;

    var current = new Date();
    var menuDateSplit = data.days[0].date.split('-');
    if (current.getFullYear() != Number(menuDateSplit[0]) ||
        current.getMonth() + 1 != Number(menuDateSplit[1]) ||
        current.getDate() != Number(menuDateSplit[2])) {
      $(".menu-out-of-date").fadeIn();
      $(".menu-out-of-date .date-container").text(data.days[0].date);
      
      menuCurrentDate = false;
    } else {

        $(".menu-out-of-date").fadeOut();

        
        // If we find that the menu is not out of date (i.e the date matches)
        // we cancel the AJAX request. 
        // This will probably not do anything if we already have the response
        // BUT the response often takes a while to download so this should be 
        // fine
        loadDiningAJAXRequest.abort();
    }

    $("#this-day").addClass("ui-btn-active ui-state-persist");
    $("#next-day").removeClass("ui-btn-active");
    $("#prev-day").removeClass("ui-btn-active");

    // JSON was not loaded, but it is now, so hide the loader
    if (jsonNotLoadedInitially) { 
      $( "#diningmenus").find(".ldr" ).loader( "hide");
      $.mobile.loading( "hide" );
    }

    //updateDiningHallHours(data);
    //have the calling function decide whether to update dining hall hours or not

    return menuCurrentDate;
  };
    

  var diningJSONLoadOffline = function() {
      
    // Get the JSON data from the dining menu database
    var sql = "SELECT jsonData FROM diningmenu";
    db.transaction(function (tx) {
      tx.executeSql(sql, [], function(txn, data) {
        // Function gets executed if the database query was succesful
        if (data.rows.length == 0) {
          $( ".ldr" ).loader("show");
          $.mobile.loading( "show" );
          jsonNotLoadedInitially = true;
          return;
        }
          
        // Parse the JSON dining menu and check if it is up to date
        diningJSON = $.parseJSON(data.rows.item(0).jsonData);
        var upToDate = diningDataCheck(diningJSON, true);
          

        // We are calling this offline, so it will not display anything if the 
        // data is not the right date
        if (upToDate) {
          $('.dining-halls .diningmenuholder').show();
          updateDiningHallHours(diningJSON);
        } else {
          $('.dining-halls .diningmenuholder').fadeOut();
        }
          
      }, function(err){
            // Gets executed if the query was unsuccesful
            alert("Error processing SQL: " + err.code);
      });
    });
  };

  
  var updateDiningMenu = function (adata) {
    if (diningJSON != null) {
      diningJSON = adata;
      var idActive = $("ul.meals li a.ui-btn-active").data("meal-id");

      if (lastDiningHall) {
        initializeDiningHall(lastDiningHall);
      } else {
        $(".diningmenuholder").fadeIn();
      }
      if (idActive != undefined) {
        console.log("setting again" + idActive);
        $('ul.meals li a[data-meal-id="' + idActive + '"]').click();
      }
      
    }
    diningJSON = adata;
  };

  var lastDiningHall = null;
    
  diningJSONCallback = function (adata) {
    if (diningDataCheck(adata)) { // we are not checking this offline
      console.log("updating database with new dining menu");
      db.transaction(function (tx) {
        if (adata != null) {
          tx.executeSql('DELETE FROM diningmenu');
        }

        tx.executeSql('INSERT INTO diningmenu (jsonData) VALUES (?)',
            [JSON.stringify(adata, null, 2)]);
        updateDiningHallHours(adata);
        updateDiningMenu(adata);
        

      });
    } else {
      console.log("dining menu old could not update database");
      updateDiningHallHours(adata);
      updateDiningMenu(adata);
    }
  };

  var initializeDiningHall = function (targetDiningHall) {
    lastDiningHall = targetDiningHall;
    if (diningJSON === null) { // diningJSON is null there is no json loaded

      setTimeout(function(){initializeDiningHall(targetDiningHall);}, 160);
      return;
    }

    var data = diningJSON;
      
    // Lookup the fooditem from the db query and return an HTML string with the
    // properly formatted info.
    var lookupFoodItem = function(itemID) {
        
        var fooditem = data.items[itemID];        
        var cor_lookup = {"humane": "images/menu-item-type-humane.png", "vegan": "images/menu-item-type-vegan.png", "vegetarian" : "images/menu-item-type-vegetarian.png", "made without gluten-containing ingredients": "images/menu-item-type-gluten-free.png", "farm to fork": "images/menu-item-type-farm-to-fork.png", "seafood watch": "images/menu-item-type-seafood.png", "Well-Being": "images/menu-item-type-well-being.png", "halal": "images/menu-item-type-halal.png"};
        
        var fooditemHTML = "<a href='#'>";
        fooditemHTML += "<h1>" + fooditem.label + "</h1>"; // The name of dish
        
        if (fooditem.cor_icon != []) {
          fooditemHTML += "<span class='item-description'>";
          for (var id in fooditem.cor_icon) {
            fooditemHTML += '<img class="sticker" src="' + cor_lookup[fooditem.cor_icon[id]] + '"/> ';
          }
            
          fooditemHTML += "</span>";
        }
        
        fooditemHTML += "</a>";
        
        return fooditemHTML;
    };  
      
    // cafe has the Json Object with all the data for a given dining hall
    var cafe = data.days[0].cafes[targetDiningHall];

    // displays a meal with a given mealID
    var initializeMeal = function (mealID) {
      var meal = cafe.dayparts[0][mealID];
      $(".items .diningmenuholder").html('');
      $.each(meal.stations, function (id, station) {
          
        // A dynamic station ID. Useful for when we need to remove a station if the contents
        // would be empty.
          
        var stationID = "station-" + station.label.replace(/\s+/g, '-').toLowerCase();
        $(".items .diningmenuholder").append('<li data-role="list-divider" id="' + stationID + '">' + station.label + "</li>");
        var specialsExist = false;
        $.each(station.items, function (id, item) {

          // We only care about the specials. Specials in the JSON are either 1 or 0.
          if (data.items[item].special == "1"){
            
            specialsExist = true;  
              
            // Build the list item html
            var fooditemHTML = "<li data-icon='false'>";
            fooditemHTML += lookupFoodItem(item);
            fooditemHTML += "</li>";
            
            // Add the list item to the container
            $(".items .diningmenuholder").append(fooditemHTML).enhanceWithin();
          }
        });
        
        // Get rid of the station list divider if it is empty.
        if (!specialsExist){
            $(("#" + stationID)).remove();
        }
      });
      $('.items ul').listview("refresh");
    };

    var defaultMealSet = false; // assume that no meal is going on now

    $('.apageheader.menu-show').html('<div id="meals-navbarcont" data-role="navbar"></div>');
    $('#meals-navbarcont').html('<ul class="meals xnavbar"></ul>');
    //$('.meals.xnavbar').html('<li class="back-cont"><a class="go-back ui-btn-icon-left" data-icon="arrow-l">Back</a></li>');
    $('#diningmenus > .pageheader > .back-btn').hide();
    $('#diningmenus > .pageheader > .dining-back-btn').show();
    console.log(cafe);
    $.each(cafe.dayparts[0], function (id, meal) { // for each meal
      // convert times
      var start = moment(meal.starttime,'HH:mm a');
      var starttime12hr = start.format('h:mm a');
      var end = moment(meal.endtime,'HH:mm a');
      var endtime12hr = end.format('h:mm a');
        
      $("ul.meals.xnavbar").append('<li><a data-meal-id="' + id + '">' + meal.label + '<p class="meal-times">' +
                                   starttime12hr + '-' + endtime12hr + '</p></a></li>');

      if (!defaultMealSet) { // if current meal has already been set, there is no need need to parse
        // parse the dayparts of this meal into javascript dates
        var xnow = moment();


        // is this meal going on now?
        if (start.isBefore(xnow) && end.isAfter(xnow)) {
          defaultMealSet = true;
          $('.meals li a[data-meal-id="' + id + '"]').addClass('ui-btn-active');
          initializeMeal(id); // if so initialize it
        }
      }
    });

    $("#diningmenus .menu-show").css("display", "block");
    $(".menu-out-of-date").removeClass("navmargin");
    $("#diningmenus .menu-hide").css("display", "none");
    $(".items").css("display", "block");


    $(".meals li a").click(function(){ // initialize meal when navbar link is pressed
      initializeMeal($(this).data("meal-id"));
    });

    if (!defaultMealSet && cafe.dayparts[0].length > 0) { // no meals going on now
      $(".items .diningmenuholder").html('<li><font style="white-space:normal"><div class="alert info always tight">There are no current meals at this dining hall, please select one above.</div></font></li>');
      $('.items .diningmenuholder').listview("refresh");
    }
    else if (cafe.dayparts[0].length === 0) { // no meals in the day at all
      $(".items .diningmenuholder").html('<li><font style="white-space:normal"><div class="alert info always tight">We could not find any meals today for this dining hall.</div></font></li>');
      $('.items .diningmenuholder').listview("refresh");
    }

    $('[data-role="navbar"]').navbar(); // necessary to apply styling to navbar (meal buttons)

    $(".meals").css("display", "block");
    //$('.meals li a.go-back').removeClass('ui-btn-icon-top');

    var goBack = function(){ // leave the meals/items view and return to dining hall list
      $("#diningmenus .menu-show").css("display", "none");
      $("#diningmenus .menu-hide").css("display", "block");
      $(".menu-out-of-date").addClass("navmargin");


      $('#diningmenus > .pageheader > .back-btn').show();
      $('#diningmenus > .pageheader > .dining-back-btn').hide();

      $(".meals").css("display", "none");
      $(".items").css("display", "none");
      $(".div.ui-content.items").css("display", "none");
      $(".dining-halls").css("display", "block");
      $(".dining-halls .diningmenuholder").css("display", "block");
      $('.dining-halls .diningmenuholder').listview("refresh");

      lastDiningHall = null; // if we go back, then student unselected dining hall

      $(document).off("backbutton", goBack);
    };



    $('#diningmenus > .pageheader > .dining-back-btn').click(goBack);

    //$(".meals li.back-cont").click(goBack);

    //document.addEventListener("backbutton", goBack, false);
    $(document).bind("backbutton", goBack);


  };

   
  function loadAllDiningJSON(dayDelta) {
    $('[data-role="navbar"]').navbar();
    checkConnection();
    if (dayDelta === undefined) {
      dayDelta = 0;
    }

    
    if (connectionStatus == "online") {
      console.log('delta', dayDelta);
      var thisDay = moment(new Date()).add(dayDelta, 'd');
      var thisDayStr = thisDay.format("YYYY-MM-DD"); // sets day difference to dayDelta
      $("#this-day").html(thisDayStr + "<br/>Current Day");
      $("#prev-day").html(thisDay.add(-1, 'd').format("YYYY-MM-DD") + "<br/>Previous");
      $("#next-day").html(thisDay.add(2, 'd').format("YYYY-MM-DD") + "<br/>Next");

      loadDiningAJAXRequest = $.ajax({
        url: "http://legacy.cafebonappetit.com/api/2/menus?format=jsonp&cafe=110,109,598,512&callback=diningJSONCallback&date=" + thisDayStr,
        cache: 'true',
        dataType: 'jsonp',
        jsonpCallback: 'diningJSONCallback'
      });

      if (dayDelta == 0) { // only offline data will be from the current day
        diningJSONLoadOffline(); // online load from database while we wait
      }

    } else {
      if (dayDelta == 0) {
        diningJSONLoadOffline(); // if not online, load from database
      } else {
        $(".menu-not-loaded").fadeIn();
      }
    }
  }

  function phoneChecks(tx) {
    var sql = "CREATE TABLE IF NOT EXISTS phonenumbers (id varchar(50) PRIMARY KEY, letter varchar(255), name varchar(255), email varchar(255), phone varchar(255), url varchar(255), officehours varchar(255))";
    db.transaction(function (tx) {
      tx.executeSql(sql);
    });

    var sql2 = "CREATE TABLE IF NOT EXISTS diningmenu (jsonData TEXT)";
    db.transaction(function (tx) {
      tx.executeSql(sql2);
    });
  }

  function loadPhoneJson() {
    var jsonCallback = function (data) {
      db.transaction(function (tx) {
        var len = data.length;
        if (len > 0) {
          tx.executeSql('DELETE FROM phonenumbers');
        }
        for (var i = 0; i < len; i++) {
          tx.executeSql('INSERT INTO phonenumbers (id, letter, name, email, phone, url, officehours) VALUES (?,?,?,?,?,?,?)', [data[i].id, data[i].letter, data[i].name, data[i].email, data[i].phone, data[i].url, data[i].officehours]);
        }
        getNumbers();
      });

    };
    $.ajax({
      url: "https://www.hamilton.edu/apppages/ajax/getappdata.cfm",
      cache: 'true',
      dataType: 'json'
    }).done(jsonCallback);
  }

  function db_error(db, error) {
    alert("Database Error: " + error);
  }

  function errorCBgetNumbers(err) {
    alert("Error processing SQL: " + err.code);
  }

  function getNumbers() {
    var sql = "SELECT * FROM phonenumbers ORDER BY letter";
    db.transaction(function (tx) {
      tx.executeSql(sql, [], getNumbers_success, errorCBgetNumbers);
    });
  }

  /* FUNCTION createAudienceForm
     Queries the database to dynamically create the audience setting 
     form before the page is shown. 
     Only audiences that are active in the audience table will appear
     as options in the settings menu.
  */
  function createAudienceForm(tx) {
      var sql = "SELECT appAudience FROM audience WHERE isActive = 1";
      db.transaction(function (tx) {
      tx.executeSql(sql, [], createAudienceForm_success);
    });
      
  }
    
  /* FUNCTION createAudienceForm_success
     Dynamically creates the audience setting form. 
     Executes when the SQL query in createAudienceForm is successful */
  function createAudienceForm_success(tx, results) {
      // Add the tuples from the results to an array 
      // to be used in making a template
      var audiences = [];
      for (var i = 0; i < results.rows.length; i++) {
          audiences.push(results.rows.item(i));
      }
      
      // Add the audience buttons to the form via a template
      var audienceTemplate = '<input type="radio" name="audiencelist" id="choice-${appAudience}" value="off"><label for="choice-${appAudience}">${appAudience}</label>'
      var audForm = $('#audienceform');
      audForm.html('');
      $.template("audTemp", audienceTemplate)
      $.tmpl("audTemp", audiences).appendTo('#audienceform');
      $('#audienceform').trigger('create');
      
      // Preselect the radio button for the audience that is currently in use
      selectAudienceRadioBttn();
      // Add the click handlers to each button
      audienceFormClickHandlers();
      
      
  }

 /* FUNCTION selectAudienceRadioBttn
    Queries the audPrefs database to get the ID of current audience.
 */
 function selectAudienceRadioBttn(tx) {
      var sql = "SELECT audienceID FROM audPrefs"; 
      audDB.transaction(function(tx){
          tx.executeSql(sql, [], selectAudienceRadioBttn_success);
      });
  }
    
  /* FUNCTION selectAudienceRadioBttn_success 
     Queries the audience table to find the name of the current audience. 
  */
  function selectAudienceRadioBttn_success(tx, results) {
      var audID = results.rows.item(0)["audienceID"]
      var sql = "SELECT appAudience FROM audience WHERE id='" + audID+"'";
      db.transaction(function(tx){
          tx.executeSql(sql, [], selectCurrentAudience);
      });
      
  }
                     
  /* FUNCTION selectCurrentAudience
     Preselects the current audience in the settings menu. 
  */
  function selectCurrentAudience(tx, results) {
      var currentAudience = results.rows.item(0)['appAudience'];
      $('#choice-' + currentAudience).attr("checked",true).checkboxradio("refresh");
  }
   
  /* FUNCTION audienceFormClickHandlers
     Adds the click handlers to the radio buttons in the audience 
     settings menu form. When a new audience is select, the 
     audPrefs table is update with the new audience. 
  */
  function audienceFormClickHandlers() {
      $('input[name="audiencelist"]').change(function () {
          console.log("CLICKED " + $(this).attr('id'));
          var newAudience = $(this).attr('id').split('-')[1];
          console.log(newAudience);
          
          // Update the audPrefs table with the new preferred audience
          var sql = "SELECT id FROM audience WHERE appAudience ='" + newAudience + "'";
          db.transaction(function (tx) {
              tx.executeSql(sql, [], updateAudiencePref);
          });
          
          
      });
  
  }
  
  /* FUNCTION updateAudiencePref
     Updates the audPrefs table with the new audience for the app. 
  */
  function updateAudiencePref(tx, results) {
      // Get the ID of the new audience
      var newAudID = results.rows.item(0)["id"];
      
      // Clear out the old audience preference and insert the new one
      audDB.transaction(function (tx) {
      tx.executeSql('Delete from audPrefs');
      var randID = guid();
      tx.executeSql('INSERT INTO audPrefs (id,audienceID) VALUES (?,?)', [randID, newAudID]);
    });
      
  }
    

//start dynamic homepage functions
    
 // Selects the appAudience and aud id for the preferred audience in the audience table
  function getPrefAud(tx){
      console.log("getPrefAud");
      var sql = "SELECT appAudience, id FROM audience WHERE isActive=1 LIMIT 1"; // 'Limit 1'is there temporarily
      db.transaction(function(tx){
          tx.executeSql(sql, [], getAudIcons);
      });
  }
    
  function getAudIcons(tx, results){
      var audience = results.rows.item(0);
      var audienceID = audience.id;
      var sql = "SELECT * FROM navtoaud as a CROSS JOIN navigation as b ON a.navid=b.id where a.audid='" + audienceID + "'";
      db.transaction(function(tx){
          tx.executeSql(sql, [], makeHomePage);
      });
  }
    
    function makeHomePage(tx, results) {
        //referencing container for all icons
        var homeAllIcons = $('#home-all-icons'); 
        
        //clearing container for all icons (don't want to add duplicates)
        homeAllIcons.html('');
        
        //adding the all information for correct icons from database, based on audience
        var iconList = [];
        var len = results.rows.length;
        for (var i = 0; i < len; i++) {
            console.log(results.rows.item(i));   
            iconList.push(results.rows.item(i));

        
        //code to be templated
        var iconTemplate = '<li class="icon-float ui-block-2x-height"><a class="ui-btn homeicon ${navAddClass}" href= ${navLink}><img src="icons/${navIcon}" class="imgResponsive svg-width ${navAddClass}-width svg"/><br>${navTitle}</a></li>';
        
        //creating templated code, adding to icon container on homepage
        $.template("buttonTemplate", iconTemplate);
        $.tmpl("buttonTemplate", iconList).appendTo('#home-all-icons'); 
        
        //formatting icon svgs
        refreshSVGs();
    }
//end dynamic homepage functions
    

  function getscrollHTML() {
    $.ajax({
                type:'post',url:'https://www.hamilton.edu/thescroll/appview.cfm'
                ,data:{}
                ,success:function(data, textStatus,e){
                    $('#scrollstories').empty().append(data).show();
                   // console.log("stories in");
                }
                }).done(function( e ) {
                     $('#scrollcontent').iscrollview("refresh");
                  //  console.log("scroll view refresh");
                });
  }



  

  function navorderCmp(fa, fb) {
    var a = fa.navorder;
    var b = fb.navorder;
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  }

  function getNavigationandPages(tx) {
    var sql = "select audienceID from audPrefs";
    db.transaction(function (tx) {
      tx.executeSql(sql, [], function (tx, results) {
        var len = results.rows.length;
        for (var i = 0; i < len; i++) {
          var audience = results.rows.item(i);
          //console.log("aud = ", audience);
          var audienceID = audience.audienceID;
          buildPages(audienceID);
          var navsql = "select n.navtitle,n.navicon,n2a.navlink,n2a.navorder from appNavs n Inner Join appNavToAudience n2a on n.id = n2a.navid where n2a.audid ='" + audienceID + "' order by navorder";
          db.transaction(function (tx) {
            tx.executeSql(navsql, [], function (tx, navresults) {
              //console.log("navresults = ", navresults);
              var pagearray = [];
              for (var i = 0; i < navresults.rows.length; i++) {
                pagearray.push(navresults.rows.item(i));
                pagearray[i].navorder += 1;
              }

              var toRemove = "dininghrs";
              pagearray = $.grep(pagearray, function(e){
                   return e.navlink != toRemove;
              });
              pagearray.unshift({
                navIcon: "fa-birthday-cake",
                navTitle: "Events",
                navlink: "events",
                navorder: 0
              });
              pagearray.push({
                navIcon: "fa-cutlery",
                navTitle: "Dining Menus",
                navlink: "diningmenus",
                navorder: 10
              });
              pagearray.push({
                navIcon: "fa-comment",
                navTitle: "Feedback",
                navlink: "feedback-page",
                navorder: 11
              });
              pagearray.push({
                navIcon: "fa-calendar",
                navTitle: "Calendar",
                navlink: "collegeCalendar",
                navorder: 12
              });

              pagearray.sort(navorderCmp);
              // sorts the list by navorder

              //console.log("pagearray = ", pagearray);
              //rowid: 8, id:"", pagetitle: "Events", pagecontents:"<p>Events</p>", pageActive: 1, navlink: "events", navTitle: "Events", navIcon: "fa-birthday-cake"});
              var navlen = pagearray.length;

              //$('.dynNavbar').html('');
              //var pagerNavTemplate = '<div><a href="#" class="navright ui-link ui-btn"><i class="fa fa-chevron-right fa-2x"></i></a></div>';
              $('.dyn-nav').html('');
              var container;
              for (var i = 0; i < navlen; i++) {
                if ((i % 3) === 0) {
                  $('.dyn-nav').append('<div class="ui-grid-b"></div>');
                  container = $('.dyn-nav > .ui-grid-b:last-child');
                }
                var navigationrow = pagearray[i];
                var navlink = navigationrow.navlink;
                var navIcon = navigationrow.navIcon;
                //var navTemplate = '<div><a href="#' + navlink + '" class="ui-link ui-btn"><i class="fa ' + navIcon + ' fa-2x"></i></a></div>';
                var blocks = ['a', 'b', 'c'];
                var navTemplate = '<div class="ui-block-' + blocks[i % 3] + ' ui-block-2x-height"><a class="ui-btn" href="#' + navlink + '"><i class="fa ' + navIcon + ' fa-2x"></i></a></div>';
                //$('.dynNavbar').append(navTemplate);
                container.append(navTemplate);
                //console.log(navTemplate);


                // if (i == 4){
                //$('.dynNavbar').append(pagerNavTemplate);
                // }else{
                //   var navTemplate = '<div><a href="#'+navlink+'" class="ui-link ui-btn"><i class="fa '+navIcon+' fa-2x"></i></a></div>';
                //$('.dynNavbar').append(navTemplate);
                //  };
              }



              //attachScroller();
              //console.log("attaching scroller");

            });
          });
        }
      });
    });
  }

  function buildPages(audienceID) {
    //var audienceID;
    var pageTemplate = '<div data-role="page" id="${id}" class="dyn"><div data-id="header" data-position="fixed" data-role="header" data-tap-toggle="false" data-transition="none" class="pageheader"><a class="backbtn"><i class="fa fa-chevron-left fa-2x iconfloat"></i><div class="hamicon"><img src="resources/ios/icon/icon-72@2x.png" class="imgResponsive" /></div></a><h1>${pagetitle}</h1></div><div data-iscroll="" data-role="content" class="ui-content"><div>${pagecontents}</div></div><footer data-role="footer" data-position="fixed" data-id="foo1"><nav data-role="navbar"><div class="container dynNavbar"></div></nav></footer>';

    //var pageTemplate='<div data-role="page" id="${id}" class="dyn"><div data-id="header" data-position="fixed" data-role="header" data-tap-toggle="false" data-transition="none" class="pageheader"><i class="fa fa-chevron-left fa-2x iconfloat"></i><div class="hamicon"><img src="resources/ios/icon/icon-72@2x.png" class="imgResponsive" /></div><h1>${pagetitle}</h1></div><div data-iscroll="" data-role="content" class="ui-content"><div>${pagecontents}</div></div><footer data-role="footer" data-position="fixed" data-id="foo1"><nav data-role="navbar"><div class="container dynNavbar"><div></div></div></nav></footer>';
    var sql = "Select p.pagetitle,p.pagecontents,p.id from Pages p Inner Join appPageToNav apn ON p.id = apn.pageid Inner Join appNavs n on apn.navid = n.id Inner Join appNavToAudience n2a on n.id = n2a.navid where p.pageactive=1 and n2a.audid ='" + audienceID + "'";
    db.transaction(function (tx) {
      tx.executeSql(sql, [], function (tx, xresults) {
        var results = xresults.rows.item(0);
        var pagelen = results.length;
        var pagearray = [];
        for (var i = 0; i < pagelen; i++) {
          pagearray.push(results.item(i));
        }
        //console.log(pagearray);
        var currentpagecount = $(".dyn").length;
        //console.log(currentpagecount);
        if (currentpagecount < pagelen) {
          $.template("attachPageTemplate", pageTemplate);
          $.tmpl("attachPageTemplate", pagearray).insertAfter('#lastStatic');
        }
      });
    });
  }

    // Function sets up the contacts list click listener. On the click of a listview item
    // the id is sent to the details page.
    function setupContactsClickListener () {

        // For each list item, add a click handler with a unique ID gotten from 
        // the phonenums db.
        $('#phonenumlist li a').each(function(){
          var elementID = $(this).attr('id');

          $(document).on('click', '#'+elementID, function(event){
              if (event.handled !== true){
                  contactListObject.itemID = elementID;
                  $.mobile.changePage("#contactdetails");
                  event.handled = true;
              }
          });
        });
    }
    
  var loadPhoneList = function (items) {
    var phonecontacts = [];
    for (var i = 0; i < items.rows.length; i++) {
      phonecontacts.push(items.rows.item(i));
    }
    var phonetemplate = '<li><a href="#" data-rel="dialog" id=${id}>${name}<br></li>';
    var permphones = '<li><a href="tel:1-315-859-4000"><span class="red">CAMPUS SAFETY (EMERGENCY)</span><br><span class="smgrey">315-859-4000</span></a</li><li><a href="tel:1-315-859-4141">Campus Safety (Non-Emergency)<br><span class="smgrey">315-859-4141</span></a></li><li><a href="tel:1-315-282-5426">Campus Safety (Tip Now) <br><span class="smgrey">315-282-5426</span></a></li><li><a href="tel:1-315-859-4340">Counseling Center<br><span class="smgrey">315-859-4340</span></a></li>';
    var pnlist = $('#phonenumlist');
    pnlist.html('');
    $.template("contactTemplate", phonetemplate);
    $.tmpl("contactTemplate", phonecontacts).appendTo('#phonenumlist');
    pnlist.prepend(permphones);
    pnlist.listview("refresh");
      
    // Setup the click listener for each list item so we can click them.
    setupContactsClickListener();
  };

  function getNumbers_success(tx, results) {
    loadPhoneList(results);
  }
    
 
  // Load the contact details. Populate the listview with phone number,
  // hours, email, and website
  var populateContactDetails = function (details) {
      
      // The database row we got for the details. Contains the info about the 
      // selected dept.
      var detailsRow = details.rows.item(0);
      
      // details should only be one row.
      var deptName = detailsRow.name;
      
      // Set header for the correct department. Select the header with 
      // id=details-header-name from the html then set its text to the 
      // name of the dept.
      var detailHeaderName = $('#details-header-name');
      detailHeaderName.text(deptName);
      
      var contactDetailsListview = $('#contact-details');
      
      // Clear the listview of any items by filling it in with empty string
      contactDetailsListview.html('');
      
      // Just get the data item from the db
      // and update the html for their listview items.
      var phoneNumber = detailsRow.phone;
      var phoneNumberHTML = '<li><a href=tel:' + phoneNumber + '>Phone<br><span class="smgrey">' 
                            + phoneNumber + '<br></span></a></li>';      
      contactDetailsListview.append(phoneNumberHTML);
      
      
      // Phone numbers
      var emailAddress = detailsRow.email;
      
      // If there is an email address in the DB
      if (emailAddress.length > 0){
        var emailAddressHTML = '<li><a href=mailto:' + emailAddress + '>Email<br><span class="smgrey">' 
                            + emailAddress + '<br></span></a></li>';
        contactDetailsListview.append(emailAddressHTML);
      }
      
      var websiteURL = detailsRow.url;
      var websiteURLHTML = '<li><a href="http://hamilton.edu' + websiteURL + '">Webpage</a></li>';
      contactDetailsListview.append(websiteURLHTML);
      
      // For office hours, we split the string by the | delimiter.
      var officeHours = detailsRow.officehours;
      
      // If the are office hours in the DB at all...
      if (officeHours.length > 0){
        var officeHoursPieces = officeHours.split("|"); // Split the officeHours 
                                                      // by the | delimiter
        // Build up the HTML and put a break between every piece of officeHoursPieces
        var officeHoursHTML = '<li data-icon="false"><a>Hours<br><span class="smgrey">';
        for (var i = 1; i < officeHoursPieces.length; i++) { // Start at one so "Office Hours"
                                                           // isn't displayed
          officeHoursHTML = officeHoursHTML + officeHoursPieces[i] + "<br>";
        }
        officeHoursHTML = officeHoursHTML + "</span></a></li>";
      
        // Put the Hours into its listview
        contactDetailsListview.append(officeHoursHTML);
      }
      
      contactDetailsListview.listview("refresh");
  }
  
  // Error is the error message from the SQL db query failure.
  function loadDetailsFailure(err) {
      alert("Error getting Details from DB: " + err)
  }
  
  // Results is the result of the db query. Called on a succesful phonenums
  // db query
  function loadDetailsSuccess(tx, results) {
      populateContactDetails(results);
  }
    
  // Get the contact details for a specific detailID from the phonenums db
  function loadContactDetails(detailsID) {
      var sql = "SELECT * FROM phonenumbers WHERE id='" + detailsID + "'";
      db.transaction(function (tx) {
        tx.executeSql(sql, [], loadDetailsSuccess, loadDetailsFailure);
      });      
  }

  function ckTable(tx, callBack, table) {
    var sql = "SELECT CASE WHEN tbl_name = '" + table + "' THEN 1 ELSE 0 END FROM sqlite_master WHERE tbl_name = '" + table + "' AND type = 'table'";
    var result = [];
    db.transaction(function (tx) {
      tx.executeSql(sql, [], function (tx, rs) {
        var newcount = rs.rows.length;
        callBack(newcount);
      }, callback_error);
    });
  }

  function ckAudTable(tx, callBack, table) {
    var sql = "SELECT CASE WHEN tbl_name = '" + table + "' THEN 1 ELSE 0 END FROM sqlite_master WHERE tbl_name = '" + table + "' AND type = 'table'";
    var result = [];
    audDB.transaction(function (tx) {
      tx.executeSql(sql, [], function (tx, rs) {
        var newcount = rs.rows.length;
        callBack(newcount);
      }, callback_error);
    });
  }
    
  function callback_error(db, error) {
    alert("Table Check Error: " + error);
  }

  function onDeviceReady() {
    // Mock device.platform property if not available
    if (!window.device) {
      window.device = {
        platform: 'Browser'
      };
    }
  }

    
  // Global string for the connection status. Either "online" or "offline"
  var connectionStatus;    
    
  // Ask the navigator if we are online.
  function checkConnection() {
    connectionStatus = navigator.onLine ? 'online' : 'offline';
  }
    
  // There is a delay in mobile browsers of 300ms.  
  // Remove it using FastClick. For when we open a browser from
  // the browser.
  $(function () {
    FastClick.attach(document.body);
  });
  // had to add handlers for external links for in app browser nonsense
  function handleExternalURLs() {
    // Handle click events for all external URLs
    //console.log(device.platform);
    /*if (device.platform.toUpperCase() === 'ANDROID') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            navigator.app.loadUrl(url, { openExternal: true });
            e.preventDefault();
        });
    }
    else if (device.platform.toUpperCase() === 'IOS') {
        $(document).on('click', 'a[href^="http"]', function (e) {
            var url = $(this).attr('href');
            window.open(url, '_system');
            e.preventDefault();
          });
    }*/

    if (device.platform === null) {
      $(document).on('click', 'a[href^="http"]', function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        window.open(url, '_system');
        return false;
      });
    }
      
      
    // want to be in-app
    else if (device.platform.toUpperCase() === 'ANDROID') {
      $(document).on('click', 'a[href^="http"]', function (e) {
          
        // Don't let the event do it's normal thing... instead...
        e.preventDefault();
        
        // Open the event in a 
        var url = $(this).attr('href');
        navigator.app.loadUrl(url, { openExternal: true });
        return false;
      });
    }
    else if (device.platform.toUpperCase() === 'IOS') {
      $(document).on('click', 'a[href^="http"]', function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
          
        // Open in-app
        window.open(url, '_blank');
        return false;
      });
    }
    else {
      $(document).on('click', 'a[href^="http"]', function (e) {
        e.preventDefault();
        var url = $(this).attr('href');
        window.open(url, '_system');
        return false;
      });
    }
  }

  /* FUNCTION setAudiencePrefTable 
     Builds the audPrefs table in the audDB */
  function setAudiencePrefTable() {
    var sql =
      "CREATE TABLE IF NOT EXISTS audPrefs ( " +
      "id varchar(50) PRIMARY KEY, " +
      "audienceID VARCHAR(50))";
    audDB.transaction(function (tx) {
      tx.executeSql(sql);
    });
  }
  
    
  /* FUNCTION PopulateAudiencePrefTable
     Initially populates the audience table when it is 
     created with a null aud ID.
  */
  function PopulateAudiencePrefTable() {
    audDB.transaction(function (tx) {
      tx.executeSql('Delete from audPrefs');
      var thisid = guid();
      tx.executeSql('INSERT INTO audPrefs (id,audienceID) VALUES (?,?)', [thisid, null]);
    });
  }

  function BuildAudienceTable(tx) {
      console.log("built audience table");
    var audsql =
      "CREATE TABLE IF NOT EXISTS audience ( " +  
      "appAudience VARCHAR(300), " +
      "id varchar(50) PRIMARY KEY, " +
      "isActive BIT)";
    db.transaction(function (tx) {
      tx.executeSql(audsql);
    });
  }

  // Content tables.
  function BuildContentTables(tx) {
      console.log("built content tables")

// new tables
    var navsql =
      "CREATE TABLE IF NOT EXISTS navigation ( " +
      "id varchar(50) PRIMARY KEY, " +
      "navAddClass VARCHAR(300), " +
      "navIcon VARCHAR(300), " +
      "navLink VARCHAR(300), " + 
      "navTitle VARCHAR(200) " +
      ")";
    db.transaction(function (tx) {
      tx.executeSql(navsql);
    });

    var navtoAudiencesql =
      "CREATE TABLE IF NOT EXISTS navtoaud  ( " +
      "audid VARCHAR(50), " +
      "id varchar(50) PRIMARY KEY, " +
      "navid VARCHAR(50), " +
      "navorder int )";
    db.transaction(function (tx) {
      tx.executeSql(navtoAudiencesql);
    });
  }
    
  /*
  Author: Ty Torregrosa 
  Cite: Jim Thomson
  
  Description: This function is a repurposed version of the function named "BuildContentTables2" in clearit.html.
  It is used to drop old tables that will no longer be used in the database (but are somehow still present in the database, despite no longer being created by any part of the code).
  
  Takes: Nothing
  Returns: Nothing
  */
  function clearTables(tx) {
    db.transaction(function (tx)
                   {
                    tx.executeSql("DROP TABLE appNavs",[],
                                  function(tx,results){console.log("Successfully Dropped");},
                                  function(tx,error){console.log("Could not delete");}
                                 );
                    tx.executeSql("DROP TABLE appNavToAudience",[],
                                  function(tx,results){console.log("Successfully Dropped2");},
                                  function(tx,error){console.log("Could not delete2");}
                                 );
                    tx.executeSql("DROP TABLE appPageToNav",[],
                                  function(tx,results){console.log("Successfully Dropped3");},
                                  function(tx,error){console.log("Could not delete3");}
                                 );
                    tx.executeSql("DROP TABLE pages",[],
                                  function(tx,results){console.log("Successfully Dropped4");},
                                  function(tx,error){console.log("Could not delete4");}
                                 );
                     tx.executeSql("DROP TABLE appAudiences",[],
                                  function(tx,results){console.log("Successfully Dropped5");},
                                  function(tx,error){console.log("Could not delete5");}
                                 );
                     tx.executeSql("DROP TABLE audPrefs",[],
                                  function(tx,results){console.log("Successfully Dropped5");},
                                  function(tx,error){console.log("Could not delete5");}
                                 );
        
            });
      
    }    

    
  /* Pull full JSON Feed */
  function loadFullJson() {
      console.log("loadfullJSON");
    $.getJSON("https://www.hamilton.edu/apppages/ajax/getalldataforTy.cfm", function (data) {
      if (data.audience.length > 0) {
        console.log("data.audience.length > 0");
        loadAudienceJson(data.audience);
      }
      if (data.navigation.length > 0) {
        loadNavigationJson(data.navigation);
      }
      if (data.navtoaud.length > 0) {
        loadNavToAudJson(data.navtoaud);
      }
    });
  }
  

    // Builds the audience database table
    function loadAudienceJson(data) {
    db.transaction(function (transaction) {
        //not sure exactly what this does, should we delete from audience?
      var len = data.length;
      if (len > 0) {
        transaction.executeSql('Delete from audience');
      }
      for (var i = 0; i < len; i++) {
        var id = data[i].id;
        var appAudience = data[i].appAudience;
        var isActive = data[i].isActive;
        transaction.executeSql('INSERT INTO audience (id,appAudience,isActive) VALUES (?,?,?)', [id, appAudience, isActive]);
      }
    });
  }
  

  // Builds the navigation table
  function loadNavigationJson(data) {
    db.transaction(function (transaction) {
      //pretty sure we need to delete from navigation (so we can check for new icons)
      var len = data.length;
      if (len > 0) {
        transaction.executeSql('Delete from navigation');
      }
      for (var i = 0; i < len; i++) {
        var id = data[i].id;
        var navTitle = data[i].navTitle;
        var navIcon = data[i].navIcon;
        var navAddClass = data[i].navAddClass;
        var navLink = data[i].navLink;
        transaction.executeSql('INSERT INTO navigation (id, navTitle, navIcon, navAddClass, navLink) VALUES (?,?,?,?,?)', [id, navTitle, navIcon, navAddClass, navLink]);
      }
    });
  }   
    
    
  // Builds the navtoaud database table
  function loadNavToAudJson(data) {
    db.transaction(function (transaction) {
      //not sure if we should delete from navtoaud, if we do it allows us to change what audiences see dynamically
      var len = data.length;
      if (len > 0) {
        transaction.executeSql('Delete from navtoaud');
      }
      for (var i = 0; i < len; i++) {
        var id = data[i].id;
        var navid = data[i].navid;
        var audid = data[i].audid;
        var navorder = data[i].navorder;
        transaction.executeSql('INSERT INTO navtoaud (id, navid, audid, navorder) VALUES (?,?,?,?)', [id, navid, audid, navorder]);
      }
    });
  }   
    

  // Builds the appPageToNav database table
  function loadappPageToNavJson(data) {
    db.transaction(function (transaction) {
      var len = data.length;
      if (len > 0) {
        transaction.executeSql('Delete from appPageToNav');
      }
      for (var i = 0; i < len; i++) {
        var id = data[i].id;
        var navid = data[i].navid;
        var pageid = data[i].pageid;
        var pageorder = data[i].pageorder;
        transaction.executeSql('INSERT INTO appPageToNav (id, navid, pageid, pageorder) VALUES (?,?,?,?)', [id, navid, pageid, pageorder]);
      }
    });
  }
    

  function BuildColorTable() {
      
      
  }
    
  function LoadColors() {
      
      
      
  }
    
  /* Check to see if version is Stale */


  // Load the app. This is what happens when you load the app for the first time after it was
  // either killed by OS or user.
  $(document).on("pagecontainerbeforechange", function (event, ui) {
    onDeviceReady(); // Wait for the device to be safe to use
    handleExternalURLs(); // Set the means of how to open new pages.
  });
    
  // A pageshow handler for the phonenums db. Currently empty cuz.
  $(document).on('pageshow', '#phonenums', function (e, data) {
    // this won't work need to check to see if there is a db if not then load it if yes then show it.
    // db.transaction(getNumbers, db_error);
  });
  // this doesn't work, might be an app vs browser thing - do more research
  //document.addEventListener('deviceready', onDeviceReady, false);

  // main worker event, find out if the db is there if the data is stale etc.
  $(document).on('pagebeforecreate', 'body', function () {
    //use this function to find out if the app has access to the internet
    checkConnection();
    if (connectionStatus === 'online') {
      console.log("online");  
      // Allocate space for the DBs
      setupDB(); 
      // Setup the phonenumbers and dining menu DBs
      phoneChecks(); 
        
      // Check the validity of the pages table, 
      // If invalid, create the audience tables. 
      clearTables();
      var table = 'pages';
      ckTable(db, function (callBack) { // Check the validity of the pages table.
        if (callBack == 0) {            // If invalid, create the audience tables.
          //create db tables
          console.log("callback == 0");
          BuildAudienceTable();
          BuildContentTables();
          //get the content and add it.
          loadFullJson();               // Then create the other tables
          getPrefAud();                 // Tets audience preference and displays all icons
        } else {
          console.log("callback != 0");
          //check versions then load whatever content you want here? or maybe just all for now just all
          loadFullJson();
        }
      }, table);
    
      // Check the validity of the audPrefs table
      table = 'audPrefs';
      ckAudTable(audDB, function (callBack) { 
        if (callBack == 0) {
            console.log("callback == 0");
          // Audience table does not exist - create it
          setAudiencePrefTable();
            
          // Populate the audience table - audience ID is NULL  
          // upon table creation (i.e no audience has been set yet)
          PopulateAudiencePrefTable();
        } 
      }, table);
        
      //Color CSS Switcher- unsure if necessary    
      var table = 'colors'; // Set the colors table appropriately
      ckTable(db, function (callBack) {
        if (callBack == 0) {
          //create db tables
          BuildColorTable();
          
        } else {
          //table exists, use preferred css colors
          LoadColors();
        }
      }, table);

    } else {
      // do something else
    }
  });

  // Load the phone numbers for the contacts menu. Gets info from db.
  $(document).on('pagebeforeshow', '#phonenums', function (e, data) {
    loadPhoneJson(); // Load listview
  });
    
  // Check the radio button for the current audience before showing the page
  // Adds click handler to each radio button to update the database
  $(document).on('pagebeforeshow','#changeaudience', function() {
      createAudienceForm(); 
  });
    
  // CONTACT DETAILS
  $(document).on('pagebeforeshow', '#contactdetails', function(){   
      loadContactDetails(contactListObject.itemID);
  });

    // Load the scroll HTML for the Scroll view. Gets info from db.   
    $(document).on('pagebeforeshow', '#scroll', function (e, data) {
     getscrollHTML();
  });

  // Load the dining menu to the screen.
  $(document).on('pagebeforeshow', '#diningmenus', function (e, data) {
    //loadDiningJSON();
    loadAllDiningJSON(0);
    $( "#diningmenus .ldr" ).loader({
      defaults: true,
      theme: 'b'
    });

    $(".dining-back-btn").removeClass('ui-btn-right').addClass('ui-btn-left');
      
    // On a click of a dining hall...
    $(".dining-halls ul.diningmenuholder li a").click(function () {
      var id = $(this).parent().attr("data-bamco-id"); // Get the dining hall name
      initializeDiningHall(id);                        // Load from the db its menu
      $(".dining-halls").css("display", "none");       // Display
    });
    var currentDiningDayDelta = 0;                     // Keep track diff from current day
    
    // Select previous day...  
    $("#prev-day").click(function(){
      currentDiningDayDelta -= 1;                      // decrement delta
      console.log("loading", currentDiningDayDelta);   // Load the other day
      $( ".ldr" ).loader("show");                      // Loading... (because of async)
      $.mobile.loading( "show" );                      // Show loading screen
      jsonNotLoadedInitially = true;

      loadAllDiningJSON(currentDiningDayDelta);        // Load the full details
    });
    $("#next-day").click(function(){
      currentDiningDayDelta += 1;
      console.log("loading", currentDiningDayDelta);
      $( ".ldr" ).loader("show");
      $.mobile.loading( "show" );
      jsonNotLoadedInitially = true;
      loadAllDiningJSON(currentDiningDayDelta);
    });
  });

    
    
    
    
  var feedbackSentDone = function(data, textStatus, jqXHR) {
    if (jqXHR.status == 200) {
      $("#feedback-sent-popup").text(data);
      $("#feedback-sent-popup").popup("open");
      console.log("success!");
    } else {
      console.log("failure :(");
    }
  };
  $(document).on('pagebeforeshow', '#feedback-page', function (e, data) {
    //$('[data-role="navbar"]').navbar();
    $('#feedback-navbarcont').find('.xnavbar > li > a').removeClass('ui-btn-icon-top');
    $('form.feedback').submit(function(e){
      e.preventDefault();
      e.stopPropagation();

      var xfer = $.ajax({
        method: 'POST',
        url: 'https://www.hamilton.edu/appPages/ajax/collectFeedback.cfm',
        data: {
          isBug: false,
          email: $('#feedback-email').val(),
          description: $('#feedback-text').val(),
          platform:  device.platform
        }
      }).done(feedbackSentDone);
    });
  });

    //bug reporting notification function
  var bugReportDone = function(data, textStatus, jqXHR) {
    if (jqXHR.status == 200) {
      $("#bug-reported-popup").text(data);
      $("#bug-reported-popup").popup("open");
    } else {
      console.log("failure :(");
    }
  };
    
    //sending bug report to server, before page loads
  $(document).on('pagebeforeshow', '#feedback-bug', function (e, data) {
    $('#feedback-bug-navbarcont').find('.xnavbar > li > a').removeClass('ui-btn-icon-top');
    $('form.bug').submit(function(e){
      e.preventDefault();
      e.stopPropagation();

      var xfer = $.ajax({
        method: 'POST',
        url: 'https://www.hamilton.edu/appPages/ajax/collectFeedback.cfm',
        data: {
          isBug: true,
          description: $('#bug-description-text').val(),
          reproductionSteps: $('#bug-reproduction-text').val(),
          email: $('#bug-email').val(),
          platform:  device.platform,
          consoleDump: errorConsole
        }
      }).done(bugReportDone);
    });
  });
    
//SCROLL CLICK BEHAVIOR
 $(document).on("click",".scrollLikeBlank", function(e){
            var clickedItem = $(this);
            var identifier = $('#identifier').val();
            var cid = $('#cid').val();
            var storyid= $(this).data("storyid");
            $.ajax({
                type:'post',url:'https://www.hamilton.edu/thescroll/assets/ajax/appscrollLike.cfm'
                ,data:{identifier: identifier,cid:cid,storyid:storyid}
                ,success:function(data, textStatus,e){
                   clickedItem.removeClass( "scrollLikeBlank" ).addClass('scrollLikeFull');
                      $('#likecount'+storyid).empty().append(data).show();
                    }
                });
       
            });
        $(document).on("click",".scrollLikeFull", function(e){
            var clickedItem = $(this);
            var identifier = $('#identifier').val();
            var cid = $('#cid').val();
            var storyid= $(this).data("storyid");
     
            $.ajax({
                type:'post',url:'https://www.hamilton.edu/thescroll/assets/ajax/appscrollLike.cfm'
                ,data:{identifier: identifier,cid:cid,storyid:storyid,remove:1}
                ,success:function(data, textStatus,e){
                      clickedItem.removeClass( "scrollLikeFull" ).addClass('scrollLikeBlank');
                              $('#likecount'+storyid).empty().append(data).show();
                                      }
                });
           });
  $(document).on('pagebeforeshow', '.dyn', function (e, data) {
    var pageid = ($.mobile.activePage.attr('id'));
    var htmlcontent = $('#' + pageid + '>.ui-content>.iscroll-scroller>.iscroll-content div').text();
    $('#' + pageid + '>.ui-content>.iscroll-scroller>.iscroll-content').html('').html(htmlcontent);
  });

//RSS UPDATE    
  var initRSSList = function(name, url){
    var eventList = $('<ul data-role="listview" class="widelist" id="' + name + 'Listview"></ul>');
    grabRssFeed(url,
      function(data){
        console.log(data);
        data.feed.entries.forEach(function(el) {
          var contab = $('<a class="ui-link"></a>').attr('href', el.link);
          contab.append($('<div class="title">' + el.title + '</div>'));
          
          var momentDate = moment(el.publishedDate, 'ddd, DD MMM YYYY hh:mm:ss Z');
          // This hardcodes the parse format of the date as it is encoded in the rss
          // feed. For events (i.e. 25live) this is beyond our control and may change.
          // Moment deprecated the date interpreting system (where it would just
          // figure out the date). If this format spec stops working, you may use 
          // new Date(el.publishedDate) but that is generally unreliable as it is
          // highly browser-specific and not well documented.
          
          contab.append($('<span class="date">' + momentDate.format("MMM D YYYY, h:mma") + '</span>'));
          contab.append($('<div class="desc">' + el.contentSnippet + '</div>'));

          eventList.append($('<li/>').append(contab));
        });
        var rssFeedObj = $('#'+name+' .rssFeed');
        rssFeedObj.html(eventList);
        rssFeedObj.enhanceWithin();

        $('#'+name+'Listview').listview("refresh");
        $('#'+name+' .eventsholder').iscrollview('refresh');
        
      }
    );
  };

  //news rss load and rebind
  $(document).on('pagebeforeshow', '#news', function (e, data) {
    /*$('#news').find('.iscroll-content').rssfeed('http://students.hamilton.edu/rss/articles.cfm?item=A9AAF6B5-FB82-2ADF-26A75A82CDDD1221', {
      limit: 25,
      linktarget: '_blank',
      header: false
    }, rewriteClass);*/
    initRSSList('news', 'http://students.hamilton.edu/rss/articles.cfm?item=A9AAF6B5-FB82-2ADF-26A75A82CDDD1221');
  });
  $(document).on('pagebeforeshow', '#ham-news', function (e, data) {
    initRSSList('ham-news', 'https://www.hamilton.edu/news/rss/news.cfm?tag=news%20item');
  });


//EVENTS
  $(document).on('pagebeforeshow', '#events', function (e, data) {
    initRSSList('events', 'https://25livepub.collegenet.com/calendars/hamilton-college-open-to-the-public.rss');
  });
    
//ATHLETICS    
  $(document).on('pagebeforeshow', '#athleticEvents', function (e, data) {
    initRSSList('athleticEvents', 'http://25livepub.collegenet.com/calendars/Hamilton_College_Athletic_Competitions.rss');
  });

//EVENTS >> ART EVENTS
  $(document).on('pagebeforeshow', '#artEvents', function (e, data) {
    initRSSList('artEvents', 'http://25livepub.collegenet.com/calendars/hamilton-college-performances.rss');
      
  });
   
//EVENTS >> ALUMNI EVENTS    
  $(document).on('pagebeforeshow', '#alumniEvents', function (e, data) {
    initRSSList('alumniEvents', 'http://25livepub.collegenet.com/calendars/hamilton-college-alumni-and-parent-events.rss');
  });
  
  $(document).on('pageshow', function() {
      // This fixes the padding issue with dynamic content
      // Basically the header would obscure the listview loaded beneath it;
      // This uses jquery mobile's layout logic to solve that
       $( "[data-position='fixed']" ).trigger( 'updatelayout' );
   });
  
  /*$(document).on('pagebeforeshow', function (event, ui) {
    //var shownPage = $(".ui-page.ui-page-theme-a.ui-page-header-fixed.ui-page-footer-fixed.iscroll-page.ui-page-active");
    //console.log(ui.toPage[0]);
    //attachScroller($(ui.toPage[0]));
  });*/

  // load campus map after page shows - don't know why I have to do this though.
  $(document).on('pageshow', '#map', function (e, data) {
    setTimeout(function () {
      $.getScript("js/campus.map.js", function (data, textStatus, jqxhr) {});
    }, 100);
  });

//WEBCAM
  $(document).on('pagebeforeshow', '#webcam', function (e, data) {
    $("#webcam-img-container").append($('<img src="http://150.209.65.30:80/mjpg/video.mjpg" height="480" width="640" class="" id="webcam-img" style="width:100%;height:auto" alt="Camera Image">'));
  });
  $(document).on('pagehide', '#webcam', function(e, data) {
    $("#webcam-img-container").empty();
  });
  $(document).on("mobileinit", function () {
 
      // Setting #container div as a jqm pageContainer
      $.mobile.pageContainer = $('#container');

      // Setting default page transition to slide
      $.mobile.defaultPageTransition = 'slide';
    $.mobile.ajaxEnabled = true;

  });
    
//RADIO 
  var songUpdateInterval;
  var updateSong = function() {
    grabRssFeed('http://spinitron.com/public/rss.php?station=whcl', function(data){
      var el = $(this);

      $('#song-container').text(data.feed.entries[0].title);

    }, true, 1);
  };
  $(document).on('pagebeforeshow', '#radio', function (e, data) {
    updateSong();
    songUpdateInterval = setInterval(updateSong, 3800);

  });
  $(document).on('pagehide', '#radio', function(e, data) {
    clearInterval(songUpdateInterval);
  });

  //KJD Necessary for SVG images (icons)
  $(document).on('pagebeforeshow', '#home', function (e, data) {
    refreshSVGs(e, data);
  });

  /*Ty's Note: I took this code out of the event listener above ('pagebeforeshow', '#home') because it needs to happen after icons are created as well.*/
  function refreshSVGs(e, data) {
      jQuery('img.svg').each(function(){
          var $img = jQuery(this);
          var imgID = $img.attr('id');
          var imgClass = $img.attr('class');
          var imgURL = $img.attr('src');

          jQuery.get(imgURL, function(data) {
              // Get the SVG tag, ignore the rest
              var $svg = jQuery(data).find('svg');

              // Add replaced image's ID to the new SVG
              if(typeof imgID !== 'undefined') {
                  $svg = $svg.attr('id', imgID);
              }
              // Add replaced image's classes to the new SVG
              if(typeof imgClass !== 'undefined') {
                  $svg = $svg.attr('class', imgClass+' replaced-svg');
              }

              // Remove any invalid XML tags as per http://validator.w3.org
              $svg = $svg.removeAttr('xmlns:a');

              // Replace image with new SVG
              $img.replaceWith($svg);

          }, 'xml');

      });
  };


    
  $(function() {
  $('.cal').hover(function() {
    $('#cap').css('color', "rgb(214,  186,  139)");
  }, function() {
    $('#cap').css('color', 'rgb(0,  47,  134)');
  });
});
    
  
    })();
;
    
var contactListObject = {
    itemID : null
}
