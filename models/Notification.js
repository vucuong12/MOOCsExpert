var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Course model
 * ==========
 */

var Notification = new keystone.List('Notification',{defaultSort: '-createdAt'});

Notification.add({
  userId: {type: Types.Text},
  createdAt: { type: Date, default: Date.now },
  content: {type: Types.Text},  
  link: {type: Types.Text},
  isViewed: {type: Types.Boolean}
});



/**
 * Registration
 */

Notification.register();