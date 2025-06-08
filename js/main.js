import { profilesKey, profiles, initializeProfile, restoreState, dataLoadCallback, populateProfiles, populateChecklists, canDelete, getFirstProfile } from './modules/profiles.js';
import { addCheckbox, canFilter, toggleFilteredClasses, calculateTotals } from './modules/filtering.js';
import { themeSetup, buildThemeSelection, setupSearchHighlight, setupBackToTop, setupTabRestore } from './modules/ui.js';

// assure default profile data
if (!('current' in profiles)) profiles.current = 'Default Profile';
if (!(profilesKey in profiles)) profiles[profilesKey] = {};
initializeProfile(profiles.current);

jQuery(document).ready(function($) {
    themeSetup(buildThemeSelection());

    $('ul li[data-id]').each(function() {
        addCheckbox(this);
    });

    $("a[href^='http']").attr('target','_blank');

    populateProfiles();

    $('.checkbox input[type="checkbox"]').click(function() {
        const id = $(this).attr('id');
        const isChecked = profiles[profilesKey][profiles.current].checklistData[id] = $(this).prop('checked');
        if (isChecked === true) {
          $('[data-id="'+id+'"] label').addClass('completed');
        } else {
          $('[data-id="'+id+'"] label').removeClass('completed');
        }
        $.jStorage.set(profilesKey, profiles);
        calculateTotals();
    });

    $('#themes').change(function() {
        const stylesheet = $('#themes').val();
        themeSetup(stylesheet);
        $.jStorage.set("style", stylesheet);
    });

    $('#profiles').change(function() {
        profiles.current = $(this).val();
        $.jStorage.set(profilesKey, profiles);

        $('li .checkbox .completed').show();

        populateChecklists();
        restoreState(profiles.current);
        calculateTotals();
    });

    $('#profileAdd').click(function() {
        $('#profileModalTitle').html('Add Profile');
        $('#profileModalName').val('');
        $('#profileModalAdd').show();
        $('#profileModalUpdate').hide();
        $('#profileModalDelete').hide();
        $('#profileModal').modal('show');
    });

    $('#profileEdit').click(function() {
        $('#profileModalTitle').html('Edit Profile');
        $('#profileModalName').val(profiles.current);
        $('#profileModalAdd').hide();
        $('#profileModalUpdate').show();
        if (canDelete()) {
            $('#profileModalDelete').show();
        } else {
            $('#profileModalDelete').hide();
        }
        $('#profileModal').modal('show');
    });

    $('#profileModalAdd').click(function(event) {
        event.preventDefault();
        const profile = $.trim($('#profileModalName').val());
        if (profile.length > 0) {
            initializeProfile(profile);
            profiles.current = profile;
            $.jStorage.set(profilesKey, profiles);
            populateProfiles();
            populateChecklists();
            restoreState(profiles.current);
        }
    });

    $('#profileModalUpdate').click(function(event) {
        event.preventDefault();
        const newName = $.trim($('#profileModalName').val());
        if (newName.length > 0 && newName != profiles.current) {
            profiles[profilesKey][newName] = profiles[profilesKey][profiles.current];
            delete profiles[profilesKey][profiles.current];
            profiles.current = newName;
            $.jStorage.set(profilesKey, profiles);
            populateProfiles();
        }
        $('#profileModal').modal('hide');
    });

    $('#profileModalDelete').click(function(event) {
        event.preventDefault();
        if (!canDelete()) {
            return;
        }
        if (!confirm('Are you sure?')) {
            return;
        }
        delete profiles[profilesKey][profiles.current];
        profiles.current = getFirstProfile();
        $.jStorage.set(profilesKey, profiles);
        populateProfiles();
        populateChecklists();
        restoreState(profiles.current);
        $('#profileModal').modal('hide');
    });

    $('#profileNG\\+').click(function() {
        $('#NG\\+Modal').modal('show');
    });

    $('#NG\\+ModalYes').click(function(event) {
        event.preventDefault();
        if (!confirm('Are you sure you wish to begin the next journey?')) {
            return;
        }
        $('[id^="playthrough_"], [id^="crow_"]').filter(':checked').each(function(){
            profiles[profilesKey][profiles.current].checklistData[this.id] = false;
        });
        $.each(profiles[profilesKey][profiles.current].hidden_categories, function(f){
            profiles[profilesKey][profiles.current].hidden_categories[f] = false;
        });
        if (profiles[profilesKey][profiles.current].journey < 3) {
            profiles[profilesKey][profiles.current].journey++;
        }
        $.jStorage.set(profilesKey, profiles);
        populateChecklists();
        restoreState(profiles.current);
        $('#NG\\+Modal').modal('hide');
    });

    $('#profileExport').click(function(){
        const filename = 'profiles.json';
        const text = JSON.stringify(profiles);
        if (window.Blob && window.navigator.msSaveBlob) {
            const blob = new window.Blob([text]);
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    });

    $('#profileImport').click(function(){
      $('#fileInput').trigger('click');
    });

    $('input#fileInput').change(function(){
      const fileInput = document.getElementById('fileInput');
      if(!fileInput.files || !fileInput.files[0] || !/\.json$/.test(fileInput.files[0].name)){
        alert("Bad input file. File should end in .json")
        return;
      }
      const fr = new FileReader();
      fr.readAsText(fileInput.files[0]);
      fr.onload = dataLoadCallback;
    });

    $('#profileExportText').click(function(){
        document.getElementById("profileText").value = JSON.stringify(profiles);
        document.getElementById("profileText").select();
        document.execCommand("copy");
    });

    $('#profileImportText').click(function(){
        if (!confirm('Are you sure you want to import profile data?')) {
            return;
        }
        try {
            const jsonProfileData = JSON.parse(document.getElementById("profileText").value);
            profiles = jsonProfileData;
            $.jStorage.set(profilesKey, profiles);
            populateProfiles();
            populateChecklists();
            $('#profiles').trigger("change");
            location.reload();
        } catch(e) {
            alert(e);
        }
    });

    $("#toggleHideCompleted").change(function() {
        const oldPos = $(window).scrollTop();
        const labels = $('ul>li>div>label:visible:not(.completed)');
        const oldOff = labels.map(function(){return $(this).offset().top});

        const hidden = !$(this).is(':checked');
        $('body').toggleClass('hide_completed', !hidden);
        profiles[profilesKey][profiles.current].hide_completed = !hidden;
        $.jStorage.set(profilesKey, profiles);

        for (var a=0; a<oldOff.length-1; a++) if (oldOff[a]>oldPos) break;
        for (var b=0; b<oldOff.length-1; b++) if (oldOff[b]>oldPos+$(window).height()) break;
        if (!oldOff.length || $('h2:visible').last().offset().top>oldPos) $('html, body').scrollTop(oldPos);
        else if (a==b) $('html, body').scrollTop(Math.round(labels.eq(b).offset().top)-Math.round($(window).height()/2));
        else {var c = Math.round((a+b)/2); $('html, body').scrollTop(oldPos+Math.round(labels.eq(c).offset().top)-Math.round(oldOff[c]));}
    });

    $('[data-ng-toggle]').change(function() {
        const journey = $(this).data('ng-toggle');
        profiles[profilesKey][profiles.current].journey = +journey;
        $.jStorage.set(profilesKey, profiles);
        toggleFilteredClasses('h_ng\\+');
        toggleFilteredClasses('s_ng\\+');
        toggleFilteredClasses('s_ng\\+\\+');
        calculateTotals();
    });

    $('[data-item-toggle]').change(function() {
        const type = $(this).data('item-toggle');
        const to_hide = $(this).is(':checked');
        const item_toggles = $(this).closest('.btn-group.btn-group-vertical').find('[data-item-toggle]');
        profiles[profilesKey][profiles.current].hidden_categories[type] = to_hide;
        $.jStorage.set(profilesKey, profiles);
        toggleFilteredClasses(type);
        toggleFilteredClasses('f_none');
        if (to_hide === (item_toggles.length === item_toggles.filter(':checked').length)) {
            $(this).closest('.btn-group.btn-group-vertical').find('[data-category-toggle]').not(function(){return this.checked === to_hide}).click();
        }
        $(this).closest('.btn-group.btn-group-vertical').find('.btn-group-vertical').toggleClass('open', item_toggles.filter(':checked').length > 0);
        calculateTotals();
    });

    $('[data-category-toggle]').change(function() {
        const to_hide = $(this).is(':checked');
        const item_toggles = $(this).closest('.btn-group.btn-group-vertical').find('[data-item-toggle]');
        if (to_hide || (item_toggles.length === item_toggles.filter(':checked').length)) {
            item_toggles.not(function(){return this.checked === to_hide}).click();
        }
    });

    calculateTotals();
});

setupSearchHighlight();
setupBackToTop();
setupTabRestore(restoreState, profilesKey, profiles);

$(".p").html('<a style="pointer-events:none">&nbsp;+ </a>');
