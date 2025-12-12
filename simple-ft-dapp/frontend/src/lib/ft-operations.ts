import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './constants';

export type NetworkType = 'mainnet' | 'testnet';

export async function getBalance(network: NetworkType, owner: string): Promise<string> {
  const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  const apiUrl = stacksNetwork.coreApiUrl || 'https://api.stacks.co';

  const body = JSON.stringify({
    sender: CONTRACT_ADDRESS,
    arguments: [`0x${Buffer.from(`'${owner}`).toString('hex')}`],
  });

  const makeRequest = async (baseUrl: string) => {
    const res = await fetch(
      `${baseUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-balance`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      }
    );
    if (!res.ok) throw new Error('Request failed');
    const data = await res.json();
    return data.result?.value || '0';
  };

  try {
    return await makeRequest(apiUrl);
  } catch {
    return await makeRequest('http://localhost:3999');
  }
}


