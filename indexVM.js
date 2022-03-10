const pqOptions = {
    width: "auto",
    height: 300,
    showTitle: false,
    showHeader: true,
    showTop: true,
    showToolbar: false,
    showBottom: true,
    wrap: true,
    hwrap: false,
    sortable: false,
    editable: false,
    resizable: false,
    collapsible: false,
    draggable: true,
    dragColumns: { enabled: true },
    scrollModel: { autoFit: true },
    numberCell: { show: true, resizable: true, title: "S.N.", minWidth: 30 },
    pageModel: { curPage: 1, rPP: 10, type: "local" },
    columnTemplate: { wrap: true, editable: false, dataType: "string", halign: "center", hvalign: "center", resizable: true, styleHead: { 'font-weight': "bold" } },
};

function IndexVM() {
    const self = this;

    var isNullOrEmpty = function(str) {
        if (str === undefined || str === null) {
            return true;
        } else if (typeof str === "string") {
            return (str.trim() === "");
        } else {
            return false;
        }
    };

    const models = {
        MyModel: function(item) {
            item = item || {};
            this.Fname = ko.observable(item.Fname || "");
            this.Mname = ko.observable(item.Mname || "");
            this.Lname = ko.observable(item.Lname || "");

            this.Email = ko.observable(item.Email || "");
            this.Phone = ko.observable(item.Phone || "");
            this.Citizenship = ko.observable(item.Citizenship || "");

            this.AddressId = ko.observable(item.AddressId || "");
            this.AddressName = ko.observable(item.AddressName || "");
            this.district = ko.observable(item.district || "");
            this.Municipality = ko.observable(item.Municipality || "");
        },
        UiElements: function() {
            self.MyModel = ko.observable(new models.MyModel());
            self.DataList = ko.observableArray([]);
            self.SelectedTransaction = ko.observable();
            self.tempAddress = ko.observable();
            self.AddressList = ko.observableArray([
                { Text: 'temporary', Value: '1' },
                { Text: 'permanent', Value: '0' }
            ]);
        },
    };

    self.SaveInformation = function() {

        if (UiEvents.validate.SaveValidation()) {
            debugger;


            if (UiEvents.functions.checkAdd()) {
                debugger;
                UiEvents.functions.Save();
                self.tempAddress(self.MyModel().AddressId)

            }


        }
    };

    self.deleteRow = function(id) {
        UiEvents.functions.Delete(id);
    };
    self.editRow = function(id) {

        var RowID = id;
        var selectItem = $("#Grid").pqGrid("getRowData", { rowIndxPage: Number(RowID) });

        self.SelectedTransaction(RowID);

        self.MyModel().AddressId(selectItem.AddressId);
        self.MyModel().district(selectItem.district);
        self.MyModel().Municipality(selectItem.Municipality);


    }


    const UiEvents = {
        validate: {
            SaveValidation: function() {
                if (isNullOrEmpty(self.MyModel().Fname())) {
                    alert("Warning! -  first Name cannot be empty...!!!");
                    return false;
                } else if (isNullOrEmpty(self.MyModel().AddressId())) {
                    alert("Warning! - address cannot be empty...!!!");
                    return false;
                } else if (isNullOrEmpty(self.MyModel().Lname())) {
                    alert("Warning! - last name cannot be empty...!!!");
                    return false;
                } else if (isNullOrEmpty(self.MyModel().Citizenship())) {
                    alert("Warning! - Citizenship cannot be empty...!!!");
                    return false;
                } else if (isNullOrEmpty(self.MyModel().district())) {
                    alert("Warning! - district cannot be empty...!!!");
                    return false;
                } else if (isNullOrEmpty(self.MyModel().Municipality())) {
                    alert("Warning! - Municipality cannot be empty...!!!");
                    return false;
                } else {

                    self.MyModel().AddressName((self.AddressList().find(X => X.Value == self.MyModel().AddressId()) || {}).Text);
                    if (isNullOrEmpty(self.SelectedTransaction())) {

                        self.DataList.push(ko.toJS(self.MyModel()));
                    } else {

                        self.DataList.splice(self.SelectedTransaction(), 1);
                        self.DataList.push(ko.toJS(self.MyModel()));
                        self.SelectedTransaction('');

                    }
                    return true;
                }
            }
        },
        clear: {
            ResetAll: function() {
                self.MyModel(new models.MyModel());
                self.DataList([]);
            },
        },
        functions: {
            Save: function() {

                if ($("#Grid").pqGrid("instance")) {
                    $("#Grid").pqGrid('option', 'dataModel.data', ko.toJS(self.DataList()));
                    $("#Grid").pqGrid('refreshDataAndView');
                } else {
                    const options = Object.assign({}, pqOptions);
                    options.colModel = [
                        { title: "type", align: "center", dataIndx: "AddressName", width: "20%" },
                        { title: "district", align: "center", dataIndx: "district", width: "35%" },
                        { title: "Municipality", align: "center", dataIndx: "Municipality", width: "20%" },

                        {
                            title: "Action",
                            align: "center",
                            render: function(ui) {
                                return `<button type='button' title='Delete' onclick='obj.deleteRow("${ui.rowIndx}")'>Delete</button>`
                            },
                            width: "10%"
                        },
                        {
                            title: "edit",
                            align: "center",
                            render: function(ui) {
                                return `<button type='button' title='edit' onclick='obj.editRow("${ui.rowIndx}")'>EDIT</button>`
                            },
                            width: "10%"

                        },
                    ];
                    options.dataModel = { data: ko.toJS(self.DataList()) };
                    $("#Grid").pqGrid(options);
                }
            },
            Delete: function(index) {
                self.DataList.splice(index, 1);
                UiEvents.functions.Save();
            },
            checkAdd: function() {


                var selectItem = $("#Grid").pqGrid("getRowData", { rowIndxPage: Number(0) });
                debugger;
                var temp = self.MyModel().AddressId();
                var add = selectItem.AddressId;
                if (isNullOrEmpty(self.tempAddress())) {
                    return true;
                } else {
                    debugger;
                    if (temp === add) {
                        alert("same address");
                        return false;
                    } else {
                        return true;
                    }
                }

            }
        },

    };

    function Init() {
        models.UiElements();
        UiEvents.clear.ResetAll();
        UiEvents.functions.Save();
    }
    Init();
}

var obj;

$(document).ready(function() {
    obj = new IndexVM();
    ko.applyBindings(obj);

});