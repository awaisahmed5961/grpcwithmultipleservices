const PROTO_PATH = "./customers.proto";
const PROTO_PATH_VEHICLE = "./vehicle.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

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

const CustomerService = grpc.loadPackageDefinition(packageDefinition).CustomerService;
const VehicleService = grpc.loadPackageDefinition(vehiclePackageDefinition).VehicleService;
const client = new CustomerService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);
const vehicleClient = new VehicleService(
    "localhost:30043",
    grpc.credentials.createInsecure()
);

module.exports = {client , vehicleClient};