/**
 * External dependencies
 */
import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import {
	getBlockTypes,
	registerBlockType,
	unregisterBlockType,
	createBlock,
} from '@wordpress/blocks';
import { dispatch, useSelect, select } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';

/**
 * Internal dependencies
 */
import registerJetpackBlock from '../../shared/register-jetpack-block';
import { name, settings } from '.';

registerJetpackBlock( name, settings );

const unregisterOtherBlocks = () => {
	getBlockTypes().forEach( blockType => {
		if ( blockType.name !== `jetpack/${ name }` ) {
			unregisterBlockType( blockType.name );
		}
	} );
};

const convertPost = () => {
	registerJetpackBlock( name, settings );
	unregisterOtherBlocks();

	dispatch( 'core/editor' ).editPost( { meta: { jetpack_is_tweetstorm: true } } );
	dispatch( 'core/editor' ).insertBlock( createBlock( 'jetpack/tweet' ) );
};

domReady( () => {
	const isTweetStorm = select( 'core/editor' ).getEditedPostAttribute( 'meta' )
		.jetpack_is_tweetstorm;

	if ( isTweetStorm ) {
		unregisterOtherBlocks();
		return;
	}

	unregisterBlockType( `jetpack/${ name }` );

	const TweetstormPanel = () => (
		<PluginDocumentSettingPanel
			name="jetpack-tweetstorm"
			title={ __( 'Tweetstorm', 'jetpack' ) }
			className="jetpack-tweetstorm"
		>
			<Button isLarge isPrimary onClick={ convertPost }>
				{ __( 'Storm', 'jetpack' ) }
			</Button>
		</PluginDocumentSettingPanel>
	);
	registerPlugin( 'jetpack-tweetstorm', { render: TweetstormPanel, icon: 'twitter' } );
} );
