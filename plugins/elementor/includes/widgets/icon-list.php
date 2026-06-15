<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Elementor Icon List Widget.
 *
 * Elementor widget that displays a list of items with icons.
 *
 * @since 1.0.0
 */
class Hugeicons_Icon_List_Widget extends \Elementor\Widget_Base
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
        return 'hugeicons-icon-list';
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
        return esc_html__('Icon List', 'hugeicons-pro');
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
        return 'eicon-bullet-list';
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
        return 'https://hugeicons.com/docs/widgets/icon-list';
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
        return ['icon', 'list', 'hugeicons', 'bullet', 'features'];
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
                'label' => esc_html__('List Items', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'item_icon',
            [
                'label' => esc_html__('Icon', 'hugeicons-pro'),
                'type' => 'hugeicons-icon-browse',
                'default' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>',
            ]
        );

        $repeater->add_control(
            'item_text',
            [
                'label' => esc_html__('Text', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('List Item', 'hugeicons-pro'),
                'placeholder' => esc_html__('Enter text', 'hugeicons-pro'),
                'label_block' => true,
            ]
        );

        $repeater->add_control(
            'item_link',
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
            'list_items',
            [
                'label' => esc_html__('Items', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $repeater->get_controls(),
                'default' => [
                    [
                        'item_text' => esc_html__('Feature one description', 'hugeicons-pro'),
                    ],
                    [
                        'item_text' => esc_html__('Feature two description', 'hugeicons-pro'),
                    ],
                    [
                        'item_text' => esc_html__('Feature three description', 'hugeicons-pro'),
                    ],
                ],
                'title_field' => '{{{ item_text }}}',
            ]
        );

        $this->add_control(
            'list_layout',
            [
                'label' => esc_html__('Layout', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'vertical' => [
                        'title' => esc_html__('Vertical', 'hugeicons-pro'),
                        'icon' => 'eicon-editor-list-ul',
                    ],
                    'horizontal' => [
                        'title' => esc_html__('Horizontal', 'hugeicons-pro'),
                        'icon' => 'eicon-ellipsis-h',
                    ],
                ],
                'default' => 'vertical',
                'toggle' => false,
            ]
        );

        $this->end_controls_section();

        // Style Section - List
        $this->start_controls_section(
            'style_list_section',
            [
                'label' => esc_html__('List', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_responsive_control(
            'space_between',
            [
                'label' => esc_html__('Space Between', 'hugeicons-pro'),
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
                    'size' => 12,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-list-widget' => 'gap: {{SIZE}}{{UNIT}};',
                ],
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
                'default' => 'left',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-list-widget' => 'justify-content: {{VALUE}};',
                ],
                'selectors_dictionary' => [
                    'left' => 'flex-start',
                    'center' => 'center',
                    'right' => 'flex-end',
                ],
                'condition' => [
                    'list_layout' => 'horizontal',
                ],
            ]
        );

        $this->add_control(
            'divider_toggle',
            [
                'label' => esc_html__('Divider', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => esc_html__('Yes', 'hugeicons-pro'),
                'label_off' => esc_html__('No', 'hugeicons-pro'),
                'return_value' => 'yes',
                'default' => 'no',
            ]
        );

        $this->add_control(
            'divider_color',
            [
                'label' => esc_html__('Divider Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#e5e7eb',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-list-item:not(:last-child)' => 'border-bottom-color: {{VALUE}};',
                ],
                'condition' => [
                    'divider_toggle' => 'yes',
                    'list_layout' => 'vertical',
                ],
            ]
        );

        $this->add_control(
            'divider_weight',
            [
                'label' => esc_html__('Divider Weight', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['px'],
                'range' => [
                    'px' => [
                        'min' => 1,
                        'max' => 10,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 1,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-list-item:not(:last-child)' => 'border-bottom-width: {{SIZE}}{{UNIT}}; border-bottom-style: solid; padding-bottom: {{SIZE}}{{UNIT}};',
                ],
                'condition' => [
                    'divider_toggle' => 'yes',
                    'list_layout' => 'vertical',
                ],
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
                    '{{WRAPPER}} .hugeicons__icon-list-icon svg' => 'color: {{VALUE}};',
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
                        'min' => 10,
                        'max' => 100,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 24,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-list-icon svg' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'icon_text_gap',
            [
                'label' => esc_html__('Icon Text Gap', 'hugeicons-pro'),
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
                    'size' => 10,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-list-item' => 'gap: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->end_controls_section();

        // Style Section - Text
        $this->start_controls_section(
            'style_text_section',
            [
                'label' => esc_html__('Text', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'text_color',
            [
                'label' => esc_html__('Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#374151',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-list-text' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'text_color_hover',
            [
                'label' => esc_html__('Hover Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__icon-list-item a:hover .hugeicons__icon-list-text' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'text_typography',
                'selector' => '{{WRAPPER}} .hugeicons__icon-list-text',
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

        $this->add_render_attribute('wrapper', 'class', 'hugeicons__icon-list-widget');
        $this->add_render_attribute('wrapper', 'class', 'hugeicons__icon-list-' . $settings['list_layout']);

        if ($settings['divider_toggle'] === 'yes') {
            $this->add_render_attribute('wrapper', 'class', 'hugeicons__icon-list-has-divider');
        }
        ?>
        <ul <?php echo $this->get_render_attribute_string('wrapper'); ?>>
            <?php foreach ($settings['list_items'] as $index => $item) : ?>
                <?php
                $item_key = 'item_' . $index;
                $has_link = !empty($item['item_link']['url']);

                $this->add_render_attribute($item_key, 'class', 'hugeicons__icon-list-item');
                $this->add_render_attribute($item_key, 'class', 'elementor-repeater-item-' . $item['_id']);

                if ($has_link) {
                    $link_key = 'link_' . $index;
                    $this->add_link_attributes($link_key, $item['item_link']);
                    $this->add_render_attribute($link_key, 'class', 'hugeicons__icon-list-item-link');
                }
                ?>
                <li <?php echo $this->get_render_attribute_string($item_key); ?>>
                    <?php if ($has_link) : ?>
                        <a <?php echo $this->get_render_attribute_string($link_key); ?>>
                    <?php endif; ?>
                        <span class="hugeicons__icon-list-icon">
                            <?php echo $item['item_icon']; ?>
                        </span>
                        <span class="hugeicons__icon-list-text">
                            <?php echo esc_html($item['item_text']); ?>
                        </span>
                    <?php if ($has_link) : ?>
                        </a>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
        </ul>
        <?php
    }
}
