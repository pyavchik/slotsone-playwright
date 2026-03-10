/** Shared mock data factories for API response mocking. */

export const MOCK_GAME_CONFIG = {
  reels: 5,
  rows: 3,
  paylines: 20,
  currencies: ['USD'],
  min_bet: 0.1,
  max_bet: 100,
  min_lines: 1,
  max_lines: 20,
  default_lines: 20,
  line_defs: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
    [2, 2, 2, 2, 2],
    [1, 0, 0, 0, 1],
    [1, 2, 2, 2, 1],
  ],
  bet_levels: [0.1, 0.2, 0.5, 1, 2, 5, 10],
  paytable_url: '',
  paytable: {
    line_wins: [
      { symbol: 'Star', x3: 0.5, x4: 2, x5: 10 },
      { symbol: 'A', x3: 0.5, x4: 1.5, x5: 5 },
    ],
    scatter: {
      symbol: 'Scatter',
      awards: [
        { count: 3, free_spins: 5 },
        { count: 4, free_spins: 10 },
      ],
    },
    wild: {
      symbol: 'Wild',
      substitutes_for: ['10', 'J', 'Q', 'K', 'A', 'Star'],
    },
  },
  rules_url: '',
  rtp: 96.5,
  volatility: 'high',
  features: ['free_spins', 'multipliers', 'scatter'],
};

export function makeGameInitResponse(overrides: Record<string, unknown> = {}) {
  return {
    session_id: 'sess_e2e_1',
    game_id: 'slot_mega_fortune_001',
    config: MOCK_GAME_CONFIG,
    balance: { amount: 1000, currency: 'USD' },
    expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    ...overrides,
  };
}

export function makeSpinResponse(overrides: Record<string, unknown> = {}) {
  return {
    spin_id: 'spin_e2e_1',
    session_id: 'sess_e2e_1',
    game_id: 'slot_mega_fortune_001',
    balance: { amount: 999.8, currency: 'USD' },
    bet: { amount: 0.2, currency: 'USD', lines: 20 },
    outcome: {
      reel_matrix: [
        ['A', 'Q', '10'],
        ['A', 'K', 'J'],
        ['A', 'Wild', 'Q'],
        ['10', 'K', 'J'],
        ['Q', 'J', '10'],
      ],
      win: {
        amount: 0.2,
        currency: 'USD',
        breakdown: [
          { type: 'line', line_index: 0, symbol: 'A', count: 3, payout: 0.2 },
        ],
      },
      bonus_triggered: null,
    },
    next_state: 'base_game',
    timestamp: Date.now(),
    ...overrides,
  };
}

export function makeNoWinSpinResponse(overrides: Record<string, unknown> = {}) {
  return {
    spin_id: 'spin_e2e_nowin',
    session_id: 'sess_e2e_1',
    game_id: 'slot_mega_fortune_001',
    balance: { amount: 999.8, currency: 'USD' },
    bet: { amount: 0.2, currency: 'USD', lines: 20 },
    outcome: {
      reel_matrix: [
        ['A', 'Q', '10'],
        ['K', 'J', 'Star'],
        ['10', 'Wild', 'Q'],
        ['J', 'K', 'A'],
        ['Q', 'J', '10'],
      ],
      win: {
        amount: 0,
        currency: 'USD',
        breakdown: [],
      },
      bonus_triggered: null,
    },
    next_state: 'base_game',
    timestamp: Date.now(),
    ...overrides,
  };
}

export function makeAuthTokenResponse() {
  return {
    access_token: 'e2e_mock_access_token',
    expires_in: 3600,
  };
}
