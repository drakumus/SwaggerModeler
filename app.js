var test =
{
  "id":1,
  "name":"A green door",
  "price":12,
  "testBool":false,
  "tags":[
     []
  ]
}

var test2 = 
{
  "id":
  {
    "one": 1,
    "two": 2
  }
}

test = JSON.stringify(test)

function tryParseJSON(jsonString) {
  try {
    var o = JSON.parse(jsonString);
    if (o && typeof o === "object") {
      return true;
    }
  } catch (e) {
    console.error(e, jsonString);
    return false;
  }

  return false;
}

var showExample = false

function buildSwaggerJSON2(data, parentType) {
  var keys = Object.keys(data);
  var op = {
    properties: {}
  };

  var arrayBreak = false;
  keys.forEach(function(x){
    var value = data[x];
    var typeData = findType(value);
    if(["object", "null", "number", "array"].indexOf(typeData) === -1 && arrayBreak !== true) {
      op.properties[x] = {
        type: typeData,
        example: value
      } 
      if (parentType === "array") arrayBreak = true;
    } else if (typeData === "array"){
      typeData = findType(data[x]);
      op.properties[x] = {
        type: typeData,
        items:
          buildSwaggerJSON2(data[x], "array").properties[0]
        ,
        example: data[x]
      }
    } else if (typeData == "number") {
      op.properties[x] = {
        type: "integer",
        example: value
      }
    } else if (typeData == "object") {
      //lookup
    }
    //op.properties[x].example = value;
  })

  return op;
}

function findType(object) {
  var typeData = typeof object

  if(typeData == "object")
    if(Array.isArray(object))
      return "array";

  return typeData
}

function processJSON(jsonString) {
  if (tryParseJSON(jsonString) === true) {
    var json = JSON.parse(jsonString);
    var yamlReady = buildSwaggerJSON2(json, "null");
    console.log(yamlReady);
    return JSON.stringify(yamlReady, null, 4);
  }
}

console.log(processJSON(test))
console.log("done")