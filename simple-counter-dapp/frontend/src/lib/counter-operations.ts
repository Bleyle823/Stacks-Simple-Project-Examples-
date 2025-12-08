import { CONTRACT_ADDRESS, CONTRACT_NAME } from './constants';
import { Network } from './network';

export async function getCounterValue(network: Network | null): Promise<string> {
  if (!network) {
    throw new Error('Network not set');
  }

  try {
    const apiUrl =
      network === 'mainnet'
        ? 'https://api.stacks.co'
        : network === 'testnet'
          ? 'https://api.testnet.stacks.co'
          : 'http://localhost:3999';

    const response = await fetch(
      `${apiUrl}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-counter`,
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
      throw new Error('Failed to fetch counter value');
    }
  } catch (error) {
    console.error('Error loading counter:', error);
    throw error;
  }
}

