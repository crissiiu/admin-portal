import { Kafka } from "kafkajs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const startSendMailConsumer = async () => {
  try {
    const kafka = new Kafka({
      clientId: "mail-service",
      brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
    });
    const consumer = kafka.consumer({ groupId: "mail-group-service" });
    await consumer.connect();

    const topicName = "send-mail";
    await consumer.subscribe({ topic: topicName, fromBeginning: false });

    console.log(
      "[mail-service] Mail service consumer đã khởi động, đang lắng nghe gửi mail]",
    );

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { to, subject, html } = JSON.parse(
            message.value?.toString() || "{}",
          );

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "crissiiu.dev@gmail.com",
              pass: "oucgojlbceplkqgr",
            },
          });

          await transporter.sendMail({
            from: "Hireheaven <no-reply>",
            to,
            subject,
            html,
          });

          console.log(`[mail-service] Mail đã được gửi tới ${to}`);
        } catch (error) {
          console.log(`[error] [mail-service] Lỗi trong quá trình gửi mail`);
        }
      },
    });
  } catch (error) {
    console.log(
      `[error] [mail-service] Khởi động Kafka Consumer bị lỗi`,
      error,
    );
  }
};
