/*
This view returns the tool bar to be shown as part of the MapView
*/

var React = require('react');

/**** FLUX ****/
var Actions = require('../actions/Actions');
var RouteStore = require('../stores/RouteStore');

var SelectBox = require('../../lib/react-select-box/lib/select-box');

/***************
****** MUI *****
****************/
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator, DropDownMenu, FontIcon, RaisedButton, DropDownIcon} = mui;


var ToolView = React.createClass({
  propTypes: {
    // venueFilters: React.PropTypes.object.isRequired
  },

  childContextTypes: { // MUI: init
    muiTheme: React.PropTypes.object //connect MUI
  },

  getChildContext () { // MUI: set theme
    return {
      muiTheme: ThemeManager.getCurrentTheme() //set MUI theme to default
    };
  },

  getInitialState (){
    return {
      // venuefilters: []
      colors: []
    }
  },

      // <div className = "container">
      //     {/*<button onClick={this.loadMore}>Load More</button>*/}
      //     <button onClick={this.props.loadMore}>Load More</button>
      //     <button onClick={function(){Actions.priceFilter(1)}}>$</button>
      //     <button onClick={function(){Actions.priceFilter(2)}}>$$</button>
      //     <button onClick={function(){Actions.priceFilter(3)}}>$$$</button>
      //     <button onClick={function(){Actions.ratingFilter(7)}}>7+</button>
      //     <button onClick={function(){Actions.ratingFilter(8)}}>8+</button>
      //     <button onClick={function(){Actions.ratingFilter(9)}}>9+</button>
      //     <button onClick={function(){Actions.clearFilter();}}>Clear Filters</button>
      //     <button onClick={function(){Actions.openNowFilter();}}>Open Now</button>
      //     {/*<button onClick={function(){Actions.clearData();}}>Clear Data</button>*/}


      // </div>
  updateFilters: function (colors) {
    // Actions.updateVenueFilters();
    this.setState({ colors: colors });
  },

  render () {
    return (
      <div style={{"backgroundColor": 'pink'}}>
        <SelectBox
            label = "By Price"
            className = ''
            onChange = {this.updateFilters}
            value = {this.state.filters}
            multiple = {true}
        >{/* SelectBox */}
          <option onClick={function(){Actions.priceFilter(1)}} key='red' value='price1'> $ </option>
          <option onClick={function(){Actions.priceFilter(2)}} key='blue' value='price2'> $$ </option>
          <option onClick={function(){Actions.priceFilter(3)}} key='green' value='price3'> $$$ </option>
          
        </SelectBox>

        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
          Price
          <span className="caret"></span></button>
          <ul className="dropdown-menu">
            <li onClick={function(){Actions.priceFilter(1)}}> <a>Price: $</a></li>
            <li onClick={function(){Actions.priceFilter(2)}}><a>Price: $$</a></li>
            <li onClick={function(){Actions.priceFilter(3)}}><a>Price: $$$</a></li>
            <li onClick={function(){Actions.openNowFilter()}}><a>Open</a></li>
          </ul>
        </div>
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
          Rating
          <span className="caret"></span></button>
          <ul className="dropdown-menu">
            <li onClick={function(){Actions.ratingFilter(7)}}> <a>7+ Rating</a></li>
            <li onClick={function(){Actions.ratingFilter(8)}}><a>8+ Rating</a></li>
            <li onClick={function(){Actions.ratingFilter(9)}}><a>9+ Rating</a></li>
          </ul>
        </div>

      </div>
    );
  } //render()
}); // toolView

module.exports = ToolView;