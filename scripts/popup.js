$(document).ready(function() {
    chrome.storage.sync.get(['extensionEnabled', 'preset', 'videoPercentage'], (data) => {
        const extensionEnabled = data.extensionEnabled !== undefined ? data.extensionEnabled : true; // default to true
        const preset = data.preset !== undefined ? data.preset : "standard"; // default to standard
        const videoPercentage = data.videoPercentage !== undefined ? data.videoPercentage : 100; // default to 100%

        $('#enabled-checkbox').prop('checked', extensionEnabled);
        $('#preset-select').val(preset);
        $('#video-percentage-slider').val(videoPercentage);
        $('#video-percentage-value').html(videoPercentage);
    });
});

$(document).on('change', '#enabled-checkbox', function() {
    chrome.storage.sync.set({extensionEnabled: $(this).prop('checked')});
});

$(document).on('change', '#preset-select', function() {
    chrome.storage.sync.set({preset: $(this).val()});
});

$(document).on('input change', '#video-percentage-slider', function() {
    $('#video-percentage-value').html($(this).val());
    chrome.storage.sync.set({videoPercentage: $(this).val()});
});
