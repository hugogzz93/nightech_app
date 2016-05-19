var RepresentativesView = function (communication) {
	var listView

	this.initialize = function () {
	 	this.$el = $('<div/>') ;
		listView = new RepresentativesListView();
		this.$el.on('click', '.add-rep-btn', function () {
			window.scrollTo(0) //else the modal will not be always viewable
	 	 	$('#add-rep-modal').openModal(); 
	 	});

	 	this.$el.on('click', '.confirm-btn', $.proxy(this.createRepresentative, this));
	 	this.$el.on('swipeleft', 'li', $.proxy(this.deleteRepresentative, this));
	 	this.render();
	}

	this.render = function () {
	 	this.$el.html(this.template());
		this.updateRepresentatives();
	 	$('.content', this.$el).html(listView.$el);
	 	return this;
	}

	this.updateRepresentatives = function() {		
		communication.getRepresentatives().done(function (response) {
			 listView.setRepresentatives(response.representatives);
		})
	}

	this.createRepresentative = function () {
		const representativeName = $('#representative-name').val();
		const repJson = { name: representativeName };
		const updateRepresentatives = $.proxy(this.updateRepresentatives, this);

		communication.createRepresentative(repJson).done(updateRepresentatives());
	}

	this.deleteRepresentative = function (e) {
		const id = $(e.target).attr('data-representative-id');
		const updateRepresentatives = $.proxy(this.updateRepresentatives, this);
		communication.destroyRepresentative(id).done(updateRepresentatives);

	}

	this.initialize()
}