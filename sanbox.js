// Function to remove "output" and "languages" properties from JSON objects while preserving content
function removeWrapperProperties(jsonData) {
    if (Array.isArray(jsonData)) {
      return jsonData.map(item => {
        if (item && typeof item === 'object') {
          // First remove "output" wrapper if it exists
          if (item.hasOwnProperty('output')) {
            item = item.output;
          }
          // Then remove "languages" wrapper if it exists
          if (item.hasOwnProperty('languages')) {
            item = item.languages;
          }
          return item;
        }
        return item;
      });
    }
    return jsonData;
  }
  
  // Get the entire input array, not just the first item
  const inputData = $input.all().map(item => item.json);
  
  // Remove "output" and "languages" properties from all objects
  const cleanedData = removeWrapperProperties(inputData);
  
  return cleanedData
  