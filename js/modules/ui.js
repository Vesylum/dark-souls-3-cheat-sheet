export const themes = {
    "Standard" : "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
    "Cosmo" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cosmo/bootstrap.min.css",
    "Cyborg" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/cyborg/bootstrap.min.css",
    "Darkly" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/darkly/bootstrap.min.css",
    "Flatly" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/flatly/bootstrap.min.css",
    "Journal" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/journal/bootstrap.min.css",
    "Lumen" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/lumen/bootstrap.min.css",
    "Paper" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/paper/bootstrap.min.css",
    "Readable" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/readable/bootstrap.min.css",
    "Sandstone" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/sandstone/bootstrap.min.css",
    "Simplex" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/simplex/bootstrap.min.css",
    "Slate" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/slate/bootstrap.min.css",
    "Spacelab" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/spacelab/bootstrap.min.css",
    "Superhero" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/superhero/bootstrap.min.css",
    "United" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/united/bootstrap.min.css",
    "Yeti" : "https://maxcdn.bootstrapcdn.com/bootswatch/3.3.6/yeti/bootstrap.min.css"
};

export function themeSetup(stylesheet) {
    if(stylesheet === null || stylesheet === undefined) {
        stylesheet = $.jStorage.get("style") || "Standard";
    }
    $("#bootstrap").attr("href", themes[stylesheet]);
}

export function buildThemeSelection() {
    const style = $.jStorage.get("style") || "Standard";
    const themeSelect = $("#themes");
    $.each(themes, function(key){
        themeSelect.append(
            $('<option></option>').val(key).html(key + " Theme")
        );
    });
    themeSelect.val(style);
    return style;
}

export function setupSearchHighlight() {
    $(function() {
        const jets = [new Jets({
            searchTag: '#playthrough_search',
            contentTag: '#playthrough_list ul'
        }), new Jets({
            searchTag: '#item_search',
            contentTag: '#item_list h4, #item_list ul'
        }), new Jets({
            searchTag: '#weapons_search',
            contentTag: '#weapons_list h4, #weapons_list ul'
        }), new Jets({
            searchTag: '#armors_search',
            contentTag: '#armors_list ul'
        })];

        $('#playthrough_search').keyup(function() {
            $('#playthrough_list').unhighlight();
            $('#playthrough_list').highlight($(this).val());
        });
        $('#item_search').keyup(function() {
            $('#item_list').unhighlight();
            $('#item_list').highlight($(this).val());
        });
        $('#weapons_search').keyup(function() {
            $('#weapons_list').unhighlight();
            $('#weapons_list').highlight($(this).val());
        });
        $('#armors_search').keyup(function() {
            $('#armors_list').unhighlight();
            $('#armors_list').highlight($(this).val());
        });
    });
}

export function setupBackToTop() {
    $(function() {
        const offset = 220;
        const duration = 500;
        $(window).scroll(function() {
            if ($(this).scrollTop() > offset) {
                $('.fadingbutton').fadeIn(duration);
            } else {
                $('.fadingbutton').fadeOut(duration);
            }
        });

        $('.back-to-top').click(function(event) {
            event.preventDefault();
            $('html, body').animate({scrollTop: 0}, duration);
            return false;
        });
    });
}

export function setupTabRestore(restoreState, profilesKey, profiles) {
    $(function() {
        $('#toggleHideCompleted').attr('checked', false);
        restoreState(profiles.current);

        if (profiles[profilesKey][profiles.current].current_tab) {
            $('.nav.navbar-nav li a[href="' + profiles[profilesKey][profiles.current].current_tab + '"]').click();
        }

        $('a[href$="_col"]').on('click', function() {
            const collapsed_key = $(this).attr('href');
            const saved_tab_state = !!profiles[profilesKey][profiles.current].collapsed[collapsed_key];
            profiles[profilesKey][profiles.current].collapsed[$(this).attr('href')] = !saved_tab_state;
            $.jStorage.set(profilesKey, profiles);
        });

        $('.nav.navbar-nav li a').on('click', function() {
            profiles[profilesKey][profiles.current].current_tab = $(this).attr('href');
            $.jStorage.set(profilesKey, profiles);
        });
    });
}
