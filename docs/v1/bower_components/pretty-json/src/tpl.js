/**
* @class PrettyJSON.tpl.
* general templates.
*
* @author #rbarriga
* @version 0.1
*
**/
PrettyJSON.tpl.Node = '' +
'<div class="node-container">' +
    //top.
    '<span class="node-top node-bracket" />' +
    //content.
    '<div class="node-content-wrapper">' +
        '<ul class="node-body" />' +
    '</div>' +
    //bottom.
    '<span class="node-down node-bracket" />' +
'</div>';

PrettyJSON.tpl.Leaf = '' +
'<div class="leaf-container">' +
    '<span class="<%= type %>"> <%=data%></span><span><%= coma %></span>' +
'</div>';
