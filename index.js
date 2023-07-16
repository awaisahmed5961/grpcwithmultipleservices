const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const {client, vehicleClient} = require('./client');

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {

    client.getAll(null, (err, data) => {
        if (!err) {
            res.render("customers", {
                results: data.customers
            });
        }
    });
});

app.post("/save", (req, res) => {
    let newCustomer = {
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    };

    client.insert(newCustomer, (err, data) => {
        if (err) throw err;

        console.log("Customer created successfully", data);
        res.redirect("/");
    });
});

app.post("/update", (req, res) => {
    const updateCustomer = {
        id: req.body.id,
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    };

    client.update(updateCustomer, (err, data) => {
        if (err) throw err;

        console.log("Customer updated successfully", data);
        res.redirect("/");
    });
});

app.post("/remove", (req, res) => {
    client.remove({ id: req.body.customer_id }, (err, _) => {
        if (err) throw err;

        console.log("Customer removed successfully");
        res.redirect("/");
    });
});



// end points related to vehcile

app.get("/vehicles", (req, res) => {
    vehicleClient.GetAllVehicles(null, (err, data) => {
        if (!err) {
            res.render("vehicle", {
                results: data.vehicles
            }); 
        }
    }); 
});

app.post("/savevehicle", (req, res) => {
    let newVehicle = {
        registerationNo: req.body.registerationNo,
        make: req.body.make,
        model: req.body.model,
        seatingCapacity: req.body.seatingCapacity,
    };

    vehicleClient.InsertVehicle(newVehicle, (err, data) => {
        if (err) throw err;
        console.log("Vehcile created successfully", data);
        res.redirect("/vehicles");
    });
});

app.post("/updatevehicle", (req, res) => {
    const updateVehicle = {
        registerationNo: req.body.id,
        make: req.body.make,
        model: req.body.model,
        seatingCapacity: req.body.seatingCapacity
    };

    vehicleClient.UpdateVehicle(updateVehicle, (err, data) => {
        if (err) throw err;

        console.log("Vehicle updated successfully", data);
        res.redirect("/vehicles");
    });
});

app.post("/removevehicle", (req, res) => {
    vehicleClient.RemoveVehicle({ registerationNo: req.body.registerationNo }, (err, _) => {
        if (err) throw err;
        console.log("Vehicle removed successfully");
        res.redirect("/vehicles");
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("Server running at port %d", PORT);
});