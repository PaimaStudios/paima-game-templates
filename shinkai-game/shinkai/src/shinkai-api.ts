import {
  decryptMessageWithPassphrase,
  generateEncryptionKeys,
  generateSignatureKeys,
  ShinkaiMessageBuilder,
} from '@shinkai_protocol/shinkai-typescript-lib';
import axios from 'axios';
import type {
  ShinakiKey,
  ShinkaiJobCreation,
  ShinkaiMessageBody,
  ShinkaiMessageResponse,
  ShinkaiPostMessageResponse,
} from './interfaces/shinkai-api-responses';

enum ShinkaiAPIPath {
  health = '/v1/shinkai_health',
  registration = '/v1/use_registration_code',
  create_job = '/v1/create_job',
  job_message = '/v1/job_message',
  get_last_messages = '/v1/last_messages_from_inbox',
}

/*
 * This class is helper to connect a Shinkai Node though the API
 */
export class ShinkaiAPI {
  /* These values are read from the .env file */
  private nodeURL: string;
  private encryptionSk!: Uint8Array;
  private signatureSk!: Uint8Array;
  private receiverPublicKey!: Uint8Array;
  private sender!: { name: string; subidentity: string };
  private receiver!: { name: string; subidentity: string };

  constructor() {
    this.nodeURL = process.env.SHINKAI_URL!;
  }

  async init() {
    const arrayFromHex = (i: string) => new Uint8Array(Buffer.from(i, 'hex'));

    const keys: ShinakiKey = JSON.parse(
      (await decryptMessageWithPassphrase(
        process.env.SHINKAI_KEY ?? '',
        process.env.SHINKAI_PASSPHRASE ?? ''
      )) || ''
    );
    this.encryptionSk = arrayFromHex(keys.profile_encryption_sk);
    this.signatureSk = arrayFromHex(keys.profile_identity_sk);
    this.receiverPublicKey = arrayFromHex(keys.node_encryption_pk);
    this.sender = {
      name: keys.shinkai_identity,
      subidentity: keys.profile,
    };
    this.receiver = {
      name: keys.shinkai_identity,
      subidentity: process.env.SHINKAI_RECEIVER_SUBIDENTITY ?? '',
    };
    return this;
  }

  /* Helper function that creates a new job, posts a message, and waits for the answer */
  async askQuestion(question: string): Promise<{ question: string; response: string }> {
    if (!this.sender) throw new Error('call init first');

    const job = await this.createJob();
    const receipt = await this.sendMessageToJob(job.data, question);
    const wait = (n: number) => new Promise(resolve => setTimeout(resolve, n));
    let post: ShinkaiMessageBody[] = [];
    while (post.length <= 1) {
      post = (await this.getMessagesFromInbox(receipt.data.inbox)).data;
      await wait(1000);
    }

    return {
      question,
      response: post[post.length - 1].content,
    };
  }

  /* Check if Shinkai Node "is pristine" */
  async isNodePristine(): Promise<boolean> {
    try {
      const data = await this.getData<{
        is_pristine: boolean;
        node_name: string;
        status: 'ok';
        version: string;
      }>(ShinkaiAPIPath.health);
      console.log('Shinkai Node Status:', data);
      return data.is_pristine;
    } catch (error) {
      console.error('Error checking node health:', error);
      throw new Error('Failed to check if the node is pristine.');
    }
  }

