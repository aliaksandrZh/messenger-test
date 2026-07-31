import { SheriffConfig } from '@softarc/sheriff-core';

export const sheriffConfig: SheriffConfig = {
  version: 1,

  tagging: {
    'src/app/features/<feature>': ['feature:<feature>'],
    'src/app/domain/<domain>': ['domain:<domain>'],
    'src/app/shared': ['shared'],
    'src/app/core': ['core'],
  },

  depRules: {
    // Features can import shared, domain, core — but NEVER other features
    'feature:*': ['shared', 'domain:*', 'core'],

    // Domain can import shared and core — but never features
    'domain:*': ['shared', 'core'],

    // Shared can import core only
    shared: ['core'],

    // Core is self-contained
    core: [],

    // Root app files can import anything
    root: ['feature:*', 'domain:*', 'shared', 'core'],
  },
};
