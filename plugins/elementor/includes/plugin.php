<?php

namespace Hugeicons_Pro;

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Plugin class.
 *
 * The main class that initiates and runs the addon.
 *
 * @since 1.0.0
 */
final class Plugin
{

    /**
     * Addon Version
     *
     * @since 1.0.0
     * @var string The addon version.
     */
    const VERSION = '1.0.0';

    /**
     * Minimum Elementor Version
     *
     * @since 1.0.0
     * @var string Minimum Elementor version required to run the addon.
     */
    const MINIMUM_ELEMENTOR_VERSION = '3.16.0';

    /**
     * Minimum PHP Version
     *
     * @since 1.0.0
     * @var string Minimum PHP version required to run the addon.
     */
    const MINIMUM_PHP_VERSION = '7.4';

    /**
     * Instance
     *
     * @since 1.0.0
     * @access private
     * @static
     * @var \Hugeicons_Pro\Plugin The single instance of the class.
     */
    private static $_instance = null;

    /**
     * Instance
     *
     * Ensures only one instance of the class is loaded or can be loaded.
     *
     * @return \Hugeicons_Pro\Plugin An instance of the class.
     * @since 1.0.0
     * @access public
     * @static
     */
    public static function instance()
    {

        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;

    }

    /**
     * Constructor
     *
     * Perform some compatibility checks to make sure basic requirements are met.
     * If all compatibility checks pass, initialize the functionality.
     *
     * @since 1.0.0
     * @access public
     */
    public function __construct()
    {

        if ($this->is_compatible()) {
            add_action('elementor/init', [$this, 'init']);
        }

    }

    /**
     * Compatibility Checks
     *
     * Checks whether the site meets the addon requirement.
     *
     * @since 1.0.0
     * @access public
     */
    public function is_compatible()
    {

        // Check if Elementor installed and activated
        if (!did_action('elementor/loaded')) {
            add_action('admin_notices', [$this, 'admin_notice_missing_main_plugin']);
            return false;
        }

        // Check for required Elementor version
        if (!version_compare(ELEMENTOR_VERSION, self::MINIMUM_ELEMENTOR_VERSION, '>=')) {
            add_action('admin_notices', [$this, 'admin_notice_minimum_elementor_version']);
            return false;
        }

        // Check for required PHP version
        if (version_compare(PHP_VERSION, self::MINIMUM_PHP_VERSION, '<')) {
            add_action('admin_notices', [$this, 'admin_notice_minimum_php_version']);
            return false;
        }

        return true;

    }

