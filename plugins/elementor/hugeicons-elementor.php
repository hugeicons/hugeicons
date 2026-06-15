<?php
/**
 * Plugin Name: Hugeicons Pro
 * Description: Elementor widgets for Hugeicons, providing an extensive icon library.
 * Plugin URI:  https://hugeicons.com
 * Version:     1.0.0
 * Author:      Hugeicons Team
 * Author URI:  https://halallab.co
 * Text Domain: hugeicons-elementor
 *
 * Elementor tested up to: 3.16.0
 * Elementor Pro tested up to: 3.16.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Define plugin constants
const HUGEICONS_PRO_VERSION = '1.0.0';
define( 'HUGEICONS_PRO_DIR', plugin_dir_path( __FILE__ ) );
define( 'HUGEICONS_PRO_URL', plugin_dir_url( __FILE__ ) );

function hugeicons_pro(): void
{

    // Load plugin file
    require_once( __DIR__ . '/includes/plugin.php' );

    // Run the plugin
    \Hugeicons_Pro\Plugin::instance();

}
add_action( 'plugins_loaded', 'hugeicons_pro' );
