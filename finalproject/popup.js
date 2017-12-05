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
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
      }
      else {
        console.log(response);
        let bias_score = score(response.data); 
        console.log(bias_score);
      }
    });

});
//function which takes a string and returns bias score
function score(text){

  //for text, interpret any non letter character besides hyphen as the end of a word
  //javascript split to parse accordingly
  let words_article = text.split(" ");

  //make set of words in webpage
  let set_article = new Set([words_article]);

  //text from bias txt file: interpret new line as the end of a word
  let words_polarizing = ["hello", "this", "is", "moronic"];

  //make set of words in txt file
  let set_polarizing = new Set([words_polarizing]);

  //find intersection between set from webpage and set of biased words
  let intersection = new Set([...set_article].filter(x => set_polarizing.has(x)));

  //count number of biased words and compare to wordcount of article, return tier underwhich ratio falls
  let bias = intersection.size;
  let total = words_article.length;
  let bias_score = bias / total;

  return bias_score;
}

