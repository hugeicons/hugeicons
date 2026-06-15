<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Elementor Icon Box Widget.
 *
 * Elementor widget that displays an icon with a title and description.
 *
 * @since 1.0.0
 */
class Hugeicons_Icon_Box_Widget extends \Elementor\Widget_Base
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
        return 'hugeicons-icon-box';
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
        return esc_html__('Icon Box', 'hugeicons-pro');
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
        return 'eicon-icon-box';
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
        return 'https://hugeicons.com/docs/widgets/icon-box';
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
        return ['icon', 'box', 'hugeicons', 'feature', 'info'];
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
                'label' => esc_html__('Icon Box', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'icon',
            [
                'label' => esc_html__('Icon', 'hugeicons-pro'),
                'type' => 'hugeicons-icon-browse',
                'default' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5"/>
<path d="M11 7H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M7 7H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M7 12H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M7 17H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M11 12H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
<path d="M11 17H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>',
            ]
        );

        $this->add_control(
            'title',
            [
                'label' => esc_html__('Title', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('Feature Title', 'hugeicons-pro'),
                'placeholder' => esc_html__('Enter title', 'hugeicons-pro'),
                'label_block' => true,
            ]
        );

        $this->add_control(
            'description',
            [
                'label' => esc_html__('Description', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::TEXTAREA,
                'default' => esc_html__('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.', 'hugeicons-pro'),
                'placeholder' => esc_html__('Enter description', 'hugeicons-pro'),
                'rows' => 5,
            ]
        );

        $this->add_control(
            'title_tag',
            [
                'label' => esc_html__('Title HTML Tag', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SELECT,
                'default' => 'h3',
                'options' => [
                    'h1' => 'H1',
                    'h2' => 'H2',
                    'h3' => 'H3',
                    'h4' => 'H4',
                    'h5' => 'H5',
                    'h6' => 'H6',
                    'p' => 'p',
                    'span' => 'span',
                    'div' => 'div',
                ],
            ]
        );

        $this->add_control(
            'icon_position',
            [
                'label' => esc_html__('Icon Position', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'top' => [
                        'title' => esc_html__('Top', 'hugeicons-pro'),
                        'icon' => 'eicon-v-align-top',
                    ],
                    'left' => [
                        'title' => esc_html__('Left', 'hugeicons-pro'),
                        'icon' => 'eicon-h-align-left',
                    ],
                    'right' => [
                        'title' => esc_html__('Right', 'hugeicons-pro'),
                        'icon' => 'eicon-h-align-right',
                    ],
                ],
                'default' => 'top',
                'toggle' => false,
            ]
        );

        $this->add_control(
            'box_link',
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
            'icon_color',
            [
                'label' => esc_html__('Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#6366f1',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-box-icon svg' => 'color: {{VALUE}};',
                ],
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
                        'min' => 20,
                        'max' => 200,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 50,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-box-icon svg' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
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
                        'max' => 100,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 16,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-box-widget' => 'gap: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'icon_background_color',
            [
                'label' => esc_html__('Background Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-box-icon' => 'background-color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'icon_padding',
            [
                'label' => esc_html__('Padding', 'hugeicons-pro'),
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
                    'size' => 0,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-box-icon' => 'padding: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'icon_border_radius',
            [
                'label' => esc_html__('Border Radius', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['px', '%', 'em', 'rem'],
                'range' => [
                    'px' => [
                        'min' => 0,
                        'max' => 100,
                        'step' => 1,
                    ],
                    '%' => [
                        'min' => 0,
                        'max' => 50,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 0,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-box-icon' => 'border-radius: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();

        // Style Section - Content
        $this->start_controls_section(
            'style_content_section',
            [
                'label' => esc_html__('Content', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
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
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-box-widget' => 'text-align: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'heading_title_style',
            [
                'label' => esc_html__('Title', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::HEADING,
                'separator' => 'before',
            ]
        );

        $this->add_control(
            'title_color',
            [
                'label' => esc_html__('Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#1f2937',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-box-title' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'title_typography',
                'selector' => '{{WRAPPER}} .hugeicons__icon-box-title',
            ]
        );

        $this->add_control(
            'title_spacing',
            [
                'label' => esc_html__('Bottom Spacing', 'hugeicons-pro'),
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
                    '{{WRAPPER}} .hugeicons__icon-box-title' => 'margin-bottom: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'heading_description_style',
            [
                'label' => esc_html__('Description', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::HEADING,
                'separator' => 'before',
            ]
        );

        $this->add_control(
            'description_color',
            [
                'label' => esc_html__('Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#6b7280',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-box-description' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'description_typography',
                'selector' => '{{WRAPPER}} .hugeicons__icon-box-description',
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

        $this->add_render_attribute('wrapper', 'class', 'hugeicons__icon-box-widget');
        $this->add_render_attribute('wrapper', 'class', 'hugeicons__icon-box-position-' . $settings['icon_position']);

        $has_link = !empty($settings['box_link']['url']);

        if ($has_link) {
            $this->add_link_attributes('box_link', $settings['box_link']);
        }

        $title_tag = \Elementor\Utils::validate_html_tag($settings['title_tag']);
        ?>
        <div <?php echo $this->get_render_attribute_string('wrapper'); ?>>
            <?php if ($has_link) : ?>
            <a <?php echo $this->get_render_attribute_string('box_link'); ?> class="hugeicons__icon-box-link">
            <?php endif; ?>
                <div class="hugeicons__icon-box-icon">
                    <?php echo $settings['icon']; ?>
                </div>
                <div class="hugeicons__icon-box-content">
                    <?php if (!empty($settings['title'])) : ?>
                        <<?php echo esc_html($title_tag); ?> class="hugeicons__icon-box-title">
                            <?php echo esc_html($settings['title']); ?>
                        </<?php echo esc_html($title_tag); ?>>
                    <?php endif; ?>
                    <?php if (!empty($settings['description'])) : ?>
                        <p class="hugeicons__icon-box-description">
                            <?php echo esc_html($settings['description']); ?>
                        </p>
                    <?php endif; ?>
                </div>
            <?php if ($has_link) : ?>
            </a>
            <?php endif; ?>
        </div>
        <?php
    }
}
