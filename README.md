# req-res cycle in micro-services with Kafka

This is for POC of how we can handle a req-res cycle from UI to a micro-service that uses Kafka events that depends on other micro-services for further data processing.

## Concept

Since events move only one way there can be cases in a micro-service architecture where we need to provide the response to the request with some data that other micro-service would have handled after processing it.

The idea is: where you handle the POST request in the Kafka producer, await the GET request to the Kafka consumer, and in the Kafka consumer where this GET request is handled, listen to the event that is emitted when the message is consumed.

## Initial Setup

clone/unzip the repo and start docker engine
(Open the folder in VS Code for ease)
navigate to the repo folder on your local machine in command prompt and run this:

```bash
docker compose up
```

If Kafka and zookeeper are not installed they'll be installed and run automatically wait till then.

On windows you may get an error that windows build tool were not found so open new cmd as administrator and run this:

```bash
npm install --global windows-build-tools
```

Be patient it can take quite some time and data to install this.

When it halts ----> re-run docker compose up in the previous cmd

Wait till the you see these messages: Welcome to the Bitnami zookeeper container & Welcome to the Bitnami kafka container
and their logs leave that terminal running and open a new terminal in the folder .

Now we create a topic named 'test' in the Kafka container, in the cmd run:

```bash
docker ps
```

You will get the running docker container's info, copy the CONTAINER ID of the kafka container and replace the "[container_id]" in the command below and run it.

```bash
docker exec -it [container_id] /opt/bitnami/kafka/bin/kafka-topics.sh --create
--bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic test
```

IF you get any error you may need to change the path too according to the COMMAND NAMES you get after running docker ps

You will get a topic created successfully message.

After this in the terminal run the following to install node modules

```bash
npm i
```

INITIAL SETUP IS DONE........

## Starting Up

Whenever you want to run the project run docker engine and then in the terminal of the project run

```bash
docker compose up
```

This will start the Kafka and zookeeper, keep it open.

In the VS Code split the terminal into two and in first run

```bash
npm run producer
```

in the second run

```bash
npm run consumer
```

you should be able to see something like this

![image](https://user-images.githubusercontent.com/56472816/178145902-98e463c8-8471-4478-bff1-eb9c74262e37.png)

START UP IS DONE.....

## Usage

Send a POST request to the route localhost:3000/subscribe-newsletter with the following body parameters

```javascript
{
    "name": "John Doe",    //string
    "age": 18,             //int
    "gender": "Male",      //string
    "hobbies": [           //array of strings
        "music",
        "code"
    ]
}
```

Postman Screenshot
![image](https://user-images.githubusercontent.com/56472816/178149173-4a2098d9-0418-4595-9906-5248a7418982.png)

Press the send button and in the consoles you shall see the logs appearing at every step as the event is processed and the response is sent.

![image](https://user-images.githubusercontent.com/56472816/178147041-71210843-634a-46ac-8850-830693531fae.png)

Also you will get the response in the response tab of postman with additional key-value pair of

```javascript
{
  success: true;
}
```

![image](https://user-images.githubusercontent.com/56472816/178149119-0e6fe3cc-020e-4f52-a740-2a5ac6820e4c.png)
