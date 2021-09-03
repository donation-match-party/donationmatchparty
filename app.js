const util = require( 'util' ),
      path = require( 'path' ),
      express = require( 'express' ),
      cors = require( 'cors' ),
      compression = require( 'compression' ),
      exphbs  = require( 'express-handlebars' ),
      bodyParser = require( 'body-parser' ),
      helpers = require( __dirname + '/helpers/general.js' ),
      app = express(  );

app.use( compression() );
app.use( express.static( 'public' ) );

app.use( bodyParser.urlencoded( {
  extended: true
} ) );

app.use( bodyParser.json() );


app.engine( 'handlebars', exphbs( { defaultLayout: 'main' } ) );
app.set( 'views', __dirname + '/views' );
app.set( 'view engine', 'handlebars' );

app.use( '/', require( './routes/index.js' ) )

app.get( '/js/helpers.js', function (req, res) {
  res.sendFile( path.join( __dirname + '/helpers/general.js' ) );
} );

module.exports = app;
