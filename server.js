require( 'dotenv' ).config();

const app = require( __dirname + '/app.js' );

const listener = app.listen( process.env.PORT || 5000, function() {
  console.log( `app is running on port ${listener.address().port}...` );
} );
