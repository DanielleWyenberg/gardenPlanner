/* JS by Danielle Wyenberg, 2023 */


require(["esri/config", "esri/Map", "esri/views/MapView",  
        "esri/widgets/Editor",
        "esri/widgets/LayerList",
        "esri/layers/FeatureLayer",
        "esri/widgets/BasemapToggle",
        "esri/widgets/BasemapGallery",
         "esri/layers/support/LabelClass",
         "esri/views/interactive/sketch/SketchTooltipOptions",
         "esri/views/interactive/snapping/SnappingOptions",
         "esri/widgets/AreaMeasurement2D",
         "esri/widgets/DistanceMeasurement2D",
         "esri/widgets/Bookmarks",
         "esri/widgets/FeatureTable",
         "esri/widgets/FeatureForm",
         "esri/form/FormTemplate",
         "esri/form/ExpressionInfo",
         "esri/form/elements/GroupElement",
         "esri/form/elements/FieldElement",
         "esri/rest/support/Query",
         "esri/geometry/geometryEngine"
               ],
        
        function (esriConfig, Map, MapView, Editor, LayerList, FeatureLayer, BasemapToggle, BasemapGallery, LabelClass, SketchTooltipOptions, SnappingOptions, AreaMeasurement2D, DistanceMeasurement2D, Bookmarks, FeatureTable, FeatureForm, FormTemplate, ExpressionInfo, GroupElement, FieldElement, Query, geometryEngine) {
            
        esriConfig.apiKey = "AAPKfb1ff48a09704264b47a8e025997ef57iOEqy8PkO--b21lGC3v2RyfJNqYqrfEoOX7tO90JKab-D9nlasXxgx8zjglhjg4x";
        
        let activeWidget = null;
    
        const map = new Map({
          basemap: "arcgis-topographic", // Basemap layer service          
        });
    
        //map with center and zoom set to upper midwest
        const view = new MapView({
          map: map,
          center: [-93.791495, 43.058485], // Longitude, latitude
          zoom: 6, // Zoom level
          container: "viewDiv" //Div Element
        });
   
        //basemap toggle widget
        const basemapToggle = new BasemapToggle({
        view: view,
        nextBasemap: "arcgis-imagery"
     });
        view.ui.add(basemapToggle,"bottom-left");
    
    
    //addEditableLayers();
    addContextLayers();
    
    // construct LayerList widget for visibility toggle
      const layerList = new LayerList({
          view: view,
           
        });
      view.ui.add(layerList, "bottom-right");  
    
        var popupString = "<b>Plant Type:</b> {Vegetable} <br> ";
               
        var popupGardenSection = {
          "title": "Garden Section",
            
          "content": popupString,
        };
        
        const handoutInfo = new FeatureLayer ({
            url: "https://services5.arcgis.com/A49gj7AiDe668Yw0/arcgis/rest/services/Handout_Info/FeatureServer",
            title: "Handout Info"
        });
        
    //specify colors
         const boundaryRenderer = {
            type: "simple",
             symbol: {
              type: "simple-fill",
              color: "#626864"
            },
        };
        
        const gardenBoundary = new FeatureLayer({
           url: "https://services5.arcgis.com/A49gj7AiDe668Yw0/arcgis/rest/services/Garden_Boundary/FeatureServer",
            title: "Garden Boundary",
            renderer: boundaryRenderer
            
            //listMode: "hide"
        });
        map.add(gardenBoundary);
    
     const vegLabelClass = {
            // autocasts as new LabelClass()
            symbol: {
                type: "text",  // autocasts as new TextSymbol()
                color: "black",
                haloColor: "white",
                haloSize: "1px",
                font: {  // autocast as new Font()
                    family: "Arial Unicode MS",
                    size: 10
                }
            },
            labelExpressionInfo: {
                expression: "$feature.Vegetable"
            },
            //minScale: 2
         
};
        const sectionRenderer = {
            type: "simple",
             symbol: {
              type: "simple-fill",
              color: "#008364"
            },
        };
       // add empty feature layers for garden sketch
        const gardenSection = new FeatureLayer({
          url: "https://services5.arcgis.com/A49gj7AiDe668Yw0/arcgis/rest/services/Garden_Section_with_Domain/FeatureServer",
          title: "Garden Sections",
          popupTemplate: popupGardenSection,
            labelingInfo: [vegLabelClass],
            renderer: sectionRenderer,
            supportsAdvancedQueries: true,
            outFields: ["*"]
          //listMode: "hide"        
        });
        map.add(gardenSection);
        
    function addContextLayers(){
         //const popup for soil type
        const popupSoils = {
          "title": "Soil Properties",
          "content": "{muname} <br> <br> {popupstring}",
        };
        
        //add Soil Type Feature Layer
    const SoilLayer = new FeatureLayer({
    url: "https://landscape11.arcgis.com/arcgis/rest/services/USA_Soils_Map_Units/featureserver",
      outfields: ["popupstring","muname"],
      popupTemplate: popupSoils,
      visible: false,
      opacity: 0.75,
      title: "Soil Map"
      
  });
        //SoilLayer source: USDA NRCS, Esri
      map.add(SoilLayer); 
        //add visible extents and popups for this layer
        
      
        
  //Add Plant Hardiness Zones Layer
        //define a popup for Hardiness Zones Layer
        const popupZones = {
          "title": "<b>Zone:</b> {name}<br>",
        };
        //define a unique value renderer
        const hardinessRenderer = {
          type: "unique-value",
          legendOptions: {
            title: "Hardiness Zone"
          },
          field: "name",
          uniqueValueInfos: [{
            value: "2",
            label: "Zone 2",
            symbol: {
              type: "simple-fill",
              color: "#edf8fb"
            },
          },
           {
             value: "3",
             label: "Zone 3",
             symbol: {
               type: "simple-fill",
               color: "#b2e2e2"
             }
           },
            {
             value: "4",
             label: "Zone 4",
             symbol: {
               type: "simple-fill",
               color: "#66c2a4"
            } 
            },
            {
             value: "5",
             label: "Zone 5",
             symbol: {
               type: "simple-fill",
               color: "#2ca25f"
            }                
                             },
            {
             value: "6",
             label: "Zone 6",
             symbol: {
               type: "simple-fill",
               color: "#006d2c"
            }               
            }
                            ]
        };
    
        //define label class for label
        const labelClass = {
            // autocasts as new LabelClass()
            symbol: {
                type: "text",  // autocasts as new TextSymbol()
                color: "black",
                haloColor: "white",
                haloSize: "1px",
        font: {  // autocast as new Font()
            family: "Arial Unicode MS",
            size: 16,
            weight: "bold"
            }
        },
  labelExpressionInfo: {
    expression: "$feature.name"
  }
};
        //add layer          
        const HardinessZonesLayer = new FeatureLayer({
          url: "https://services5.arcgis.com/A49gj7AiDe668Yw0/arcgis/rest/services/ushardinesszones_Midwest_Only/FeatureServer",       
          //"https://services5.arcgis.com/A49gj7AiDe668Yw0/arcgis/rest/services/ushardinesszones/FeatureServer",
          outFields: ["name"],
          popupTemplate: popupZones,
          title: "Hardiness Zones",
          opacity: 0.45,
          visible: true,
          renderer: hardinessRenderer,
          labelingInfo: [labelClass]
        });
        map.add(HardinessZonesLayer);
    };
    
    const editor = new Editor({
        view: view,
        allowedWorkflows: ["create", "update"], //user can create or edit/update their own features
        
        snappingOptions: {
            enabled: true
        },
        sketchTooltipOptions: {
            enabled: true
        },
        
        layerInfos: [
            {layer: gardenSection,
            formTemplate: {
                //set so that only one field displays wtihin the form
                elements: [ {
                
                type: "field",
                fieldName: "Vegetable",
                label: "Vegetable"
            
                }]
            }
            
            }
            ]
      
      });
        view.ui.add(editor, "top-right");
       
    //add area and distance measurement buttons
    // add the toolbar for the measurement widgets and add widgets
        view.ui.add("topbar", "top-right");

        document.getElementById("distanceButton").addEventListener("click", function() {
          setActiveWidget(null);
          if (!this.classList.contains("active")) {
            setActiveWidget("distance");
          } else {
            setActiveButton(null);
          }
        });

        document.getElementById("areaButton").addEventListener("click", function() {
          setActiveWidget(null);
          if (!this.classList.contains("active")) {
            setActiveWidget("area");
          } else {
            setActiveButton(null);
          }
        });

        function setActiveWidget(type) {
          switch (type) {
            case "distance":
              activeWidget = new DistanceMeasurement2D({
                view: view
              });

              // skip the initial 'new measurement' button
              activeWidget.viewModel.start();

              view.ui.add(activeWidget, "top-right");
              setActiveButton(document.getElementById("distanceButton"));
              break;
            case "area":
              activeWidget = new AreaMeasurement2D({
                view: view
              });

              // skip the initial 'new measurement' button
              activeWidget.viewModel.start();

              view.ui.add(activeWidget, "top-right");
              setActiveButton(document.getElementById("areaButton"));
              break;
            case null:
              if (activeWidget) {
                view.ui.remove(activeWidget);
                activeWidget.destroy();
                activeWidget = null;
              }
              break;
          }
        };

        function setActiveButton(selectedButton) {
          // focus the view to activate keyboard shortcuts for sketching
          view.focus();
          let elements = document.getElementsByClassName("active");
          for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("active");
          }
          if (selectedButton) {
            selectedButton.classList.add("active");
          }
        };
    
    
//Javascript Object for relevant vegetable data - set up read from csv
    
    const data = [{Variety: "Asparagus", Row_Spacin: 36, yield_10ft: 3, yield_unit: "lb."}, {Variety: "Bush Beans", Row_Spacin: 24, yield_10ft: 6, yield_unit: "lb."}, {Variety: "Lima Beans", Row_Spacin: 24, yield_10ft: 2, yield_unit: "lb."}, {Variety: "Pole Beans", Row_Spacin: 24, yield_10ft: 3, yield_unit: "lb."}, {Variety: "Beets", Row_Spacin: 12, yield_10ft: 10, yield_unit: "lb."}, {Variety: "Broccoli", Row_Spacin: 24, yield_10ft: 10, yield_unit: "lb."}, {Variety: "Cabbage", Row_Spacin: 24, yield_10ft: 10, yield_unit: "heads"}, {Variety: "Carrots", Row_Spacin: 12, yield_10ft: 10, yield_unit: "lb."}, {Variety: "Cauliflower", Row_Spacin: 24, yield_10ft: 10, yield_unit: "lb."}, {Variety: "Celery", Row_Spacin: 24, yield_10ft: 8, yield_unit: "lb."}, {Variety: "Chinese Cabbage", Row_Spacin: 24, yield_10ft: 10, yield_unit: "heads"}, {Variety: "Sweet Corn", Row_Spacin: 30, yield_10ft: 11, yield_unit: "ears"}, {Variety: "Cucumbers", Row_Spacin: 48, yield_10ft: 10, yield_unit: "lb."}, {Variety: "Eggplant", Row_Spacin: 24, yield_10ft: 20, yield_unit: "fruits"}, {Variety: "Endive", Row_Spacin: 12, yield_10ft: 6, yield_unit: "lb."}, {Variety: "Kale", Row_Spacin: 18, yield_10ft: 2, yield_unit: "lb."}, {Variety: "Kohlrabi", Row_Spacin: 15, yield_10ft: 8, yield_unit: "lb."}, {Variety: "Lettuce", Row_Spacin: 12, yield_10ft: 5, yield_unit: "lb."}, {Variety: "Muskmelon", Row_Spacin: 60, yield_10ft: 10, yield_unit: "melons"}, {Variety: "Mustard", Row_Spacin: 12, yield_10ft: 4, yield_unit: "lb."}, {Variety: "Okra", Row_Spacin: 30, yield_10ft: 5, yield_unit: "lb."}, {Variety: "Onion Seed", Row_Spacin: 12, yield_10ft: 10, yield_unit: "lb."}, {Variety: "Onion Sets", Row_Spacin: 12, yield_10ft: 10, yield_unit: "lb."}, {Variety: "Parsley", Row_Spacin: 12, yield_10ft: 0.5, yield_unit: "lb."}, {Variety: "Parsnips", Row_Spacin: 18, yield_10ft: 10, yield_unit: "lb."}, {Variety: "Peas", Row_Spacin: 18, yield_10ft: 3, yield_unit: "lb."}, {Variety: "Peppers", Row_Spacin: 24, yield_10ft: 80, yield_unit: "fruit"}, {Variety: "Potatoes (Irish)", Row_Spacin: 24, yield_10ft: 30, yield_unit: "lb."}, {Variety: "Potatoes (Sweet)", Row_Spacin: 36, yield_10ft: 12, yield_unit: "lb."}, {Variety: "Pumpkins (winter squash)", Row_Spacin: 72, yield_10ft: 40, yield_unit: "lb."}, {Variety: "Radishes", Row_Spacin: 12, yield_10ft: 10, yield_unit: "bunches"}, {Variety: "Rhubarb", Row_Spacin: 48, yield_10ft: 12, yield_unit: "lb."}, {Variety: "Spinach", Row_Spacin: 12, yield_10ft: 5, yield_unit: "lb."}, {Variety: "Squash (summer)", Row_Spacin: 30, yield_10ft: 60, yield_unit: "fruit"}, {Variety: "Swiss Chard", Row_Spacin: 15, yield_10ft: 22, yield_unit: "lb."}, {Variety: "Tomatoes", Row_Spacin: 36, yield_10ft: 60, yield_unit: "lb."}, {Variety: "Turnips", Row_Spacin: 15, yield_10ft: 10, yield_unit: "lb."}, {Variety: "Watermelons", Row_Spacin: 72, yield_10ft: 4, yield_unit: "melons"}];
    
    //create empty object for results of query
    var totalYield = [];
    //cycle through the objects in the data array to find matches and calculate yield
    for (let i = 0; i < data.length; i++){
        let yield_unit = data[i].yield_unit;
        let yield_10ft = data[i].yield_10ft;
        let plantSpacing = data[i].Row_Spacin;
        let VegType = data[i].Variety;
    
        //run query to find which veg user has assigned
      let query = gardenSection.createQuery();
            query.where = "Vegetable = '" + VegType + "'";
            query.outFields = ["Shape__Length", "Shape__Area"];
            query.returnDistinctValues = true;
            query.returnGeometry = false;
    
    gardenSection.queryFeatures(query)
        .then(function(response){
            //check if there is no match and response is undefined
            if (jQuery.isEmptyObject(response.features[0])) {return;} //jump over one iteration in the loop
            let result = response.features[0].attributes; //this is just grabbing the first record; later could add sum statistic if needed
            let area = result.Shape__Area * 5.5; //convert into square feet
            
        
            //calculate total yield - area overall divided by area of 10ftxspacing, times yield per 10 feet
            totalYield.push({Variety: VegType, Total_Yield: Math.round((area/((plantSpacing/12)*10))* yield_10ft), yield_unit: yield_unit});
            
    });
    };
    
  
//add button for export report
    document.getElementById("exportReport").addEventListener("click", function(){
        console.log("Export Report button was clicked!")
          
            const csvdata = csvmaker(totalYield);
            download(csvdata);
           
    });
    
   //functions for download and csvmaker - will run when exportReport button is clicked
    const download = function (data) {
 
    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: 'text/csv' });
 
    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob)
 
    // Creating an anchor(a) tag of HTML
    const a = document.createElement('a')
 
    // Passing the blob downloading url
    a.setAttribute('href', url)
 
    // Setting the anchor tag attribute for downloading
    // and passing the download file name
    a.setAttribute('download', 'download.csv');
 
    // Performing a download with click
    a.click()
}
 
    const csvmaker = function (data) {
    // Empty array for storing the values
    var csvRows = [];
    // Headers is basically a keys of an object
    const headers = Object.keys(data[0]);
    // As for making csv format, headers
    // must be separated by comma and
    // pushing it into array
    csvRows.push(headers.join(','));
 
    // Pushing Object values into array
    // with comma separation
    
    for (let j = 0; j < 2; j++){
      console.log(j);  
    };
    console.log(data);
   console.log(data.length);
    for (let i = 0; i < data.length; i++){
        const values = Object.values(data[i]).join(',');
        csvRows.push(values)
        };
    // Returning the array joining with new line
     return csvRows.join('\n')
};
 

  
      });
  
 
  
  