import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  function signin(id?: string): string[];
}

jest.mock("../nats-wrapper");

process.env.STRIPE_KEY =
  "sk_test_51N0OmmI4CCiD4THQMrNI9TvUvoTF98Sk5ytcEjHrwCkNSlSBslea545ZcSyNoway7KHndAoT8KwGgQwnQx90bB5Y00yeOUEh12";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "secret";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) {
    await mongo.stop();
  }
});

global.signin = (id?: string) => {
  // Build a JWT payload. {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build Session Object. {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJson = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64Json = Buffer.from(sessionJson).toString("base64");

  // return a string that the cookie with the encoded data
  return [`session=${base64Json}`];
};
