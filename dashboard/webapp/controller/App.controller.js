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
            utility.objectTypeFilterData(this);
            utility.recordTypeFilterData(this);
            utility.InteractingOrgFilterData(this);
            utility.InteractionPurposeFilterData(this);
            
            
         },
         onPress:function(oEvent){
             
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
          onSelectionChange:function(oEvent)
          
          {
            // debugger;
            var sIconTabRes=this.getView().byId("card1conTabHeader").oSelectedItem.getProperty("text"),
            aFilter=[],
            aSorter=[];
            switch(sIconTabRes) 
            {
                case "My Recent Records":
                    utility.resetModel(this);
                    aSorter.push(new Sorter("ChangedOn",true,false));
                    var oListItems = this.getView().byId('card1List').getBinding("items");
                    oListItems.filter().filters =null;
                    oListItems.filter(aFilter);
                    oListItems.sort(aSorter);
                    utility.setLength(this);
                    // onSearch();
                  break;
                case "My Recent favorites":
                    utility.resetModel(this);
                    aFilter.push(new Filter("IsFavorite",FilterOperator.EQ,true));
                    var oListItems = this.getView().byId('card1List').getBinding("items");
                    oListItems.filter(aFilter);
                    utility.setLength(this);
                    // this.onSearch();
                  break;
                
                    // default:
            //       // code block
            }  
          },
        //   Buttonclick:function(oEvent)
        //   {
            
        //       var modelLen=this.getView().byId('card1List').getBinding("items").oList.length;
        //       if(oEvent.getSource().getId() == "container-dashboard.dashboard---App--idF")
        //       {
        //          if( this.counter<=modelLen)
        //          {
        //              this.counter+=4;
        //              if(this.counter<=modelLen)
        //              {
        //                 utility.setLength(this,this.counter);
        //              }
        //              else
        //              {
        //                 utility.setLength(this,modelLen);
        //              }
                    
        //          }
                

        //       }
        //       else if(oEvent.getSource().getId() == "container-dashboard.dashboard---App--idB")
        //       {
        //           if(this.counter>4)
        //           {
        //             this.counter-=4;
        //              utility.setLength(this,this.counter);
        //           }
        //           else
        //           {
        //               utility.setLength(this,4)
        //           }
                        
        //       }
        //   },
          onSmartChange:function(oEvent)
          {
            
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
        },

        onSearch: function(oEvent) {
            var arr=[]= oEvent.mParameters.selectionSet.map(d=>d.mProperties.selectedKeys),
            aFilter=[];
            
            
            for (var i=0; i<arr.length; i++)
                {
                    if (arr[i].length!=0){
                        var sfilterObj=oEvent.getParameter("selectionSet")[i].getBindingInfo("items").model;
                        // aFilter.push(new Filter(sfilterObj,FilterOperator.EQ,true));
                    for(let j=0; j<arr[i].length; j++){
                        var oListItems = this.getView().byId('card1List').getBinding("items");
                    
                        switch(sfilterObj){
                            case 'objtype':
                                  aFilter.push(new Filter("ObjectType",FilterOperator.EQ,arr[i][j]));
                                  oListItems.filter(aFilter);
                                break;
                            case 'rectyp' :
                                aFilter.push(new Filter("RecordType",FilterOperator.EQ,arr[i][j]));
                                  oListItems.filter(aFilter);
                                break; 
                            case 'intorg' :
                                aFilter.push(new Filter("InteractingOrgId",FilterOperator.EQ,arr[i][j]));
                                  oListItems.filter(aFilter);
                                break; 
                            case 'intprp' :
                            aFilter.push(new Filter("InteractionPurposeId",FilterOperator.EQ,arr[i][j]));
                            oListItems.filter(aFilter);
                                break;    
                        }
                        debugger;
                        }
                    }
                }
        //     debugger;
        //     var multiInput = sap.ui.getCore().byId("_IDGenFilterBar1");
        //     var otoken = new sap.m.Token({ 
        //     key: 'myDefaultFilterValue', 
        //     text: 'myDefaultFilterValue'
        // });
        //     multiInput.setTokens([otoken]);
        
        }
        
      });
    }
  );
  
  