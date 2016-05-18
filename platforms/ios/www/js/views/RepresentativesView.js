var RepresentativesView = function (communication) {
	var listView

	this.initialize = function () {
	 	this.$el = ('<div></div>');
		listView = new RepresentativesListView();
	 	this.render();
	}

	this.setRepresentatives = function(list) {
		representatives = list;
		this.render();
	}

	this.render = function () {
	 	this.$el.html(this.template(representatives));
	 	$('.content', this.$el).html(listView.$el);
	 	return this;
	}

	this.updateRepresentatives = function() {
		communication.getRepresentatives().done(function (representatives) {
			 listView.setRepresentatives(representatives);
		})
	}

	this.initialize()
}