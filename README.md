# rsafe-server

The following is the backend application code for Zayuk Safe

## Description

Zayuk Safe backend is an application that defines the logic for backend functions using the handlers in the handler folder. It then deploys this code into an API Gateway using the serverless.dev.yml file deployed with a serverless command

## Environment

Developers must initialize in a Linux environment, windows will not work.

## 3rd Party Libraries

### AWS Lambda

https://aws.amazon.com/
https://aws.amazon.com/lambda/
Zayuk Safe backend is deployed on AWS lambda functions, in a distributed computation setting

### AWS API Gateway

https://aws.amazon.com/api-gateway/
Zayuk Safe's backend API is deployed via pipeline onto API Gateway

### Serverless

https://www.serverless.com/framework/docs/getting-started
Serverless is a library that deploys lambda functions to AWS and defines an API with API Gateway

### DynamoDB

https://aws.amazon.com/dynamodb/
DynamoDB is used as the AWS Database which holds Zayuk Safe's fundamental data

### Stripe Treasury

https://stripe.com/treasury
Operating Accounts are stored in Stripe Treasury, These accounts are used to transact between the association and the residents in the association

### Stripe Connect

https://stripe.com/connect
Connect is used to store customer and association data for stripe to process transactions between the two

### Stripe Payments

https://stripe.com/payments
Used to create Payment Methods of the association residents on their operating account between the association, service providers, and residents

### Stripe Identity

https://stripe.com/identity
Identity is used to validate the documents of the registrant and to validate the address and owner

### Google Maps Platform:

https://mapsplatform.google.com/
We use Google Validation API to validate the addresses and units of our communities

### Auth0

## Installation

Users will need to first verify their ssh key is registered in GitHub and then clone into their github

git clone git@github.com:zayuk-inc/rsafe-server.git

Once users have cloned into the repo they can run

npm i

to install all libraries

## Setup

Team members will need AWS credentials and AWS Management Console access to make serverless calls

## Micro-Services

https://drive.google.com/file/d/1_N0lJ71u5h737FfItexlbpVKFrUY92kl/view?usp=sharing
https://drive.google.com/file/d/1aEzGtWwxtaod-05aZwB-WMzW1IAK2ZF8/view?usp=sharing
See diagram above for microservices to backend

## Schema:

https://drive.google.com/file/d/1-dF511Ch5rgaR7b2Q2c3tw5V9tV4j51f/view?usp=sharing
See diagram above for schema between databases and microservices

## System Architecture

## Local Testing:

https://tldv.io/app/meetings/657bc70aceb4a600132371b7
Developers should watch the tl;dv above to understand how test test single functions locally
