class ServerModel {
	constructor(view) {
		this.view = view;
		this.nservers = 1;
		this.mu = 1;
		this.maxqlen = -1;

		this.entity = null;
		this.dest = null;
		this.statTable = $("#server_stats").clone().attr("id", view.name);
		this.statTable.find("h2").text(view.name);

		$("#results").append(this.statTable);
		this.stat = [
			this.statTable.find("#arrival"),
			this.statTable.find("#drop"),
			this.statTable.find("#sutil"),
			this.statTable.find("#qtime"),
			this.statTable.find("#stime"),
			this.statTable.find("#qsize"),
			this.statTable.find("#ssize"),
			this.statTable.find("#qtimed"),
			this.statTable.find("#stimed"),
			this.statTable.find("#qsized"),
			this.statTable.find("#ssized"),
		];

		this.view.image.attr({ title: `Service rate = ${this.mu}` });
	}

	jsonify() {
		return {
			nservers: this.nservers,
			mu: this.mu,
			maxqlen: this.maxqlen,
		};
	}

	start() {
		this.entity = QueueApp.sim.addEntity(ServerEntity, null, this.nservers, this.mu, this.maxqlen);
	}

	connect() {
		this.entity.dest = this.dest ? this.dest.entity : null;
	}

	showSettings(x, y) {
		const d = $("#server_form");
		QueueApp.form_view = this.view;
		d.find("#server_form_rate").val(this.mu);
		d.find("#queue_length").val(this.maxqlen);
		d.show().position({
			of: $(this.view.image.node),
			at: "center center",
			my: "left top",
		});
	}

	saveSettings(dialog) {
		const d = $("#server_form");
		this.mu = d.find("#server_form_rate").val();
		this.maxqlen = d.find("#queue_length").val();
		this.view.image.attr({ title: `Service rate = ${this.mu}` });
	}

	showStats() {
		const service = this.entity.facility;
		const qd = service.queueStats().durationSeries;
		const qs = service.queueStats().sizeSeries;
		const sd = service.systemStats().durationSeries;
		const ss = service.systemStats().sizeSeries;
		const usage = (service.usage() / QueueApp.sim.time()) * 100;
		this.stat[0].text(this.entity.arrived);
		this.stat[1].text(this.entity.dropped);
		this.stat[2].text(`${usage.toFixed(1)}%`);
		this.stat[3].text(qd.average().toFixed(3));
		this.stat[4].text(sd.average().toFixed(3));
		this.stat[5].text(qs.average().toFixed(3));
		this.stat[6].text(ss.average().toFixed(3));
		this.stat[7].text(qd.deviation().toFixed(3));
		this.stat[8].text(sd.deviation().toFixed(3));
		this.stat[9].text(qs.deviation().toFixed(3));
		this.stat[10].text(ss.deviation().toFixed(3));

		this.view.showCounters(qd.count(), sd.count());
	}

	unlink() {
		this.statTable.remove();
		this.view = null;
		this.stat = null;
	}
}

/***************************************************/

class ServerEntity extends Entity {
	start(nservers, mu, maxqlen) {
		this.mu = mu;
		this.facility = CreateFacility("queue", Discipline.FCFS, nservers, maxqlen);
		this.dropped = 0;
		this.arrived = 0;
	}

	arrive(stamp) {
		this.arrived++;
		const duration = QueueApp.random.exponential(this.mu);
		this.useFacility(this.facility, duration).done(this.completed, this, stamp);
	}

	completed(stamp) {
		if (this.callbackMessage === -1) {
			this.dropped++;
		} else {
			if (this.dest) {
				this.dest.arrive(stamp);
			}
		}
	}
}
