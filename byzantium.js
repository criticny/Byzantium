var url='http://users.ox.ac.uk/~rahtz/test.js';
var TEI=[];
var AddedModules=[];
var ExcludedElements=[];
var ExcludedAttributes=[];
var Back = ""
var Current = ""
var currentModule = ""
var xml = ""
var title = ""
var filename = ""
var author = ""
var description = ""


//SETS JSON OBJECT
function teijs(data) {
    TEI=data;
    showmodules();
}

//DISPLAYS INITIAL MODULES
function showmodules() {

    var items = [];
	var moduleCounter = 0;
    $.each(TEI.modules, function(i, module) {
            items.push('<li><button class="addModule" id="' + module.ident + 'A">Add</button><button class="removeModule" id="'+module.ident+'R">Remove<button class="modulelink" style="border:none; color:blue; cursor: pointer;">' + module.ident + '</button>' + module.desc + '</li>');
			moduleCounter += 1;
        });
    $('#modules').html($('<p/>', { html: "Found " + TEI.modules.length + " modules"}));

    $('#modules').append($('<ul/>', {
        'class': 'modules',
        html: items.join('')
    }));
}

//SHOWS ADDED OR SUBTRACTED MODULES
function showNewModules(){
	$('#selected').empty();
	var items = [];
	$.each(AddedModules, function(i, module){
		items.push('<li>' + AddedModules[i] + '</li>');
	});
	$('#selected').html($('<p/>', { html: "Items Selected:" }));
	$('#selected').append($('<ul/>', {
		'class': 'selected',
		html: items.join('')
	}));
}

//DISPLAYS ELEMENTS
function showelements(name  )
{
	
    var items = [];
    $('#elements').html($('<h2/>', {html: "Elements in module " + name }));
    $.each(TEI.elements, function(i, element) {
        if (element.module == name) {
			//alert(element.attributes);
			//$.each(element.attributes, function(i, attribute){
			//	alert(attribute.ident);
			//});
			currentModule = name;
            items.push('<td><button class="addRemove" id="' + name + ":" + element.ident + '">');
			if($.inArray((name + ":" + element.ident), ExcludedElements) == -1){
				items.push("Exclude");
			}
			else{
				items.push("Include");
			}
			items.push('</button><button class="elementlink" style="border:none; color:blue; cursor: pointer;">' + element.ident + '</button>' + element.desc + '</td></tr>');
          }
        });
	
    $('#elements').append($('<table/>', {'class': 'elements',html: '<tr><td>Include/Exclude</td></tr>' + items.join('') }));
}

function loadFile(xml){
	AddedModules = [];
	alert( xml);
	xmlDoc = $.parseXML(xml);
	$xml = $(xmlDoc);
	$xml.find("moduleRef").each(function(i, item) {
		//alert(item.getAttribute('except'));
		//alert(item.getAttribute('key'));
		key = item.getAttribute('key');
		excepts = item.getAttribute('except');
		AddedModules.push(key);
		//ExcludedElements.push(key+":"+e);
		var individualExcepts = excepts.split(" ");
		$.each(individualExcepts, function(i, except){
			if(except != ""){
				ExcludedElements.push(key+":"+except);
			}
		})
	})
	$xml.find("elementSpec").each(function(i, item){
		var module = item.getAttribute('module');
		var element = item.getAttribute('ident');
		$(this).find("attDef").each(function(i, test){
			var attribute = test.getAttribute('ident');
			ExcludedAttributes.push(module + ";" + element + ";" + attribute);
		})
	})
	//alert($xml.find("moduleRef").except());
	//$title = $xml.find("title");
	
}


//DISPLAYS ATTRIBUTES
function showattributes(name ) {
	$('#attributes').show();
	$('#elements').hide();
	Back = "Elements";
	Current = "Attributes";
	var items = [];
	var bigString = ""
	$('#attributes').html($('<h2/>', {html: "Attributes in element " + name }));
	$.each(TEI.elements, function(i, element){
		if(element.module == currentModule){
			if(element.ident == name){
				$.each(element.attributes, function(i, attribute){
					items.push('<td><button class="addRemoveAttribute" id="' + currentModule + ";" + name + ";" + attribute.ident + '">');
					if($.inArray((currentModule + ";" + name + ";" + attribute.ident), ExcludedAttributes) == -1){
						items.push("Exclude");
					}
					else{
						items.push("Include");
					}
					items.push('</button>' + "  " + attribute.ident + "    "  + attribute.desc + '</td></tr>');
				});
			}
		}
	});
	$('#attributes').append($('<table/>', {'class': 'attributes',html: '<tr><td>Include/Exclude</td></tr>' + items.join('') }));
}


