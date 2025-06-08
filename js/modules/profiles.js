export const profilesKey = 'darksouls3_profiles';

export let profiles = $.jStorage.get(profilesKey, {});

export function initializeProfile(profile_name) {
    if (!(profile_name in profiles[profilesKey])) profiles[profilesKey][profile_name] = {};
    if (!('checklistData' in profiles[profilesKey][profile_name]))
        profiles[profilesKey][profile_name].checklistData = {};
    if (!('collapsed' in profiles[profilesKey][profile_name]))
        profiles[profilesKey][profile_name].collapsed = {};
    if (!('current_tab' in profiles[profilesKey][profile_name]))
        profiles[profilesKey][profile_name].current_tab = '#tabPlaythrough';
    if (!('hide_completed' in profiles[profilesKey][profile_name]))
        profiles[profilesKey][profile_name].hide_completed = false;
    if (!('journey' in profiles[profilesKey][profile_name]))
        profiles[profilesKey][profile_name].journey = 1;
    if (!('hidden_categories' in profiles[profilesKey][profile_name]))
        profiles[profilesKey][profile_name].hidden_categories = {
            f_boss: false,
            f_miss: false,
            f_npc: false,
            f_estus: false,
            f_bone: false,
            f_tome: false,
            f_coal: false,
            f_ash: false,
            f_gest: false,
            f_sorc: false,
            f_pyro: false,
            f_mirac: false,
            f_ring: false,
            f_weap: false,
            f_arm: false,
            f_tit: false,
            f_gem: false,
            f_cov: false,
            f_misc: false
        };
}

export function restoreState(profile_name) {
    $('a[href$="_col"]').each(function() {
        const value = profiles[profilesKey][profile_name].collapsed[$(this).attr('href')];
        const active = $(this).hasClass('collapsed');
        if ((value && !active) || (!value && active)) {
            $($(this).attr('href')).collapse('toggle');
        }
    });

    const $button = $("#toggleHideCompleted");
    const hide_completed_state = profiles[profilesKey][profile_name].hide_completed;
    const button_active = $button.is(':checked');
    if ((hide_completed_state && !button_active) || (!hide_completed_state && button_active)) {
        $button.click();
    }

    $('[data-ng-toggle="' + profiles[profilesKey][profile_name].journey + '"]').click().change();
    $.each(profiles[profilesKey][profile_name].hidden_categories, function(key, value) {
        const $el = $('[data-item-toggle="' + key + '"]');
        const active = $el.is(':checked');
        if ((value && !active) || (!value && active)) {
            $el.click();
        }
    });
}

export function dataLoadCallback(arg){
  const jsonProfileData = JSON.parse(arg.currentTarget.result);
  profiles = jsonProfileData;
  $.jStorage.set(profilesKey, profiles);
  populateProfiles();
  populateChecklists();
  $('#profiles').trigger("change");
  location.reload();
}

export function populateProfiles() {
    $('#profiles').empty();
    $.each(profiles[profilesKey], function(index) {
        $('#profiles').append($("<option></option>").attr('value', index).text(index));
    });
    $('#profiles').val(profiles.current);
}

export function populateChecklists() {
    $('.checkbox input[type="checkbox"]').prop('checked', false)
        .closest('label').removeClass('completed')
        .closest('li').show();

    $.each(profiles[profilesKey][profiles.current].checklistData, function(index, value) {
        $('#' + index)
            .prop('checked', value)
            .closest('label')
            .toggleClass('completed', value);
    });

}

export function canDelete() {
    let count = 0;
    $.each(profiles[profilesKey], function() { count++; });
    return (count > 1);
}

export function getFirstProfile() {
    for (const profile in profiles[profilesKey]) {
        return profile;
    }
}
