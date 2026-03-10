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

/** Nice win: 3x-8x bet multiplier (store default bet = 1) */
export function makeNiceWinSpinResponse(bet = 1) {
  const winAmount = bet * 5; // 5x multiplier
  return makeSpinResponse({
    balance: { amount: 1000 - bet + winAmount, currency: 'USD' },
    bet: { amount: bet, currency: 'USD', lines: 20 },
    outcome: {
      reel_matrix: [
        ['Star', 'Q', '10'],
        ['Star', 'K', 'J'],
        ['Star', 'Wild', 'Q'],
        ['Star', 'K', 'J'],
        ['Star', 'J', '10'],
      ],
      win: {
        amount: winAmount,
        currency: 'USD',
        breakdown: [
          { type: 'line', line_index: 0, symbol: 'Star', count: 5, payout: winAmount },
        ],
      },
      bonus_triggered: null,
    },
  });
}

/** Big win: 8x-18x bet multiplier (store default bet = 1) */
export function makeBigWinSpinResponse(bet = 1) {
  const winAmount = bet * 12; // 12x multiplier
  return makeSpinResponse({
    balance: { amount: 1000 - bet + winAmount, currency: 'USD' },
    bet: { amount: bet, currency: 'USD', lines: 20 },
    outcome: {
      reel_matrix: [
        ['Wild', 'Star', 'A'],
        ['Wild', 'Star', 'K'],
        ['Wild', 'Star', 'Q'],
        ['Wild', 'Star', 'J'],
        ['Wild', 'Star', '10'],
      ],
      win: {
        amount: winAmount,
        currency: 'USD',
        breakdown: [
          { type: 'line', line_index: 0, symbol: 'Wild', count: 5, payout: winAmount * 0.6 },
          { type: 'line', line_index: 1, symbol: 'Star', count: 5, payout: winAmount * 0.4 },
        ],
      },
      bonus_triggered: null,
    },
  });
}

/** Mega win: 18x-40x bet multiplier (store default bet = 1) */
export function makeMegaWinSpinResponse(bet = 1) {
  const winAmount = bet * 25; // 25x multiplier
  return makeSpinResponse({
    balance: { amount: 1000 - bet + winAmount, currency: 'USD' },
    bet: { amount: bet, currency: 'USD', lines: 20 },
    outcome: {
      reel_matrix: [
        ['Wild', 'Wild', 'Wild'],
        ['Wild', 'Wild', 'Wild'],
        ['Wild', 'Wild', 'Wild'],
        ['Wild', 'Star', 'Wild'],
        ['Wild', 'Wild', 'Wild'],
      ],
      win: {
        amount: winAmount,
        currency: 'USD',
        breakdown: [
          { type: 'line', line_index: 0, symbol: 'Wild', count: 5, payout: winAmount },
        ],
      },
      bonus_triggered: null,
    },
  });
}

/** Ultra win: 40x+ bet multiplier (store default bet = 1) */
export function makeUltraWinSpinResponse(bet = 1) {
  const winAmount = bet * 50; // 50x multiplier
  return makeSpinResponse({
    balance: { amount: 1000 - bet + winAmount, currency: 'USD' },
    bet: { amount: bet, currency: 'USD', lines: 20 },
    outcome: {
      reel_matrix: [
        ['Wild', 'Wild', 'Wild'],
        ['Wild', 'Wild', 'Wild'],
        ['Wild', 'Wild', 'Wild'],
        ['Wild', 'Wild', 'Wild'],
        ['Wild', 'Wild', 'Wild'],
      ],
      win: {
        amount: winAmount,
        currency: 'USD',
        breakdown: [
          { type: 'line', line_index: 0, symbol: 'Wild', count: 5, payout: winAmount },
        ],
      },
      bonus_triggered: null,
    },
  });
}

// ── Roulette ────────────────────────────────────────────────────────────

export function makeRouletteInitResponse(overrides: Record<string, unknown> = {}) {
  return {
    session_id: 'rsess_e2e_1',
    game_id: 'european_roulette_001',
    balance: { amount: 1000, currency: 'USD' },
    config: {
      game_id: 'european_roulette_001',
      type: 'roulette' as const,
      variant: 'european' as const,
      numbers: 37,
      min_bet: 1,
      max_total_bet: 1000,
      bet_levels: [1, 5, 10, 25, 50, 100],
      bet_types: {
        straight: { payout: 35, size: 1, maxBet: 500 },
        split: { payout: 17, size: 2, maxBet: 500 },
        street: { payout: 11, size: 3, maxBet: 500 },
        corner: { payout: 8, size: 4, maxBet: 500 },
        line: { payout: 5, size: 6, maxBet: 500 },
        dozen: { payout: 2, size: 12, maxBet: 500 },
        column: { payout: 2, size: 12, maxBet: 500 },
        even_odd: { payout: 1, size: 18, maxBet: 500 },
        red_black: { payout: 1, size: 18, maxBet: 500 },
        high_low: { payout: 1, size: 18, maxBet: 500 },
      },
      currencies: ['USD'],
      rtp: 97.3,
      features: ['la_partage'],
      wheel_order: [
        0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
        24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
      ],
      number_colors: {
        '0': 'green',
        '1': 'red', '2': 'black', '3': 'red', '4': 'black', '5': 'red', '6': 'black',
        '7': 'red', '8': 'black', '9': 'red', '10': 'black', '11': 'black', '12': 'red',
        '13': 'black', '14': 'red', '15': 'black', '16': 'red', '17': 'black', '18': 'red',
        '19': 'red', '20': 'black', '21': 'red', '22': 'black', '23': 'red', '24': 'black',
        '25': 'red', '26': 'black', '27': 'red', '28': 'black', '29': 'black', '30': 'red',
        '31': 'black', '32': 'red', '33': 'black', '34': 'red', '35': 'black', '36': 'red',
      },
    },
    recent_numbers: [],
    expires_at: new Date(Date.now() + 3600_000).toISOString(),
    ...overrides,
  };
}

