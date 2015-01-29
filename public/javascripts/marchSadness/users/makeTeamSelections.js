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
    $('#saving').hide();
    // Activates knockout.js
    ko.applyBindings(new makePicksViewModel())
});

var addTeam = function() {
    var route, payload;
    route = '/marchsadness/addPick/' + event.target.value;
    payload = {
        round1picks: round1picks(),
        round2picks: round2picks(),
        round3picks: round3picks(),
        round4picks: round4picks(),
        round5picks: round5picks(),
        round6picks: round6picks()
    };
    $('#save').hide();
    $('#saving').show();
    $.post(route, payload, function () {
        $('#save').show();
        $('#saving').hide();
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
    self.midwestTeams = ko.observableArray([]);
    self.southTeams = ko.observableArray([]);
    self.eastTeams = ko.observableArray([]);
    self.westTeams = ko.observableArray([]);
    self.allNcaaTeams = {};

    tbdTeam = new NcaaTeamViewModel('TBD','','', true);
    for (var key in msTeams) {
        var newTeam;
        newTeam = new NcaaTeamViewModel(msTeams[key].teamName, msTeams[key]._id, msTeams[key].seed, true);
        self.allNcaaTeams[msTeams[key]._id] = newTeam;
        if (msTeams[key].region === 'midwest') { self.midwestTeams.push(newTeam); }
        if (msTeams[key].region === 'south') { self.southTeams.push(newTeam); }
        if (msTeams[key].region === 'east') { self.eastTeams.push(newTeam); }
        if (msTeams[key].region === 'west') { self.westTeams.push(newTeam); }
    }
    self.midwestTeams.sort(seedComparator);
    self.southTeams.sort(seedComparator);
    self.eastTeams.sort(seedComparator);
    self.westTeams.sort(seedComparator);

    ['1','2','3','4','5','6'].map(function(i) {
        team.rounds['round' + i + 'picks'].map(function(x) {
            self['round' + i + 'picks'].push(self.allNcaaTeams[x]);
            self.allNcaaTeams[x].notSelected(false)
        });
    });
    while (self.round1picks().length < 6) { self.round1picks().push(tbdTeam); }
    while (self.round2picks().length < 6) { self.round2picks().push(tbdTeam); }
    while (self.round3picks().length < 3) { self.round3picks().push(tbdTeam); }
    while (self.round4picks().length < 3) { self.round4picks().push(tbdTeam); }
    while (self.round5picks().length < 1) { self.round5picks().push(tbdTeam); }
    while (self.round6picks().length < 1) { self.round6picks().push(tbdTeam); }

    self.addTeam = function() {
        var route, payload;
        route = '/marchsadness/addPick/' + team._id;
        payload = {
            round1picks: self.round1picks(),
            round2picks: self.round2picks(),
            round3picks: self.round3picks(),
            round4picks: self.round4picks(),
            round5picks: self.round5picks(),
            round6picks: self.round6picks()
        };
        $('#save').hide();
        $('#saving').show();
        $.post(route, payload, function () {
            setTimeout(function () {
                $('#save').show();
                $('#saving').hide();
            }, 1500);
        });
    };

    self.pushTeam = function(team) {
        var selectedRound, tbdIndex;
        selectedRound = $("#roundTabs li[class='active']").attr('id')[1];
        tbdIndex = self.indexOfFirstTBD(selectedRound);
        if (tbdIndex !== -1) {
            self.insertTeamIntoPicksArray(selectedRound, team);
        }
    };

    self.popTeam = function(team) {
        var selectedRound;
        if (team.name !== 'TBD') {
            selectedRound = $("#roundTabs li[class='active']").attr('id')[1];
            team.notSelected(true);
            self.removeTeam(team, selectedRound);
        }
    };

    self.removeTeam = function (team, selectedRound) {
        var roundIndex, tempArray, tempTeam;
        tempArray = [];

        roundIndex = 'round' + selectedRound + 'picks';
        while(self[roundIndex]().length > 0) {
            tempTeam = self[roundIndex].pop();
            if (tempTeam.id !== team.id) {
                tempArray.push(tempTeam);
            }
        }
        while(tempArray.length > 0) {
            self[roundIndex].push(tempArray.pop());
        }
        self[roundIndex].push(tbdTeam);
    };

    self.indexOfFirstTBD = function (selectedRound) {
        var roundIndex;
        roundIndex = 'round' + selectedRound + 'picks';
        for(var i = 0, len = self[roundIndex]().length; i < len; i++) {
            if (self[roundIndex]()[i].name === 'TBD') { return i; }
        }
        return -1;
    };

    self.insertTeamIntoPicksArray = function(selectedRound, team) {
        var roundIndex;
        roundIndex = 'round' + selectedRound + 'picks';
        team.notSelected(false);
        self[roundIndex].pop();
        self[roundIndex].reverse();
        self[roundIndex].push(team);
        self[roundIndex].reverse();
    };

    function NcaaTeamViewModel(teamName, teamId, seed, notSelected) {
        var self = this;
        self.name = teamName;
        self.id = teamId;
        self.seed = seed;
        self.notSelected = ko.observable(notSelected);
    }
}

function seedComparator(a, b) {
    if (a.seed < b.seed) { return -1; }
    if (a.seed > b.seed) { return 1; }
    return 0;
}