    /**
     * Admin notice
     *
     * Warning when the site doesn't have Elementor installed or activated.
     *
     * @since 1.0.0
     * @access public
     */
    public function admin_notice_missing_main_plugin()
    {

        if (isset($_GET['activate'])) unset($_GET['activate']);

        $message = sprintf(
        /* translators: 1: Plugin name 2: Elementor */
            esc_html__('"%1$s" requires "%2$s" to be installed and activated.', 'hugeicons-elementor'),
            '<strong>' . esc_html__('Hugeicons Pro', 'hugeicons-elementor') . '</strong>',
            '<strong>' . esc_html__('Elementor', 'hugeicons-elementor') . '</strong>'
        );

        printf('<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message);

    }

    /**
     * Admin notice
     *
     * Warning when the site doesn't have a minimum required Elementor version.
     *
     * @since 1.0.0
     * @access public
     */
    public function admin_notice_minimum_elementor_version()
    {

        if (isset($_GET['activate'])) unset($_GET['activate']);

        $message = sprintf(
        /* translators: 1: Plugin name 2: Elementor 3: Required Elementor version */
            esc_html__('"%1$s" requires "%2$s" version %3$s or greater.', 'hugeicons-elementor'),
            '<strong>' . esc_html__('Hugeicons Pro', 'hugeicons-elementor') . '</strong>',
            '<strong>' . esc_html__('Elementor', 'hugeicons-elementor') . '</strong>',
            self::MINIMUM_ELEMENTOR_VERSION
        );

        printf('<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message);

    }

    /**
     * Admin notice
     *
     * Warning when the site doesn't have a minimum required PHP version.
     *
     * @since 1.0.0
     * @access public
     */
    public function admin_notice_minimum_php_version()
    {

        if (isset($_GET['activate'])) unset($_GET['activate']);

        $message = sprintf(
        /* translators: 1: Plugin name 2: PHP 3: Required PHP version */
            esc_html__('"%1$s" requires "%2$s" version %3$s or greater.', 'hugeicons-elementor'),
            '<strong>' . esc_html__('Hugeicons Pro', 'hugeicons-elementor') . '</strong>',
            '<strong>' . esc_html__('PHP', 'hugeicons-pro') . '</strong>',
            self::MINIMUM_PHP_VERSION
        );

        printf('<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>', $message);

    }

    /**
     * Initialize
     *
     * Load the addons functionality only after Elementor is initialized.
     *
     * Fired by `elementor/init` action hook.
     *
     * @since 1.0.0
     * @access public
     */
    public function init()
    {
        // Register widgets and controls
        add_action('elementor/widgets/register', [$this, 'register_widgets']);
        add_action('elementor/controls/register', [$this, 'register_controls']);
        add_action('elementor/elements/categories_registered', [$this, 'add_elementor_widget_categories']);
        // Register frontend scripts and styles
        add_action('elementor/frontend/after_enqueue_styles', [$this, 'frontend_styles']);
        // Register editor scripts and styles
        add_action('elementor/editor/before_enqueue_styles', [$this, 'editor_styles']);
        add_action('elementor/editor/after_enqueue_scripts', [$this, 'editor_scripts']);

        // Register admin scripts and styles
        add_action('admin_enqueue_scripts', [$this, 'admin_styles']);

        // Hook to add the admin menu
        add_action('admin_menu', [$this, 'add_admin_menu']);

        // Register the settings
        add_action('admin_init', [$this, 'register_settings']);

        // Hook to handle license deactivation
        add_action('admin_init', [$this, 'handle_license_deactivation']);
    }

    /**
     * Register settings
     *
     * Register the plugin settings and their sanitization callback.
     *
     * @since 1.0.0
     * @access public
     */
    public function register_settings()
    {
        register_setting('hugeicons-settings-group', 'hugeicons-license', [
            'type' => 'string',
            'sanitize_callback' => [$this, 'sanitize_license'],
            'default' => ''
        ]);
    }

    /**
     * Handle License Deactivation
     *
     * Clear the license key option if the deactivate button is pressed.
     *
     * @since 1.0.0
     * @access public
     */
    public function handle_license_deactivation()
    {
        if (isset($_POST['hugeicons-deactivate-license'])) {
            // Security check
            check_admin_referer('hugeicons-settings-group-options');

            // Clear the option
            update_option('hugeicons-license', '');

            // Redirect back to the settings page (optional)
            wp_redirect(add_query_arg('page', 'hugeicons-pro-settings', admin_url('options-general.php')));
            exit;
        }
    }

    /**
     * Validate the License Key
     *
     * Send a POST request to the license API and validate the license key.
     *
     * @since 1.0.0
     * @access public
     * @param string $license License key to validate.
     * @return bool True if the license is valid, false otherwise.
     */
    public function validate_license($license) {
        $api_url = 'https://hugeicons.com/api/validate-license'; // Your API URL

        // Make the GET request
        $response = wp_remote_get($api_url . "?license=$license");

        $body = wp_remote_retrieve_body( $response );
        $body_content = json_decode( $body, true );

        // Handle errors
        if (isset($body_content['message']) and $body_content['message'] == "Invalid license") {
            return false;
        }

        // License is valid
        return true;
    }

    /**
     * Sanitize license
     *
     * Sanitize the license key input.
     *
     * @since 1.0.0
     * @access public
     */
    public function sanitize_license($input)
    {
        // Sanitize the input (e.g., strip_tags, esc_attr)
        // Add additional validation if necessary
        if (!empty($input)) {
            $license = sanitize_text_field($input);
            if ($this->validate_license($license)) {
                return $license;
            }else{
                add_settings_error(
                    'hugeicons-license',
                    'hugeicons-license-error',
                    'Invalid license key',
                    'error'
                );
            }
        }

        return '';
    }

    /**
     * Enqueue admin styles.
     *
     * @since 1.0.0
     * @access public
     */
    public function admin_styles()
    {

        wp_enqueue_style(
            'hugeicons-pro-admin',
            HUGEICONS_PRO_URL . 'assets/css/hugeicons-pro-admin.css',
            [],
            self::VERSION
        );
    }

    /**
     * Enqueue frontend styles.
     *
     * @since 1.0.0
     * @access public
     */
    public function frontend_styles()
    {

        wp_enqueue_style(
            'hugeicons-pro',
            HUGEICONS_PRO_URL . 'assets/css/hugeicons-pro-frontend.css',
            [],
            self::VERSION
        );

        wp_enqueue_script(
            'hugeicons-faq-widget',
            HUGEICONS_PRO_URL . 'assets/js/hugeicons-faq-widget.js',
            ['jquery'],
            self::VERSION,
            true
        );
    }

    /**
     * Enqueue editor scripts.
     *
     * @since 1.0.0
     * @access public
     */
    public function editor_scripts()
    {

        wp_enqueue_script(
            'hugeicons-pro-editor',
            HUGEICONS_PRO_URL . 'assets/js/hugeicons-pro-editor.js',
            ['jquery'],
            self::VERSION,
            true
        );
    }

    /**
     * Enqueue editor styles.
     *
     * @since 1.0.0
     * @access public
     */
    public function editor_styles()
    {

        wp_enqueue_style(
            'hugeicons-pro-editor',
            HUGEICONS_PRO_URL . 'assets/css/hugeicons-pro-editor.css',
            [],
            self::VERSION
        );
    }


    /**
     * Register custom widget categories.
     *
     * @param \Elementor\Elements_Manager $elements_manager Elementor elements manager.
     * @since 1.0.0
     * @access public
     */
    public function add_elementor_widget_categories($elements_manager)
    {

        $elements_manager->add_category(
            'hugeicons-icons',
            [
                'title' => esc_html__('Hugeicons', 'hugeicons-pro'),
            ]
        );
    }

    /**
     * Register Widgets
     *
     * Load widgets files and register new Elementor widgets.
     *
     * Fired by `elementor/widgets/register` action hook.
     *
     * @param \Elementor\Widgets_Manager $widgets_manager Elementor widgets manager.
     */
    public function register_widgets($widgets_manager)
    {

        require_once(__DIR__ . '/widgets/icon.php');
        require_once(__DIR__ . '/widgets/icon-box.php');
        require_once(__DIR__ . '/widgets/icon-button.php');
        require_once(__DIR__ . '/widgets/icon-list.php');
        require_once(__DIR__ . '/widgets/faq.php');

        $license_key = get_option('hugeicons-license', '');

        if (!empty($license_key)) {
            $widgets_manager->register(new \Hugeicons_Icon_Widget());
            $widgets_manager->register(new \Hugeicons_Icon_Box_Widget());
            $widgets_manager->register(new \Hugeicons_Icon_Button_Widget());
            $widgets_manager->register(new \Hugeicons_Icon_List_Widget());
            $widgets_manager->register(new \Hugeicons_FAQ_Widget());
        }

    }

    /**
     * Register Controls
     *
     * Load controls files and register new Elementor controls.
     *
     * Fired by `elementor/controls/register` action hook.
     *
     * @param \Elementor\Controls_Manager $controls_manager Elementor controls manager.
     */
    public function register_controls($controls_manager)
    {
        require_once(__DIR__ . '/controls/icon-browse.php');
        $controls_manager->register(new \Hugeicons_Icon_Browse_Control());
    }

    /**
     * Add Admin Menu
     *
     * Register the settings page in the WordPress admin menu.
     *
     * @since 1.0.0
     * @access public
     */
    public function add_admin_menu()
    {
        add_submenu_page(
            'options-general.php', // Parent slug
            'Hugeicons Pro Settings', // Page title
            'Hugeicons Pro', // Menu title
            'manage_options', // Capability
            'hugeicons-pro-settings', // Menu slug
            [$this, 'display_settings_page'], // Function to display the content
            'hgi-hugeicons-logo', // Icon URL
            6 // Position
        );
    }

    /**
     * Display Settings Page
     *
     * Output the HTML content of the settings page.
     *
     * @since 1.0.0
     * @access public
     */
    public function display_settings_page()
    {
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            return;
        }

        // Check if the 'hugeicons-license' setting is saved
        $license_key = get_option('hugeicons-license', '');

        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

            <div class="hugeicons-admin__wrap">
                <form method="post" action="options.php">
                    <?php settings_fields('hugeicons-settings-group'); ?>
                    <?php do_settings_sections('hugeicons-settings-group'); ?>
                    <?php if (empty($license_key)): ?>
                        <div class="hugeicons-admin__intro">
                            <h3>Unlock Premium</h3>
                            <p>Beautify your projects with pro features!</p>
                        </div>
                        <table class="form-table">
                            <tr>
                                <th scope="row">Pro License</th>
                                <td>
                                    <input
                                            type="text"
                                            name="hugeicons-license"
                                            value="<?php echo esc_attr($license_key); ?>"
                                            placeholder="81F507EC-95324D86-8EEDEDED-06201942"
                                    />

                                    <div>Your Gumroad account and e-mail contains the License key</div>
                                </td>
                            </tr>
                        </table>
                        <?php submit_button('Activate License'); ?>
                    <?php else: ?>
                        <div>
                            <div class="hugeicons-admin__intro">
                                <h3>Enjoy Premium</h3>
                                <p>Thank you for your support!</p>
                            </div>
                            <p>License Key: <strong><?php echo esc_html($license_key); ?></strong></p>
                            <input type="submit" name="hugeicons-deactivate-license" class="button button-secondary"
                                   value="<?php esc_attr_e('Deactivate License', 'hugeicons-pro'); ?>"/>
                        </div>
                    <?php endif; ?>
                </form>
            </div>
        </div>
        <?php
    }
}
