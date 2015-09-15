/* The only store we are going to use, contains information of all routes, attached waypoints, venues, filtered venues, etc... */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

/********* OUR STORE DATA ***********/

var routes = []; //Stores the last waypoint searched in for that route
var currentRoute = 0;
var _venueFilters = {
  ratingFilter: -1, 
  priceFilter: -1,  
  openNowFilter: false
};


/********* OUR ACTION RESPONSE ***********/

/*** PAYTON ***/
function initRoutes (newRoutes){
  // console.log("RouteStore inside initRoutes. routes = ", newRoutes)
  routes = newRoutes; 
  currentRoute = routes[0]; //set default currentRoute to first result
} //initRoutes

function sortVenues() {
  currentRoute.filteredVenues.sort(function(a,b){
    return a.totalDistance - b.totalDistance;
  });
}
function addVenues(venue_wrappers, point){
    //NOTE: point is used for calulating total distance, which is equal to distance of point to origin, plus distance of point to venue


    // count++;
    // var prevResults = newRoute.results || {}; //results is a hash for quick checking
    var newResults = {};
    var newResultsArr = [];
    var allVenues = currentRoute.allVenues;

    venue_wrappers.forEach(function(venue_wrapper, i){
      var venue = venue_wrapper.venue;
      venue.totalDistance = venue.location.distance + point.distance; // in meters
      //remove duplicate venues 
      if (!allVenues[venue.id]) { // if venue does NOT exist already 
          // newResults[venue.id] = venue; //save into newResults 
          allVenues[venue.id] = venue; //save to allVenues
      } else { // if venue is brand new, on
        // NOTE: only save if new result is closer to radii than the one from before; THEN: save the new result, get rid of previous; ELSE: don't save new venue
        if (allVenues[venue.id].location.distance > venue.location.distance) {
          allVenues[venue.id] = venue; //save to allVenues
        } //if
      } //if
    }); //forEach(venues)

    //NOTE: allVenues has completed update
    /***** updated filteredVenues *****/
    for (var venue_id in allVenues) { //convert newResults object into array
      newResultsArr.push(newResults[venue_id]); //push value into array
    } 

    currentRoute.filteredVenues = getFilteredArr(); //NOTE: get back a filtered and sorted array
} //addVenues()


function setCurrentRoute (index) {
  //First save the old data
  //Then find current one and set data to that
  currentRoute = routes[index];

}

function getFilteredArr () {    
  var filteredVenues = [];
  var allVenues = currentRoute.allVenues;
  // console.log("$$$$$$$$$$$$ getFilteredArr &&&&&& allvenues = ", allVenues)
  var {ratingFilter, priceFilter, openNowFilter} = _venueFilters;

  for(var id in allVenues){
    var venue = allVenues[id];
    var valid = true;

    //Ratings
    if(ratingFilter !==-1 ){
      if(!venue.rating){
        valid = false;
      } else if (venue.rating < ratingFilter){
        valid = false;
      }
    }

    //Price
    if(priceFilter !== -1){
      if(!venue.price) {
        valid = false;
      } else if (!(venue.price.tier)){
        valid = false;
      } else if (!(venue.price.tier === priceFilter) ){
        valid = false;
      }
    }

    //Open now filter
    if(openNowFilter){
      if(!venue.hours || !venue.hours.isOpen){
        valid = false;
      }
    }

    if(valid) {
        filteredVenues.push(venue);
    }
    
  } //for(allVenues)

  return filteredVenues;
} //getFilteredArr()


/*** LINUS ***/
// function setCurrentRoute (index) {
//   currentRoute = index;
// }

// function addWaypoints (waypoints) {
//   routeData.push({waypoints: waypoints, index: 1});
// }

/*****************
******************
*STORE CALLBACKS
******************
*****************/

var Store = assign({}, EventEmitter.prototype, {
  /* Payton */

  getRoutes: function() {
    return routes; 
  }, 

  getCurrentRoute: function() {
    return currentRoute; 
  }, 



  /* Linus */
  // getWaypoints: function(){
  //   var temp = routeData[currentRoute].waypoints.slice(routeData[currentRoute].index, 20);
  //   routeData[currentRoute].index+=20;
  //   console.log(temp, routeData[currentRoute].index);
  //   return temp;
  // },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case Constants.INIT_ROUTES: // initializes after a new trip is defined
      initRoutes(action.newRoutes);  
      Store.emitChange();
      break;

    case Constants.ADD_VENUES:
      addVenues(action.results, action.point);
      Store.emitChange();
      break;

    case Constants.SELECT_ROUTE:
      setCurrentRoute(action.index);
      Store.emitChange();
      break;

    case Constants.PRICE_FILTER: 
      _venueFilters.priceFilter = action.tier;
      currentRoute.filteredVenues = getFilteredArr();
      sortVenues();
      Store.emitChange();
      break;
    case Constants.RATING_FILTER: 
      _venueFilters.ratingFilter = action.minRating;
      currentRoute.filteredVenues = getFilteredArr();
      sortVenues();
      Store.emitChange();
      break;
    
    case Constants.OPEN_NOW_FILTER:
      _venueFilters.openNowFilter = !_venueFilters.openNowFilter; 
      currentRoute.filteredVenues = getFilteredArr();
      sortVenues();
      Store.emitChange();
      break;
    case Constants.CLEAR_FILTER:
      _venueFilters.openNowFilter = false; 
      _venueFilters.ratingFilter = -1; 
      _venueFilters.priceFilter = -1; 
      currentRoute.filteredVenues = getFilteredArr(); 
      sortVenues();
      Store.emitChange();
      break;
    case Constants.SORT_VENUES:
      sortVenues();
      Store.emitChange();
      break;


    // case Constants.CLEAR_DATA:
    //     routeData = [];
    //     currentRoute = 0;
    //     break;
    // case Constants.ADD_WAYPOINTS:
    //     addWaypoints(action.wayPoints);
    //     break;

    default:
      // no op
  }
});

module.exports = Store;
