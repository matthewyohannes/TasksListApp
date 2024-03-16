import { ListTablesCommand, DynamoDBClient, ProjectionType } from "@aws-sdk/client-dynamodb";
import {
  UpdateCommand,
  PutCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

import crypto from "crypto";




const client = new DynamoDBClient({ region: "us-west-1" });
const docClient = DynamoDBDocumentClient.from(client); // Sends CRUD commands to the database


export const fetchTasks = async () => {
    const command = new ScanCommand({ // scans database for dynamodb
        ExpressionAttributeNames: { "#name": "name" },
        ProjectionExpression: "id, #name, completed", // name is reserved key word in DynamoDB so to bypass must use #
        TableName: "Tasks"
    })

    const response = await docClient.send(command);

    return response;
};


export const createTasks = async ({ name, completed }) => {
  const uuid = crypto.randomUUID();
  const command = new PutCommand({
    TableName: "Tasks",
    Item: {
      id: uuid, // partition key
      name,
      completed,
    },
  });

  const response = await docClient.send(command);

  return response;
};

export const updateTasks = async ({ id, name, completed }) => {
    const command = new UpdateCommand({
      TableName: "Tasks",
      Key: {
        id,
      },
      ExpressionAttributeNames: {
        "#name": "name",
      },
      UpdateExpression: "set #name = :n, completed = :c", // tells dynamodb what values to be updated, n and c r placeholders
      ExpressionAttributeValues: {
        ":n": name,
        ":c": completed,
      },
      ReturnValues: "ALL_NEW",
    });
  
    const response = await docClient.send(command);
  
    return response;
};


export const deleteTasks = async (id) => {
    const command = new DeleteCommand({
      TableName: "Tasks",
      Key: {
        id,
      },
    });
  
    const response = await docClient.send(command);
  
    return response;
  };



