'use strict';

import { AWSError, DynamoDB } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request';

const dynamoDb = new DynamoDB.DocumentClient()

export async function get(event: { pathParameters: { id: any; }; }) {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  let dbResponse: PromiseResult<DynamoDB.DocumentClient.GetItemOutput, AWSError>

  try {
    dbResponse = await dynamoDb.get(params).promise()
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch the result item.',
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify(dbResponse.Item),
  }
}