//READY FUNCTION. DISPLAYS MODULES
$(document).ready(function(){
	$('#actions').hide();
	$('#loadProjectTools').hide();
	$('#startInfo').hide();
})


//Loads the TEI Object.
function loadTEI(){
   $('#message').html('<p>Loading source.....' + url + '</p>');
   $.ajax({
    url: url,
    dataType: 'jsonp',
       jsonpCallback: 'teijs',
       success: function(data) {
           $('#message').html('<p>Successfuly read ' + url)
		   $('#message').hide()
       }
   });
   AddedModules.push("core");
   AddedModules.push("tei");
   AddedModules.push("header");
   AddedModules.push("textstructure");
   /**showNewModules();*/
   //doShowAll();
}
//CLICK BUTTON EVENT FOR SAVE
/*$(document).on("click","button.save", function(){
	$.ajax({
		type: "POST",
		url: "http://oxgarage.oucs.ox.ac.uk:8080/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/relaxng%3Aapplication%3Axml-relaxng/",
		data: xml,
		dataType: "xml",
		success: function(msg) {
			alert("Success");
		},
		error: function (xhr, ajaxOptions, thrownError) {
			alert(xhr.status);
			alert("Failure");
			alert(thrownError + ".");
		}
	});
})*/


//Sets the XML to be outputted.
function setXML(){
	var output = [];
	var attributesOutput = [];
	var items = [];
	xml = '<?xml version="1.0"?>' +
'<TEI xml:lang="en" xmlns="http://www.tei-c.org/ns/1.0"><teiHeader><fileDesc><titleStmt><title>';
	if(title != ""){
		xml = xml + title;
	}
	else{
		xml = xml + "My TEI Extension";
	}
	xml = xml + '</title><author>';
	if(author != ""){
		xml = xml + author;
	}
	else{
		xml = xml + 'generated by Roma 4.9';
	}
	xml = xml + '</author></titleStmt><publicationStmt><p>for use by whoever wants it</p></publicationStmt><notesStmt><note type="ns">http://www.example.org/ns/nonTEI</note></notesStmt><sourceDesc><p>created on Sunday 30th September 2012 12:40:50 PM</p></sourceDesc></fileDesc></teiHeader><text><front><divGen type="toc"/></front><body><p>';
	if(description != ""){
		xml = xml + description;
	}
	else{
		xml = xml + "My TEI Customization starts with modules tei, core, textstructure and header";
	}
	xml = xml + '</p><schemaSpec xml:lang="en" prefix="tei_" docLang="en" ident="';
	if (filename != ""){
		xml = xml + filename;
	}
	else{
		xml = xml + 'myTEI'
	}
	xml = xml + '">';
	$.each(AddedModules, function(i, name) {
		var currentModule = name;
		var currentElements = "";
		$.each(ExcludedElements, function(j, element){
			if(element.split(':')[0] == name){
				currentModule = currentModule + ':' + element.split(':')[1];
			}
		})
		$.each(ExcludedAttributes, function(k, attribute){
			if(attribute.split(';')[0] == name){
				if($.inArray((attribute.split(';')[0] + ":" + attribute.split(';')[1]), ExcludedElements) == -1){
					currentElements = currentModule + ';' + attribute.split(';')[1] + ';' + attribute.split(';')[2];
				}
				else{
					currentElements = currentElements + "";
				}
			}
			if(currentElements.length > 0){
				attributesOutput.push(currentElements);
			}
		})
		output.push(currentModule);
	})
	$.each(output, function(i, module){
		var splitOutput = module.split(":");
		key = "";
		excludes = "";
		$.each(splitOutput, function(j, elements){
			if(j == 0){
				key = elements;
			}
			else{
				excludes = excludes + " "  + elements;
			}
		})
		xml = xml + '<moduleRef except="' + excludes + '" key="' + key + '"/>';
		items.push('<p>key="' + key + '" excludes="' + excludes + '"</p>');
	})
	usedModules = [];
	usedElements = [];
	var finalAttributes = [];
	var attributeString = "";
	$.each(attributesOutput, function(i, element){
		var currentModule = element.split(";")[0];
		$.each(attributesOutput, function(j, element){
			var currentElement = element.split(';')[1];
			attributeString = currentModule + ";";
			attributeString = attributeString + currentElement;
			$.each(attributesOutput, function(k, element){
				if(currentModule == element.split(';')[0]){
					if(currentElement == element.split(';')[1]){
						attributeString = attributeString + ";" + element.split(';')[2];
					}
				}
			})
			if($.inArray(attributeString, usedElements) == -1){
				usedElements.push(attributeString);
			}
			attributeString = "";
		})
	})
	$.each(usedElements, function(i, element){
		var module = "";
		var elementSpec = "";
		var attributeString = "";
		var currentElement = element.split(';');
		$.each(currentElement, function(i, element){
			if(i == 0){
				module = element;
			}
			else if(i == 1){
				elementSpec = element;
			}
			else{
				attributeString = attributeString + '<attDef ident="' + element + '" mode="delete"/>';
			}
		})
		xml = xml + '<elementSpec ident="' + elementSpec + '" mode="change" module="' + module.split(':')[0] + '"> <attList>' + attributeString + '</attList></elementSpec>'
	})
	xml = xml + '</schemaSpec></body></text></TEI>';

}

