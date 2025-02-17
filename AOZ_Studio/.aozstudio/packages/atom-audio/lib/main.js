var path = require("path"),
    AudioPreviewer = require("./audio-previewer");

module.exports = {
    activate: function() {
        this.openerDisposable = atom.workspace.addOpener( function(uriToOpen){
                var extension = path.extname(uriToOpen).toLowerCase();

                if( extension === '.mp3' ||
                    extension === '.ogg' ||
                    extension === '.aac' ||
                    extension === '.wav') {
                    return new AudioPreviewer(uriToOpen);
                }
            });
    },

    deactivate: function() {
        this.openerDisposable.dispose();
    }
};
