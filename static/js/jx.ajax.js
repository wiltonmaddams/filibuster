jx.define('jx.ajax', {
    init: function() {
    this.refs = {
    }
    this.on({
      ".ajax-click" : {
        'click': this.onAjaxClick
      },
      "window" : {
        'hashchange': this.onHashChange
      },

    });
    
  },
  // TODO: Add globally available state
  onAjaxClick: function(element, e) {
    attrs = {}
    
    if ($(element).attr("data-ajax-spinner") === "self") {      
      $(element).hide();
      $("<img src='/static/img/loading.gif'>").insertAfter($(element));
    }
    
    if ($(element).attr("data-ajax-verb")) {      
      verb = $(element).attr("data-ajax-verb");
    } else {
      verb = "POST";
    }

    for (i=0;i<element.attributes.length;i++){
        attrs[element.attributes[i].nodeName] = element.attributes[i].nodeValue;
    }
    
        
    this.jaxon($(element).attr("data-jaxon-call"), {attrs: attrs, data: $(element).data()}, element);
  },
  AjaxRequest: function(url, json_data, element, verb) {
    var that = this;
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(json_data),
        dataType: 'json',
        success: function(data){
          that.processRequest(data, element);          
        },
        error: function(){
        },
        processData: false,
        type: verb,
        url: url
    });    
  },
  jaxoncb: function(call, data, cb) {
    var that = this;
    cb = typeof(cb) != 'undefined' ? cb : null;
    json_data = {call: call, data: data}
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(json_data),
        dataType: 'json',
        success: function(data){
          that.processRequest(data);
          cb.call(data);          
        },
        error: function(){
        },
        processData: false,
        type: 'POST',
        url: '/jaxon'
    });    
  },
  jaxon: function(call, data, element) {
    var that = this;
    element = typeof(element) != 'undefined' ? element : null;
    custom_trigger_event = ""
    //Allow for custom callback event
    if (!(call.indexOf(":") == -1)) {
        custom_trigger_event = call.substring(call.indexOf(":") + 1, call.length);
        call = call.substring(0, call.indexOf(":"));    
    }
    

    json_data = {call: call, custom_trigger_event: custom_trigger_event, data: data}
    
    that.__getCore().event("jaxon." + call, "request", {});
    
    $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(json_data),
        dataType: 'json',
        success: function(data){
          that.processRequest(data, element);          
        },
        error: function(){
        },
        processData: false,
        type: 'POST',
        url: '/jaxon'
    });    
  },
  getHashParam: function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\#&]" + name + "=([^&#]*)")
    var results = regex.exec(window.location);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },
  checkHashParam: function(urlString) {
    var results = urlString.split('#');

    if (results[1] !== undefined) {
        if (results[1] !== "") {
            return true
        }
        else {
            return false
        }
    }
  },
  onHashChange: function(e) {
    
  },  
  domFormReset: function(element) {
    var obj = $(element);
    var startVal = obj.attr("start");
    obj.css("color", "#aaaaaa")    
    obj.val(startVal);
  },
  processRequest: function (data, element) {   
      var that = this;
      if (element !== null && $(element).attr("data-ajax-url") === "self") {
        $(element).show();
      }
              
      $(data).each(function() {


        if (this.type == "JAXON") {
            
            if (this.data.data.action === 'trigger') {
                //Trigger JAXON event
                var response = this.data.data.response;
                var namespace = this.data.data.namespace;
                var event_name = this.data.data.event;
                that.__getCore().event(namespace, event_name, response);
            }            

  

        }
          

        if (this.type == "JAXON_DATASTORE") {
             
            if (this.data.data.action === 'add') {
                //Trigger JAXON event
                var namespace = this.data.data.namespace;
                var payload = this.data.data.payload;
                var store = jx.ajax.getStore(namespace);
                store.add(payload);                
            }   

            if (this.data.data.action === 'load') {
                //Trigger JAXON event
                var namespace = this.data.data.namespace;
                var payload = this.data.data.payload;
                var store = jx.ajax.getStore(namespace);
                store.load_data(payload);                
            }  

        }


        if (this.type == "JAXON_TEMPLATE") {
             
            if (this.data.data.action === 'load') {
                //Trigger JAXON event
                var store = jx.ux.templates.handleLoadingTemplates(this.data.data.templates);                
            }  

        }

        if (this.type == "DOM") {

            if (this.data.data.action === 'value') {
                $(this.data.data.element).attr("value", this.data.data.content);
            }
            
            if (this.data.data.action === 'addClass') {
                $(this.data.data.element).addClass(this.data.data.content);
            }
            if (this.data.data.action === 'removeClass') {
                $(this.data.data.element).removeClass(this.data.data.content);
            }                                
            if (this.data.data.action === 'insert') {
                $(this.data.data.element).html(this.data.data.content);                    
            }
            if (this.data.data.action === 'replace') {
                $(this.data.data.element).replaceWith(this.data.data.content);                    
            }

            if (this.data.data.action === 'insertBefore') {
                $(this.data.data.content).insertBefore(this.data.data.element);                    
            }

            if (this.data.data.action === 'insertAfter') {
                $(this.data.data.content).insertAfter(this.data.data.element);                    
            }
            
            if (this.data.data.action === 'append') {
                $(this.data.data.element).append(this.data.data.content);
            }
            if (this.data.data.action === 'prepend') {
                $(this.data.data.element).prepend(this.data.data.content);
            }
            if (this.data.data.action === 'hide') {
                $(this.data.data.element).hide();
            }     
            if (this.data.data.action === 'remove') {
                $(this.data.data.element).remove();
            }                           
            if (this.data.data.action === 'show') {
                $(this.data.data.element).show();
            }
            if (this.data.data.action === 'fadeIn') {
                $(this.data.data.element).fadeIn("fast");
            }
            if (this.data.data.action === 'fadeOut') {
                $(this.data.data.element).fadeOut("fast");
            }
            if (this.data.data.action === 'slideDown') {
                $(this.data.data.element).slideDown(this.data.data.content);
            }      
            if (this.data.data.action === 'slideUp') {
                $(this.data.data.element).slideUp(this.data.data.content);
            }
            if (this.data.data.action === 'focus') {
                $(this.data.data.element).focus();
            }
            if (this.data.data.action === 'modal') {
                $.modal(this.data.data.content);
            }
            if (this.data.data.action === 'changeSection') {
                $(location).attr('hash', "section/" + this.data.data.content);
            }
            
            if (this.data.data.action === 'changeLocation') {
                window.location = this.data.data.content;
            }
            
            if (this.data.data.action === 'addNumber') {
                var num = parseInt($(this.data.data.element).text());
                var newNumber = num + parseInt(this.data.data.content);            
                $(this.data.data.element).text(newNumber);
            }                
            if (this.data.data.action === 'event') {
                if (this.data.data.method === 'click') {
                    eval('$("' + this.data.data.element + '").unbind("click");$("' + this.data.data.element + '").live("click", function() {' + this.data.data.content + ' });');              
                }
            }

            if (this.data.data.action === 'addMessage') {
                domAddMessage(this.data.data.content, this.data.data.style);
            }                

            if (this.data.data.action === 'addMessageSpeed') {
                domAddMessageSpeed(this.data.data.content, this.data.data.style, this.data.data.speed);
            } 

            if (this.data.data.action === 'formReset') {
                that.domFormReset(this.data.data.element);
            }                                                                                                 
        }                
      })
    }    
});