//This function is used to show the name of all the projects that are saved to the browser.
 function doShowAll(){
   var key = "";
   var pairs = "<tr><th>Name</th></tr>\n";
   var i=0;
   for (i=0; i<=localStorage.length-1; i++) {
	 key = localStorage.key(i);
	 if(key == "TEI_SPECIFICATIONS"){
	 }
	 else{
		pairs += "<tr><td>"+key+"</td></tr>\n";
	 }
   }
   if (pairs == "<tr><th>Name</th><th>Value</th></tr>\n") {
	 pairs += "<tr><td><i>empty</i></td>\n<td><i>empty</i></td></tr>\n";
   }
   document.getElementById('pairs').innerHTML = pairs;
 }
 
//--------------------------------------------------------------------------------------------------------------
//------------------------------------------------BUTTON CLICKS HERE--------------------------------------------
//--------------------------------------------------------------------------------------------------------------


 $(document).on("click","button.newProject", function(){
	$('#startPage').hide();
	$('#startInfo').show();
	//loadTEI();
	//showNewModules();
	//$('#actions').show();
});

$(document).on("click","button.saveStartInfo", function(){
	title = $("#title").val();
	filename = $("#filename").val();
	author = $("#author").val();
	description = $("#description").val();
	$('#startInfo').hide();
	loadTEI();
	showNewModules();
	$('#actions').show();
});

$(document).on("click","button.loadProject", function(){
	$('#startPage').hide();
	loadTEI();
	$('#modules').hide();
	$('#loadProjectTools').show();
	doShowAll();
});

//Used to save a project to the browser.
$(document).on("click","button.save", function(){
	var name = $("#saveAs").val(); 
	//alert(name);
	if(name == ''){
	}
	else{
		setXML();
		var data = xml;
		localStorage.setItem(name, data);
		
	}
	doShowAll();
})

//Used to load a project from the browser.
$(document).on("click","button.load", function(){
	var name = $("#loadAs").val();
	if(name == ''){
	}
	else{
		var data = localStorage.getItem(name);
		loadFile(data);
	}
	showNewModules();
	showmodules();
	$('#modules').show();
	$('#actions').show();
	$('#loadProjectTools').hide();
	//doShowAll();
})

$(document).on("click","button.delete", function(){
	var name = $("#deleteProject").val();
	if(name == ''){
	}
	else{
		localStorage.removeItem(name);
	}
	doShowAll();
})

