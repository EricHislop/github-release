'use strict';

import { AWSError, DynamoDB } from 'aws-sdk'
import { PromiseResult } from 'aws-sdk/lib/request';

const dynamoDb = new DynamoDB.DocumentClient()
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

export async function list() {

  let dbResponse: PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>

  try {
    dbResponse = await dynamoDb.scan(params).promise()
  } catch (error) {
    console.error(error)
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t fetch the todo items.',
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(dbResponse.Items),
  }
}