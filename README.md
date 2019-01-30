# Snitch: A Database transfer tool

Snitch is a command line tool. Its goal is to copy data from various data sources into a central data warehouse.

It provides a pipeline for copying data, temporarily storing the data on file storage and eventually moving that data into a data warehouse.

## Main Features
1. Extract data from multiple databases.
2. Extract data from multiple tables.
3. Insert data into multiple data warehouses
4. Universal configuration of data query across relational and NoSQL DBs
5. Configurable scheduler with start/end dates and interval.
6. ACID compliant pipeline
7. Incremental transfer of data with indices stored on redis

## Supported Databases
Snitch currently the following data stores

### Data source
Snitch supports the following
1. MySQL
2. MongoDB
3. Postgres 
4. MsSQL
5. RethinkDB
6. MariaDB
7. Apache Kafka

#### Pre-configured Templates
Snitch supports templates (Predetermined tables for popular frameworks):
1. Magento

**NB** We need help supporting more data sources. Please help!

### Data warehouse
1. MySQL / Amazon Aurora
2. Postgres / Amazon's Redshift
3. Cassandra
4. Google BigQuery

**NB** We need help supporting more data warehouses. Please help!

## Installation

Clone this repository

```bash
    git clone https://github.com/AtlasDev/data-pipeline-service

```

Navigate to the directory and initialize the project
 
```bash
cd data-pipeline-service && npm run setup
```

Run the pipeline

```bash
npm start
```

## Configuration

Snitch uses a simple JSON config file.

### Config file location
The default location of the configuration file is ./pipeline.json.
The config directory location can be changed by setting the PIPELINE_CONF_PATH environment variable. 

### Configuration Options
The JSON file contains an object with the following keys:

#### scheduler - object
This tells the pipeline when to schedule the pipeline.


| Parameter        | Type           | Description  |
| ------------- |:-------------:|:----- |
| start     | date | Time when the pipeline can start running |
| end      | date      |   Time when the pipeline will stop running |
| interval | number      |  Time intervals to run the pipeline  |

**NB:** There is a lock on the pipeline. As such, one pipeline has to be completed or fail before the next scheduled pipeline will run.

#### events - object

You can setup hooks to notify when the following events take place
1. When a pipeline runs successfully
2. When an error occur

Snitch currently supports two event triggers

1. success
2. error

You can configure an action to be triggered when an event happens
e.g

"events" : {
    "success" : {
        "type" : "slack",
        "options" : {
            "webhook" : process.env.SLACK_WEBHOOK,
            "channel" : 'Pipeline Reports: ''
        }
    },
    "error" : ...
}

The following reporting types are supported

1. slack

| channel     | string | Slack channel to post to |
| webhook      | string      |   Slack Webhook |

2. sendgrid

| apiKey     | string | Sendgrid API_KEY |
| to      | string  <email>    | Email address to send messages to |
| from      | string <email>     | From Email Address |

3. segment

| write_key     | string | Segment Write KEy |

3. zapier

| webhook     | string <url> | Zapier Webhook |

3. webhook
This is a custom endpoint

| webhook     | string <url> |  |



#### redis - object

The pipeline uses Redis to keep track of an incremental counter which will determine the next set of data to copy. 

For example, if you want to incrementally copy 100 records from the table "users" based on the "last_modified_date" field, the pipeline saves the most recent "last_modified_date" key from the array of results and stores this in Redis.
The next time the pipeline runs, it reads the "last_modified_date" key from Redis and uses that to fetch the next 100 records.

| Parameter        | Type           | Description  |
| ------------- |:-------------:|:----- |
| url      | string | Redis url |

#### fileStorage - object

When data is extracted from the various data sources, it is saved to the local file storage or on Amazon's s3.
 
| Parameter        | Type           | Description  |
| ------------- |:-------------:|:----- |
| fileMode      | remote/local | Indicates where to  |
| accessKeyId      | string      | AWS Access ID. Leave empty if "fileMode" is empty  |
| secretAccessKey      | string      |   AWS Secret Access key. Leave empty if "fileMode" is empty |
| defaultPath      | string      |   AWS Default path. Leave empty if "fileMode" is empty |
| Bucket | string      |  AWS S3 bucket. Leave empty i

 
#### source - array
 
Specify the array of data sources to extract data from. Each object contains the following
 
| Parameter        | Type           | Description  |
| ------------- |:-------------:|:----- | 
| type      | postgress/mysql/mongodb/rethinkdb/kafka | The type of database supported  |
| credentials      | array | Credentials of the data sources  |
| schema      | array | Fields to copy  |
 
  
##### credentials - array
Contains objects with the following parameters

| Parameter        | Type           | Description  |
| ------------- |:-------------:|:----- |
| url      | string | Database url  |
   
##### schema
Contains objects with the following parameters

| Parameter        | Type           | Description  |
| ------------- |:-------------:|:----- |
| fields      | array<string> | List of fields to copy from. Leave an empty array to copy all fields |
| table      | string | Table to copy from  |
| limit      | number | Number of records to transfer at once |
| destination_table_name      | string | A name to be used as the destination table name |
| primary_key      | string | Table's primary key  |
| incremental_key_key      | string | A field in the table used as an incremental key. This is usually a created_at or updated_at field based on your table schema. Leave empty to copy all the records at once. |

###### Additional Parameters for V2

1. Kafka

| Parameter        | Type           | Description  |
| ------------- |:-------------:|:----- |
| records_limit      | string | Number of records to fetch before dumping to the Warehouse  |
| topic      | string | Kafka topic to listen on  |

#### destination
Information about the destination warehouse

1. Google Big Query
The following keys are needed for Google's BigQuery

| Parameter        | Type           | Description  |
| ------------- |:-------------:|:----- |
| type      | string<googleBigQuery> | Database url  |
| projectId      | string<Your google project ID> | Database url  |
| datasetID      | string<Your google dataset (database?) ID> | Database url  |

##### Big Query Authentication
We use Service Accounts for authentication. Thus you need to specify your GOOGLE_APPLICATION_CREDENTIALS environment variable. This should point to the credentials.json or p2 file.
   

## Best practices
 it might be good to override the default 10 seconds TIMEOUT environmental variable to something that suits you.
 
## Dependencies
Under the hood, Snitch uses the amazing library:

[vm2](https://github.com/patriksimek/vm2) - Advanced vm/sandbox for Node.js

## Version 2 Updates
The following configuration are needed to support the additional data sources

### Apache Kafka

| Parameter        | Type           | Description  |
| ------------- |:-------------:|:----- |
| records_limit      | string | Number of records to fetch before dumping to the Warehouse  |
| topic      | string | Kafka topic to listen on  |

