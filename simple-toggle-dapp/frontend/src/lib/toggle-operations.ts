import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './constants';

export type NetworkType = 'mainnet' | 'testnet';

export async function getToggleValue(network: NetworkType): Promise<boolean> {
  const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  const apiUrl = stacksNetwork.coreApiUrl || 'https://api.stacks.co';

  try {
    const response = await fetch(
      `${apiUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-flag`,
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
      // For this example we assume the API returns a decoded boolean `value`
      return Boolean(data.result?.value);
    } else {
      // Fallback: try local devnet
      try {
        const devnetResponse = await fetch(
          `http://localhost:3999/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-flag`,
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
          return Boolean(devnetData.result?.value);
        }
      } catch (e) {
        // Ignore devnet error
      }
      throw new Error('Failed to fetch toggle value');
    }
  } catch (error) {
    console.error('Error loading toggle value:', error);
    throw error;
  }
}


