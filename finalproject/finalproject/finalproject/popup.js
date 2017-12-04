function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };
chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}

//send message to content.js to begin parsing article in the event that the 
//extension was clicked
chrome.tabs.query({active: true, currentWindow: true}, function (tabs){
    console.log("extension opened");
    chrome.tabs.sendMessage(tabs[0].id, {action: "Activate"}, function (response) {
      console.log(response);
    });

});

BufferedReader br = null;
FileReader fr = null;

try {
    fr = new FileReader(‘liberal_bias.txt’);
    br = new BufferedReader(fr);

    String currentline;
    String bias_string = null;

    // Eliminate the space between words
    String[] txt = bias_string.split("");
    String[] txt2 = data.split("");
  
    // Declare variable to track bias score
    let bias_score = 0

    // Compile words in bias.txt into a string
    while ((bias_string = br.readLine()) != null) {
       bias_string = bias_string + “ “ + currentline;}
      
    // Iterate through string of webpage txt
    for(int i = 0; i < txt.length; i++)
    { 
      if (txt2.equalsIgnoreCase(txt[i])
      {
         bias_score += 1;
      }
    }
  }
finally {
    try {
        if(br != null)br.close();
    }
console.log(`${bias_score}`);

  