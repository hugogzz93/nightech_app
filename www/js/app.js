// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */

    LogInView.prototype.template = Handlebars.compile($('#log-in-tpl').html());
    ReservationsView.prototype.template = Handlebars.compile($('#coordinator-menu-tpl').html());
    AdministratorView.prototype.template = Handlebars.compile($('#administrator-menu-tpl').html());
    CreateReservationView.prototype.template = Handlebars.compile($('#create-reservation-tpl').html());
    ReservationsListView.prototype.template = Handlebars.compile($('#reservations-list-tpl').html());
    ServicesListView.prototype.template = Handlebars.compile($('#services-list-tpl').html());
    TableChooseModalView.prototype.template = Handlebars.compile($('#table-choose-modal-tpl').html());

    
    const communication = new Communication();
    const slider = new PageSlider($('body'));
    const mainUrl = "http://api.localhost:3000";


    communication.initialize(mainUrl).done( function () {
         
         // Front Page
        router.addRoute('', function() {
            if (!communication.auth_token) {
                console.log("Log In");
                slider.slidePage(new LogInView().render().$el);

            } else {
                console.log("Logged In");
            }
        });

        // Coordinator reservations menu
        router.addRoute('reservations', function() {
            console.log('empty');
            const date = new Date()
             slider.slidePage(new ReservationsView(communication).render().$el);
        });

        // create reservation
        router.addRoute('reservations/create', function () {
            communication.getRepresentatives().done(function (representatives) {
                 slider.slidePage(new CreateReservationView(communication, representatives).render().$el) ;
            })
        })

        // administrator view
        router.addRoute('administrator', function () {
            slider.slidePage(new AdministratorView(communication).render().$el);
        })

        router.start();

    } );


    /* --------------------------------- Event Registration -------------------------------- */
    document.addEventListener('deviceready', function () {
        FastClick.attach(document.body);
        if (navigator.notification) { // Override default HTML alert with native dialog
            window.alert = function (message) {
                navigator.notification.alert(
                    message,    // message
                    null,       // callback
                    "Error",    // title
                    'OK'        // buttonName
                );
            };
        }
    }, false);

    events.on('navigationRequest', function (url) {
             router.load(url);
        })

    events.on('logInSuccess', function (user) {
         router.load(user.credentials === "coordinator" ? 'reservations' : 'administrator' );
    })

    events.on('reservationCreated', function () {
        router.load("reservations"); 
        events.emit('toastRequest', "Reservation Created!");
    })

    events.on('toastRequest', function (message) {
         var $toastContent = $('<span>' + message + '</span>');
          Materialize.toast($toastContent, 2500);
    })

    /* ---------------------------------- Local Functions ---------------------------------- */
    /* ---------------------------------- Handlebars Helpers ------------------------------- */

    Handlebars.registerPartial('serviceCollapsible', $('#service-collapsible-li-tpl').html());
    Handlebars.registerPartial('createTable', $('#create-service-li-tpl').html());

    Handlebars.registerHelper('reservationIcon', function (text) {
         // const text = Handlebars.escapeExpression(text);
         var returnText = "";
         if (text === "pending") {
            returnText = new Handlebars.SafeString(
            ''
            );
         } else if(text === "accepted"){
            returnText = new Handlebars.SafeString(
            '<i class="material-icons">done</i>'
            );
         } else if(text === "rejected"){
            returnText = new Handlebars.SafeString(
            '<i class="material-icons">not_interested</i>'
            );
         }
         return returnText;
    })

    Handlebars.registerHelper('serviceIcon', function (service) {
         // const text = Handlebars.escapeExpression(text);
         status = service.status
         var returnText = "";
         if (status === "incomplete") {
            returnText = new Handlebars.SafeString(
            '<i class="material-icons service-btn" data-service-status="' + service.status + '" data-service-id="' + service.id + '">done</i>'
            );
         } else if(status === "complete"){
            returnText = new Handlebars.SafeString(
            '<i class="material-icons service-btn" data-service-status="' + service.status + '" data-service-id="' + service.id + '">receipt</i>'
            );
         }
         return returnText;
    })

    Handlebars.registerHelper('showPending', function (status) {
         var returnText = "";
         if(status === "accepted" || status === "rejected") {
            returnText = new Handlebars.SafeString(
            'class="hidden"'
            );
         }
         return returnText;
    })

    Handlebars.registerHelper('serviceStatusColor', function (status) {
         var returnText = "";
         if(status === "complete") {
            returnText = Handlebars.SafeString("orange accent-1");
         }
         return returnText;
    })

    Handlebars.registerHelper('ifnot', function(conditional, options) {
      if(!conditional) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    });

    Handlebars.registerHelper('partial', function(name, ctx, hash) {
        var ps = Handlebars.partials;
        if(typeof ps[name] !== 'function')
            ps[name] = Handlebars.compile(ps[name]);
        debugger
        return ps[name](ctx, hash);
    });

    Handlebars.registerHelper('tableHelper', function (table) {
         const services = table.services;
         var ps = Handlebars.partials;

         ps["serviceCollapsible"] = typeof ps["serviceCollapsible"] === 'function' ? ps["serviceCollapsible"] : Handlebars.compile(ps["serviceCollapsible"]);
         ps["createTable"] = typeof ps["createTable"] === 'function' ? ps["createTable"] : Handlebars.compile(ps["createTable"]);

         for(var i = 0; i < services.length; i++) {
                if(!services[i].ammount) {
                    return ps["serviceCollapsible"](services[i]);
                }
         }
        return ps["createTable"](table);
    })



}());