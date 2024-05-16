const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { config } = require("../../config");
const { createErrorResponse } = require("../../shared/ErrorResponse");
const { hashPassword } = require("../../shared/helper");
const {
  generateToken,
  decodeToken,
  modifiedData,
} = require("../../shared/helper");
const { createSuccessResponse } = require("../../shared/SuccessResponse");
const { getPersonByEmail, createPerson } = require("../PersonsResources");
const { auth0User } = require("../../shared/auth0");
const { getSecretValue } = require("../../shared/GetSecrets");

const {
  secretKey: { devSecretKey, stageSecretKey, prodSecretKey },
  dynamoTable: { Person_TABLE },
} = config();
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION,
});

exports.handler = async (event) => {
  try {
    let requestBody;
    if (process.env.IS_LOCAL || process.env.NODE_ENV === "test") {
      requestBody = event.body;
    } else {
      requestBody = JSON.parse(event.body);
    }
    const existingPerson = await getPersonByEmail(
      dynamoDB,
      Person_TABLE,
      requestBody.email
    );

    if (existingPerson.Items.length > 0) {
      return createErrorResponse(
        400,
        "Provided User email already exists!, please try with new email"
      );
    }
    console.log(requestBody);
    if (!requestBody.email || !requestBody.password) {
      return createErrorResponse(400, "Missing required params");
    }

    const hashedPassword = await hashPassword(requestBody.password);
    const personId = uuidv4();

    const fullName = `${requestBody.firstName} ${requestBody.lastName}`;
    console.log("fullName >>>>", fullName);

    const auth0Response = await auth0User(
      requestBody.email,
      requestBody.password,
      fullName,
      hashedPassword,
      personId
    );

    console.log("auth0Response >>>>", auth0Response);

    const newPerson = {
      personId,
      email: requestBody.email,
      password: hashedPassword,
      name: fullName || null,
      subscribed: true,
      defaultAssociationId: "null",
      auth0Id: auth0Response.data.user_id,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    await createPerson(dynamoDB, Person_TABLE, newPerson);

    const userDetails = {
      id: newPerson.personId,
      email: newPerson.email,
      name: newPerson.name,
    };

    let keyName;
    console.log("Process.env", process.env.STAGE);
    if (process.env.STAGE === "prod") {
      keyName = prodSecretKey;
    } else if (process.env.STAGE === "stage") {
      keyName = stageSecretKey;
    } else {
      keyName = devSecretKey;
    }

    const { key } = await getSecretValue(keyName);
    const token = await generateToken(jwt, userDetails, key);
    const decodedTokenData = await decodeToken(jwt, token, key);
    const finalResponse = await modifiedData(token, decodedTokenData);

    return createSuccessResponse(
      200,
      "User successfully registered",
      finalResponse
    );
  } catch (error) {
    console.error("Error inserting data:", error);
    return createErrorResponse(400, "Error occurred while registering", error);
  }
};
