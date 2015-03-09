$(document).ready(function () {
    ko.applyBindings(new makePicksViewModel());
    setPicklistValues();
    $('.teamSelectView').hide();
});

function makePicksViewModel() {
    "use strict";
    var self = this,
        key,
        removeIndex,
        pickIndex,
        tbdTeam,
        allOptionLists = [];
    self.round1picks = ko.observableArray([]);
    self.round2picks = ko.observableArray([]);
    self.round3picks = ko.observableArray([]);
    self.round4picks = ko.observableArray([]);
    self.round5picks = ko.observableArray([]);
    self.round6picks = ko.observableArray([]);
    self.round1pick1 = ko.observable();
    self.round1pick2 = ko.observable();
    self.round1pick3 = ko.observable();
    self.round1pick4 = ko.observable();
    self.round1pick5 = ko.observable();
    self.round1pick6 = ko.observable();
    self.round2pick1 = ko.observable();
    self.round2pick2 = ko.observable();
    self.round2pick3 = ko.observable();
    self.round2pick4 = ko.observable();
    self.round2pick5 = ko.observable();
    self.round2pick6 = ko.observable();
    self.round3pick1 = ko.observable();
    self.round3pick2 = ko.observable();
    self.round3pick3 = ko.observable();
    self.round4pick1 = ko.observable();
    self.round4pick2 = ko.observable();
    self.round4pick3 = ko.observable();
    self.round5pick1 = ko.observable();
    self.round6pick1 = ko.observable();
    self.round1pick1options = ko.observableArray([]);
    self.round1pick2options = ko.observableArray([]);
    self.round1pick3options = ko.observableArray([]);
    self.round1pick4options = ko.observableArray([]);
    self.round1pick5options = ko.observableArray([]);
    self.round1pick6options = ko.observableArray([]);
    self.round2pick1options = ko.observableArray([]);
    self.round2pick2options = ko.observableArray([]);
    self.round2pick3options = ko.observableArray([]);
    self.round2pick4options = ko.observableArray([]);
    self.round2pick5options = ko.observableArray([]);
    self.round2pick6options = ko.observableArray([]);
    self.round3pick1options = ko.observableArray([]);
    self.round3pick2options = ko.observableArray([]);
    self.round3pick3options = ko.observableArray([]);
    self.round4pick1options = ko.observableArray([]);
    self.round4pick2options = ko.observableArray([]);
    self.round4pick3options = ko.observableArray([]);
    self.round5pick1options = ko.observableArray([]);
    self.round6pick1options = ko.observableArray([]);
    allOptionLists = [
        self.round1pick1options,
        self.round1pick2options,
        self.round1pick3options,
        self.round1pick4options,
        self.round1pick5options,
        self.round1pick6options,
        self.round2pick1options,
        self.round2pick2options,
        self.round2pick3options,
        self.round2pick4options,
        self.round2pick5options,
        self.round2pick6options,
        self.round3pick1options,
        self.round3pick2options,
        self.round3pick3options,
        self.round4pick1options,
        self.round4pick2options,
        self.round4pick3options,
        self.round5pick1options,
        self.round6pick1options
    ];
    self.selectOptions = ko.observableArray([]);
    self.allNcaaTeamsMap = {};
    self.selectedTeams = {};

    var dontUpdateList = {
        'round1pick1': self.round1pick1options,
        'round1pick2': self.round1pick2options,
        'round1pick3': self.round1pick3options,
        'round1pick4': self.round1pick4options,
        'round1pick5': self.round1pick5options,
        'round1pick6': self.round1pick6options,
        'round2pick1': self.round2pick1options,
        'round2pick2': self.round2pick2options,
        'round2pick3': self.round2pick3options,
        'round2pick4': self.round2pick4options,
        'round2pick5': self.round2pick5options,
        'round2pick6': self.round2pick6options,
        'round3pick1': self.round3pick1options,
        'round3pick2': self.round3pick2options,
        'round3pick3': self.round3pick3options,
        'round4pick1': self.round4pick1options,
        'round4pick2': self.round4pick2options,
        'round4pick3': self.round4pick3options,
        'round5pick1': self.round5pick1options,
        'round6pick1': self.round6pick1options
    };

    var updateOtherLists = function (value, addOrDelete, selectedList) {
        if (addOrDelete === 'delete') {
            allOptionLists.map(function (thisList) {
                if (dontUpdateList[selectedList] !== thisList) {
                    removeIndex = findWithAttr(thisList(), 'id', value);
                    thisList.splice(removeIndex, 1);
                }
            })
        }
        else {
            allOptionLists.map(function (thisList) {
                if (dontUpdateList[selectedList] !== thisList) {
                    thisList.push(self.allNcaaTeamsMap[value]);
                }
            })
        }
    };

    tbdTeam = new NcaaTeamViewModel('Make a Selection', '', '', true, false);
    self.selectOptions.push(tbdTeam);
    self.allNcaaTeamsMap.TBD = tbdTeam;

    // create master options list
    for (key in msTeams) {
        self.selectOptions.push(new NcaaTeamViewModel(msTeams[key].teamName, msTeams[key]._id, msTeams[key].seed, true, msTeams[key].eliminated));
        self.allNcaaTeamsMap[key] = self.selectOptions()[self.selectOptions().length - 1];
    }

    // copy master options to all single pick options lists
    allOptionLists.map(function (singleOptionsList) {
        self.selectOptions().map(function (team) {
            singleOptionsList.push(team);
        })
    });

    // for all existing picks, set the appropriate ui and viewmodel value
    ['1', '2', '3', '4', '5', '6'].map(function (i) {
        pickIndex = 1;
        team.rounds['round' + i + 'picks'].map(function (x) {
            // set ko observable variable
            self['round' + i + 'pick' + pickIndex]([self.allNcaaTeamsMap[x].id]);
            // set not selected to false
            self.allNcaaTeamsMap[x].notSelected(false);
            // remove team from other team's individual lists
            updateOtherLists(self.allNcaaTeamsMap[x].id, 'delete', 'round' + i + 'pick' + pickIndex);
            pickIndex += 1;
        });
    });

    //self.updateLists = function() {
    //    "use strict";
    //    var selectedRound = $("#roundTabs li[class*='ui-state-active']").attr('id')[1];
    //    console.log('selected round' + selectedRound);
    //};

    var flattenPicks = function () {
        var payload = {
            round1picks: [],
            round2picks: [],
            round3picks: [],
            round4picks: [],
            round5picks: [],
            round6picks: []
        };
        if (self.round1pick1() && !self.round1pick1()[0]) {
            self.round1pick1 = [self.round1pick1()];
            payload.round1picks.push(self.round1pick1);
        } else {
            payload.round1picks.push(self.round1pick1());
        }
        if (self.round1pick2() && !self.round1pick2()[0]) {
            self.round1pick2 = [self.round1pick2()];
            payload.round1picks.push(self.round1pick2);
        } else {
            payload.round1picks.push(self.round1pick2());
        }
        if (self.round1pick3() && !self.round1pick3()[0]) {
            self.round1pick3 = [self.round1pick3()];
            payload.round1picks.push(self.round1pick3);
        } else {
            payload.round1picks.push(self.round1pick3());
        }
        if (self.round1pick4() && !self.round1pick4()[0]) {
            self.round1pick4 = [self.round1pick4()];
            payload.round1picks.push(self.round1pick4);
        } else {
            payload.round1picks.push(self.round1pick4());
        }
        if (self.round1pick5() && !self.round1pick5()[0]) {
            self.round1pick5 = [self.round1pick5()];
            payload.round1picks.push(self.round1pick5);
        } else {
            payload.round1picks.push(self.round1pick5());
        }
        if (self.round1pick6() && !self.round1pick6()[0]) {
            self.round1pick6 = [self.round1pick6()];
            payload.round1picks.push(self.round1pick6);
        } else {
            payload.round1picks.push(self.round1pick6());
        }
        if (self.round2pick1() && !self.round2pick1()[0]) {
            self.round2pick1 = [self.round2pick1()];
            payload.round2picks.push(self.round2pick1);
        } else {
            payload.round2picks.push(self.round2pick1());
        }
        if (self.round2pick2() && !self.round2pick2()[0]) {
            self.round2pick2 = [self.round2pick2()];
            payload.round2picks.push(self.round2pick2);
        } else {
            payload.round2picks.push(self.round2pick2());
        }
        if (self.round2pick3() && !self.round2pick3()[0]) {
            self.round2pick3 = [self.round2pick3()];
            payload.round2picks.push(self.round2pick3);
        } else {
            payload.round2picks.push(self.round2pick3());
        }
        if (self.round2pick4() && !self.round2pick4()[0]) {
            self.round2pick4 = [self.round2pick4()];
            payload.round2picks.push(self.round2pick4);
        } else {
            payload.round2picks.push(self.round2pick4());
        }
        if (self.round2pick5() && !self.round2pick5()[0]) {
            self.round2pick5 = [self.round2pick5()];
            payload.round2picks.push(self.round2pick5);
        } else {
            payload.round2picks.push(self.round2pick5());
        }
        if (self.round2pick6() && !self.round2pick6()[0]) {
            self.round2pick6 = [self.round2pick6()];
            payload.round2picks.push(self.round2pick6);
        } else {
            payload.round2picks.push(self.round2pick6());
        }
        if (self.round3pick1() && !self.round3pick1()[0]) {
            self.round3pick1 = [self.round3pick1()];
            payload.round3picks.push(self.round3pick1);
        } else {
            payload.round3picks.push(self.round3pick1());
        }
        if (self.round3pick2() && !self.round3pick2()[0]) {
            self.round3pick2 = [self.round3pick2()];
            payload.round3picks.push(self.round3pick2);
        } else {
            payload.round3picks.push(self.round3pick2());
        }
        if (self.round3pick3() && !self.round3pick3()[0]) {
            self.round3pick3 = [self.round3pick3()];
            payload.round3picks.push(self.round3pick3);
        } else {
            payload.round3picks.push(self.round3pick3());
        }
        if (self.round4pick1() && !self.round4pick1()[0]) {
            self.round4pick1 = [self.round4pick1()];
            payload.round4picks.push(self.round4pick1);
        } else {
            payload.round4picks.push(self.round4pick1());
        }
        if (self.round4pick2() && !self.round4pick2()[0]) {
            self.round4pick2 = [self.round4pick2()];
            payload.round4picks.push(self.round4pick2);
        } else {
            payload.round4picks.push(self.round4pick2());
        }
        if (self.round4pick3() && !self.round4pick3()[0]) {
            self.round4pick3 = [self.round4pick3()];
            payload.round4picks.push(self.round4pick3);
        } else {
            payload.round4picks.push(self.round4pick3());
        }
        if (self.round5pick1() && !self.round5pick1()[0]) {
            self.round5pick1 = [self.round5pick1()];
            payload.round5picks.push(self.round5pick1);
        } else {
            payload.round5picks.push(self.round5pick1());
        }
        if (self.round6pick1() && !self.round6pick1()[0]) {
            self.round6pick1 = [self.round6pick1()];
            payload.round6picks.push(self.round6pick1);
        } else {
            payload.round6picks.push(self.round6pick1());
        }
        return payload;
    };

    self.saveBallot = function () {
        var route, payload;
        route = '/marchsadness/saveBallot/' + team._id;
        //payload = flattenPicks();
        payload = {
            round1picks: [
                $("#round1pick1").val() === "" ? "" : $("#round1pick1").val(),
                $("#round1pick2").val() === "" ? "" : $("#round1pick2").val(),
                $("#round1pick3").val() === "" ? "" : $("#round1pick3").val(),
                $("#round1pick4").val() === "" ? "" : $("#round1pick4").val(),
                $("#round1pick5").val() === "" ? "" : $("#round1pick5").val(),
                $("#round1pick6").val() === "" ? "" : $("#round1pick6").val()
            ],
            round2picks: [
                $("#round2pick1").val() === "" ? "" : $("#round2pick1").val(),
                $("#round2pick2").val() === "" ? "" : $("#round2pick2").val(),
                $("#round2pick3").val() === "" ? "" : $("#round2pick3").val(),
                $("#round2pick4").val() === "" ? "" : $("#round2pick4").val(),
                $("#round2pick5").val() === "" ? "" : $("#round2pick5").val(),
                $("#round2pick6").val() === "" ? "" : $("#round2pick6").val()
            ],
            round3picks: [
                $("#round3pick1").val() === "" ? "" : $("#round3pick1").val(),
                $("#round3pick2").val() === "" ? "" : $("#round3pick2").val(),
                $("#round3pick3").val() === "" ? "" : $("#round3pick3").val()
            ],
            round4picks: [
                $("#round4pick1").val() === "" ? "" : $("#round4pick1").val(),
                $("#round4pick2").val() === "" ? "" : $("#round4pick2").val(),
                $("#round4pick3").val() === "" ? "" : $("#round4pick3").val()
            ],
            round5picks: [
                $("#round5pick1").val() === "" ? "" : $("#round5pick1").val()
            ],
            round6picks: [
                $("#round6pick1").val() === "" ? "" : $("#round6pick1").val()
            ]
        };
        $('#saveAllChangesButton').addClass("disabled").html("Saving");
        $.post(route, payload, function () {
            window.location.reload(true);
        });
    };

    function NcaaTeamViewModel(teamName, teamId, seed, notSelected, eliminated) {
        var self = this;
        self.name = teamName;
        self.id = teamId;
        self.seed = seed;
        self.notSelected = ko.observable(notSelected);
        self.eliminated = eliminated;
    }

    function sortLists() {
        allOptionLists.map(function (thisList) {
            thisList.sort(teamNameComparitor);
        })
    }

    function teamNameComparitor(a, b) {
        if (a.name > b.name || b.name === "Make a Selection") {
            return 1;
        }
        if (a.name < b.name || a.name === "Make a Selection") {
            return -1;
        }
        return 0;
    }

    var checkIfValidUpdate = function (value, action, pick) {
        if (value && value[0] && self.allNcaaTeamsMap[value[0]].name !== 'Make a Selection') {
            updateOtherLists(value[0], action, pick);
        }
    };

    [
        'round1pick1',
        'round1pick2',
        'round1pick3',
        'round1pick4',
        'round1pick5',
        'round1pick6',
        'round2pick1',
        'round2pick2',
        'round2pick3',
        'round2pick4',
        'round2pick5',
        'round2pick6',
        'round3pick1',
        'round3pick2',
        'round3pick3',
        'round4pick1',
        'round4pick2',
        'round4pick3',
        'round5pick1',
        'round6pick1'
    ].map(function (key) {
            self[key].subscribe(function (oldValue) {
                checkIfValidUpdate(oldValue, 'add', key);
            }, null, "beforeChange");

            self[key].subscribe(function (newValue) {
                checkIfValidUpdate(newValue, 'delete', key);
                sortLists();
            });
        });
}

