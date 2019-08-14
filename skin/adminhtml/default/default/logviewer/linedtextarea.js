/**
 * Displays line numbers in a textbox.
 * 
 * Usage:
 *      $("id").linedtextarea();
 *      $$("selector").each(function(element) { 
 *          element.linedtextarea();
 *      });
 * 
 * Converted to Prototype.js from http://alan.blog-city.com/jquerylinedtextarea.htm
 */
(function() {
    
    /*
     * Helper function to make sure the line numbers are always
     * kept up to the current system
     */
    var fillOutLines = function(codeLines, h, lineNo) {
        while ((codeLines.measure("height") - h) <= 0) {
            codeLines.insert("<div class='lineno' id='lineno-" + lineNo + "'>" + lineNo + "</div>");
            lineNo++;
        }
        return lineNo;
    };
    
    var LinedTextarea = {
        linedtextarea: function(element) {
            element = $(element);
            var lineNo = 1;
            /* Turn off the wrapping of as we don't want to screw up the line numbers */
            element.writeAttribute("wrap", "off");
            element.setStyle({resize: "none"});
            var originalTextAreaWidth = element.measure("border-box-width");
            
            /* Wrap the text area in the elements we need */
            Element.wrap(element, "div", { 'class': "linedtextarea" });
            var linedTextAreaDiv = element.up().wrap("div", {
                'class': "linedwrap",
                style: "width:" + originalTextAreaWidth + "px",
            });
            var linedWrapDiv = linedTextAreaDiv.up();

            var linesDiv = new Element("div", {
                'class': "lines",
                style: "width:50px;height:" + (element.measure("height") + 6) + "px;",
            });
            var codeLinesDiv = new Element("div", { 'class': "codelines" });
            linesDiv.insert(codeLinesDiv);
            
            linedTextAreaDiv.insert({ top: linesDiv });
            
            /* Draw the number bar; filling it out where necessary */
            lineNo = fillOutLines(codeLinesDiv, linesDiv.measure("height"), 1);

            /* Set the width */
            var sidebarWidth = linesDiv.measure("border-box-width");
            var paddingHorizontal = linedWrapDiv.measure("border-left") + 
                                    linedWrapDiv.measure("border-right") + 
                                    linedWrapDiv.measure("padding-left") + 
                                    linedWrapDiv.measure("padding-right");
            var linedWrapDivNewWidth = originalTextAreaWidth - paddingHorizontal;
            var textareaNewWidth = originalTextAreaWidth - sidebarWidth - paddingHorizontal - 20;

            element.setStyle({ width: textareaNewWidth + "px" });
            linedWrapDiv.setStyle({ width: linedWrapDivNewWidth + "px" });
            
            /* React to the scroll event */
            element.observe("scroll", function() {
                //var domTextArea = $(this)[0];
                var scrollTop = element.scrollTop;
                var clientHeight = element.clientHeight;
                codeLinesDiv.setStyle({'margin-top': (-1 * scrollTop) + "px"});
                lineNo = fillOutLines(codeLinesDiv, scrollTop + clientHeight, lineNo);
            });

            /* Should the textarea get resized outside of our control */
            element.observe("resize", function() {
                linesDiv.height(element.clientHeight + 6);
            });
            
            var selectionChange = function() {
                if (element.selectionStart !== undefined && element.selectionStart >= 0) {
                    var start = element.selectionStart;
                    var end = element.selectionEnd;
                    var firstLine = element.value.substr(0, start).split("\n").length;
                    var lastLine = firstLine + element.value.substr(start, end - start).split("\n").length;
                    $$(".lineselect").each(function(elem) {
                        elem.removeClassName("lineselect");
                    });
                    for (var line = firstLine; line < lastLine; line++) {
                        $("lineno-" + line).addClassName("lineselect");
                    }
                }
            };
            element.observe("keyup", selectionChange);
            element.observe("click", selectionChange);
            element.observe("focus", selectionChange);
        },
    };
    
    Element.addMethods(LinedTextarea);
})();