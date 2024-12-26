// import amqp from 'amqplib';

// let channel: amqp.Channel;

// // Connect to RabbitMQ
// export const connectRabbitMQ = async (): Promise<void> => {
//     try {
//         const connection = await amqp.connect(process.env.RABBITMQ_URL as string);
//         channel = await connection.createChannel();
//         console.log('Product-Service: Connected to RabbitMQ');

//         // Declare a queue
//         await channel.assertQueue('productQueue', { durable: true });
//         await channel.assertQueue('deleteProductQueue', { durable: true });
//     } catch (err) {
//         console.error('RabbitMQ Error:', err);
//     }
// };

// // Publish messages to a queue
// export const sendToQueue = (queue: string, message: object): void => {
//     if (!channel) {
//         console.error('RabbitMQ Channel not established');
//         return;
//     }
//     channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
//     console.log(`Sent message to queue ${queue}:`, message);
// };


import { connect, Channel, Connection, Message } from 'amqplib';
import dotenv from 'dotenv';
// import { addProduct, deleteProduct, updateProduct } from '../controller/admin.controller';

dotenv.config();

const RABBITMQ_URL: string = process.env.RABBITMQ_URL || '';

let channel: Channel;

const initializeRabbitMQ = async (): Promise<void> => {
    try {
        const connection: Connection = await connect(RABBITMQ_URL);
        console.log(RABBITMQ_URL, "DD");

        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
    } catch (err) {
        console.error('Failed to connect to RabbitMQ:', err);
        process.exit(1);
    }
};

interface MessageData {
    [key: string]: any;
}

const publishToQueue = (queueName: string, message: MessageData): void => {
    if (!channel) {
        console.error('Channel not initialized.');
        return;
    }
    channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue ${queueName}:`, message);
};

const consumeQueue = (queueName: string, callback: (data: MessageData) => void): void => {
    if (!channel) {
        console.error('Channel not initialized.');
        return;
    }
    channel.assertQueue(queueName, { durable: true });
    channel.consume(queueName, (msg: Message | null) => {
        if (msg) {
            const data: MessageData = JSON.parse(msg.content.toString());
            callback(data);
            channel.ack(msg);
        }
    }, { noAck: false });
};

export { publishToQueue, consumeQueue, initializeRabbitMQ };