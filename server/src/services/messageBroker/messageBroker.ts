import { singleton } from '../../decorators/singleton';
import { KafkaService } from './kafka';

@singleton
export class MessageBrokerService {
    private messageBrokerType: string = '';
    private messageBroker: any;

    constructor(messageBrokerType?: string) {
        switch (messageBrokerType) {
            default: {
                this.messageBroker = new KafkaService();
            }
        }
    }

    public async init(): Promise<any> {
        return await this.messageBroker.init();
    }

    public async subscribe(topic: string): Promise<any> {
        return await this.messageBroker.subscribe(topic);
    }

    public async publish(topic: string, message: any): Promise<void> {
        return await this.messageBroker.publish(topic, message);
    }

    public async disconnect(): Promise<void> {
        return await this.messageBroker.disconnect();
    }
}