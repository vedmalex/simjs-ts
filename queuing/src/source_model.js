class SourceModel {
  constructor(view) {
    this.view = view;
    this.lambda = 0.25;
    this.dest = null;
    this.view.image.attr({title: `Interarrival rate = ${this.lambda}`});
  }

  jsonify() {
    return {
      lambda: this.lambda
    };
  }

  start() {
    this.entity = QueueApp.sim.addEntity(SourceEntity, null, this.lambda);
  }

  connect() {
    this.entity.dest = this.dest ? this.dest.entity : null;
  }

  showSettings() {
    const d = $('#source_form');
    QueueApp.form_view = this.view;
    d.find('#source_form_rate').val(this.lambda);

    d.show().position({
      of: $(this.view.image.node),
      at: 'center center',
      my: 'left top'
    });
  }

  saveSettings(dialog) {
    const d = $('#source_form');
    this.lambda = d.find('#source_form_rate').val();
    this.view.image.attr({title: `Interarrival rate = ${this.lambda}`});
  }

  unlink() {
    this.view = null;
  }

  showStats() {
    this.view.showCounters(NaN, this.entity.generated);
  }
}

/*-------------------------*/
class SourceEntity extends Sim.Entity {
  start(lambda) {
    this.lambda = lambda;
    this.setTimer(0).done(this.traffic);
    this.generated = 0;
  }

  traffic() {
    if (!this.dest) return;
    this.dest.arrive(this.time());

    this.generated ++;

    const duration = QueueApp.random.exponential(this.lambda);

    this.setTimer(duration).done(this.traffic);
  }
}
