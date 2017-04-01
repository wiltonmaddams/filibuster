(function($){
    $.fn.serializeObject = function(){

        var self = this,
            json = {},
            push_counters = {},
            patterns = {
                "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
                "key":      /[a-zA-Z0-9_]+|(?=\[\])/g,
                "push":     /^$/,
                "fixed":    /^\d+$/,
                "named":    /^[a-zA-Z0-9_]+$/
            };


        this.build = function(base, key, value){
            base[key] = value;
            return base;
        };

        this.push_counter = function(key){
            if(push_counters[key] === undefined){
                push_counters[key] = 0;
            }
            return push_counters[key]++;
        };

        $.each($(this).serializeArray(), function(){

            // skip invalid keys
            if(!patterns.validate.test(this.name)){
                return;
            }

            var k,
                keys = this.name.match(patterns.key),
                merge = this.value,
                reverse_key = this.name;

            while((k = keys.pop()) !== undefined){

                // adjust reverse_key
                reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

                // push
                if(k.match(patterns.push)){
                    merge = self.build([], self.push_counter(reverse_key), merge);
                }

                // fixed
                else if(k.match(patterns.fixed)){
                    merge = self.build([], k, merge);
                }

                // named
                else if(k.match(patterns.named)){
                    merge = self.build({}, k, merge);
                }
            }

            json = $.extend(true, json, merge);
        });

        return json;
    };
})(jQuery);

/*
* PT Mini JavaScript Framework
*/

/* Create a jx namesapce */
var jx = {
  js_assets: '/static/js/'
  
};

