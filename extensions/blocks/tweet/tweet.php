<?php
/**
 * Tweet Block.
 *
 * @since 8.x
 *
 * @package Jetpack
 */

namespace Automattic\Jetpack\Extensions\Tweet;

use Jetpack_Gutenberg;

const FEATURE_NAME = 'tweet';
const BLOCK_NAME   = 'jetpack/' . FEATURE_NAME;

/**
 * Registers the block for use in Gutenberg
 * This is done via an action so that we can disable
 * registration if we need to.
 */
function register_block() {
	jetpack_register_block(
		BLOCK_NAME,
		array( 'render_callback' => __NAMESPACE__ . '\load_assets' )
	);

	$post_types = get_post_types( array( 'public' => true ) );
	foreach ( $post_types as $post_type ) {
		register_post_meta(
			$post_type,
			'jetpack_is_tweetstorm',
			array(
				'show_in_rest' => true,
				'single'       => true,
				'type'         => 'boolean',
			)
		);
	}

	add_filter( 'jetpack_sync_post_meta_whitelist', __NAMESPACE__ . '\allow_sync_post_meta' );
}
add_action( 'init', __NAMESPACE__ . '\register_block' );

/**
 * Tweet block registration/dependency declaration.
 *
 * @param array  $attr    Array containing the Tweet block attributes.
 * @param string $content String containing the Tweet block content.
 *
 * @return string
 */
function load_assets( $attr, $content ) {
	/*
	 * Enqueue necessary scripts and styles.
	 */
	Jetpack_Gutenberg::load_assets_as_required( FEATURE_NAME );

	return sprintf(
		'<div class="%1$s">%2$s</div>',
		esc_attr( Jetpack_Gutenberg::block_classes( FEATURE_NAME, $attr ) ),
		$content
	);
}

/**
 * Sync the post meta.
 *
 * @param array $post_meta The post meta fields to be synced.
 *
 * @return array The post meta fields to be synced, including ours.
 */
function allow_sync_post_meta( $post_meta ) {
	$post_meta[] = 'jetpack_is_tweetstorm';
	return $post_meta;
}