var setPicklistValues = function () {
    $('#round1pick1').val($('#r1p1name').attr('value'));
    $('#round1pick2').val($('#r1p2name').attr('value'));
    $('#round1pick3').val($('#r1p3name').attr('value'));
    $('#round1pick4').val($('#r1p4name').attr('value'));
    $('#round1pick5').val($('#r1p5name').attr('value'));
    $('#round1pick6').val($('#r1p6name').attr('value'));
    $('#round2pick1').val($('#r2p1name').attr('value'));
    $('#round2pick2').val($('#r2p2name').attr('value'));
    $('#round2pick3').val($('#r2p3name').attr('value'));
    $('#round2pick4').val($('#r2p4name').attr('value'));
    $('#round2pick5').val($('#r2p5name').attr('value'));
    $('#round2pick6').val($('#r2p6name').attr('value'));
    $('#round3pick1').val($('#r3p1name').attr('value'));
    $('#round3pick2').val($('#r3p2name').attr('value'));
    $('#round3pick3').val($('#r3p3name').attr('value'));
    $('#round4pick1').val($('#r4p1name').attr('value'));
    $('#round4pick2').val($('#r4p2name').attr('value'));
    $('#round4pick3').val($('#r4p3name').attr('value'));
    $('#round5pick1').val($('#r5p1name').attr('value'));
    $('#round6pick1').val($('#r6p1name').attr('value'));
};

function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
}


