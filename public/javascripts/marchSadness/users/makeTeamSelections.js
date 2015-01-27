$(document).ready(function () {
    $('#Round1 a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#Round2 a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#Round3 a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#Round4 a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#Round5 a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $('#Round6 a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    // Activates knockout.js
    ko.applyBindings(new makePicksViewModel())
    $('#addTeam').on('click', addTeam);

});

var addTeam = function() {
    var route;
    route = '/marchsadness/addPick/' + event.target.value;
    $.post(route, function () {
        window.location.reload(true);
    });
};

function makePicksViewModel() {
    var self, tbdTeam;
    self = this;
    self.round1picks = ko.observableArray([]);
    self.round2picks = ko.observableArray([]);
    self.round3picks = ko.observableArray([]);
    self.round4picks = ko.observableArray([]);
    self.round5picks = ko.observableArray([]);
    self.round6picks = ko.observableArray([]);
    self.roundSelection = ko.observable();
    self.allNcaaTeams = {};
    tbdTeam = new NcaaTeam ('TBD','');
    for (var key in msTeams) {
        self.allNcaaTeams[msTeams[key]._id] = new NcaaTeam(msTeams[key].teamName, msTeams[key]._id);
    };
    ['1','2','3','5','6'].map(function(i) {
        team.rounds['round' + i + 'picks'].map(function(x) {
            self['round' + i + 'picks'].push(self.allNcaaTeams[x]);
        });
    });
    while (self.round1picks().length < 6) { self.round1picks().push(tbdTeam); }
    while (self.round2picks().length < 6) { self.round2picks().push(tbdTeam); }
    while (self.round3picks().length < 3) { self.round3picks().push(tbdTeam); }
    while (self.round4picks().length < 3) { self.round4picks().push(tbdTeam); }
    while (self.round5picks().length < 1) { self.round5picks().push(tbdTeam); }
    while (self.round6picks().length < 1) { self.round6picks().push(tbdTeam); }
}

function NcaaTeam(teamName, teamId) {
    var self = this;
    self.name = teamName;
    self.id = teamId;
}

