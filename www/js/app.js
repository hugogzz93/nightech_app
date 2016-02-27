// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */

    LogInView.prototype.template = Handlebars.compile($('#coordinator-menu-tpl').html());
    
    const communication = new Communication();
    const slider = new PageSlider($('body'));

    communication.initialize("http://api.localhost:3000").done( function () {
         
         // Front Page
        router.addRoute('', function() {
            if (!communication.auth_token) {
                console.log("Log In");
                slider.slidePage(new LogInView(communication).render().$el);

            } else {
                console.log("Logged In");
            }
        });

        // // Coordinator reservations menu
        // router.addRoute('reservations', function() {
        //     console.log('empty');
        //     communication.getReservations().done(function (reservations) {
        //          slider.slidePage(new MenuReservations(reservations).render().$el);
        //     })
        // });

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

    /* ---------------------------------- Local Functions ---------------------------------- */


}());