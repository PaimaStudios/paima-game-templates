export interface ShinkaiPostMessageResponse {
  status: string;
  message: string;
  data: {
    message_id: string;
    parent_message_id: string;
    inbox: string;
    scheduled_time: Date;
  };
}

export interface ShinkaiMessageBody {
  job_id: string;
  content: string;
  files_inbox: string;
  parent: null | string;
  workflow?: null;
}

export interface ShinkaiJobCreation {
  data: string;
  status: string;
}

export interface ShinkaiMessageResponse {
  data: Datum[];
  status: string;
}

interface Datum {
  body: Body;
  encryption: string;
  external_metadata: ExternalMetadata;
  version: string;
}

interface Body {
  unencrypted: BodyUnencrypted;
}

interface BodyUnencrypted {
  internal_metadata: InternalMetadata;
  message_data: MessageData;
}

interface InternalMetadata {
  encryption: string;
  inbox: string;
  node_api_data: NodeAPIData;
  recipient_subidentity: string;
  sender_subidentity: string;
  signature: string;
}

interface NodeAPIData {
  node_message_hash: string;
  node_timestamp: Date;
  parent_hash: string;
}

interface MessageData {
  unencrypted: MessageDataUnencrypted;
}

interface MessageDataUnencrypted {
  message_content_schema: string;
  message_raw_content: string;
}

interface ExternalMetadata {
  intra_sender: string;
  other: string;
  recipient: string;
  scheduled_time: Date;
  sender: string;
  signature: string;
}
