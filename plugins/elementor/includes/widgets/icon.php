<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Elementor Icon Widget.
 *
 * Elementor widget that inserts an icon into the page.
 *
 * @since 1.0.0
 */
class Hugeicons_Icon_Widget extends \Elementor\Widget_Base
{

    /**
     * Get widget name.
     *
     * Retrieve icon widget name.
     *
     * @return string Widget name.
     * @since 1.0.0
     * @access public
     */
    public function get_name()
    {
        return 'hugeicons-icon';
    }

    /**
     * Get widget title.
     *
     * Retrieve icon widget title.
     *
     * @return string Widget title.
     * @since 1.0.0
     * @access public
     */
    public function get_title()
    {
        return esc_html__('Icon', 'hugeicons-pro');
    }

    /**
     * Get widget icon.
     *
     * Retrieve icon widget icon.
     *
     * @return string Widget icon.
     * @since 1.0.0
     * @access public
     */
    public function get_icon()
    {
        return 'eicon-favorite';
    }

    /**
     * Get custom help URL.
     *
     * Retrieve a URL where the user can get more information about the widget.
     *
     * @return string Widget help URL.
     * @since 1.0.0
     * @access public
     */
    public function get_custom_help_url()
    {
        return 'https://hugeicons.com/docs/widgets/icon';
    }

    /**
     * Get widget categories.
     *
     * Retrieve the list of categories the icon widget belongs to.
     *
     * @return array Widget categories.
     * @since 1.0.0
     * @access public
     */
    public function get_categories()
    {
        return ['hugeicons-icons'];
    }

    /**
     * Get widget keywords.
     *
     * Retrieve the list of keywords the icon widget belongs to.
     *
     * @return array Widget keywords.
     * @since 1.0.0
     * @access public
     */
    public function get_keywords()
    {
        return ['icon', 'hugeicons', 'image'];
    }

    /**
     * Register icon widget controls.
     *
     * Add input fields to allow the user to customize the widget settings.
     *
     * @since 1.0.0
     * @access protected
     */
    protected function register_controls()
    {

        $this->start_controls_section(
            'content_section',
            [
                'label' => esc_html__('Icon', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'icon',
            [
                'label' => esc_html__('Choose Icon', 'hugeicons-pro'),
                'type' => 'hugeicons-icon-browse',
                'default' => '<svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.0001 17C14.2006 17.6224 13.1504 18 12.0001 18C10.8499 18 9.79965 17.6224 9.00012 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M2.35151 13.2135C1.99849 10.9162 1.82198 9.76763 2.25629 8.74938C2.69059 7.73112 3.65415 7.03443 5.58126 5.64106L7.02111 4.6C9.41841 2.86667 10.6171 2 12.0001 2C13.3832 2 14.5818 2.86667 16.9791 4.6L18.419 5.64106C20.3461 7.03443 21.3097 7.73112 21.744 8.74938C22.1783 9.76763 22.0018 10.9162 21.6487 13.2135L21.3477 15.1724C20.8473 18.4289 20.597 20.0572 19.4291 21.0286C18.2612 22 16.5538 22 13.1389 22H10.8613C7.44646 22 5.73903 22 4.57112 21.0286C3.40321 20.0572 3.15299 18.4289 2.65255 15.1724L2.35151 13.2135Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
</svg>',
            ]
        );

        $this->add_control(
            'icon_link',
            [
                'label' => esc_html__('Link', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::URL,
                'options' => ['url', 'is_external', 'nofollow'],
                'default' => [
                    'url' => '',
                    'is_external' => false,
                    'nofollow' => false,
                ],
                'label_block' => true,
            ]
        );

        $this->add_control(
            'text_align',
            [
                'label' => esc_html__('Alignment', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'left' => [
                        'title' => esc_html__('Left', 'hugeicons-pro'),
                        'icon' => 'eicon-text-align-left',
                    ],
                    'center' => [
                        'title' => esc_html__('Center', 'hugeicons-pro'),
                        'icon' => 'eicon-text-align-center',
                    ],
                    'right' => [
                        'title' => esc_html__('Right', 'hugeicons-pro'),
                        'icon' => 'eicon-text-align-right',
                    ],
                ],
                'default' => 'center',
                'toggle' => true,
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-widget' => 'text-align: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_section();


        $this->start_controls_section(
            'style_section',
            [
                'label' => esc_html__('Icon Style', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'icon_color',
            [
                'label' => esc_html__('Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'global' => [
                    'default' => \Elementor\Core\Kits\Documents\Tabs\Global_Colors::COLOR_PRIMARY,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-widget svg' => 'color: {{VALUE}}',
                ],
            ]
        );

        $this->add_control(
            'width',
            [
                'label' => esc_html__('Size', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['px', '%', 'em', 'rem', 'custom'],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 200,
                        'step' => 5,
                    ],
                    '%' => [
                        'min' => 0,
                        'max' => 100,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 50,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-widget svg' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();
    }

    /**
     * Render icon widget output on the frontend.
     *
     * Written in PHP and used to generate the final HTML.
     *
     * @since 1.0.0
     * @access protected
     */
    protected function render()
    {
        $settings = $this->get_settings_for_display();
        if (!empty($settings['icon_link']['url'])) {
            $this->add_link_attributes('icon_link', $settings['icon_link']);
        }
        ?>
        <div class="hugeicons__icon-widget">
            <?php if (!empty($settings['icon_link']['url'])) : ?>
            <a <?php echo $this->get_render_attribute_string('icon_link'); ?>>
            <?php endif; ?>
                <?php echo $settings['icon']; ?>
            <?php if (!empty($settings['icon_link']['url'])) : ?>
            </a>
            <?php endif; ?>
        </div>
        <?php
    }

}
