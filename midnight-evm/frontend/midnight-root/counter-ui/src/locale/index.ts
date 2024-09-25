export const INITIALIZE_PAGE = {
  deploy: 'Deploy new contract',
  joinAddress: 'Contract address to join',
  participants: 'Contract participants',
  join: 'Join',
  title:
    'Please provide a contract address to join one or provide a participants list (space separated github usernames) to deploy your own contract',
};

export const WELCOME_PAGE = {
  participant: 'Participant to add',
  organizer: 'Organizer to add',
  add: 'Add',
  title: (isAdded: boolean) =>
    isAdded
      ? `You are an organizer of the Midnight welcome contract. Please provide a new organizer or participant that you would like to add`
      : `You are not yet an organizer of the Midnight welcome contract. Give your public key to an organizer so they can add you.`,
  address: (contractAddress: string) => `Contract address: ${contractAddress}`,
  publicKey: (hexKey: string) => `Public key: ${hexKey}`,
};

export const MISC = {
  yes: 'Yes',
  no: 'No',
  pleaseWait: 'Please wait',
};
