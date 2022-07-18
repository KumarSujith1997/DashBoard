sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "dashboard/dashboard/model/models",
        "sap/ui/model/json/JSONModel"
    ],
    function (UIComponent, Device, models,JSONModel) {
        "use strict";

        return UIComponent.extend("dashboard.dashboard.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {

                // call the base component's init function
                UIComponent.prototype.init.apply(this,arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                // this.setModel(models.createDeviceModel(), "device");

                // set device model
			    var oDeviceModel = new JSONModel(Device);
			    oDeviceModel.setDefaultBindingMode("OneWay");
			    this.setModel(oDeviceModel, "device");
            }
        });
    }
);