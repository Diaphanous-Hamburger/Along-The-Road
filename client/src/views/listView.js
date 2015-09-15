/*
ListView: This view shows the details of the possible routes from origin to destination
*/

var React = require('react');
var VenueView = require('./venueView');

var Actions = require('../actions/Actions.js');
// var VenueStore = require('../stores/VenueStore');


var ListView = React.createClass({

  propTypes: {
    currentRoute: React.PropTypes.object.isRequired
  },

  defaultOptions: {

    
  },
  componentDidMount () {
    console.log("listView -----> componentDidMount()");
    // $(document).$(".card").on('hover', function(e){
    // });

    $(document).on('mouseenter', '.card', function(e) {
      // console.log("*********mouseenter. e=", e);
      $(e.currentTarget).css({'background-color': 'pink'})
    });
    $(document).on('mouseleave', '.card', function(e) {
      $(e.currentTarget).css({'background-color': 'white'})
      // console.log("*********mouseenter. e=", e);
    });

    // $(document).on('mousein', '.card', function() {
    //   console.log("*********HOvered");
    // });
  },

  componentDidUpdate(prevProps, prevState) {
    // if (this.props.currentRoute.wayPoints.length && !this.props.currentRoute.results.length && QueryStore.prevWaypoints()==21) {
    //   this.queryFourSquare(1, 21);
    // } 
  },

  //Gets the previous number of waypoints and the new number to be querried
  // _onChange () {
  //   var waypoints = QueryStore.getWaypoints();
  //   // if (this.props.currentRoute.wayPoints.length && !this.props.currentRoute.results.length) {
  //   this.queryFourSquare(waypoints);
  //   // } 
  // },

  render () {
    var component = this;

    if(this.props.currentRoute){
      var listDetails = this.props.currentRoute.filteredVenues.map(function(venue, index) {
        return (
          <VenueView venue={venue} origin={component.props.origin}/>
        )
      });
      
      return (
        <div> {listDetails} </div>
      );

    }else{
      return null;
    } //if

    // var listDetails = this.state.venues.map(function(venue, index) {
    //   return (
    //     <VenueView venue={venue}/>
    //   )
    // });
    
  } //render()
});

module.exports = ListView;