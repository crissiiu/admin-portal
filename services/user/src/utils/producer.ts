import dotenv from "dotenv";
import { Admin, Kafka, Producer } from "kafkajs";

dotenv.config();

let producer: Producer;
let admin: Admin;

export const connectKafka = async () => {
  try {
    const kafka = new Kafka({
      clientId: "user-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });

    admin = kafka.admin();

    await admin.connect();

    const topic = await admin.listTopics();

    if (!topic.includes("send-mail")) {
      await admin.createTopics({
        topics: [
          {
            topic: "send-mail",
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      });
    }

    console.log("[user-service] Topic send email đã được tạo");
    await admin.disconnect();
    producer = kafka.producer();
    await producer.connect();
    console.log("[user-service] Đã connect tới Kafka Producer");
  } catch (error) {
    console.log("[error]][user-service] Lỗi khi connect đến kafka", error);
  }
};

export const publishToTopic = async (topic: string, message: any) => {
  if (!producer) {
    console.log("Kafka producer is not initialized");
    return;
  }

  try {
    await producer.send({
      topic: topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  } catch (error) {
    console.log("Lỗi khi gửi thông tin đến kafka", error);
  }
};

export const disconnectKafka = async () => {
  if (producer) {
    producer.disconnect();
  }
};
