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
        Display_Bias_Score_Word(bias_score);
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
  let words_polarizing = $.get("scripts/bias_text.py");

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

//function to identify the political lean of the article
function lean(text){

  //for text, interpret any non letter character besides hyphen as the end of a word
  //javascript split to parse accordingly
  let words_article = text.split(" ");

  //make set of words in webpage
  let set_article = new Set([words_article]);

  //text from conservative txt file: interpret new line as the end of a word
  let words_conservative = $.get("scripts/conseravtive_text.py");

  //text from liberal txt file: interpret new line as the end of a word
  let words_liberal = $.get("scripts/liberal_text.py");

  //make set of words in txt file
  let set_conservative = new Set([words_conservative]);

  //make set of words in txt file
  let set_liberal = new Set([words_liberal]);

  //find intersection between set from webpage and set of conservative words
  let intersection_conservative = new Set([...set_article].filter(x => set_conservative.has(x)));

  //find intersection between set from webpage and set of liberal words
  let intersection_liberal = new Set([...set_article].filter(x => set_liberal.has(x)));

  //count number of biased words and compare to wordcount of article, return tier underwhich ratio falls
  let conservative_bias = intersection_conservative.size;
  let liberal_bias = intersection_liberal.size;
  let total = words_article.length;
  let conservative_bias_score = conservative_bias / total;
  let liberal_bias_score = liberal_bias / total;

  let outcome = liberal_bias_score - conservative_bias_score
  if(outcome > 0):
    return '1'

  if(outcome < 0):
    return '-1'

  if(outcome = 0):
    return '0'
}

function Display_Bias_Score_Word(bias_score){
  if (0 <= bias_score && bias_score <= 0.4)
  {
    document.getElementById("bias").innerHTML = 'Neutral';
    document.getElementById("bias").style.background = "green";
  }
  else if (0.4 < bias_score && bias_score <= 0.6)
  {
    document.getElementById("bias").innerHTML = 'Skewed';
    document.getElementById("bias").style.background = "yellow";
  }
  else
  {
    document.getElementById("bias").innerHTML = 'Biased';
    document.getElementById("bias").style.background = "red";
  }
}

function Display_Political_Lean(political_lean) {
  if (political_lean < 0)
  {
    document.getElementById("lean").innerHTML = 'Conservative';
    document.getElementById("lean").style.background = "red";
  }
  else if (political_lean == 0)
  {
    document.getElementById("lean").innerHTML = 'Neutral';
    document.getElementById("lean").style.background = "black";
  }
  else
  {
    document.getElementById("bias").innerHTML = 'Liberal';
    document.getElementById("lean").style.background = "blue";
  }
}
