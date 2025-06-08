import { profilesKey, profiles } from './profiles.js';

export function addCheckbox(el) {
    const $el = $(el);
    const content = $el.html().split('\n')[0];
    const sublists = $el.children('ul');

    const checkboxHtml =
        '<div class="checkbox">' +
            '<label>' +
                '<input type="checkbox" id="' + $el.attr('data-id') + '">' +
                '<span class="item_content">' + content + '</span>' +
            '</label>' +
        '</div>';

    $el.html(checkboxHtml).append(sublists);

    if (profiles[profilesKey][profiles.current].checklistData[$el.attr('data-id')] === true) {
        $('#' + $el.attr('data-id')).prop('checked', true);
        $('label', $el).addClass('completed');
    }
}

export function canFilter(entry) {
    const classAttr = entry.attr('class');
    if (!classAttr) {
        return false;
    }
    if (classAttr === 'f_none') {
        return Object.values(profiles[profilesKey][profiles.current].hidden_categories).some(f => f);
    }
    const classList = classAttr.split(/\s+/);
    for (let i = 0; i < classList.length; i++) {
        if ((classList[i].match(/^h_ng\+*$/) && classList[i].match(/^h_ng(\+*)$/)[1].length < profiles[profilesKey][profiles.current].journey) ||
           (classList[i].match(/^s_ng\+*$/) && classList[i].match(/^s_ng(\+*)$/)[1].length >= profiles[profilesKey][profiles.current].journey)) {
            return true;
        }
    }
    let foundMatch = 0;
    for (let i = 0; i < classList.length; i++) {
        if (!classList[i].match(/^f_.*/)) {
            continue;
        }
        if(classList[i] in profiles[profilesKey][profiles.current].hidden_categories) {
            if(!profiles[profilesKey][profiles.current].hidden_categories[classList[i]]) {
                return false;
            }
            foundMatch = 1;
        }
    }
    if (foundMatch === 0) {
        return false;
    }
    return true;
}

export function toggleFilteredClasses(str) {
    $("li." + str).each(function() {
        if(canFilter($(this))) {
            $(this).css('display', 'none');
        } else {
            $(this).css('display', '');
        }
    });
}

export function calculateTotals() {
    $('[id$="_overall_total"]').each(function() {
        const type = this.id.match(/(.*)_overall_total/)[1];
        let overallCount = 0, overallChecked = 0;
        $('[id^="' + type + '_totals_"]').each(function() {
            const regex = new RegExp(type + '_totals_(.*)');
            const regexFilter = new RegExp('^playthrough_(.*)');
            const i = parseInt(this.id.match(regex)[1]);
            let count = 0, checked = 0;
            for (let j = 1; ; j++) {
                const checkbox = $('#' + type + '_' + i + '_' + j);
                if (checkbox.length === 0) {
                    break;
                }
                if (checkbox.is(':hidden') && checkbox.prop('id').match(regexFilter) && canFilter(checkbox.closest('li'))) {
                    continue;
                }
                count++;
                overallCount++;
                if (checkbox.prop('checked')) {
                    checked++;
                    overallChecked++;
                }
            }
            if (checked === count) {
                this.innerHTML = $('#' + type + '_nav_totals_' + i)[0].innerHTML = 'DONE';
                $(this).removeClass('in_progress').addClass('done');
                $(this).parent('h3').addClass('completed');
                $($('#' + type + '_nav_totals_' + i)[0]).removeClass('in_progress').addClass('done');
            } else {
                this.innerHTML = $('#' + type + '_nav_totals_' + i)[0].innerHTML =  checked + '/' + count;
                $(this).removeClass('done').addClass('in_progress');
                $(this).parent('h3').removeClass('completed');
                $($('#' + type + '_nav_totals_' + i)[0]).removeClass('done').addClass('in_progress');
            }
            $(this).parent('h3').next('div').children('h4').addClass('completed');
            $(this).parent('h3').next('div').children('ul').children('li').children('div').children('label:not(.completed)').parent('div').parent('li').parent('ul').prev('h4').removeClass('completed');
        });
        if (overallChecked === overallCount) {
            this.innerHTML = 'DONE';
            $(this).removeClass('in_progress').addClass('done');
        } else {
            this.innerHTML = overallChecked + '/' + overallCount;
            $(this).removeClass('done').addClass('in_progress');
        }
        document.getElementById("profileText").value = JSON.stringify(profiles);
    });
}

