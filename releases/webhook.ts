'use strict'

import * as uuid from 'uuid'

import { DynamoDB } from 'aws-sdk'
import { secrets } from '../utils/secrets'

const dynamoDb = new DynamoDB.DocumentClient()

export async function webhook(event: { body: string }) {

  try {
    await secrets(event)
  } catch (error) {
    console.error(error)
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t validate authentication.',
    }
  }

  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)

  if (data.action !== 'released') {
    console.error('Validation Failed')
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the result item.',
    }
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      name: data.release.name,
      tag_name: data.release.tag_name,
      url: data.release.url,
      body: data.release.body,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }

  try {
    await dynamoDb.put(params).promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item)
    }
    return response
  } catch (error) {
    console.error(error)
    return {
      statusCode: error.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the result item.',
    }
  }
}