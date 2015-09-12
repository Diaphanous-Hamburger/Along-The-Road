/*
This view shows the details of each venue
*/

var React = require('react');

/***************
****** MUI *****
****************/
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var {Card, CardHeader, CardMedia, CardActions, CardText, Avatar, CardTitle} = mui;


var VenueView = React.createClass({
  propTypes: {
    venue: React.PropTypes.object.isRequired,
    openFourSquare: React.PropTypes.func.isRequired
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },


  render () {
    var {featuredPhotos, name, contact, hours, categories, location, menu, price, rating, ratingColor, stats, url, totalDistance} = this.props.venue;

    if (categories) {
      var categoryList = categories.map(function(category, index) {
        return category.shortName;
      });
    }

    if (featuredPhotos && featuredPhotos.items && featuredPhotos.items.length) {
      var photoUrl = featuredPhotos.items[0].prefix + "100x100" + featuredPhotos.items[0].suffix;
    }

    var avatar = (
      <Avatar
        src={photoUrl ? photoUrl : "https://foursquare.com/img/categories/food/default_64.png"}
        size={70}>
      </Avatar>
    );

    var msgToDollarSigns = {
      "Cheap": "$",
      "Moderate": "$$",
      "Expensive": "$$$",
      "Very Expensive": "$$$$"
    };


    var categoryText = categoryList ? categoryList.join("/") : "N/A";
    var priceText = price && price.message ? msgToDollarSigns[price.message] : "N/A";
    var ratingText = rating ? rating + '/10' : "N/A";
    //var distanceText = Math.round(location.distance/1000*.621*10)/10 + " mi. off the road";
    var totalDistanceText = Math.round(totalDistance/1000*.621*10)/10 + " mi";

    return (
      <Card className="card">
        <div className="col-xs-2 avatar" >
          {avatar}
        </div>
        <div className="col-xs-7">
          <span className="title"> {name} </span>
          <span className="category"> {categoryText} </span>
          <span className="address">{location.formattedAddress[0] ? location.formattedAddress[0] : null} </span>
          <span className={hours && hours.status && hours.status.toLowerCase().includes('open') ? 'open' : 'closed'}> {hours && hours.status ? hours.status : null} </span>
        </div>
        <div className="col-xs-3 detail-info">
          <span className="rating"> {"\uD83C\uDFC6 " + ratingText} </span>
          <span className="distance"> {totalDistanceText} </span>
          <span className="price"> {priceText} </span>
          <span className="glyphicon glyphicon-info-sign clickable" onClick={this.props.openFourSquare}></span>
        </div>
      </Card>
    );
  }
});

module.exports = VenueView;