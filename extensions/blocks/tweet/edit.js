/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { BlockIcon, InnerBlocks, MediaPlaceholder, RichText } from '@wordpress/block-editor';
import {
	Placeholder,
	withNotices,
	TextareaControl,
	TextControl,
	Disabled,
	Icon,
	IconButton,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import icon from './icon';
import './editor.scss';

function TweetEdit( { attributes, className, noticeOperations, noticeUI, setAttributes } ) {
	/**
	 * Write the block editor UI.
	 *
	 * @returns {object} The UI displayed when user edits this block.
	 */
	const [ notice, setNotice ] = useState();
	const [ tweetText, setTweetText ] = useState( '' );
	const [ media, setMedia ] = useState( [] );

	/* Call this function when you want to show an error in the placeholder. */
	const setErrorNotice = () => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( __( 'Put error message here.', 'jetpack' ) );
	};

	const onSelectMedia = newMedia => {
		const addedMedia = Array.isArray( newMedia ) ? newMedia : [ newMedia ];

		if ( 'video' === addedMedia[ 0 ].type ) {
			if ( addedMedia.length > 1 ) {
				noticeOperations.createErrorNotice(
					__( 'Only one video is allowed per tweet.', 'jetpack' )
				);
			}

			setMedia( addedMedia.slice( 0, 1 ) );
			return;
		}

		if ( 'image/gif' === addedMedia[ 0 ].mime ) {
			if ( addedMedia.length > 1 ) {
				noticeOperations.createErrorNotice( __( 'Only one GIF is allowed per tweet.', 'jetpack' ) );
			}

			setMedia( addedMedia.slice( 0, 1 ) );
			return;
		}

		if ( addedMedia.some( item => 'image' !== item.type ) ) {
			noticeOperations.createErrorNotice(
				__( 'Only images are allowed in a gallery.', 'jetpack' )
			);
		}

		if ( addedMedia.some( item => 'image/gif' === item.mime ) ) {
			noticeOperations.createErrorNotice( __( "GIFs can't be included in a gallery.", 'jetpack' ) );
		}

		const filteredMedia = addedMedia.filter(
			item => 'image' === item.type && 'image/gif' !== item.mime
		);

		if ( filteredMedia.length > 4 ) {
			noticeOperations.createErrorNotice(
				__( 'A maximum of four images can be attached to a tweet.', 'jetpack' )
			);
		}

		setMedia( filteredMedia.slice( 0, 4 ) );
	};

	const removeMediaItem = item => {
		setMedia( media.filter( checkItem => checkItem !== item ) );
	};

	const generateMediaPreview = item => {
		let preview = <div className="wp-block-jetpack-tweet__media-item-error"></div>;

		switch ( item.type ) {
			case 'image':
				preview = <img src={ item.url } alt="" />;
				break;
			case 'video':
				/* eslint-disable jsx-a11y/media-has-caption */
				preview = (
					<Disabled>
						<video src={ item.url } />
					</Disabled>
				);
			/* eslint-enable jsx-a11y/media-has-caption */
		}

		return (
			<div key={ item.id || item.url } className="wp-block-jetpack-tweet__media-item">
				<IconButton
					className="wp-block-jetpack-tweet__media-item-remove"
					icon="no"
					label={ __( 'Remove this item.', 'jetpack' ) }
					onClick={ () => removeMediaItem( item ) }
				/>
				{ preview }
			</div>
		);
	};

	const labels = {
		title: false,
		instructions: __(
			'You can attach one video or GIF, or up to four photos per tweet.',
			'jetpack'
		),
	};

	return (
		<div className={ className }>
			<RichText
				tagName="p"
				placeholder={ __( 'Add a tweet', 'jetpack' ) }
				allowedFormats={ [] }
				withoutInteractiveFormatting={ true }
				onChange={ setTweetText }
			/>
			<div className="wp-block-jetpack-tweet__media">
				{ media.map( item => generateMediaPreview( item ) ) }
			</div>
			<MediaPlaceholder
				accept="image/*,video/*"
				allowedTypes={ [ 'image', 'video' ] }
				onSelect={ onSelectMedia }
				multiple={ true }
				labels={ labels }
				isAppender={ true }
			/>
		</div>
	);
}

export default withNotices( TweetEdit );
