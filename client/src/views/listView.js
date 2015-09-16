/*
ListView: This view shows the details of the possible routes from origin to destination
*/

var React = require('react');
var VenueView = require('./venueView');

var Actions = require('../actions/Actions.js');
var ListUpdateStore = require('../stores/ListUpdateStore');
// var VenueStore = require('../stores/VenueStore');


var ListView = React.createClass({


  propTypes: {
    currentRoute: React.PropTypes.object.isRequired
  },

  shouldComponentUpdate () {
    // return false;
  },

  defaultOptions: {
    colors: {
      defaultColor: '#FFF',
      hoverColor: '#ddd'

    }
    
  },

  componentDidMount () {
    // console.log("listView -----> componentDidMount()");

    /*******  INIT LISTVIEW UX ********/
    var {hoverColor, defaultColor} = this.defaultOptions.colors;
    ListUpdateStore.addChangeListener(this.updateList);
 
    $(document).on('mouseenter', '.card', function(e) {
      $(e.currentTarget).css({'background-color': hoverColor});

      //update map markers to show active venue
      var venue_id = $(e.currentTarget).attr('id');
      Actions.selectVenue(venue_id);
    });

    $(document).on('mouseleave', '.card', function(e) {
      $(e.currentTarget).css({'background-color': defaultColor})
    });

    // deactivate marker when mouse leave the list-container
    $(document).on('mouseleave', '.list-container', function(e) {
      Actions.selectVenue("");
    });

  }, //componentDidMount()

  updateList() { 
    this.forceUpdate();
  },
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

  } //render()
});

module.exports = ListView;