/*
This component is the overView. It shows the user the possible routes he/she can take to arrive at the destination
*/

var React = require('react');
var MapView = require('./mapView');
var RouteDetailView = require('./routeDetailView');
var ListView = require('./listView');
var ToolView = require('./toolView');

var MapHelpers = require('../helpers/mapHelpers');

/***************
****** MUI *****
****************/
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Card, CardHeader, CardMedia, CardActions, CardText, Avatar, CardTitle} = mui;

// var QueryStore = require('../stores/QueryStore');

var Actions = require('../actions/Actions.js');
var RouteStore = require('../stores/RouteStore');

var overView = React.createClass({
  // adds access to the router context. the getCurrentParams method can then be used to get the properties from the route
  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState () {
    return {
      routes: [],
      currentRoute: null, // current route in the form of a polyline object
      // searchRadius: this.defaultOptions.radius
    }
  },

  //default options to be used for this view, inclusind route options and radius of search
  defaultOptions: {
    polyline: { //configuration for inactive polylines
      zIndex: 1,
      strokeOpacity: 0.4,
      strokeWeight: 6
    },
    radius: 5, // radius used to generate wayPoints, in km.
    routePalette: ['blue', 'black', 'green', 'pink'],

    _fourSquare: {
      fourSquare_url: "https://api.foursquare.com/v2/venues/explore?client_id=ELLZUH013LMEXWRWGBOSNBTXE3NV02IUUO3ZFPVFFSZYLA30&client_secret=U2EQ1N1J4EAG4XH4QO4HCZTGM3FCWDLXU2WJ0OPTD2Q3YUKF&v=20150902",
      foodCategory_url: "&categoryId=4d4b7105d754a06374d81259",
      limit_url: "&limit=10",
      photos_url: "&venuePhotos=1",
      category_url: "&section=food",
      distance_url: "&sortByDistance=0"  
    }
  },

  // this is called after the first render of the component
  componentDidMount () {
    // QueryStore.addChangeListener(this.updateResults)

    /****** INITIALIZE MAP ******/
    var {origin, destination} = this.context.router.getCurrentParams();
    this.state.origin = origin;
    var start = MapHelpers.getLatLong(origin);
    var end = MapHelpers.getLatLong(destination);
    var map = MapHelpers.initializeMap(start);
    window.map = map; 

    /****** CREATE START/END MARKERS *******/
    MapHelpers.initializeMarkers(start, end, map);

    /****** ZOOM ******/
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);

    /****** FLUX:  ******/
    RouteStore.addChangeListener(function(){
      var routes = RouteStore.getRoutes();
      var currentRoute = RouteStore.getCurrentRoute();
      // console.log("$$$$$$$$$$$ RouteStore returned. currentRoute = ", currentRoute);
      
      //The only place we are going to set state
      this.setState({
        routes, 
        currentRoute
      });

    }.bind(this)); //update routes



    /****** BEGIN APP INITIALIZATION *****/ 
    this.getRoutes(start, end, map);

  }, //componentDidMount()

  // SETUP PHASE STEP 1: Obtain routes from Google Maps Api
  // NOTE: asyncronous function
  getRoutes (start, end, map) {
    var directionsService = new google.maps.DirectionsService();
    var component = this;

    /****** GET ROUTES *******/
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    }; //request
    
    // func: Asynchronously gets routes from google
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) { //.OK indicates the response contains a valid DirectionsResult.
        var newRoutes = []; //empty array for storing route polylines
        var colors = component.defaultOptions.routePalette;

        response.routes.forEach(function(googleRoute, i){

          // create a polyline for each suggested googleRoute
          var newRoute = new google.maps.Polyline({
            path: googleRoute.overview_path,
            strokeColor: colors[i],
            map
          });

          newRoute.setOptions(component.defaultOptions.polyline);

          newRoute.path = googleRoute.overview_path; //saved for future use
          newRoute.color = colors[i];
          newRoute.distance = googleRoute.legs[0].distance.text;
          newRoute.distanceMeters = googleRoute.legs[0].distance.value;
          newRoute.duration = googleRoute.legs[0].duration.text;

          // derived properties
          newRoute.index = i; //tracks position in routes array
          newRoute.allVenues = {}; //all venues found 
          newRoute.filteredVenues = []; //processed (filtered OR sorted) venues to be displayed
          newRoute.queryIndex = 1; //where we begin with queries, defaults to 0
          newRoute.queryComplete = false; //whether all waypoints have been queried. Defaults to false
          var radius = MapHelpers.getSearchRadius(newRoute);
          newRoute.searchRadius = radius;
          newRoute.wayPoints = MapHelpers.getWayPoints(newRoute, radius); //syncronously get waypoints for select googleRoute
          newRoute.addListener('click', component.changeCurrentRoute.bind(component, newRoute));

          newRoutes.push(newRoute); // save routes in array
          
          

        }); //for(routes)
        
        Actions.initRoutes(newRoutes);
        
        component.changeCurrentRoute(RouteStore.getCurrentRoute()); //load the first route
      } // if(success)
    }); //directionsService.route callback

  }, //getRoutes()

  loadMore () {
    var queryIndex = this.state.currentRoute.queryIndex;
    var queries = this.state.currentRoute.wayPoints.slice(queryIndex, queryIndex+20);
    this.getFourSquare(queries); //getFourSquare
    this.state.currentRoute.queryIndex+=20;

  },

  // Event: switch the route and update the active venues
  changeCurrentRoute (newRoute) {
    // console.log("overView ------> changeCurrentRoute() newRoute=", newRoute);
    
    /******** UPDATE POLYLINES *********/
    this.state.currentRoute.setOptions(this.defaultOptions.polyline); //hide old route
    newRoute.setOptions({zIndex: 2, strokeOpacity: 1}); //show currentRoute

    Actions.selectRoute(newRoute.index);

    /******** QUERY FOR VENUES *********/
    if(Object.keys(newRoute.allVenues).length===0){
      this.loadMore();
    } //if


  }, // changeCurrentRoute()


  // SETUP PHASE (STEP 3): Obtain waypoints for each route
  // NOTE: asyncronous function
  //queries fourSquare api to get new results.
  //save results to the current route and updates the parent (mapView)
  //re-render results onto the page by updating state variable.
  getFourSquare (wayPoints) {

    // var index = currentRoute.queryIndex;
    // if(index<wayPoints.length){
      
    // }
    // var max = index+2; 
    // var results = {}; //test against duplicates
    // var component = this;
    // if(max>wayPoints.length){

    // }
    var count = wayPoints.length;
    
    // for(var i=index; i<max; i++){
    for(var i=0; i<wayPoints.length; i++){
      var point = wayPoints[i]; 
      var ll = "&ll=" + point.G+"," + point.K;
      var radius_url = "&radius=" + this.state.currentRoute.searchRadius * 1000;

      //These two properties ensure that the data is only displayed once all of the requests have returned
      //It is important for the speed of the app and ensuring that everything works
      // var sortingPoint = wayPoints.length%20-1;
      // var count = 1;

      var {fourSquare_url, foodCategory_url, category_url, limit_url, photos_url, distance_url} = this.defaultOptions._fourSquare;

      $.ajax({
        url: fourSquare_url + ll + category_url + radius_url + limit_url + photos_url + distance_url,
        method: "GET",
        success: function(data){
          count--;
          var point = this; // waypoint used for query, bound to this for for callback
          var venue_wrappers = data.response.groups[0].items; //extract venues array from data
          Actions.addVenues(venue_wrappers, point);
          if(count === 0 ){
            Actions.sortVenues();
          }
        }.bind(point), 
        error: function(error){
          count--;
          console.log("TEST -------> fourSquare error, error=", error);
        }
      }); //ajax()

    }; //for()
  }, // getFourSquare()


  render () {
    var that = this;
    return (
      <div className = 'container-fluid' style = {{'height': '100%'}} >
        <div className = 'row' style={{'height': '100%', 'width': '100%'}}>
          <div className = 'col-sm-5 left-container'>

            <div className = 'tool-bar-container' style={{"backgroundColor": "purple"}} >
              <ToolView
                loadMore = {this.loadMore}
              /> {/* ToolView */}
            </div>

            <div
              className = 'list-container'
              /*onScroll={function(){console.log("TEST $$$$$$$$$ onScroll()")}}*/
            > {/* div.list-container */}
                <ListView
                  // currentRoute={this.state.currentRoute}
                  currentRoute = {this.state.currentRoute}
                  origin = {this.state.origin}

                /> {/* ListView*/}

            </div> {/* list-container */}

          </div> {/* col-sm-4 */}

          <div className='col-sm-7 right-container'>
            <div className='row map-container'>
              <MapView 
                currentRoute={this.state.currentRoute} 
                id="map"
                origin = {this.state.origin}

              /> {/* MapView */}
            </div> {/* row */}

            <div className='row route-container'>
              <RouteDetailView
                routes={this.state.routes}
                changeCurrentRoute={this.changeCurrentRoute}
              /> {/* RouteDetailView */}
            </div> {/* row */}


          </div> {/* col-sm-8 */}

        </div> {/* row */}
      </div>
    )
  }
});

module.exports = overView;
