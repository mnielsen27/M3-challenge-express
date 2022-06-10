var express = require("express");
var server = express();
var bodyParser = require("body-parser");

var model = {
  clients: {},
  reset: function () {
    return (model.clients = {});
  },
  addAppointment: function (client, date) {
    const obj = { date: date.date, status: "pending" };
    if (this.clients.hasOwnProperty(client)) {
      this.clients[client].push(obj);
    } else {
      this.clients[client] = [obj];
    }
    return obj;
  },
  attend: function (client, date) {
    if (this.clients.hasOwnProperty(client)) {
      for (let i = 0; i < this.clients[client].length; i++) {
        if (date == this.clients[client][i].date) {
          this.clients[client][i].status = "attended";
        }
      }
    }
  },
  expire: function (client, date) {
    if (this.clients.hasOwnProperty(client)) {
      for (let i = 0; i < this.clients[client].length; i++) {
        if (date == this.clients[client][i].date) {
          this.clients[client][i].status = "expired";
        }
      }
    }
  },
  cancel: function (client, date) {
    if (this.clients.hasOwnProperty(client)) {
      for (let i = 0; i < this.clients[client].length; i++) {
        if (date == this.clients[client][i].date) {
          this.clients[client][i].status = "cancelled";
        }
      }
    }
  },
  erase: function (client, date) {
    if (this.clients.hasOwnProperty(client)) {
      let cliente = this.clients[client];
      switch (date) {
        case "attended": {
          this.clients[client] = cliente.filter((d) => d.status !== "attended");
          break;
        }
        case "expired": {
          this.clients[client] = cliente.filter((d) => d.status !== "expired");
          break;
        }
        case "cancelled": {
          this.clients[client] = cliente.filter(
            (d) => d.status !== "cancelled"
          );
          break;
        }
        default: {
          this.clients[client] = cliente.filter((d) => d.date !== date);
          break;
        }
      }
    }
  },
  //getAppointments: function (client) {},
  //getClients: function () {},
};

server.use(bodyParser.json());

server.get("/api", (req, res) => {
  res.status(200).send(model.clients);
});

server.post("/api/Appointments", (req, res) => {
  let { client, appointment } = req.body;
  if (!client) {
    return res.status(400).send("the body must have a client property");
  }
  if (typeof client !== "string") {
    return res.status(400).send("client must be a string");
  }
  const obj = model.addAppointment(client, appointment);
  /*try {

  } catch (e){
      throw TypeError ()
  }*/
  return res.send(obj);
});

server.listen(3002);
module.exports = { model, server };