//CLICK BUTTON EVENT FOR OUTPUT
$(document).on("click","button.export", function(){
setXML();
alert(xml);
data='<TEI xmlns="http://www.tei-c.org/ns/1.0" xml:lang="en"><teiHeader><fileDesc><titleStmt><title>My TEI Extension</title><author>generated by Roma 4.9</author></titleStmt><publicationStmt><p>for use by whoever wants it</p></publicationStmt><notesStmt><note type="ns">http://www.example.org/ns/nonTEI</note></notesStmt><sourceDesc><p>created on Thursday 11th October 2012 09:46:32 AM</p></sourceDesc></fileDesc></teiHeader><text><front><divGen type="toc"/></front><body><p>My TEI Customization	starts with modules tei, core, textstructure and	header</p><schemaSpec ident="myTEI" docLang="en" prefix="tei_"	xml:lang="en"><moduleRef key="core" except=""/><moduleRef	key="tei" except=""/><moduleRef key="header"	except=""/><moduleRef key="textstructure" except=""/><elementSpec ident="freddy" ns="http://www.example.org/ns/nonTEI"	     mode="add"><desc/><classes><memberOf key="model.addrPart"/><memberOf key="model.nameLike.agent"/><memberOf key="att.editLike"/><memberOf key="att.lexicographic"/></classes><content xmlns:rng="http://relaxng.org/ns/structure/1.0"></content></elementSpec></schemaSpec></body></text></TEI>';
  var uri='http://oxgarage.oucs.ox.ac.uk:8080/ege-webservice/Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/relaxng%3Aapplication%3Axml-relaxng/';
  var f = document.createElement('form');
    f.action = uri;
    f.method = "post";
    f.innerHTML = f.innerHTML + "<textarea name='input' style='display:none;'>default</textarea>";
	if(filename != ""){
		f.innerHTML = f.innerHTML + "<input name='filename' value='" + filename + "' style='display:none;'/>";
	}
	else{
		f.innerHTML = f.innerHTML + "<input name='filename' value='" + "myTEI" + "' style='display:none;'/>";
	}
    document.getElementsByTagName("body")[0].appendChild(f);
    document.getElementsByName("input")[0].value=xml;
    f.submit()
	
})


//CLICK BUTTON EVENT FOR ADDING/REMOVING ELEMENT
$(document).on("click","button.addRemove", function(){
	name = $(this).attr('id');
	action = $(this).html();
	if(action == "Exclude"){
		ExcludedElements.push(name);
		$(this).html("Include");
	}
	if(action == "Include"){
		ExcludedElements.splice($.inArray(name.substring(0, name.length - 1), ExcludedElements),1);
		$(this).html("Exclude");
	}
	
})


//CLICK BUTTON EVENT FOR ADDING/REMOVING ATTRIBUTE
$(document).on("click","button.addRemoveAttribute", function(){
	name = $(this).attr('id');
	action = $(this).html();
	if(action == "Exclude"){
		ExcludedAttributes.push(name);
		$(this).html("Include");
	}
	if(action == "Include"){
		ExcludedAttributes.splice($.inArray(name.substring(0, name.length - 1), ExcludedAttributes),1);
		$(this).html("Exclude");
	}
})

//CLICK BUTTON EVENT FOR VIEWING ELEMENTS
$(document).on("click","button.modulelink",function() {
	$('#modules').hide();
	$('#selected').hide();
	$('#elements').show();
	Back = "Modules";
	Current = "Elements";
    showelements($(this).text() );
        return false;
})


//CLICK BUTTON EVENT FOR VIEWING ATTRIBUTES
$(document).on("click","button.elementlink",function(){
	showattributes($(this).text() );
		return false;
})


//CLICK BUTTON EVENT FOR ADDING MODULE
$(document).on("click","button.addModule",function() {
	name = $(this).attr('id');
	var exists = false;
	var index = $.inArray(name.substring(0, name.length - 1), AddedModules);
	if(index == -1){
		AddedModules.push(name.substring(0, name.length - 1));
	}
	showNewModules();
})

//CLICK BUTTON EVENT FOR REMOVING MODULE
$(document).on("click","button.removeModule",function(){
	name = $(this).attr('id');
	var exists = false;
	if($.inArray(name.substring(0, name.length - 1), AddedModules) != -1){
		AddedModules.splice($.inArray(name.substring(0, name.length - 1), AddedModules),1);
	}
	showNewModules();
})


//CLICK BUTTON EVENT FOR BACK
$(document).on("click","button.back", function(){
	if(Back == "Modules"){
		$('#modules').show();
		$('#selected').show();
	}
	if(Back == "Elements"){
		$('#elements').show();
	}
	if(Current == "Elements"){
		$('#elements').hide();
		$('#attributes').hide();
	}
	if(Current == "Attributes"){
		$('#attributes').hide();
		Back = "Modules"
		Current = "Elements"
	}
})
