const { handler } = require("../../handlers/Auth/Registration");
const { createErrorResponse } = require("../../shared/ErrorResponse");

jest.mock("jsonwebtoken");
jest.mock("dotenv");
jest.mock("uuid", () => {
  return {
    v4: jest.fn(),
  };
});
jest.mock("../../handlers/PersonsResources", () => {
  const mockExistingPerson = {
    Items: { length: 1 },
  };
  const mockNoExistingPerson = {
    Items: { length: 0 },
  };
  return {
    getPersonByEmail: jest
      .fn()
      .mockResolvedValueOnce(mockNoExistingPerson)
      .mockResolvedValueOnce(mockExistingPerson),
    createPerson: jest.fn(),
  };
});
// jest.mock("../../shared/ErrorResponse"); //, () => {
//   return {
//     createErrorResponse: jest.fn().mockResolvedValueOnce({
//       statusCode: 400,
//       message: "Mock Failure No Password",
//     }),
//   };
// });
jest.mock("../../shared/SuccessResponse", () => {
  return {
    createSuccessResponse: jest.fn().mockResolvedValue({
      statusCode: 200,
      message: "Mock Success",
    }),
  };
});

jest.mock("bcryptjs", () => {
  return {
    compare: jest.fn().mockResolvedValueOnce(true),
  };
});

jest.mock("../../shared/GetSecrets", () => {
  return {
    getSecretValue: jest.fn().mockResolvedValue({ key: true }),
  };
});
jest.mock("../../shared/auth0", () => {
  return {
    auth0User: jest.fn().mockResolvedValue({ data: { user_id: "id" } }),
  };
});
jest.mock("../../shared/helper", () => {
  return {
    hashPassword: jest.fn().mockResolvedValueOnce(true),
    decodeToken: jest.fn().mockResolvedValueOnce(true),
    generateToken: jest.fn().mockResolvedValueOnce(true),
    modifiedData: jest.fn().mockResolvedValueOnce(true),
  };
});

jest.mock("aws-sdk", () => {
  const mockPerson = [
    {
      id: "MockPersonId",
      email: "MockPersonEmail",
      name: "MockPersonName",
      defaultAssociationId: "MockPersonDefaultAssociationId",
      password: "password",
    },
  ];
  const mockDynamoDB = {
    query: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: mockPerson }),
    }),
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDynamoDB),
    },
    SES: jest.fn(),
  };
});

const invalidSignUpBody = {
  body: {
    email: "test@yopmail.com",
  },
};
const validSignUpBody = {
  body: {
    email: "test@yopmail.com",
    password: "Testing@123",
    firstName: "first name",
    lastName: "last name",
  },
};
describe("Sign Up", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should sign up a user", async () => {
    const validRequestBodyEvent = validSignUpBody;

    const result = await handler(validRequestBodyEvent);

    console.log(result);
    expect(result).toMatchObject({
      statusCode: 200,
      message: "Mock Success",
    });
  });

  it("Should fail to sign up a user because one exists", async () => {
    const invalidRequestBodyEvent = invalidSignUpBody;

    const result = await handler(invalidRequestBodyEvent);

    console.log(result);
    expect(result).toMatchObject(
      createErrorResponse(
        400,
        "Provided User email already exists!, please try with new email"
      )
    );
  });
});
