/*
This view shows the details of the possible routes from origin to destination
*/

var React = require('react');
var VenueView = require('./venueView')

var ListView = React.createClass({

  propTypes: {
    currentRoute: React.PropTypes.object.isRequired,
    updateResults: React.PropTypes.func.isRequired,
    searchRadius: React.PropTypes.number.isRequired
  },

  getInitialState () {
    return {
      filterOptions: {}
    }
  },

  defaultOptions: {
    fourSquare_url: "https://api.foursquare.com/v2/venues/explore?client_id=THM343VWNYYUYSO1WHDTDP0GPKWC4Q3Q3UTFGEUJ10OWEUKE&client_secret=NZWHYIAF5FETD1M3QTIAHELXW5ZFJOWOCCRRGHOPPKBUAXEY&v=20150902",
    foodCategory_url: "&categoryId=4d4b7105d754a06374d81259",
    limit_url: "&limit=10",
    photos_url: "&venuePhotos=1",
    category_url: "&section=food",
    distance_url: "&sortByDistance=0"
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentRoute.wayPoints.length && !this.props.currentRoute.results.length) {
      this.queryFourSquare();
    }
  },

  //queries fourSquare api to get new results.
  //save results to the current route and updates the parent (mapView)
  //re-render results onto the page by updating state variable.
  queryFourSquare (){
    var results = {}; //test against duplicates
    var component = this;

    var wayPoints = this.props.currentRoute.wayPoints;

    for (var i = 1; i < wayPoints.length; i++) {
      var point = wayPoints[i];
      var ll = "&ll="+point.G+","+point.K;
      var radius_url = "&radius="+this.props.searchRadius*1000;


      var {fourSquare_url, foodCategory_url, category_url, limit_url, photos_url, distance_url} = this.defaultOptions;
      $.ajax({
        url: fourSquare_url+ll+category_url+radius_url+limit_url+photos_url+distance_url,
        method: "GET",
        success: function(data){
          var venues = data.response.groups[0].items;

          var point = this;

          // loops through venues and adds them to results object and also removes duplicates by only saving the duplicate venue with the smallest distance property
          for (var i = 0; i < venues.length; i++) {
            var venue = venues[i].venue;
            venue.point = point;

            venue.totalDistance = venue.location.distance + venue.point.distance; // in meters
            if (!results[venue.id]) { // if
                results[venue.id] = venue;
            } else {
              if (results[venue.id].location.distance > venue.location.distance) {
                results[venue.id] = venue;
              }
            } //if
          } //for

          var resultsArray = [];
          for (var id in results) {
            resultsArray.push(results[id]);
          }

          component.sortBy("distance", resultsArray); // sort by distance by default

          // TESTING!!!! remove this line of code
          //resultsArray = component.filterWith({price: ["$", "$$$"], rating: 8, openNow: true},resultsArray);

          if (resultsArray.length) {
            component.props.updateResults(resultsArray);
          }

        }.bind(point), //success()
        error: function(error){
          console.log("TEST -------> fourSquare error, error=", error);
        }
        // dataType: dataType
      }); //ajax()
    } //for

  }, // queryFourSquare()

  sortBy(criterion, array) {
    var compareFns = {
      distance: function(a, b) { // closest first
            return a.totalDistance - b.totalDistance;
          },
      rating: function(a, b) { // higher rating first
          return b.rating - a.rating;
      }
    };

    array.sort(compareFns[criterion]);
  }, // sortBy()

  filter(array) { // filterOptions is an object with price, rating, and openNow as keys, and the appropriate filter params as the values
    var filterOptions = this.state.filterOptions;
    var filterFns = {
      price: function(venue, priceOptions) { // options is an array of desired dollar signs
        var msgToDollarSigns = {
          "Cheap": "$",
          "Moderate": "$$",
          "Expensive": "$$$",
          "Very Expensive": "$$$$"
        };
        var price = venue.price;
        var priceText = price && price.message ? msgToDollarSigns[price.message] : "N/A";
        return priceOptions.indexOf(priceText) !== -1;
      },
      rating: function(venue, minRating) {
        return !!(venue.rating && venue.rating > minRating);
      },
      openNow: function(venue, on) { // on is a boolean indicating whether or not to filter by open now
        if (!on) {
          return true;
        }
        var hours = venue.hours;
        return hours && hours.status && hours.status.toLowerCase().includes('open');
      }
    }; // filterFns


    var filteredArray = [];
    array.forEach(function(venue) {
      var stillTrue = true;
      for (var filter in filterOptions) {
        console.log("     filtering by ",filter,"with options: ",filterOptions[filter]);
        stillTrue = stillTrue && filterFns[filter](venue, filterOptions[filter]);
      }
      if (stillTrue) {
        filteredArray.push(venue);
      }
    });
    
    return filteredArray;
  }, // filter()

  render () {


    console.log("RE-RENDERING HERE!! -------------",this.state.filterOptions);

    var component = this;

    var togglePriceOption = function(dollarSigns) {
      console.log("this from togglePriceOption -----------------------",this);
      alert(arguments[0]);
      if (!this.state.filterOptions.price) {
        this.state.filterOptions.price = [];
      }
      var idx = this.state.filterOptions.price.indexOf(dollarSigns);
      if (idx === -1) {
        this.state.filterOptions.price.push(dollarSigns);
      } else {
        this.state.filterOptions.price.splice(idx, 1);
      }
      console.log("filter options from togglePriceOption -------------",this.state.filterOptions);
      this.setState({});
    };

    var toggleOpenNow = function() {
      this.state.filterOptions.openNow = !this.state.filterOptions.openNow;


      console.log("filter options from toggleOpenNow -------------",this.state.filterOptions);
      this.setState({});
    };


    var priceFilter = (
      <div className="btn-group filter price-filter" role="group" aria-label="...">
        <button type="button" className="btn btn-default" data-toggle="button" onClick={togglePriceOption.bind(this, "$")}>$</button>
        <button type="button" className="btn btn-default" data-toggle="button" onClick={togglePriceOption.bind(this, "$$")}>$$</button>
        <button type="button" className="btn btn-default" data-toggle="button" onClick={togglePriceOption.bind(this, "$$$")}>$$$</button>
        <button type="button" className="btn btn-default" data-toggle="button" onClick={togglePriceOption.bind(this, "$$$$")}>$$$$</button>
      </div>
    );

    var ratingFilter = (
      <div className="dropdown filter rating-filter">
        <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          Rating
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
          <li><a href="#">7 or higher</a></li>
          <li><a href="#">8 or higher</a></li>
          <li><a href="#">9 or higher</a></li>
        </ul>
      </div>
      );

    var openNowFilter = (
      <div className="btn-group filter open-now-filter" role="group" aria-label="...">
        <button type="button" className="btn btn-default" data-toggle="button" onClick={toggleOpenNow.bind(this)}>OPEN NOW</button>
      </div>
    );

    var filteredArray = this.filter(this.props.currentRoute.results);
    console.log("length of original array: ",this.props.currentRoute.results.length);
    console.log("length of filtered array: ",filteredArray.length);
    var listDetails = filteredArray.map(function(venue, index) {
      return (
        <VenueView venue={venue} openFourSquare={component.props.openFourSquare.bind(null, venue)}/>
      )
    });

    return (
      <div>
        <div className="filters">
          {priceFilter}
          {ratingFilter}
          {openNowFilter}
        </div>
        <div className="list-details">
          {listDetails}
        </div>
      </div>
    );
  }
});

module.exports = ListView;