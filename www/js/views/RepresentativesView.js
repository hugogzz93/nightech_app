var RepresentativesView = function (communication) {
	var listView

	this.initialize = function () {
	 	this.$el = $('<div/>') ;
		listView = new RepresentativesListView();
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

	this.initialize()
}