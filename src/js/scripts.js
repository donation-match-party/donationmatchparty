window.helpers = {
    ready: function( fn ) {
        if ( document.readyState !== 'loading' ){
            fn();
        } else {
            document.addEventListener( 'DOMContentLoaded', fn );
        }
    }
};

window.helpers.ready( function(){


    const filter = document.getElementById( 'filter' );

    filter.addEventListener( 'change', event => {
        // const value = event.target.value;
        const tags = [...document.querySelectorAll( '[selected]' )].map( tag => tag.getAttribute( 'value' ) )

        console.log( 'tags', tags );

        [...document.querySelectorAll('tr[data-type]')].forEach( row => {
            console.log( 'row.dataset.type', row.dataset.type );
            if ( tags.indexOf( row.dataset.type ) === -1 ){
                row.classList.add( 'd-none' );
            } else {
                row.classList.remove( 'd-none' );
            }
        } );
    } );

    // [...document.querySelectorAll('.filter-narrow')].forEach( filterNarrowBtn => {
    //     filterNarrowBtn.addEventListener( 'click', event => {
    //         const selectedTag = event.target.innerHTML
    //         console.log( 'selectedTag', selectedTag );

    //         // [...filter.querySelectorAll('option-pure')].forEach( option => {
    //         [...document.querySelectorAll('#filter option-pure')].forEach( option => {
    //             //setting selected to the <option-pure> or by setting selectPure.selectedIndex = 1;.
    //             if ( selectedTag === option.getAttribute( 'value' ) ){
    //                 option.setAttribute( 'selected', 'selected' );
    //                 console.log( option, 'adding', option.getAttribute( 'value' ) );
    //             } else {
    //                 option.removeAttribute( 'selected' );
    //                 console.log( option, 'removing', option.getAttribute( 'value' ) );
    //             }

    //         } );
    //     } );
    // } );

} );