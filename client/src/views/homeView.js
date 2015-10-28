/*
This component is the home view. It allows the user to input his/her travel route
*/
var React = require('react');
var Router = require('react-router');
var Actions = require('../actions/Actions.js');
var Link = Router.Link;

// Import MUI components (material-ui)
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {RaisedButton, Paper} = mui;

var HomeView = React.createClass({

  childContextTypes: { // MUI: init
    muiTheme: React.PropTypes.object //connect MUI
  },
  getChildContext () { // MUI: set theme
    return {
      muiTheme: ThemeManager.getCurrentTheme() //set MUI theme to default
    };
  },
  getInitialState () {
    return {
      origin: '',
      destination: ''
    }
  },

  // Componenet lifecycle method that get's called after the first render
  componentDidMount () {

    // allows access of the props inside setOrigin and setDestination
    var component = this;

    var setOrigin = function() {
      var origin = this.getPlace().geometry.location.lat() + ',' + this.getPlace().geometry.location.lng();
      component.setState({
        origin
      });
    };

    var setDestination = function() {
      var destination = this.getPlace().geometry.location.lat() + ',' + this.getPlace().geometry.location.lng();

      component.setState({
        destination
      });
    };

    // creates google maps autocomplete field and attaches it to the input specified
    var originAutoComplete = new google.maps.places.Autocomplete(document.getElementById('origin'));
    originAutoComplete.addListener('place_changed', setOrigin);

    var destinationAutoComplete = new google.maps.places.Autocomplete(document.getElementById('destination'));
    destinationAutoComplete.addListener('place_changed', setDestination);

    $('#destination').keydown(function(event){
        var keyCode = (event.keyCode ? event.keyCode : event.which);
        if (keyCode === 13) {
            if($(this).val()){
              $('.submit_button').trigger('click');
            }
            // console.log('button clicked this.text=', $(this).text());
            // if(this.text)
            // $('#startSearch').trigger('click');
        }
    });
  },

  render () {
    var slider_options = {
      dots: true,
      speed: 500,
      arrows: true,
      centerMode: true,
      draggable: true,
    };

    var component = this;

    var goToOverView = function(){
      window.reactRouter.transitionTo('overview', {origin:component.state.origin, destination:component.state.destination});
    }

    return (
      <div className='container-fluid'>
        <div className = 'row centered input-container'>
          <div className='subtitle'> Explore restaurants along the way </div>
          <div className="input-group">
            <input className="start-location form-control" id="origin" placeholder="Starting Location" />
          </div> {/*input-group*/}
        </div>{/* row */}

        <div className = 'row centered'>
          <div className = 'col-sm-12'>
            {/*<TextField id="destination" placeholder='' floatingLabelText="End Location" hintText="Enter a destination"/>*/}
            <div className="input-group">
              <input className="form-control" id="destination" placeholder="Destination" />
            </div> {/*input-group*/}
          </div> {/* col */}
        </div>{/* row */}
        <div className = 'row centered'>
          <div className = 'col-sm-12' >
            <RaisedButton
              label="GO!"
              className="submit_button"
              secondary={true}
              onClick={goToOverView}
              /*linkButton="true"
              params={{
                origin: this.state.origin,
                destination: this.state.destination
              }}
              containerElement={<Link to="overview"/>}*/
              style={{
                'width':'180px',
                'borderRadius': '5px'
              }}
            /> {/* RaisedButton */}
          </div> {/* col */}
        </div>{/* row */}

        <br/><br/>

        <Paper className="app-info" style={{'backgroundColor':"rgba(256, 256, 256, 0.7)", 'borderRadius':'10px'}}>
            <div className = 'row centered'>
              <div className = 'col-sm-12'>
                <h2> Get the App</h2>
              </div> {/* col */}
            </div> {/* row */}

            <div className = 'row'>
              <div className = 'col-sm-12 text-center'>
                <a href="https://itunes.apple.com/us/app/food-en-route/id1042386985?mt=8">
                  <img className="app-store" src="https://www3.iconcerts.com/images/new-images/app-icons/en/available_apple.png"/>
                </a>
              </div> {/* col */}
            </div> {/* row */}
        </Paper> {/* jumbotron */}
     </div>
    )
  }
})

module.exports = HomeView;
