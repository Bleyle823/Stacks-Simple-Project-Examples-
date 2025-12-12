import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './constants';

export type NetworkType = 'mainnet' | 'testnet';

export async function getOwnerValue(network: NetworkType): Promise<string> {
  const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  const apiUrl = stacksNetwork.coreApiUrl || 'https://api.stacks.co';

  try {
    const response = await fetch(
      `${apiUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-owner`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: CONTRACT_ADDRESS,
          arguments: [],
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      // For this example, assume the API returns a decoded principal string under `value`
      return data.result?.value || '';
    } else {
      // Fallback: try local devnet
      try {
        const devnetResponse = await fetch(
          `http://localhost:3999/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-owner`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sender: CONTRACT_ADDRESS,
              arguments: [],
            }),
          }
        );
        if (devnetResponse.ok) {
          const devnetData = await devnetResponse.json();
          return devnetData.result?.value || '';
        }
      } catch (e) {
        // Ignore devnet error
      }
      throw new Error('Failed to fetch owner value');
    }
  } catch (error) {
    console.error('Error loading owner:', error);
    throw error;
  }
}


