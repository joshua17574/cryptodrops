import { db } from './db.js';
import { airdrops } from './schema.js';

const existingAirdrops = [
  {
    name: "LayerZero",
    description: "Omnichain interoperability protocol enabling seamless communication between different blockchains",
    blockchain: "Ethereum",
    type: "retroactive",
    status: "active",
    verified: true,
    logo: "🌉",
    website: "https://layerzero.network",
    twitter: "https://twitter.com/LayerZero_Labs",
    discord: "https://discord.gg/layerzero",
    telegram: "https://t.me/layerzeroprotocol",
    totalValue: "$100,000,000",
    estimatedReward: "$500-$2000",
    participants: 850000,
    difficulty: "medium",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    requirements: [
      "Bridge assets between different chains using LayerZero",
      "Use multiple chains (minimum 5 different networks)",
      "Make transactions worth over $1000 total volume",
      "Use the protocol consistently over multiple months",
      "Interact with LayerZero-powered applications"
    ],
    category: "DeFi",
    featured: true
  },
  {
    name: "zkSync Era",
    description: "Ethereum Layer 2 scaling solution using zero-knowledge rollup technology",
    blockchain: "Ethereum",
    type: "retroactive",
    status: "active",
    verified: true,
    logo: "⚡",
    website: "https://zksync.io",
    twitter: "https://twitter.com/zksync",
    discord: "https://discord.gg/zksync",
    telegram: "https://t.me/zksync",
    totalValue: "$300,000,000",
    estimatedReward: "$300-$1500",
    participants: 1200000,
    difficulty: "easy",
    startDate: "2024-01-01",
    endDate: "2024-11-30",
    requirements: [
      "Bridge ETH to zkSync Era",
      "Make swaps on native DEXes",
      "Provide liquidity to zkSync Era pools",
      "Use zkSync Era for NFT transactions",
      "Hold funds on zkSync Era for extended periods"
    ],
    category: "Layer 2",
    featured: true
  },
  {
    name: "Scroll",
    description: "zkEVM Layer 2 solution for Ethereum bringing EVM compatibility with zero-knowledge proofs",
    blockchain: "Ethereum",
    type: "retroactive",
    status: "active",
    verified: true,
    logo: "📜",
    website: "https://scroll.io",
    twitter: "https://twitter.com/Scroll_ZKP",
    discord: "https://discord.gg/scroll",
    telegram: "https://t.me/scrollzkp",
    totalValue: "$200,000,000",
    estimatedReward: "$200-$1000",
    participants: 900000,
    difficulty: "easy",
    startDate: "2024-01-15",
    endDate: "2024-12-15",
    requirements: [
      "Bridge assets to Scroll network",
      "Interact with Scroll DeFi protocols",
      "Make regular transactions on Scroll",
      "Participate in Scroll testnet activities",
      "Provide liquidity on Scroll DEXes"
    ],
    category: "Layer 2",
    featured: true
  },
  {
    name: "StarkNet",
    description: "Cairo-based ZK-Rollup bringing scalability to Ethereum with verifiable computation",
    blockchain: "Ethereum",
    type: "retroactive",
    status: "active",
    verified: true,
    logo: "🔷",
    website: "https://starknet.io",
    twitter: "https://twitter.com/StarkNetFndn",
    discord: "https://discord.gg/starknet",
    telegram: "https://t.me/starknet",
    totalValue: "$150,000,000",
    estimatedReward: "$400-$1200",
    participants: 750000,
    difficulty: "medium",
    startDate: "2024-02-01",
    endDate: "2024-12-20",
    requirements: [
      "Deploy and interact with smart contracts",
      "Bridge ETH to StarkNet",
      "Use DeFi protocols on StarkNet",
      "Participate in testnet campaigns",
      "Hold assets on StarkNet"
    ],
    category: "Layer 2",
    featured: true
  },
  {
    name: "Celestia",
    description: "First modular blockchain network enabling anyone to easily deploy their own blockchain",
    blockchain: "Cosmos",
    type: "testnet",
    status: "active",
    verified: true,
    logo: "🌌",
    website: "https://celestia.org",
    twitter: "https://twitter.com/CelestiaOrg",
    discord: "https://discord.gg/celestia",
    telegram: "https://t.me/celestiaorg",
    totalValue: "$80,000,000",
    estimatedReward: "$300-$800",
    participants: 450000,
    difficulty: "medium",
    startDate: "2024-01-20",
    endDate: "2024-11-15",
    requirements: [
      "Run a light node on testnet",
      "Deploy rollups on Celestia",
      "Participate in community activities",
      "Complete testnet tasks",
      "Join developer community"
    ],
    category: "Testnet",
    featured: true
  },
  {
    name: "Arbitrum Odyssey",
    description: "NFT-based exploration campaign for Arbitrum Layer 2 ecosystem",
    blockchain: "Arbitrum",
    type: "social",
    status: "active",
    verified: true,
    logo: "🚀",
    website: "https://arbitrum.io",
    twitter: "https://twitter.com/arbitrum",
    discord: "https://discord.gg/arbitrum",
    telegram: "https://t.me/arbitrum",
    totalValue: "$50,000,000",
    estimatedReward: "$100-$500",
    participants: 1500000,
    difficulty: "easy",
    startDate: "2024-03-01",
    endDate: "2024-10-31",
    requirements: [
      "Complete weekly tasks on Arbitrum",
      "Use various DeFi protocols",
      "Collect NFT badges",
      "Bridge assets to Arbitrum",
      "Interact with partner protocols"
    ],
    category: "Social",
    featured: false
  },
  {
    name: "Polyhedra ZK",
    description: "Zero-knowledge infrastructure providing cross-chain interoperability solutions",
    blockchain: "Multi-chain",
    type: "retroactive",
    status: "active",
    verified: true,
    logo: "🔺",
    website: "https://polyhedra.network",
    twitter: "https://twitter.com/PolyhedraZK",
    discord: "https://discord.gg/polyhedra",
    telegram: "https://t.me/polyhedranetwork",
    totalValue: "$60,000,000",
    estimatedReward: "$250-$700",
    participants: 320000,
    difficulty: "medium",
    startDate: "2024-02-15",
    endDate: "2024-12-01",
    requirements: [
      "Use zkBridge for cross-chain transfers",
      "Interact with multiple chains",
      "Complete bridge transactions",
      "Hold bridged assets",
      "Participate in campaigns"
    ],
    category: "DeFi",
    featured: false
  },
  {
    name: "Telegram Trading Bots",
    description: "Revolutionary on-chain trading directly through Telegram messenger",
    blockchain: "Solana",
    type: "social",
    status: "active",
    verified: true,
    logo: "🤖",
    website: "https://telegram.org",
    twitter: "https://twitter.com/telegram",
    discord: "https://discord.gg/telegram",
    telegram: "https://t.me/tradingbots",
    totalValue: "$30,000,000",
    estimatedReward: "$50-$300",
    participants: 2000000,
    difficulty: "easy",
    startDate: "2024-01-10",
    endDate: "2024-12-31",
    requirements: [
      "Use Telegram trading bots",
      "Complete trades on Solana",
      "Refer friends to the platform",
      "Hold tokens bought through bot",
      "Participate in community events"
    ],
    category: "Telegram",
    featured: false
  },
  {
    name: "MetaMask Snaps",
    description: "Extend MetaMask functionality with community-built plugins and features",
    blockchain: "Ethereum",
    type: "holders",
    status: "upcoming",
    verified: true,
    logo: "🦊",
    website: "https://metamask.io",
    twitter: "https://twitter.com/MetaMask",
    discord: "https://discord.gg/metamask",
    telegram: "https://t.me/metamask",
    totalValue: "$40,000,000",
    estimatedReward: "$200-$600",
    participants: 180000,
    difficulty: "easy",
    startDate: "2024-04-01",
    endDate: "2024-12-15",
    requirements: [
      "Install and use MetaMask Snaps",
      "Be an active MetaMask user",
      "Try multiple Snap plugins",
      "Hold ETH in MetaMask",
      "Provide feedback to developers"
    ],
    category: "Holders",
    featured: false
  },
  {
    name: "Blast L2",
    description: "EVM-compatible Layer 2 with native yield for ETH and stablecoins",
    blockchain: "Ethereum",
    type: "retroactive",
    status: "active",
    verified: true,
    logo: "💥",
    website: "https://blast.io",
    twitter: "https://twitter.com/Blast_L2",
    discord: "https://discord.gg/blast",
    telegram: "https://t.me/blastl2",
    totalValue: "$120,000,000",
    estimatedReward: "$400-$1500",
    participants: 680000,
    difficulty: "easy",
    startDate: "2024-02-20",
    endDate: "2024-11-30",
    requirements: [
      "Bridge ETH or stablecoins to Blast",
      "Earn native yield on deposits",
      "Use Blast DeFi protocols",
      "Invite friends to platform",
      "Hold funds for extended period"
    ],
    category: "Layer 2",
    featured: true
  },
  {
    name: "Wormhole",
    description: "Generic message passing protocol connecting multiple blockchain networks",
    blockchain: "Multi-chain",
    type: "retroactive",
    status: "active",
    verified: true,
    logo: "🌀",
    website: "https://wormhole.com",
    twitter: "https://twitter.com/wormhole",
    discord: "https://discord.gg/wormhole",
    telegram: "https://t.me/wormholecrypto",
    totalValue: "$90,000,000",
    estimatedReward: "$350-$900",
    participants: 520000,
    difficulty: "medium",
    startDate: "2024-01-05",
    endDate: "2024-12-10",
    requirements: [
      "Bridge assets using Wormhole",
      "Use multiple blockchain networks",
      "Interact with cross-chain DeFi",
      "Complete bridge transactions",
      "Hold bridged tokens"
    ],
    category: "DeFi",
    featured: false
  },
  {
    name: "Jupiter DEX",
    description: "Leading decentralized exchange aggregator on Solana with best swap rates",
    blockchain: "Solana",
    type: "retroactive",
    status: "active",
    verified: true,
    logo: "🪐",
    website: "https://jup.ag",
    twitter: "https://twitter.com/JupiterExchange",
    discord: "https://discord.gg/jupiter",
    telegram: "https://t.me/jupiterexchange",
    totalValue: "$70,000,000",
    estimatedReward: "$200-$800",
    participants: 890000,
    difficulty: "easy",
    startDate: "2024-01-25",
    endDate: "2024-12-05",
    requirements: [
      "Swap tokens on Jupiter",
      "Use limit orders feature",
      "Try DCA (Dollar Cost Average)",
      "Provide liquidity on Solana",
      "Complete high volume trades"
    ],
    category: "Solana",
    featured: false
  },
  {
    name: "Berachain",
    description: "EVM-identical Layer 1 blockchain with Proof of Liquidity consensus",
    blockchain: "Berachain",
    type: "testnet",
    status: "active",
    verified: true,
    logo: "🐻",
    website: "https://berachain.com",
    twitter: "https://twitter.com/berachain",
    discord: "https://discord.gg/berachain",
    telegram: "https://t.me/berachain",
    totalValue: "$100,000,000",
    estimatedReward: "$500-$1800",
    participants: 420000,
    difficulty: "medium",
    startDate: "2024-02-10",
    endDate: "2024-11-25",
    requirements: [
      "Participate in testnet activities",
      "Provide liquidity on testnet",
      "Use testnet DeFi protocols",
      "Complete NFT quests",
      "Join community governance"
    ],
    category: "Testnet",
    featured: true
  }
];

async function migrate() {
  try {
    console.log('Starting data migration...');
    
    for (const airdrop of existingAirdrops) {
      await db.insert(airdrops).values(airdrop);
      console.log(`Inserted: ${airdrop.name}`);
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
