createDialog().then( config => {
	return ClassicEditor
		.create( document.querySelector( '.editor' ), {
			licenseKey: config.licenseKey,
			ckbox: {
				tokenUrl: config.ckboxTokenUrl
			},
			documentOutline: {
				container: document.querySelector( '.document-outline-container' )
			}
		} )
		.then( editor => {
			window.editor = editor;
		} )
		.catch( handleSampleError );
} );

function handleSampleError( error ) {
	const issueUrl = 'https://github.com/ckeditor/ckeditor5/issues';

	const message = [
		'Oops, something went wrong!',
		`Please, report the following error on ${ issueUrl } with the build id "4cik9fo0qq15-jujsj4qk5w31" and the error stack trace:`
	].join( '\n' );

	console.error( message );
	console.error( error );
}
