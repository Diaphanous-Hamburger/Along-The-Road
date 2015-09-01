/*
This component is the home view. It allows the user to input his/her travel route
*/

var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

// Import MUI components (material-ui)
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {TextField, RaisedButton, Paper} = mui;


var HomeView = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object //connect MUI
  },
  getChildContext () {
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
      var origin = this.getPlace().geometry.location.G + ',' + this.getPlace().geometry.location.K;;
      component.setState({
        origin
      });
    };

    var setDestination = function() {
      var destination = this.getPlace().geometry.location.G + ',' + this.getPlace().geometry.location.K;
      component.setState({
        destination
      });
    };

    // creates google maps autocomplete field and attaches it to the input specified
    var originAutoComplete = new google.maps.places.Autocomplete(document.getElementById('origin'));
    originAutoComplete.addListener('place_changed', setOrigin);

    var destinationAutoComplete = new google.maps.places.Autocomplete(document.getElementById('destination'));
    destinationAutoComplete.addListener('place_changed', setDestination);
  },

  render () {
    return (
      <div className='container'>
        <div className='jumbotron'>
          <div className='container panel'>
            <div className = 'row'>
              <div className = 'col-sm-12'>
                <h2>Plan your Trip</h2>
              </div>
            </div>

            <div className = 'row'>
              <div className = 'col-sm-6'>
                <div className = 'container'>
                  <div className = 'row'>
                    <div className = 'col-sm-12'>
                      <TextField className= 'center-block' id="origin" placeholder='' floatingLabelText="Start Location" hintText="Enter a starting location"/>
                    </div>
                  </div>
                  <div className = 'row'>
                    <div className = 'col-sm-12'>
                      <TextField id="destination" placeholder='' floatingLabelText="End Location" hintText="Enter a destination"/>
                    </div>
                  </div>
                  <div className = 'row'>
                    <div className = 'col-sm-12'>
                      <RaisedButton label="Submit" linkButton="true" params={{origin: this.state.origin, destination: this.state.destination }} containerElement={<Link to="map"/>}/>
                    </div>
                  </div>

                </div> {/* container */}

              </div> {/* col-sm-6 */}

              <div className = 'col-sm-6'>
                <div className = 'row'>
                  <div className = 'col-sm-12'>
                    <p>
                      {"Enter a route and find all the best places to eat along the way!"}
                    </p>
                  </div>
                </div> {/* row */}
              </div> {/* col-sm-6 */}
            </div> {/* row */}
          </div> {/* container */}
        </div> {/* jumbotron */}
        <div className='container'>
          <div className = 'row'>
            <div className = 'col-sm-12'>
              <h1> Get The App (coming soon...) </h1>

              <h3>
                {"Stumptown butcher four loko trust fund banh mi, mlkshk ugh 8-bit cred. Fanny pack cornhole bitters jean shorts, drinking vinegar fap Intelligentsia disrupt freegan Thundercats sartorial lumbersexual brunch beard blog. Shoreditch Austin health goth wolf stumptown, fashion axe vinyl photo booth hashtag cronut. Selvage plaid Williamsburg iPhone, umami hashtag blog stumptown fap. Cred Schlitz pork belly, kogi gastropub crucifix lomo McSweeney's actually disrupt aesthetic narwhal. Try-hard tote bag scenester butcher, keytar."}
              </h3>
            </div>
          </div>
        </div> {/* jumbotron */}
      </div>
    )
  }
})

module.exports = HomeView;
