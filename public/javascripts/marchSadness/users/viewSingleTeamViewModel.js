$(document).ready(function () {
    ko.applyBindings(new makePicksViewModel());
    setPicklistValues();
    $('.teamSelectView').hide();
});

function makePicksViewModel() {
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
        'round1pick1' : self.round1pick1options,
        'round1pick2' : self.round1pick2options,
        'round1pick3' : self.round1pick3options,
        'round1pick4' : self.round1pick4options,
        'round1pick5' : self.round1pick5options,
        'round1pick6' : self.round1pick6options,
        'round2pick1' : self.round2pick1options,
        'round2pick2' : self.round2pick2options,
        'round2pick3' : self.round2pick3options,
        'round2pick4' : self.round2pick4options,
        'round2pick5' : self.round2pick5options,
        'round2pick6' : self.round2pick6options,
        'round3pick1' : self.round3pick1options,
        'round3pick2' : self.round3pick2options,
        'round3pick3' : self.round3pick3options,
        'round4pick1' : self.round4pick1options,
        'round4pick2' : self.round4pick2options,
        'round4pick3' : self.round4pick3options,
        'round5pick1' : self.round5pick1options,
        'round6pick1' : self.round6pick1options
    };

    var updateOtherLists = function (value, addOrDelete, selectedList) {
        if (addOrDelete === 'delete') {
            allOptionLists.map(function (thisList) {
                if (dontUpdateList[selectedList] !== thisList) {
                    removeIndex = findWithAttr(thisList(), 'id', value.id);
                    thisList.splice(removeIndex, 1);
                }
            })
        }
        else {
            allOptionLists.map(function (thisList) {
                if (dontUpdateList[selectedList] !== thisList) {
                    thisList.push(value);
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
            self['round' + i + 'pick' + pickIndex](self.allNcaaTeamsMap[x]);
            // push to observable round array
            self['round' + i + 'picks'].push(self.allNcaaTeamsMap[x]);
            // set not selected to false
            self.allNcaaTeamsMap[x].notSelected(false);
            // remove team from other team's individual lists
            updateOtherLists(self.allNcaaTeamsMap[x], 'delete', 'round' + i + 'pick' + pickIndex);
            pickIndex += 1;
        });
    });

    //self.updateLists = function() {
    //    "use strict";
    //    var selectedRound = $("#roundTabs li[class*='ui-state-active']").attr('id')[1];
    //    console.log('selected round' + selectedRound);
    //};

    //self.saveChanges = function() {
    //    var route, payload;
    //    route = '/marchsadness/addPick/' + team._id;
    //    payload = {
    //        round1picks: self.round1picks(),
    //        round2picks: self.round2picks(),
    //        round3picks: self.round3picks(),
    //        round4picks: self.round4picks(),
    //        round5picks: self.round5picks(),
    //        round6picks: self.round6picks()
    //    };
    //    $('#save').hide();
    //    $('#saving').show();
    //    $.post(route, payload, function () {
    //        setTimeout(function () {
    //            $('#save').show();
    //            $('#saving').hide();
    //        }, 1500);
    //    });
    //};

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

    self.round1pick1.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round1pick1');
        }
    }, null, "beforeChange");

    self.round1pick1.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round1pick1');
        }
        sortLists();
    });

    self.round1pick2.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round1pick2');
        }
    }, null, "beforeChange");

    self.round1pick2.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round1pick2');
        }
        sortLists();
    });

    self.round1pick3.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round1pick3');
        }
    }, null, "beforeChange");

    self.round1pick3.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round1pick3');
        }
        sortLists();
    });

    self.round1pick4.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round1pick4');
        }
    }, null, "beforeChange");

    self.round1pick4.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round1pick4');
        }
        sortLists();
    });

    self.round1pick5.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round1pick5');
        }
    }, null, "beforeChange");

    self.round1pick5.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round1pick5');
        }
        sortLists();
    });

    self.round1pick6.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round1pick6');
        }
    }, null, "beforeChange");

    self.round1pick6.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round1pick6');
        }
        sortLists();
    });

    self.round2pick1.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round2pick1');
        }
    }, null, "beforeChange");

    self.round2pick1.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round2pick1');
        }
        sortLists();
    });

    self.round2pick2.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round2pick2');
        }
    }, null, "beforeChange");

    self.round2pick2.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round2pick2');
        }
        sortLists();
    });

    self.round2pick3.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round2pick3');
        }
    }, null, "beforeChange");

    self.round2pick3.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round2pick3');
        }
        sortLists();
    });

    self.round2pick4.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round2pick4');
        }
    }, null, "beforeChange");

    self.round2pick4.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round2pick4');
        }
        sortLists();
    });

    self.round2pick5.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round2pick5');
        }
    }, null, "beforeChange");

    self.round2pick5.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round2pick5');
        }
        sortLists();
    });

    self.round2pick6.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round2pick6');
        }
    }, null, "beforeChange");

    self.round2pick6.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round2pick6');
        }
        sortLists();
    });

    self.round3pick1.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round3pick1');
        }
    }, null, "beforeChange");

    self.round3pick1.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round3pick1');
        }
        sortLists();
    });

    self.round3pick2.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round3pick2');
        }
    }, null, "beforeChange");

    self.round3pick2.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round3pick2');
        }
        sortLists();
    });

    self.round3pick3.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round3pick3');
        }
    }, null, "beforeChange");

    self.round3pick3.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round3pick3');
        }
        sortLists();
    });

    self.round4pick1.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round4pick1');
        }
    }, null, "beforeChange");

    self.round4pick1.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round4pick1');
        }
        sortLists();
    });

    self.round4pick2.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round4pick2');
        }
    }, null, "beforeChange");

    self.round4pick2.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round4pick2');
        }
        sortLists();
    });

    self.round4pick3.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round4pick3');
        }
    }, null, "beforeChange");

    self.round4pick3.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round4pick3');
        }
        sortLists();
    });

    self.round5pick1.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round5pick1');
        }
    }, null, "beforeChange");

    self.round5pick1.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round5pick1');
        }
        sortLists();
    });

    self.round6pick1.subscribe(function (oldValue) {
        if(oldValue && oldValue[0].name !== 'Make a Selection') {
            updateOtherLists(oldValue[0], 'add', 'round6pick1');
        }
    }, null, "beforeChange");

    self.round6pick1.subscribe(function (newValue) {
        if(newValue[0].name !== 'Make a Selection') {
            updateOtherLists(newValue[0], 'delete', 'round6pick1');
        }
        sortLists();
    });
}

var setPicklistValues = function() {
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
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}


