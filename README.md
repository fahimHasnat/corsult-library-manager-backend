# Corsult Library Manager - Backend

This guide will walk you through setting up the backend of the Corsult Library Manager.

## Prerequisites

Before setting up the backend, ensure you have the following installed:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)
- **npm**: npm comes bundled with Node.js, so installing Node.js will also install npm.

## Installation

### 1. Install NestJS CLI

To get started, you'll need to install the NestJS CLI globally on your system. Run the following command:

```
npm install -g @nestjs/cli
```
### 2. Install Project Dependencies
Once the NestJS CLI is installed, navigate to the project directory and install the necessary dependencies by running:

```bash
npm install
```
### 3. Configure Environment Variables
The env is provided with the code since I have used a database server, rather than a local db.

### 4. Run the Redis Server In Terminal
```
redis-server
```

### 5. Run the Development Server
```
npm run start:dev
```

This will start the NestJS development server and make the API accessible at 
```http://localhost:8001```.

## Database Optimization Scopes

### 1. Partitioning

- Partition the books table by category
- Partition the borrow table by borrowed_date

### 2. Sharding

- Use user_id as sharding key
- Divide data into shards and store it on separate database instances
- Use an application-layer routing mechanism to direct queries to the correct shard.

### 3. Strategies for Handling Large Datasets and High Query Volumes

- Indexing book_id, user_id
- Create composite indexes
- Data archiving rules should be applied, ex: borrowing record from before 6 months should be in a data warehouse
- Create multiple read replicas to handle read traffic
- Use parameterized query so that database can make the execution plan more optimized

   