(function(app) {

  app.name = "jx";
  app.utils = {};
  app.internals = {obj_refs: {}};
  app.events = {};
  app.templates = {};
  app.templates_ref = {};
  
  app.utils.merge = function(obj, obj1, obj2) {
    var attrname;

    for (attrname in obj1) {
      if (attrname !== "__namespace") {
        obj[attrname] = obj1[attrname];
      }
    }

    for (attrname in obj2) {
      obj[attrname] = obj2[attrname];
    }

    return obj;
  };

  app.event = function(from_object, name, e) {  
    //Get the namespace of the object triggering the event
    if (typeof(from_object) == "string") {
        var ns = from_object;
    } else {
        var ns = from_object.__namespace;    
    }
    
    if (typeof(app.events[ns]) == "undefined") {
        return false;
    }
    if (typeof(app.events[ns][name]) == "undefined") {
         return false;
    }
    $.each(app.events[ns][name], function(index, observer) {
        observer.callback.call(observer.scope, from_object, e);
    });
  }
  
  app.__process_object = function(obj) {
    if (typeof(obj.require) !== 'undefined' && obj.require.length > 0 || typeof(obj.extend) !== 'undefined') {
      app.__require_classes(obj, app.__init_object);
    } else {
      obj = app.__init_object(obj);
    }
    return obj;
  };

  app.__init_object = function(obj) {
    if (typeof(obj.extend) !== 'undefined') {
      obj = app.utils.merge(obj, app.internals.obj_refs[obj.extend], obj);
    }
    
    if (typeof(obj.init) !== 'undefined') {
      obj.on = function(event_handlers) {
        $.each(event_handlers, function(selectors){
          $.each(this, function(e, callback){
            if (selectors == "document") {
                $(document).on(e, function(event_obj) {
                  callback.call(obj, this, event_obj);
                });
            } else if (selectors == "window") {
                $(window).on(e, function(event_obj) {
                  callback.call(obj, this, event_obj);
                });
            } else {
                $("body").on(e, selectors, function(event_obj) {
                  callback.call(obj, this, event_obj);
                });
            }
          });
        });
      };
      
      
       obj.observe = function(event_handlers) {
        $.each(event_handlers, function(selectors){
          $.each(this, function(e, callback){

            if (typeof(app.events[selectors]) == "undefined") {
                app.events[selectors] = {}
            }

            if (typeof(app.events[selectors][e]) == "undefined") {
                app.events[selectors][e] = [];
            }
            app.events[selectors][e].push({callback: callback, scope: obj})
          });
        });
      };
      
      obj.templates = function(templates) {
      $.each(templates, function(template_name, path){
          app.templates_ref[template_name] = path;
          app.templates[path] = {'path': path, 'template_string': null, 'status': false};
        });
      }; 
 

      if (typeof(obj.onReady) !== 'undefined') {
        $(document).ready(function() {
                  obj.onReady()
        })
      };
      obj.init();

      // Abstract jaxon classes use _init() and _onReady() that that they are not over written
      if (typeof(obj._init) !== 'undefined') {
         obj._init();  
      }

      if (typeof(obj._onReady) !== 'undefined') {
        $(document).ready(function() {
                  obj.onReady()
        })
      }      

    }

    
    return obj;
  };

  app.__require_classes = function(obj, callback) {
    var requires = [];

    if (typeof(obj.require) !== 'undefined') {
      requires = obj.require;
    }

    if (typeof(obj.extend) !== 'undefined') {
      requires.push(obj.extend);
    }

    $.each(requires, function(index, value) {
      if (!app.__is_defined(value)) {
        jQuery.ajax({
            async:false,
            type:'GET',
            url:app.js_assets + value.toLowerCase() + ".js",
            data:null,
            success: function() {
              if (index == requires.length - 1) {
               callback(obj);
              }
            },
            dataType:'script',
            error: function(xhr, textStatus, errorThrown) {
            }
        });
 
      } else {
        console.log(value + " is already defiend");
      }
    });
  };

  app.__is_defined = function(ns_string) {
    var parts = ns_string.split('.');
    var parent = app;
    var pl, i;

    if (parts[0] == app.name) {
        parts = parts.slice(1);
    }
    pl = parts.length;
    for (i = 0; i < pl; i++) {
        if (typeof(parent[parts[i]]) == 'undefined') {
          return false;
        } else {
          return false;
        }
    }
  };

  app.define = function (ns_string, ns_object) {
    if (app.__is_defined(ns_string)) {
      console.log(ns_string + " is already defiend");
      return false;
    }
    var parts = ns_string.split('.'),
        parent = app,
        pl, i;
    if (parts[0] == app.name) {
        parts = parts.slice(1);
    }
    pl = parts.length;
    for (i = 0; i < pl; i++) {
        if (typeof(parent[parts[i]]) == 'undefined') {
            if (i == pl-1) {
              ns_object.__namespace = ns_string;
              parent[parts[i]] = app.__process_object(ns_object);
            } else {
              parent[parts[i]] = {};
            }
        }
        parent = parent[parts[i]];
    }
    
    //Provide method on all jx classes to access the jx core object  
    app.addCoreHelper(app, ns_object);  
    app.internals.obj_refs[ns_string] = ns_object;
    return parent;
  };
  app.addCoreHelper = function(core_object, ns_object) {
      if (typeof(ns_object['__jaxon']) == 'undefined') {
          ns_object['__jaxon'] = {
              core_object: core_object               
          }
      }
      ns_object.__getCore = function() {
          return this.__jaxon.core_object
      };
      ns_object.getController = function(controller_name) {
          var jxcore = this.__getCore();
          var app_name = jxcore.name;
          //Adds the jx.controllers. prefix
          var controller_ns = app_name + "." + "controllers." + controller_name;
          return jxcore.internals.obj_refs[controller_ns];
      };
      ns_object.getStore = function(store_name) {
          var jxcore = this.__getCore();
          var app_name = jxcore.name;
          //Adds the jx.controllers. prefix
          var store_ns = app_name + "." + "stores." + store_name;       
          return jxcore.internals.obj_refs[store_ns];
      };     

      ns_object.JXTemplate = function() {
          var jxcore = this.__getCore();
          //Adds the jx.controllers. prefix
          var jx_ux_template_ns = "jx.ux.templates";       
          return jxcore.internals.obj_refs[jx_ux_template_ns];
      };     
  
  };
  app.create = function(obj, data) {
    var newobj = (function(obj, data) {
      this.pvid = 0;
    })(obj, data)
    
    return new $.extend(newobj, obj);
  }
})(jx);
                        