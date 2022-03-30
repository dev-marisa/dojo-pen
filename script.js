const previewCSS = document.querySelector("#preview-css");
const preview = document.querySelector("#preview");

// apply an additional id to all selectors
function cssScoping(cssText, scopeID) {
    let result = ""
    let selector = "";
    let properties = "";
    let openCount = 0;
    for(let letter of cssText) {

        if(letter === "{") {
            openCount++;
        } else if(letter === "}") {
            openCount--;
            if(openCount === 0) {
                properties += letter;
                result += properties;
                properties = "";
                continue;
            }
        }

        if(openCount === 0) {
            selector += letter;
        } else {
            properties += letter;
        }

        if(openCount > 0 && selector.length > 0) {
            result += scopeID + " " + selector;
            selector = "";
        }
    }
    return result;
} 

function sanitize(text) {
    text = text.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("=", "&equals;");
    return text;
}

function updateHTML(text) {
    let result_element = document.querySelector("#highlighting-html");
    if(text[text.length-1] == "\n") { // If the last character is a newline character
        text += " "; // Add a placeholder space character to the final line 
    }
    result_element.innerHTML = sanitize(text);
    Prism.highlightElement(result_element);
    preview.innerHTML = text;
}

function updateCSS(text) {
    let result_element = document.querySelector("#highlighting-css");
    if(text[text.length-1] == "\n") { // If the last character is a newline character
        text += " "; // Add a placeholder space character to the final line 
    }
    result_element.innerHTML = sanitize(text);
    Prism.highlightElement(result_element);
    previewCSS.innerHTML = cssScoping(text, " #preview");
}

function syncScrollHTML(element) {
    let result_element = document.querySelector("#highlighting1");
    // Get and set x and y
    result_element.scrollTop = element.scrollTop;
    result_element.scrollLeft = element.scrollLeft;
}

function syncScrollCSS(element) {
    let result_element = document.querySelector("#highlighting2");
    // Get and set x and y
    result_element.scrollTop = element.scrollTop;
    result_element.scrollLeft = element.scrollLeft;
}

function onStartup() {
    let urlParams = window.location.search;
    if(urlParams.length > 0) {
        // remove the "?" from the start
        urlParams = urlParams.substring(1);
        // split on "&"
        for(let kvpair of urlParams.split("&")) {
            // need to split on first instance of "="
            let index = kvpair.indexOf("=");
            let key = kvpair.substring(0, index);
            let val = kvpair.substring(index+1);
            if(key === "html") {
                let html = decodeURI(val);
                // recover the "#" characters
                html = html.replaceAll("%23", "#");
                // set in preview
                preview.innerHTML = html;
                // set in textarea
                document.querySelector("#editing-html").value = html;
                // show in editor
                updateHTML(html);
            }
            if(key === "css") {
                let css = decodeURI(val);
                // recover the "#" characters
                css = css.replaceAll("%23", "#");
                // set in preview
                previewCSS.innerHTML = cssScoping(css, " #preview");
                // set in textarea
                document.querySelector("#editing-css").value = css;
                // show in editor
                updateCSS(css);
            }
        }
    }
}
onStartup();

function generateLink() {
    const htmlEditor = document.querySelector("#editing-html").value;
    const cssEditor = document.querySelector("#editing-css").value;
    console.log(encodeURI(htmlEditor));
    window.location.search = "?html=" + encodeURI(htmlEditor) + "&css=" + encodeURI(cssEditor);
}
