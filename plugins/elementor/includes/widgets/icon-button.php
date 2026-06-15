<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Elementor Icon Button Widget.
 *
 * Elementor widget that inserts a button with an icon.
 *
 * @since 1.0.0
 */
class Hugeicons_Icon_Button_Widget extends \Elementor\Widget_Base
{

    /**
     * Get widget name.
     *
     * @return string Widget name.
     * @since 1.0.0
     * @access public
     */
    public function get_name()
    {
        return 'hugeicons-icon-button';
    }

    /**
     * Get widget title.
     *
     * @return string Widget title.
     * @since 1.0.0
     * @access public
     */
    public function get_title()
    {
        return esc_html__('Icon Button', 'hugeicons-pro');
    }

    /**
     * Get widget icon.
     *
     * @return string Widget icon.
     * @since 1.0.0
     * @access public
     */
    public function get_icon()
    {
        return 'eicon-button';
    }

    /**
     * Get custom help URL.
     *
     * @return string Widget help URL.
     * @since 1.0.0
     * @access public
     */
    public function get_custom_help_url()
    {
        return 'https://hugeicons.com/docs/widgets/icon-button';
    }

    /**
     * Get widget categories.
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
     * @return array Widget keywords.
     * @since 1.0.0
     * @access public
     */
    public function get_keywords()
    {
        return ['button', 'icon', 'hugeicons', 'link', 'cta'];
    }

    /**
     * Register widget controls.
     *
     * @since 1.0.0
     * @access protected
     */
    protected function register_controls()
    {
        // Content Section
        $this->start_controls_section(
            'content_section',
            [
                'label' => esc_html__('Button', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'button_text',
            [
                'label' => esc_html__('Text', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('Click Here', 'hugeicons-pro'),
                'placeholder' => esc_html__('Enter button text', 'hugeicons-pro'),
            ]
        );

        $this->add_control(
            'button_link',
            [
                'label' => esc_html__('Link', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::URL,
                'options' => ['url', 'is_external', 'nofollow'],
                'default' => [
                    'url' => '#',
                    'is_external' => false,
                    'nofollow' => false,
                ],
                'label_block' => true,
            ]
        );

        $this->add_control(
            'icon',
            [
                'label' => esc_html__('Icon', 'hugeicons-pro'),
                'type' => 'hugeicons-icon-browse',
                'default' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>',
            ]
        );

        $this->add_control(
            'icon_position',
            [
                'label' => esc_html__('Icon Position', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'before' => [
                        'title' => esc_html__('Before', 'hugeicons-pro'),
                        'icon' => 'eicon-h-align-left',
                    ],
                    'after' => [
                        'title' => esc_html__('After', 'hugeicons-pro'),
                        'icon' => 'eicon-h-align-right',
                    ],
                ],
                'default' => 'before',
                'toggle' => false,
            ]
        );

        $this->add_control(
            'button_align',
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
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__button-wrapper' => 'text-align: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_section();

        // Style Section - Button
        $this->start_controls_section(
            'style_button_section',
            [
                'label' => esc_html__('Button', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'button_typography',
                'selector' => '{{WRAPPER}} .hugeicons__button-widget',
            ]
        );

        $this->start_controls_tabs('button_style_tabs');

        // Normal State
        $this->start_controls_tab(
            'button_normal_tab',
            [
                'label' => esc_html__('Normal', 'hugeicons-pro'),
            ]
        );

        $this->add_control(
            'button_text_color',
            [
                'label' => esc_html__('Text Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#ffffff',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__button-widget' => 'color: {{VALUE}};',
                    '{{WRAPPER}} .hugeicons__button-widget svg' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'button_background_color',
            [
                'label' => esc_html__('Background Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#6366f1',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__button-widget' => 'background-color: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_tab();

        // Hover State
        $this->start_controls_tab(
            'button_hover_tab',
            [
                'label' => esc_html__('Hover', 'hugeicons-pro'),
            ]
        );

        $this->add_control(
            'button_text_color_hover',
            [
                'label' => esc_html__('Text Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__button-widget:hover' => 'color: {{VALUE}};',
                    '{{WRAPPER}} .hugeicons__button-widget:hover svg' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'button_background_color_hover',
            [
                'label' => esc_html__('Background Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__button-widget:hover' => 'background-color: {{VALUE}};',
                ],
            ]
        );

        $this->end_controls_tab();

        $this->end_controls_tabs();

        $this->add_control(
            'button_border_radius',
            [
                'label' => esc_html__('Border Radius', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%', 'em', 'rem'],
                'default' => [
                    'top' => '8',
                    'right' => '8',
                    'bottom' => '8',
                    'left' => '8',
                    'unit' => 'px',
                    'isLinked' => true,
                ],
                'separator' => 'before',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__button-widget' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_responsive_control(
            'button_padding',
            [
                'label' => esc_html__('Padding', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%', 'em', 'rem'],
                'default' => [
                    'top' => '12',
                    'right' => '24',
                    'bottom' => '12',
                    'left' => '24',
                    'unit' => 'px',
                    'isLinked' => false,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__button-widget' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Box_Shadow::get_type(),
            [
                'name' => 'button_box_shadow',
                'selector' => '{{WRAPPER}} .hugeicons__button-widget',
            ]
        );

        $this->end_controls_section();

        // Style Section - Icon
        $this->start_controls_section(
            'style_icon_section',
            [
                'label' => esc_html__('Icon', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'icon_size',
            [
                'label' => esc_html__('Size', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['px', 'em', 'rem'],
                'range' => [
                    'px' => [
                        'min' => 10,
                        'max' => 100,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 20,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__button-icon svg' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'icon_spacing',
            [
                'label' => esc_html__('Spacing', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['px', 'em', 'rem'],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 50,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 8,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__button-widget' => 'gap: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();
    }

    /**
     * Render widget output on the frontend.
     *
     * @since 1.0.0
     * @access protected
     */
    protected function render()
    {
        $settings = $this->get_settings_for_display();

        $this->add_render_attribute('wrapper', 'class', 'hugeicons__button-wrapper');

        $this->add_render_attribute('button', 'class', 'hugeicons__button-widget');
        $this->add_render_attribute('button', 'class', 'hugeicons__button-icon-' . $settings['icon_position']);

        if (!empty($settings['button_link']['url'])) {
            $this->add_link_attributes('button', $settings['button_link']);
        }

        $icon_html = '<span class="hugeicons__button-icon">' . $settings['icon'] . '</span>';
        $text_html = '<span class="hugeicons__button-text">' . esc_html($settings['button_text']) . '</span>';
        ?>
        <div <?php echo $this->get_render_attribute_string('wrapper'); ?>>
            <a <?php echo $this->get_render_attribute_string('button'); ?>>
                <?php if ($settings['icon_position'] === 'before') : ?>
                    <?php echo $icon_html; ?>
                    <?php echo $text_html; ?>
                <?php else : ?>
                    <?php echo $text_html; ?>
                    <?php echo $icon_html; ?>
                <?php endif; ?>
            </a>
        </div>
        <?php
    }
}