  /* Create new Profile */
  async registerProfile(registrationName: string) {
    // First, check if the node is pristine
    const pristine = await this.isNodePristine();
    if (!pristine) {
      console.log('Node is not pristine. Registration may not be allowed.');
      return;
    }

    // Generate encryption and signature keys
    // We are going to use the same keys for both the device and the profile
    const encryptionKeys = await generateEncryptionKeys();
    const signatureKeys = await generateSignatureKeys();

    // Convert hex strings to Uint8Array
    const myDeviceEncryptionSk = new Uint8Array(
      Buffer.from(encryptionKeys.my_encryption_sk_string, 'hex')
    );
    const myDeviceSignatureSk = new Uint8Array(
      Buffer.from(signatureKeys.my_identity_sk_string, 'hex')
    );
    // For registration, the profile's encryption and signature keys can be the same as the device's
    const profileEncryptionSk = myDeviceEncryptionSk;
    const profileSignatureSk = myDeviceSignatureSk;

    // Construct the registration message
    const message = await ShinkaiMessageBuilder.initialRegistrationWithNoCodeForDevice(
      myDeviceEncryptionSk,
      myDeviceSignatureSk,
      profileEncryptionSk,
      profileSignatureSk,
      registrationName, // Device registration name, e.g., 'main_device'
      this.sender.subidentity,
      this.sender.name, // Sender identifier
      this.receiver.name // Receiver identifier
    );

    console.log({
      myDeviceEncryptionSk,
      myDeviceSignatureSk,
      profileEncryptionSk,
      profileSignatureSk,
    });

    const resp = await this.postData<{
      status: string;
      data: {
        encryption_public_key: string;
        identity_public_key: string;
        message: string;
        node_name: string;
      };
    }>(message, ShinkaiAPIPath.registration);

    // Check response status and return data or throw an error
    if (resp.status === 'success') {
      console.log('Registration successful:', resp.data);
      return resp.data;
    } else {
      console.error('Registration failed:', resp);
      throw new Error(`Registration failed: ${JSON.stringify(resp)}`);
    }
  }

  /* Create new Job */
  async createJob(): Promise<ShinkaiJobCreation> {
    if (!this.sender) throw new Error('call init first');

    // Construct the job creation message
    const data = {
      local_vrkai: [],
      local_vrpack: [],
      vector_fs_items: [],
      vector_fs_folders: [],
      network_folders: [],
    };
    const jobCreationMessage = await ShinkaiMessageBuilder.jobCreation(
      data as any,
      this.encryptionSk,
      this.signatureSk,
      this.receiverPublicKey,
      this.sender.name,
      this.sender.subidentity,
      this.receiver.name,
      this.receiver.subidentity
    );

    const response = await this.postData<ShinkaiJobCreation>(
      jobCreationMessage,
      ShinkaiAPIPath.create_job
    );
    return response;
  }

  /* Send message to Job */
  async sendMessageToJob(
    jobId: string,
    messageContent: string
  ): Promise<ShinkaiPostMessageResponse> {
    if (!this.sender) throw new Error('call init first');

    // Construct the message to send to the job
    const message = await ShinkaiMessageBuilder.jobMessage(
      jobId,
      messageContent,
      '', // Optional files inbox
      '', // Optional parent message
      this.encryptionSk,
      this.signatureSk,
      this.receiverPublicKey,
      this.sender.name,
      this.sender.subidentity,
      this.receiver.name,
      this.receiver.subidentity
    );

    const response = await this.postData<ShinkaiPostMessageResponse>(
      message,
      ShinkaiAPIPath.job_message
    );
    return response;
  }

  /* Get last message from inbox */
  async getMessagesFromInbox(
    inbox: string,
    count = 10,
    offset: string | null = null
  ): Promise<{ data: ShinkaiMessageBody[] }> {
    if (!this.sender) throw new Error('call init first');

    const message = await ShinkaiMessageBuilder.getLastMessagesFromInbox(
      this.encryptionSk,
      this.signatureSk,
      this.receiverPublicKey,
      inbox,
      count,
      offset,
      this.sender.subidentity,
      this.sender.name,
      this.receiver.name
    );

    // Assuming `postData` is a function to send the message to a Shinkai node and fetch the response
    const response = await this.postData<ShinkaiMessageResponse>(
      message,
      ShinkaiAPIPath.get_last_messages
    );
    const data: ShinkaiMessageBody[] = response.data.map(d => {
      const raw = d.body.unencrypted.message_data.unencrypted.message_raw_content;
      return JSON.parse(raw);
    });

    return { data };
  }

  private async postData<T>(data: any, path: ShinkaiAPIPath): Promise<T> {
    const response = await axios<T>({
      url: `${this.nodeURL}${path}`,
      method: 'post',
      data,
    });
    return response.data;
  }

  private async getData<T>(path: ShinkaiAPIPath): Promise<T> {
    const response = await axios<T>({
      url: `${this.nodeURL}${path}`,
      method: 'get',
    });
    return response.data;
  }
}
