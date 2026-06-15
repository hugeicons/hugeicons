jQuery(document).ready(function ($) {
    $('body').on('click', '.hugeicons-icon-control', function () {
        var modal = $('#hugeicons-pro-icons-modal');
        // Show the modal
        modal.fadeIn(300);
        // set display to flex
        modal.css('display', 'flex');

        // Initialize the React app
        if (window.HugeiconsReactApp) {
            console.log("Init react")
            window.HugeiconsReactApp.init('hugeicons-icon-browser-app');
        }
    });

    $(window).on('click', function (event) {
        var modal = $('#hugeicons-pro-icons-modal');
        if ($(event.target).is(modal) || $(event.target).is('.elementor-templates-modal__header__close i')) {
            modal.fadeOut(300);
        }

        if($(event.target).is('#hugeicons__icon-select')) {
            var iconSVG = $('#hugeicons__selected-icon-svg').text();
            // change width and height to 100% in the svg tag
            iconSVG = iconSVG.replace(/width="(\d+)"/, 'width="100%"');
            iconSVG = iconSVG.replace(/height="(\d+)"/, 'height="100%"');

            // Replace all "#141B34" with "currentColor"
            iconSVG = iconSVG.replace(/#141B34/g, 'currentColor');

            if(!iconSVG) {
                modal.fadeOut(300);
                return;
            }

            $('.hugeicons-icon-value-input').val(iconSVG).trigger('input');
            $('.hugeicons-control-icon__preview').html(iconSVG);
            modal.fadeOut(300);
        }
    });
});
