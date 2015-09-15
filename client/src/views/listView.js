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
    colors: {
      default: '#FFF',
      hover: '#BBAA9C'

    }
  },

  componentDidMount () {
    // console.log("listView -----> componentDidMount()");

    /*******  INIT LISTVIEW UX ********/
    $(document).on('mouseenter', '.card', function(e) {
      // console.log("*********mouseenter. e=", e);
      var {hoverColor, defaultColor} = this.defaultOptions.colors;

      $(e.currentTarget).css({'background-color': hoverColor});

      var venue_id = $(e.currentTarget).attr('id');

      //update map markers to show active venue
      Actions.selectVenue(venue_id);
    });

    $(document).on('mouseleave', '.card', function(e) {
      $(e.currentTarget).css({'background-color': defaultColor})
    });

    // deactivate marker when mouse leave the list-container
    $(document).on('mouseleave', '.list-container', function(e) {
      // $(e.currentTarget).css({'background-color': 'white'})
      log('&&&&&&&&& right container entered')
      Actions.selectVenue("");
    });
  }, //componentDidMount()

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