export function makeRouletteSpinResponse(overrides: Record<string, unknown> = {}) {
  return {
    spin_id: 'rspin_e2e_1',
    session_id: 'rsess_e2e_1',
    game_id: 'european_roulette_001',
    balance: { amount: 1035, currency: 'USD' },
    outcome: {
      winning_number: 17,
      bet_breakdown: [
        {
          bet_type: 'straight',
          numbers: [17],
          bet_amount: 1,
          payout: 36,
          won: true,
          la_partage: false,
        },
      ],
      total_bet: 1,
      total_return: 36,
      win: {
        amount: 35,
        currency: 'USD',
        breakdown: [
          { bet_type: 'straight', numbers: [17], bet_amount: 1, payout: 36, won: true },
        ],
      },
    },
    timestamp: Date.now(),
    ...overrides,
  };
}

export function makeAmericanRouletteInitResponse(overrides: Record<string, unknown> = {}) {
  return {
    session_id: 'arsess_e2e_1',
    game_id: 'american_roulette_001',
    balance: { amount: 1000, currency: 'USD' },
    config: {
      type: 'american',
      min_bet: 1,
      max_bet: 500,
      table_limit: 1000,
      chip_values: [1, 5, 10, 25, 100, 500],
    },
    expires_at: new Date(Date.now() + 3600_000).toISOString(),
    ...overrides,
  };
}

export function makeAmericanRouletteSpinResponse(overrides: Record<string, unknown> = {}) {
  return {
    spin_id: 'arspin_e2e_1',
    session_id: 'arsess_e2e_1',
    game_id: 'american_roulette_001',
    balance: { amount: 999, currency: 'USD' },
    outcome: {
      winning_number: 0,
      winning_color: 'green',
      wheel_position: 0,
      win: {
        amount: 0,
        currency: 'USD',
        breakdown: [],
      },
      total_bet: 1,
      total_return: 0,
    },
    timestamp: Date.now(),
    ...overrides,
  };
}

// ── History ─────────────────────────────────────────────────────────────

export function makeHistoryResponse(overrides: Record<string, unknown> = {}) {
  const items = Array.from({ length: 5 }, (_, i) => ({
    spin_id: `spin_hist_${i + 1}`,
    timestamp: Date.now() - i * 60_000,
    bet: { amount: 1, lines: 20 },
    outcome: {
      win: { amount: i % 2 === 0 ? 2.5 : 0 },
      bonus_triggered: i === 2,
    },
  }));

  return {
    items,
    total: 25,
    summary: {
      total_rounds: 25,
      total_wagered: 25,
      total_won: 18.5,
      net_result: -6.5,
      biggest_win: 12,
    },
    ...overrides,
  };
}

export function makeRoundDetailResponse(overrides: Record<string, unknown> = {}) {
  return {
    round: {
      id: 'spin_hist_1',
      created_at: new Date().toISOString(),
      bet: 1,
      win: 2.5,
      balance_before: 100,
      balance_after: 101.5,
      lines: 20,
      reel_matrix: [
        ['A', 'Q', '10'],
        ['A', 'K', 'J'],
        ['A', 'Wild', 'Q'],
        ['10', 'K', 'J'],
        ['Q', 'J', '10'],
      ],
      win_breakdown: [
        { type: 'line', line_index: 0, symbol: 'A', count: 3, payout: 2.5 },
      ],
    },
    provably_fair: {
      server_seed_hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2',
      server_seed: 'revealed_seed_value_123',
      client_seed: 'client_seed_abc',
      nonce: 42,
      revealed: true,
    },
    transactions: [
      { id: 'txn_1', type: 'bet', amount: -1, balance_after: 99 },
      { id: 'txn_2', type: 'win', amount: 2.5, balance_after: 101.5 },
    ],
    ...overrides,
  };
}

export function makeAuthTokenResponse() {
  return {
    access_token: 'e2e_mock_access_token',
    expires_in: 3600,
  };
}
