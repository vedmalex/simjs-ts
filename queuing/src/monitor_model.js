class MonitorModel {
  constructor(view) {
    this.view = view;
    this.dest = null;
    this.statTable = $('#monitor_stats').clone().attr('id', view.name);
    this.statTable.find('h2').text(view.name);

    $("#results").append(this.statTable);
    this.stat = [
      this.statTable.find('#arrival'),
      this.statTable.find('#inter'),
      this.statTable.find('#interd')];
  }

  jsonify() {
    return null;
  }

  start() {
    this.entity = QueueApp.sim.addEntity(MonitorEntity);
  }

  connect() {
    if (this.dest) this.entity.dest = this.dest.entity;
  }

  showStats() {
    const m = this.entity.monitor;

    this.stat[0].text(m.count());
    this.stat[1].text(m.average().toFixed(3));
    this.stat[2].text(m.deviation().toFixed(3));
  }

  showSettings(x, y) {
    const d = $('#monitor_form');
    QueueApp.form_view = this.view;
    d.dialog('option', {title: this.view.name, position: [x, y]})
    .dialog('open');
  }

  saveSettings(dialog) {
  }

  unlink() {
    this.statTable.remove();
  }
}

/*-------------------------*/
class MonitorEntity extends Sim.Entity {
  start() {
    this.monitor = new Sim.TimeSeries();
  }

  arrive() {
    this.monitor.record(1, this.time());
    if (this.dest) this.dest.arrive();
  }
}
