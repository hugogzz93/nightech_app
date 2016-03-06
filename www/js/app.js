// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */

    LogInView.prototype.template = Handlebars.compile($('#log-in-tpl').html());
    ReservationsView.prototype.template = Handlebars.compile($('#coordinator-menu-tpl').html());
    AdministratorView.prototype.template = Handlebars.compile($('#administrator-menu-tpl').html());
    CreateReservationView.prototype.template = Handlebars.compile($('#create-reservation-tpl').html());
    ReservationsListView.prototype.template = Handlebars.compile($('#reservations-list-tpl').html());
    ServicesListView.prototype.template = Handlebars.compile($('#reservations-list-tpl').html());
    
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

        // // Show User
        // router.addRoute('users/:id', function (id) {
        //      console.log('show user') ;
        //      communication.findUserById(parseInt(id)).done(function (user) {
        //           slider.slidePage(new UserView(user).render().$el) ;
        //      })
        // });

        // // Administrator

        // // Show Service
        // router.addRoute('services/:id', function (id) {
        //      console.log('show service') ;
        //      communication.findServiceById(parseInt(id)).done(function (service) {
        //           slider.slidePage(new ServiceView(service).render().$el) ;
        //      })
        // });

        // // Update Service
        // router.addRoute('services/:id/update', function (id) {
        //      console.log('update service') ;
        //      communication.findServiceById(parseInt(id)).done(function (service) {
        //           slider.slidePage(new UpdateServiceView(service).render().$el) ;
        //      })
        // });

        // // Super User

        // // User Index
        // router.addRoute('users', function () {
        //      console.log("User index") ;
        //      communication.getUsers().done(function (users) {
        //           slider.slidePage(new UserIndexView(users).render().$el) ;
        //      })
        // });

        // // Admin View User
        // router.addRoute('users/:id', function (id) {
        //      console.log("Admin User Update") ;
        //      communication.findUserById(parseInt(id)).done(function (user) {
        //           slider.slidePage(new AdminViewUser(user).render().$el) ;
        //      })
        // });

        // router.addRoute('finance', function () {
        //      console.log("finance") ;
        //      // missing api implementation
        // })

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
         var $toastContent = $('<span>Reservation Created!</span>');
          Materialize.toast($toastContent, 2500);
    })

    /* ---------------------------------- Local Functions ---------------------------------- */
    /* ---------------------------------- Handlebars Helpers ------------------------------- */
    Handlebars.registerHelper('reservationIcon', function (text) {
         // const text = Handlebars.escapeExpression(text);
         var returnText;
         if (text === "pending") {
            returnText = new Handlebars.SafeString(
            ''
            );
         } else if(text === "accepted"){
            returnText = new Handlebars.SafeString(
            '<i class="material-icons">done</i>'
            );
         } else {
            returnText = new Handlebars.SafeString(
            '<i class="material-icons">not_interested</i>'
            );
         }
         return returnText;
    })



}());