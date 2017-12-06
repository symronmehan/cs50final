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

// Function which converts txt files into strings
// This function needs to be able to have the parameter be an input that is inputed in the score function
function converter(txt_file){
	var fs = require("fs");
	var output_string = fs.readFileSync("file_name").toString('utf-8');
	var textByLine = text.split("\n");
	console.log(textByLine);
	return textByLine;
}

function political_lean(text, txt_file){
    //for text, interpret any non letter character besides hyphen as the end of a word
    //javascript split to parse accordingly
	let words_article = text.split(" ");

    //make set of words in webpage
	let set_article = new Set([words_article]);

	//make set of words from conservative word list
    fopen("conservative.txt", "r") as txt_file:
	let temp_string_conservative = converter(txt_file);
	close("conservative.txt");
	let set_conservative = new Set([temp_string_conservative]);

    //find intersection between set from webpage and set of biased words
	let conservative_intersection = new Set([...set_article].filter(x => set_conservative.has(x)));

	//make set of words from liberal word list
    fopen("liberal.txt", "r") as txt_file:
	let temp_string_liberal = converter(txt_file);
	close("liberal.txt");
	let set_liberal = new Set([temp_string_liberal]);

    //find intersection between set from webpage and set of biased words
	let liberal_intersection = new Set([...set_article].filter(x => set_liberal.has(x)));

	//Determine political lean
	if (conservative_intersection.size == liberal_intersection.size)
	{
	    return political_lean = 0;
	}
	else if (conservative_intersection.size > liberal_intersection.size)
	{
	    return political_lean = 1;
	}
	else if (conservative_intersection.size < liberal_intersection.size)
	{
	    return political_lean = -1;
	}
}

//function which takes a string and returns bias score
function score(text, txt_file){

  //for text, interpret any non letter character besides hyphen as the end of a word
  //javascript split to parse accordingly
	let words_article = text.split(" ");

  //make set of words in webpage
	let set_article = new Set([words_article]);


  //text from bias txt file: interpret new line as the end of a word
  //let words_polarizing = ["hello", "this", "is", "moronic"];

    //make set of words in txt file
	open("bias.txt", "rb") as txt_file:
	let temp_string_biaswords = converter(txt_file);
	close("bias.txt");
	let set_polarizing = new Set([temp_string_biaswords]);


    //count number of biased words and compare to wordcount of article, return tier underwhich ratio falls
	let bias = intersection.size;
	let total = words_article.length;
	let bias_score = bias / total;

	return bias_score;
}

function Display_Bias_Score_Word(bias_score){console.log('hi');
	if (0 <= bias_score && bias_score <= 0.4)
	{
		document.getElementById("bias").innerHTML = 'Neutral';
    	document.getElementById("bias").style.color = "green";
	}
	else if (0.4 < bias_score && bias_score <= 0.6)
	{
    	document.getElementById("bias").innerHTML = 'Skewed';
    	document.getElementById("bias").style.color = "yellow";
	}
	else
	{
    	document.getElementById("bias").innerHTML = 'Biased';
    	document.getElementById("bias").style.color = "red";
	}
}

function Display_Political_Lean(political_lean) {
	document.getElementById("lean").innerHTML = political_lean;
}
