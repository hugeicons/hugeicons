<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Elementor FAQ Widget.
 *
 * Elementor widget that displays an accordion-style FAQ section.
 *
 * @since 1.0.0
 */
class Hugeicons_FAQ_Widget extends \Elementor\Widget_Base
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
        return 'hugeicons-faq';
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
        return esc_html__('FAQ', 'hugeicons-pro');
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
        return 'eicon-accordion';
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
        return 'https://hugeicons.com/docs/widgets/faq';
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
        return ['faq', 'accordion', 'hugeicons', 'question', 'answer', 'toggle'];
    }

    /**
     * Get script depends.
     *
     * @return array Script dependencies.
     * @since 1.0.0
     * @access public
     */
    public function get_script_depends()
    {
        return ['hugeicons-faq-widget'];
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
                'label' => esc_html__('FAQ Items', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $repeater = new \Elementor\Repeater();

        $repeater->add_control(
            'question',
            [
                'label' => esc_html__('Question', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::TEXT,
                'default' => esc_html__('What is this FAQ about?', 'hugeicons-pro'),
                'placeholder' => esc_html__('Enter question', 'hugeicons-pro'),
                'label_block' => true,
            ]
        );

        $repeater->add_control(
            'answer',
            [
                'label' => esc_html__('Answer', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::WYSIWYG,
                'default' => esc_html__('This is the answer to the question. You can add any content here including formatting, links, and more.', 'hugeicons-pro'),
                'placeholder' => esc_html__('Enter answer', 'hugeicons-pro'),
            ]
        );

        $repeater->add_control(
            'item_icon',
            [
                'label' => esc_html__('Question Icon', 'hugeicons-pro'),
                'type' => 'hugeicons-icon-browse',
                'default' => '',
            ]
        );

        $this->add_control(
            'faq_items',
            [
                'label' => esc_html__('FAQ Items', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::REPEATER,
                'fields' => $repeater->get_controls(),
                'default' => [
                    [
                        'question' => esc_html__('What is Hugeicons?', 'hugeicons-pro'),
                        'answer' => esc_html__('Hugeicons is a premium icon library with thousands of beautiful icons in multiple styles.', 'hugeicons-pro'),
                    ],
                    [
                        'question' => esc_html__('How do I use the icons?', 'hugeicons-pro'),
                        'answer' => esc_html__('Simply drag the icon widgets to your page and click to browse and select your desired icon from our library.', 'hugeicons-pro'),
                    ],
                    [
                        'question' => esc_html__('Can I customize the icons?', 'hugeicons-pro'),
                        'answer' => esc_html__('Yes! You can customize the color, size, and other styling options for each icon using the Elementor controls.', 'hugeicons-pro'),
                    ],
                ],
                'title_field' => '{{{ question }}}',
            ]
        );

        $this->end_controls_section();

        // Settings Section
        $this->start_controls_section(
            'settings_section',
            [
                'label' => esc_html__('Settings', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_CONTENT,
            ]
        );

        $this->add_control(
            'expand_icon',
            [
                'label' => esc_html__('Expand Icon', 'hugeicons-pro'),
                'type' => 'hugeicons-icon-browse',
                'default' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4V20M4 12H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>',
            ]
        );

        $this->add_control(
            'collapse_icon',
            [
                'label' => esc_html__('Collapse Icon', 'hugeicons-pro'),
                'type' => 'hugeicons-icon-browse',
                'default' => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 12H20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>',
            ]
        );

        $this->add_control(
            'icon_position',
            [
                'label' => esc_html__('Toggle Icon Position', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::CHOOSE,
                'options' => [
                    'left' => [
                        'title' => esc_html__('Left', 'hugeicons-pro'),
                        'icon' => 'eicon-h-align-left',
                    ],
                    'right' => [
                        'title' => esc_html__('Right', 'hugeicons-pro'),
                        'icon' => 'eicon-h-align-right',
                    ],
                ],
                'default' => 'right',
                'toggle' => false,
            ]
        );

        $this->add_control(
            'first_open',
            [
                'label' => esc_html__('First Item Open', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => esc_html__('Yes', 'hugeicons-pro'),
                'label_off' => esc_html__('No', 'hugeicons-pro'),
                'return_value' => 'yes',
                'default' => 'yes',
            ]
        );

        $this->add_control(
            'toggle_multiple',
            [
                'label' => esc_html__('Allow Multiple Open', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SWITCHER,
                'label_on' => esc_html__('Yes', 'hugeicons-pro'),
                'label_off' => esc_html__('No', 'hugeicons-pro'),
                'return_value' => 'yes',
                'default' => 'no',
            ]
        );

        $this->end_controls_section();

        // Style Section - Item
        $this->start_controls_section(
            'style_item_section',
            [
                'label' => esc_html__('Item', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'item_spacing',
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
                    'size' => 10,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-widget' => 'gap: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'item_background',
            [
                'label' => esc_html__('Background Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#f9fafb',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-item' => 'background-color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'item_background_active',
            [
                'label' => esc_html__('Active Background Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-item.active' => 'background-color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'item_border_radius',
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
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-item' => 'border-radius: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Border::get_type(),
            [
                'name' => 'item_border',
                'selector' => '{{WRAPPER}} .hugeicons__faq-item',
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Box_Shadow::get_type(),
            [
                'name' => 'item_box_shadow',
                'selector' => '{{WRAPPER}} .hugeicons__faq-item',
            ]
        );

        $this->end_controls_section();

        // Style Section - Question
        $this->start_controls_section(
            'style_question_section',
            [
                'label' => esc_html__('Question', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_responsive_control(
            'question_padding',
            [
                'label' => esc_html__('Padding', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%', 'em', 'rem'],
                'default' => [
                    'top' => '16',
                    'right' => '20',
                    'bottom' => '16',
                    'left' => '20',
                    'unit' => 'px',
                    'isLinked' => false,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-question' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'question_color',
            [
                'label' => esc_html__('Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#1f2937',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-question-text' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'question_color_active',
            [
                'label' => esc_html__('Active Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-item.active .hugeicons__faq-question-text' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'question_typography',
                'selector' => '{{WRAPPER}} .hugeicons__faq-question-text',
            ]
        );

        $this->end_controls_section();

        // Style Section - Answer
        $this->start_controls_section(
            'style_answer_section',
            [
                'label' => esc_html__('Answer', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_responsive_control(
            'answer_padding',
            [
                'label' => esc_html__('Padding', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::DIMENSIONS,
                'size_units' => ['px', '%', 'em', 'rem'],
                'default' => [
                    'top' => '0',
                    'right' => '20',
                    'bottom' => '16',
                    'left' => '20',
                    'unit' => 'px',
                    'isLinked' => false,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-answer' => 'padding: {{TOP}}{{UNIT}} {{RIGHT}}{{UNIT}} {{BOTTOM}}{{UNIT}} {{LEFT}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'answer_color',
            [
                'label' => esc_html__('Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#6b7280',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-answer' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_group_control(
            \Elementor\Group_Control_Typography::get_type(),
            [
                'name' => 'answer_typography',
                'selector' => '{{WRAPPER}} .hugeicons__faq-answer',
            ]
        );

        $this->end_controls_section();

        // Style Section - Icons
        $this->start_controls_section(
            'style_icons_section',
            [
                'label' => esc_html__('Icons', 'hugeicons-pro'),
                'tab' => \Elementor\Controls_Manager::TAB_STYLE,
            ]
        );

        $this->add_control(
            'heading_question_icon',
            [
                'label' => esc_html__('Question Icon', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::HEADING,
            ]
        );

        $this->add_control(
            'question_icon_color',
            [
                'label' => esc_html__('Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#6366f1',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-icon svg' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'question_icon_size',
            [
                'label' => esc_html__('Size', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['px', 'em', 'rem'],
                'range' => [
                    'px' => [
                        'min' => 10,
                        'max' => 50,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 24,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-icon svg' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
                ],
            ]
        );

        $this->add_control(
            'heading_toggle_icon',
            [
                'label' => esc_html__('Toggle Icon', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::HEADING,
                'separator' => 'before',
            ]
        );

        $this->add_control(
            'toggle_icon_color',
            [
                'label' => esc_html__('Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'default' => '#9ca3af',
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-toggle svg' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'toggle_icon_color_active',
            [
                'label' => esc_html__('Active Color', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::COLOR,
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-item.active .hugeicons__faq-toggle svg' => 'color: {{VALUE}};',
                ],
            ]
        );

        $this->add_control(
            'toggle_icon_size',
            [
                'label' => esc_html__('Size', 'hugeicons-pro'),
                'type' => \Elementor\Controls_Manager::SLIDER,
                'size_units' => ['px', 'em', 'rem'],
                'range' => [
                    'px' => [
                        'min' => 10,
                        'max' => 50,
                        'step' => 1,
                    ],
                ],
                'default' => [
                    'unit' => 'px',
                    'size' => 20,
                ],
                'selectors' => [
                    '{{WRAPPER}} .hugeicons__faq-toggle svg' => 'width: {{SIZE}}{{UNIT}}; height: {{SIZE}}{{UNIT}};',
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

        $this->add_render_attribute('wrapper', 'class', 'hugeicons__faq-widget');
        $this->add_render_attribute('wrapper', 'class', 'hugeicons__faq-toggle-' . $settings['icon_position']);
        $this->add_render_attribute('wrapper', 'data-multiple', $settings['toggle_multiple'] === 'yes' ? 'true' : 'false');
        ?>
        <div <?php echo $this->get_render_attribute_string('wrapper'); ?>>
            <?php foreach ($settings['faq_items'] as $index => $item) : ?>
                <?php
                $item_class = 'hugeicons__faq-item elementor-repeater-item-' . $item['_id'];
                if ($settings['first_open'] === 'yes' && $index === 0) {
                    $item_class .= ' active';
                }
                ?>
                <div class="<?php echo esc_attr($item_class); ?>">
                    <div class="hugeicons__faq-question">
                        <?php if (!empty($item['item_icon'])) : ?>
                            <span class="hugeicons__faq-icon">
                                <?php echo $item['item_icon']; ?>
                            </span>
                        <?php endif; ?>
                        <span class="hugeicons__faq-question-text">
                            <?php echo esc_html($item['question']); ?>
                        </span>
                        <span class="hugeicons__faq-toggle">
                            <span class="hugeicons__faq-expand-icon">
                                <?php echo $settings['expand_icon']; ?>
                            </span>
                            <span class="hugeicons__faq-collapse-icon">
                                <?php echo $settings['collapse_icon']; ?>
                            </span>
                        </span>
                    </div>
                    <div class="hugeicons__faq-answer">
                        <?php echo wp_kses_post($item['answer']); ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
        <?php
    }
}
