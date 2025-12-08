import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './constants';

export type NetworkType = 'mainnet' | 'testnet';

async function callRead(network: NetworkType, functionName: string): Promise<string> {
  const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  const apiUrl = stacksNetwork.coreApiUrl || 'https://api.stacks.co';

  const body = JSON.stringify({
    sender: CONTRACT_ADDRESS,
    arguments: [],
  });

  const makeRequest = async (baseUrl: string) => {
    const res = await fetch(
      `${baseUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/${functionName}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }
    );
    if (!res.ok) {
      throw new Error('Request failed');
    }
    const data = await res.json();
    return data.result?.value || '0';
  };

  try {
    return await makeRequest(apiUrl);
  } catch {
    // Fallback to local devnet
    return await makeRequest('http://localhost:3999');
  }
}

export async function getYesVotes(network: NetworkType): Promise<string> {
  return callRead(network, 'get-yes-votes');
}

export async function getNoVotes(network: NetworkType): Promise<string> {
  return callRead(network, 'get-no-votes');
}


