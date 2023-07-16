const PROTO_PATH = "./customers.proto";
const PROTO_PATH_VEHICLE = './vehicle.proto';

var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var vehiclePackageDefinition = protoLoader.loadSync(PROTO_PATH_VEHICLE, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

var customersProto = grpc.loadPackageDefinition(packageDefinition);
var vehicleProto = grpc.loadPackageDefinition(vehiclePackageDefinition);

const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();
const customers = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        name: "John Bolton",
        age: 23,
        address: "Address 1"
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        name: "Mary Anne",
        age: 45,
        address: "Address 2"
    }
];


const vehicles = [
    {
        registerationNo: "2014-Y",
        make: "Toyota",
        model: "2023",
        seatingCapacity: 4 
    },
    {
        registerationNo: "88787-Y",
        make: "Honda",
        model: "2005",
        seatingCapacity: 4 
    }
]


server.addService(vehicleProto.VehicleService.service , {
    GetAllVehicles: (_, callback) => {
        callback(null, { vehicles });
    },
    GetVehicle: (call , callback) => {
        let vehicle = vehicles.find(n => n.registerationNo == call.request.registerationNo);

        if (vehicle) {
            callback(null, vehicle);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        } 
    },
    InsertVehicle: (call, callback) => {
        let vehicle = call.request;
        
        vehicle.registerationNo = uuidv4();
        vehicles.push(vehicle);
        callback(null, vehicle);
    },

    UpdateVehicle: (call, callback) => {
        let existingVehicle = vehicles.find(n => n.registerationNo == call.request.registerationNo);
        if (existingVehicle) {
            existingVehicle.make = call.request.make;
            existingVehicle.model = call.request.model;
            existingVehicle.seatingCapacity = call.request.seatingCapacity;
            callback(null, existingVehicle);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        } 
    },
    RemoveVehicle: (call, callback) => {
        console.log(call)
        console.log(callback)
        let existingVehicleIndex = vehicles.findIndex(
            n => n.registerationNo == call.request.registerationNo
        );

        if (existingVehicleIndex != -1) {
            vehicles.splice(existingVehicleIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    }
});




server.addService(customersProto.CustomerService.service, {
    getAll: (_, callback) => {
        callback(null, { customers });
    },

    get: (call, callback) => {
        let customer = customers.find(n => n.id == call.request.id);

        if (customer) {
            callback(null, customer);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    insert: (call, callback) => {
        let customer = call.request;
        
        customer.id = uuidv4();
        customers.push(customer);
        callback(null, customer);
    },

    update: (call, callback) => {
        let existingCustomer = customers.find(n => n.id == call.request.id);

        if (existingCustomer) {
            existingCustomer.name = call.request.name;
            existingCustomer.age = call.request.age;
            existingCustomer.address = call.request.address;
            callback(null, existingCustomer);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    remove: (call, callback) => {
        let existingCustomerIndex = customers.findIndex(
            n => n.id == call.request.id
        );

        if (existingCustomerIndex != -1) {
            customers.splice(existingCustomerIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    }
});

server.bind("127.0.0.1:30043", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:30043");
server.start();