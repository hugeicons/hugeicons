<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Hugeicons Icon Browse Control.
 *
 * A control for displaying a button to open the custom icon browse modal.
 *
 * @since 1.0.0
 */
class Hugeicons_Icon_Browse_Control extends \Elementor\Base_Data_Control {

    /**
     * Get control type.
     *
     * Retrieve the control type, in this case `hugeicons-icon-browse`.
     *
     * @since 1.0.0
     * @access public
     * @return string Control type.
     */
    public function get_type() {
        return 'hugeicons-icon-browse';
    }

    /**
     * Get default settings.
     *
     * Retrieve the default settings of the icon browse control. Used to return
     * the default settings while initializing the icon browse control.
     *
     * @since 1.0.0
     * @access protected
     * @return array Control default settings.
     */
    protected function get_default_settings() {
        return [
            'label_block' => true,
            'separator' => 'after',
        ];
    }

    public function enqueue() {
        // add hugeicons-pro-browse.js
        wp_enqueue_script( 'hugeicons-pro-browse', HUGEICONS_PRO_URL . 'assets/js/hugeicons-pro-browse.js', [ 'jquery' ], HUGEICONS_PRO_VERSION, true );

        // add hugeicons-pro-browse.css
        wp_enqueue_style( 'hugeicons-pro-browse', HUGEICONS_PRO_URL . 'assets/css/hugeicons-pro-browse.css', [], HUGEICONS_PRO_VERSION );

        // embed icon-browser react app [icon-browser/js/main.a3e05bfe.js, 787.1ee16706.chunk.js]
        wp_enqueue_script( 'hugeicons-pro-icon-browser', HUGEICONS_PRO_URL . 'icon-browser/main.js', [ 'jquery' ], HUGEICONS_PRO_VERSION, true );
    }

    /**
     * Render the control's content template in the editor.
     *
     * Used to generate the control HTML in the editor using Underscore JS template.
     * The variables for the class are available using `data` JS object.
     *
     * @since 1.0.0
     * @access public
     */
    public function content_template() {
        $control_uid = $this->get_control_uid( 'icon' );
        ?>
        <div class="elementor-control-field">
            <# if ( data.label ) { #>
            <label for="<?php echo $control_uid; ?>" class="elementor-control-title">{{{ data.label }}}</label>
            <# } #>

            <div class="elementor-control-input-wrapper hugeicons-icon-control">
                <!-- Hidden input to store the actual value of the control -->
                <input type="hidden" data-setting="{{ data.name }}" class="hugeicons-icon-value-input" />

                <div class="hugeicons-control-icon__media-area elementor-control-media-area">
                    <div class="hugeicons-control-icon__preview">
                        <# if ( data.controlValue ) { #>
                        {{{ data.controlValue }}}
                        <# } #>
                        <# if ( !data.controlValue ) { #>
                        {{{ data.default }}}
                        <# } #>
                    </div>
                </div>
            </div>
        </div>

        <# if ( data.description ) { #>
        <div class="elementor-control-field-description">{{{ data.description }}}</div>
        <# } #>
        <?php
        include HUGEICONS_PRO_DIR . 'templates/modal-template.php';
    }


}
