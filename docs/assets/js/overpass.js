const overpass = (() => {
  function call(map, overpassQuery, icon) {
    let e = map.getBounds().getEast();
    let w = map.getBounds().getWest();
    let n = map.getBounds().getNorth();
    let s = map.getBounds().getSouth();

    var bounds = s + "," + w + "," + n + "," + e;
    var nodeQuery = "(node[" + overpassQuery + "](" + bounds + ");";
    var wayQuery = "way[" + overpassQuery + "](" + bounds + ");";
    var relationQuery = "relation[" + overpassQuery + "](" + bounds + ");)";
    var query =
      "?data=[out:json][timeout:25];" +
      nodeQuery +
      wayQuery +
      relationQuery +
      ";out;>;out skel%3b";
    var baseUrl = "https://overpass-api.de/api/interpreter";
    var resultUrl = baseUrl + query;

    fetch(resultUrl)
      .then((response) => response.json())
      .then(function (data) {
        if (data == "") {
          helper.side_toaster("no data", 2000);
          return false;
        }
        data.elements.forEach((element) => {
          if (element.type == "node") {
            L.marker([element.lat, element.lon])
              .addTo(overpass_group)
              .setIcon(maps[icon])
              .bindPopup(element.tags.name);
          }
        });
      })
      .then(helper.side_toaster("loaded", 2000))
      .catch(function (err) {
        helper.side_toaster("something went wrong, try again", 2000);
      });
  }

  return {
    call,
  };
})();
