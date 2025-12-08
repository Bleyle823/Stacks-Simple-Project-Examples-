import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { CONTRACT_ADDRESS, CONTRACT_NAME } from './constants';

export type NetworkType = 'mainnet' | 'testnet';

export async function getTotalLiquidity(network: NetworkType): Promise<string> {
  const stacksNetwork = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  const apiUrl = stacksNetwork.coreApiUrl || 'https://api.stacks.co';

  try {
    const response = await fetch(
      `${apiUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-total-liquidity`,
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
      return data.result?.value || '0';
    } else {
      // Fallback: try local devnet
      try {
        const devnetResponse = await fetch(
          `http://localhost:3999/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-total-liquidity`,
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
          return devnetData.result?.value || '0';
        }
      } catch (e) {
        // Ignore devnet error
      }
      throw new Error('Failed to fetch total liquidity');
    }
  } catch (error) {
    console.error('Error loading total liquidity:', error);
    throw error;
  }
}


