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
    $.post(route, payload, function () {
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
    self.northTeams = ko.observableArray([]);
    self.southTeams = ko.observableArray([]);
    self.eastTeams = ko.observableArray([]);
    self.westTeams = ko.observableArray([]);
    self.allNcaaTeams = {};

    tbdTeam = new NcaaTeamViewModel('TBD','','');
    for (var key in msTeams) {
        var newTeam;
        newTeam = new NcaaTeamViewModel(msTeams[key].teamName, msTeams[key]._id, msTeams[key].seed);
        self.allNcaaTeams[msTeams[key]._id] = newTeam;
        if (msTeams[key].region === 'north') { self.northTeams.push(newTeam); }
        if (msTeams[key].region === 'south') { self.southTeams.push(newTeam); }
        if (msTeams[key].region === 'east') { self.eastTeams.push(newTeam); }
        if (msTeams[key].region === 'west') { self.westTeams.push(newTeam); }
    };
    self.northTeams.sort(seedComparator);
    self.southTeams.sort(seedComparator);
    self.eastTeams.sort(seedComparator);
    self.westTeams.sort(seedComparator);

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
        $.post(route, payload, function () {
            window.location.reload(true);
        });
    };

    self.pushTeam = function(team) {
        var selectedRound, tbdIndex;
        selectedRound = $("#roundTabs li[class='active']").attr('id')[1];
        switch (selectedRound) {
            case ("1"):
                tbdIndex = self.indexOfFirstTBD('round1picks');
                if (tbdIndex !== -1) {
                    self.insertTeamIntoPicksArray('round1picks', team);
                }
                break;
            case ("2"):
                tbdIndex = self.indexOfFirstTBD('round2picks');
                if (tbdIndex !== -1) {
                    self.insertTeamIntoPicksArray('round2picks', team);
                }
                break;
            case ("3"):
                tbdIndex = self.indexOfFirstTBD('round3picks');
                if (tbdIndex !== -1) {
                    self.insertTeamIntoPicksArray('round3picks', team);
                }
                break;
            case ("4"):
                tbdIndex = self.indexOfFirstTBD('round4picks');
                if (tbdIndex !== -1) {
                    self.insertTeamIntoPicksArray('round4picks', team);
                }
                break;
            case ("5"):
                tbdIndex = self.indexOfFirstTBD('round5picks');
                if (tbdIndex !== -1) {
                    self.insertTeamIntoPicksArray('round5picks', team);
                }
                break;
            case ("6"):
                tbdIndex = self.indexOfFirstTBD('round6picks');
                if (tbdIndex !== -1) {
                    self.insertTeamIntoPicksArray('round6picks', team);
                }
                break;
        }

    };

    self.indexOfFirstTBD = function (roundIndex) {
        for(var i = 0, len = self[roundIndex]().length; i < len; i++) {
            if (self[roundIndex]()[i].name === 'TBD') { return i; }
        }
        return -1;
    };

    self.insertTeamIntoPicksArray = function(roundIndex, team) {
        self[roundIndex].pop();
        self[roundIndex].reverse();
        self[roundIndex].push(new NcaaTeamViewModel(team.name, team.id, team.seed));
        self[roundIndex].reverse();
    };

    function NcaaTeamViewModel(teamName, teamId, seed) {
        var self = this;
        self.name = teamName;
        self.id = teamId;
        self.seed = seed;
    }
};



function seedComparator(a, b) {
    if (a.seed < b.seed) { return -1; }
    if (a.seed > b.seed) { return 1; }
    return 0;
}

