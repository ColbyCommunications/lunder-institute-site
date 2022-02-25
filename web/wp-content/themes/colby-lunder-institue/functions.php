<?php
/**
 * Theme functions.
 *
 * @package baileysigns
 */

/**
 * Add support for a custom css class to builder elements.
 */
add_theme_support( 'avia_template_builder_custom_css' );

/**
 * Add in editor-styles.css.
 */
function npa_add_editor_styles() {
	add_editor_style( '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' );
	add_editor_style( 'editor-style.css' );
}
add_action( 'admin_init', 'npa_add_editor_styles' );

/**
 * Add items to the TinyMCE formats menu.
 * Callback function to filter the MCE settings.
 *
 * @param  array $init_array tiny_mce_before_init().
 */
function npa_mce_before_init_insert_formats( $init_array ) {
	// Define the style_formats array.
	$style_formats = array(
		// Each array child is a format with it's own settings.
		array(
			'title'    => 'Button (Standard)',
			'selector' => 'a',
			'classes'  => 'button',

		),
	);
	// Insert the array, JSON ENCODED, into 'style_formats'.
	$init_array['style_formats'] = wp_json_encode( $style_formats );

	return $init_array;

}
// Attach callback to 'tiny_mce_before_init'.
add_filter( 'tiny_mce_before_init', 'npa_mce_before_init_insert_formats' );

add_filter( 'avf_modify_thumb_size', 'enfold_customization_modify_thumb_size', 10, 1 );
function enfold_customization_modify_thumb_size( $size ) {
	$size['entry_with_sidebar'] = array(
		'width'  => 1300,
		'height' => 1300,
		'crop'   => false,
	);
	return $size;
}

// Enqueue Styles --- --- ---
function npa_enqueue_styles() {
	wp_enqueue_style( 'editor-style', get_stylesheet_directory_uri() . '/editor-style.css', false, '1.0', 'all' );
	wp_enqueue_style( 'google-font-opensans', 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700' );
	wp_enqueue_script( 'fontawesome', 'https://use.fontawesome.com/1c75905ed3.js', array(), '4.7.0', true );
}
add_action( 'wp_head', 'npa_enqueue_styles' );

add_filter('avf_merge_assets', function() {
	return 'none';
});

add_filter( 'display_post_states', 'remove_ALB_post_state', 999, 2 );
function remove_ALB_post_state( $post_states, $post ) {
	if ( array_key_exists( 'wp_editor', $post_states ) ) {
		unset( $post_states['wp_editor'] );
	}
	if ( array_key_exists( 'avia_alb', $post_states ) ) {
		unset( $post_states['avia_alb'] );
	}

	return $post_states;
}
