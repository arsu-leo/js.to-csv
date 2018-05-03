//filename:   string
//data:       Array of arrays or objects
//fields:     unfedinfed, Array to use as keys (if data is array of objects) and header, Object to use as keys as data object keys and values as header

var toCsv = function(filename, data, fields, fieldSeparator, rowSeparator) 
{
  fieldSeparator = fieldSeparator || ',';
  rowSeparator = rowSeparator || '\r\n';
  var processRow = function (row, fields) 
  {
    var outRow = [];
    //If it's an array, we dont care about fields
    //Else, we use fields or all data element keys
    var keys = Array.isArray(row) 
      ? Object.keys(row) 
      : (fields || Object.keys(row));

    for (var j = 0; j < keys.length; j++) 
    {
      var val = row[keys[j]];
      var innerValue = val === null || val === undefined 
        ? '' 
        : (val instanceof Date 
          ? val.toLocaleString() 
          : val.toString());
      
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|;|\n)/g) >= 0)
          result = '"' + result + '"';
      outRow.push(result);
    }
    return outRow.join(fieldSeparator);
  };
  var csvContent = [];
  if(fields)
  {
    if(Array.isArray(fields))
    {
      csvContent.push(processRow(fields));
    }
    else
    {
      csvContent.push(processRow(Object.values(fields)));
      fields = Object.keys(fields);
    }
    csvContent += rowSeparator;
  }

  for(var i = 0; i < data.length; ++i)
    csvContent.push(processRow(data[i], fields));
  
  csvContent = csvContent.join(rowSeparator);
  
  var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  if (navigator && navigator.msSaveBlob) 
  { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } 
  else 
  {
    var link = document.createElement("a");
    link.style.display = 'none';
    
    var url = window.URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute('target', '_blank')
    
    // Browsers that support HTML5 download attribute
    if (link.download !== undefined)  // feature detection
      link.setAttribute("download", filename);
     
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};