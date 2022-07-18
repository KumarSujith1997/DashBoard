  sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/model/Sorter",
        "dashboard/dashboard/utils/utility",
        "sap/ushell/services/CrossApplicationNavigation"
    ],
    function(BaseController,Filter,FilterOperator,Sorter,utility,Container,CrossApplicationNavigation){
      "use strict";
  
      return BaseController.extend("dashboard.dashboard.controller.controller.App", {
        onInit()
         {
            this.counter=4;
            utility.Init(this); 
            utility.objectHeaderData(this);
         },
         onPress:function(oEvent){
             debugger;
            // var sObjectUuid = oEvent.getSource().getParent().getParent().getBindingContext('relModel').getProperty('RelObjectUuid');
                                // navigate to product information application
                                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                                target: {
                                semanticObject: "ManageProductInfo",
                                action: "display"
                                },
                                // params: {
                                // "RecordID": "00000800.COR.001"
                                // }
                                })) || "";
                                /*oCrossAppNavigator.toExternal({
                                target: {
                                shellHash: hash
                                }
                                });*/
                                // To open in new tab
                                var url = window.location.href.split('#')[0] + hash;
                                sap.m.URLHelper.redirect(url, true);
             
         },
          onSelectionChange:function()
          {
            var sIconTabRes=this.getView().byId("card1conTabHeader").oSelectedItem.getProperty("text"),
            amultiComboRes=[]=this.getView().byId("card1MultiComboBox").getSelectedItems().map(m=>m.getProperty("text")),
            aFilter=[],
            aSorter=[];
            switch(sIconTabRes) 
            {
                case "My favorites":
                    utility.resetModel(this);
                    aFilter.push(new Filter("IsFavorite",FilterOperator.EQ,true));
                    amultiComboRes.map((item)=>{
                         aFilter.push(new Filter("RecordTypeText",FilterOperator.EQ,item))
                     });
                    var oListItems = this.getView().byId('card1List').getBinding("items");
                    oListItems.filter(aFilter);
                    utility.setLength(this);
                  break;
                case "My recent records":
                    utility.resetModel(this);
                    aSorter.push(new Sorter("ChangedOn",true,false));
                    amultiComboRes.map((item)=>{
                        aFilter.push(new Filter("RecordTypeText",FilterOperator.EQ,item))
                    });
                    var oListItems = this.getView().byId('card1List').getBinding("items");
                    // oList.filter().filters =null;
                    oListItems.filter(aFilter);
                    oListItems.sort(aSorter);
                    utility.setLength(this);
                  break;
                default:
                  // code block
            }  
          },
          Buttonclick:function(oEvent)
          {
              debugger;
              var modelLen=this.getView().byId('card1List').getBinding("items").oList.length;
              if(oEvent.getSource().getId() == "container-dashboard.dashboard---App--idF")
              {
                 if( this.counter<=modelLen)
                 {
                     this.counter+=4;
                     if(this.counter<=modelLen)
                     {
                        utility.setLength(this,this.counter);
                     }
                     else
                     {
                        utility.setLength(this,modelLen);
                     }
                    
                 }
                

              }
              else if(oEvent.getSource().getId() == "container-dashboard.dashboard---App--idB")
              {
                  if(this.counter>4)
                  {
                    this.counter-=4;
                     utility.setLength(this,this.counter);
                  }
                  else
                  {
                      utility.setLength(this,4)
                  }
                        
              }
          },
          onSmartChange:function(oEvent)
          {
            debugger;
          },
         /**
        * To fetch X-CSRF token
        * @return {string} token
        * @private
        */
        onPressWF: function () {
            var sToken = "";
            $.ajax({
                url: "/dashboarddashboard/bpmworkflowruntime/v1/task-instances",
                method: "GET",
                async: false,
                contentType:"application/json",
                // headers: {
                //     "X-CSRF-Token": "Fetch"
                // },
                success: function (data) {
                    // sToken = data.getResponseHeader("X-CSRF-Token");
                }
            });
            return sToken;
        }
      });
    }
  );
  
  