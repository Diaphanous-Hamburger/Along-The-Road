var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var Actions = {

  // What does this do?
  initRoutes: function(newRoutes) { //get all routes and save to RouteStore
    AppDispatcher.dispatch({
      actionType: Constants.INIT_ROUTES,
      newRoutes
    });    
  }, 

  /********* LEGACY ********/

  query: function() {
    AppDispatcher.dispatch({
      actionType: Constants.QUERY_WAYPOINTS,
    });
  },

  addVenues: function(results, point){
    // console.log("Actions ----> addVenues")
    AppDispatcher.dispatch({
      actionType: Constants.ADD_VENUES,
      results: results, 
      point: point
    });
  },

  sortVenues: function() {
    AppDispatcher.dispatch({
      actionType: Constants.SORT_VENUES
    });
  },

  priceFilter: function(tier){
    AppDispatcher.dispatch({
      actionType: Constants.PRICE_FILTER,
      tier: tier
    });
  },
  ratingFilter: function(minRating) {
    AppDispatcher.dispatch({
      actionType: Constants.RATING_FILTER,
      minRating: minRating
    })
  },
  clearData: function() {
    AppDispatcher.dispatch({
      actionType: Constants.CLEAR_DATA
    });
  },
  openNowFilter: function() {
    AppDispatcher.dispatch({
      actionType: Constants.OPEN_NOW_FILTER,
    });
  },
  clearFilter: function() {
    AppDispatcher.dispatch({
      actionType: Constants.CLEAR_FILTER,
    });
  },
  selectRoute: function(index) {
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_ROUTE,
      index: index
    });
  },
  selectVenue: function(venue_id) {
    console.log("Actions ----> selectRoute")
    AppDispatcher.dispatch({
      actionType: Constants.SELECT_VENUE,
      venue_id: venue_id
    });
  },
  addWaypoints: function(wayPoints){
    AppDispatcher.dispatch({
      actionType: Constants.ADD_WAYPOINTS,
      wayPoints: wayPoints
    })
  }

};

module.exports = Actions;