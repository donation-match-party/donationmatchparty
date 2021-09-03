const express = require( 'express' ),
      fs = require( 'fs' ),
      path = require( 'path' ),
      url = require( 'url' ),
      timediff = require( 'timediff' ),
      { google } = require( 'googleapis' ),
      removeLeadingSlash = require( 'remove-leading-slash' ),
      helpers = require( __dirname + '/../helpers/general.js' ),
      router = express.Router();

function getRequestPaths( req ){
    return {
        project: removeLeadingSlash( req.url.split( '?' )[0].replace( 'projects/', '' ) ),
        appURL: process.env.URL,
        reqUrlFull: (req.protocol + '://' + req.get('host') + req.originalUrl).replace('http://fourtonfish.com/', 'https://fourtonfish.com/data/')
    };
}

router.all( '/', async function( req, res ) {
    const icons = {
        'education': '🏫',
        'environment': '🌍',
        'guns': '🔫',
        'medical': '🩺',
        'news': '📰',
        'politics': '🗳',
        'women\'s rights': '♀️',
    };

    const reqPaths = getRequestPaths( req );

    let updateData = false;

    let data = req.app.get( 'data' );
    const dataTimestamp = req.app.get( 'data_ts' );


    if ( !data || !dataTimestamp ){
        updateData = true;
    } else {
        const dateDiff = timediff( dataTimestamp, Date.now(), 'm' );

        if ( dateDiff && dateDiff.minutes >= 1 ){
            updateData = true;
        }
    }

    if ( updateData ){
        const auth = new google.auth.GoogleAuth({
            keyFile: 'client_secret.json',
            scopes: 'https://www.googleapis.com/auth/spreadsheets' 
        } );

        const authClientObject = await auth.getClient();
        const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });

        const readData = await googleSheetsInstance.spreadsheets.values.get({
            auth,
            spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
            range: 'Sheet1'
        })

        let rows = readData.data['values'];
        rows.shift();
        data = rows;
        req.app.set( 'data', data );
        req.app.set( 'data_ts', Date.now() );
    }

    const donations = data.map( function( row ){
        if ( row[0] && row[3] && row[6] ){
            return {
                cause: row[0],
                is_active: [ 'true', 'yes', 'y' ].indexOf( row[1].trim().toLowerCase() ) !== -1 ,
                type: row[2],
                icon: icons[row[2].trim().toLowerCase()] || '💸',
                max_match: row[3],
                offer_start_date: row[4],
                offer_end_date: row[5],
                offer_end_in: row[5],
                url: row[6]
            };
        }
    } );


    const tags = [...new Set( donations.map( function( donation ){
        return donation.type;
    } ) )];

    // const tags = donations.map( function( donation ){
    //     return donation.type;
    // } );

    // donations = donations.filter( function( data ){
    //     return !data.hide || ['n', 'no', 'false'].indexOf( data.hide.trim().toLowerCase() === -1 );
    // } );

    res.render( '../views/home.handlebars', {
        title: process.env.PROJECT_NAME,
        description: process.env.PROJECT_DESCRIPTION,
        sc_project: process.env.SC_PROJECT,
        sc_security: process.env.SC_SECURITY,
        appURL: reqPaths.appURL,
        donations: donations,
        // tags: tags.join(','),
        tags: tags,
        timestamp: Date.now()
    } );
} );

module.exports = router;
