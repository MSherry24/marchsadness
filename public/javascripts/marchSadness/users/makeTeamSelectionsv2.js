$(document).ready(function () {
    // Activates knockout.js
    ko.applyBindings(new makePicksViewModel());
});

function makePicksViewModel() {
    "use strict";
    var self, tbdTeam;
    self = this;
    self.round1picks = ko.observableArray([]);
    self.round2picks = ko.observableArray([]);
    self.round3picks = ko.observableArray([]);
    self.round4picks = ko.observableArray([]);
    self.round5picks = ko.observableArray([]);
    self.round6picks = ko.observableArray([]);
    self.midwestTeams = ko.observableArray([]);
    self.southTeams = ko.observableArray([]);
    self.eastTeams = ko.observableArray([]);
    self.westTeams = ko.observableArray([]);
    self.allNcaaTeams = {};
    self.allNcaaTeamsList = ko.observableArray([]);

    tbdTeam = new NcaaTeamViewModel('TBD', '', '', true, false);

    for (var key in msTeams) {
        var newTeam;
        newTeam = new NcaaTeamViewModel(msTeams[key].teamName, msTeams[key]._id, msTeams[key].seed, true, msTeams[key].eliminated);
        self.allNcaaTeams[msTeams[key]._id] = newTeam;
        self.allNcaaTeamsList.push(newTeam);
    }

    function NcaaTeamViewModel(teamName, teamId, seed, notSelected, eliminated) {
        var self = this;
        self.name = teamName;
        self.id = teamId;
        self.seed = seed;
        self.notSelected = ko.observable(notSelected);
        self.eliminated = eliminated;
    }


}