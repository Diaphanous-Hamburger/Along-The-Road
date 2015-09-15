
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var Constants = require('../constants/Constants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var prevVenue = ''; // NOTE: only 1 venue can be active at any time
var activeVenue = ''; // NOTE: only 1 venue can be active at any time

function setActiveVenue(venue_id){
  prevVenue = activeVenue;
  activeVenue = venue_id;
}


var Store = assign({}, EventEmitter.prototype, {
  getActiveVenue: function(){
    return activeVenue;
  },

  getPrevVenue: function(){
    return prevVenue;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  var text;

  switch(action.actionType) {
    case Constants.SELECT_VENUE:
      setActiveVenue(action.venue_id);
      Store.emitChange();

      break;

    default:
  }
});

module.exports = Store;
