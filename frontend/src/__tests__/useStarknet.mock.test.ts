import { renderHook, act } from '@testing-library/react-hooks';
import { useStarknet } from '../hooks/useStarknet';

describe('useStarknet (mock)', () => {
  it('returns mock account and contract in dev mode', () => {
    const { result } = renderHook(() => useStarknet());
    expect(result.current.account).toBeDefined();
    expect(result.current.account).toMatch(/^0x[a-fA-F0-9]{8,}/);
    expect(result.current.contract).toBeDefined();
    expect(typeof result.current.connectWallet).toBe('function');
    expect(typeof result.current.disconnectWallet).toBe('function');
  });

  it('simulates connect/disconnect events', async () => {
    const { result } = renderHook(() => useStarknet());
    await act(async () => {
      await result.current.connectWallet();
    });
    expect(result.current.account).toBeDefined();
    await act(async () => {
      await result.current.disconnectWallet();
    });
    expect(result.current.account).toBeNull();
  });
});
