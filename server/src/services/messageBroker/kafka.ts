import { Kafka } from 'kafkajs';
import { singleton } from '../../decorators/singleton';

@singleton
export class KafkaService {
  private connection;
  private producer;
  private consumer;

  constructor() { 
    this.init();
  }

  /**
   * init - creates new connection to kafka if there is no connection for some reason
   */
  public init() {
    try {
      if (!this.connection) {
        console.log('Register kafka');
        this.connection = new Kafka({
          clientId: 'jeeng',
          brokers: ['kafka:9092'],
        })
      }

      this.producer = this.connection.producer();
      this.consumer = this.connection.consumer({ groupId: 'jeeng' });

    } catch (kafkaConnectionError) {
      console.log('kafkaConnectionError ', kafkaConnectionError);
    }
  }


  /**
   * publish - send message to kafka according topic
   */
  public async publish(topic: string, message: any): Promise<void> {
    try {
      if (this.connection) {
        await this.producer.connect()
        await this.producer.send({
          topic: topic,
          messages: [
            message
          ],
        })
      }

    } catch (publishError) {
      console.log('publishError ', publishError);
    }
  }


  /**
   * subscribe - listens to messages.
   */
  public async subscribe(topic: string) {
    try {
      if (this.connection) {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: topic, fromBeginning: true });
        await this.consumer.run({
          eachBatchAutoResolve: true,
          eachBatch: async ({
            batch,
            resolveOffset,
            heartbeat,
            isRunning,
            isStale,
          }) => {
            for (let message of batch.messages) {
              if (!isRunning() || isStale()) break // shut down the consumer without losing any messages.
              console.log('message ', message.value.toString());
              resolveOffset(message.offset) // make sure we pull only relevant message
              await heartbeat()
            }
          },
        })
      }
    } catch (subscribeError) {
      console.log('subscribeError ', subscribeError.stack);
    }
  }


  /**
  * disconnect - disconnect kafka
  */
  public async disconnect() {
    try {
      await this.consumer.disconnect()
      await this.producer.disconnect();
    } catch (disconnectError) {
      console.log('disconnectError ', disconnectError.stack);
    }
  }
}
