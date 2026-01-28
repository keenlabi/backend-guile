import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAssets1767610200000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Clear existing assets
        await queryRunner.query(`DELETE FROM "assets"`);

        // 2. Insert Assets
        await queryRunner.query(`
            INSERT INTO "assets" 
            ("id", "symbol", "name", "decimals", "type", "is_deposit_enabled", "is_withdrawal_enabled", "is_trading_enabled", "icon_url", "deposit_address") 
            VALUES
            -- BTC
            ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BTC', 'Bitcoin', 8, 'crypto', true, true, true, 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
            
            -- ETH
            ('d3c7a912-8255-412e-9d22-13271791a8e3', 'ETH', 'Ethereum', 18, 'crypto', true, true, true, 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'),
            
            -- SOL
            ('99676632-13d8-4f81-a67b-180b67323803', 'SOL', 'Solana', 9, 'crypto', true, true, true, 'https://assets.coingecko.com/coins/images/4128/small/solana.png', 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH'),
            
            -- USDT
            ('b7532321-4f8c-4c7b-99f5-467f272d5472', 'USDT', 'Tether', 6, 'stablecoin', true, true, true, 'https://assets.coingecko.com/coins/images/325/small/Tether.png', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'),
            
            -- USDC
            ('4d2f8310-2f91-49b0-967b-232104037568', 'USDC', 'USD Coin', 6, 'stablecoin', true, true, true, 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png', '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'),
            
            -- XAU (GOLD) - Updated Symbol and Icon
            ('f121855e-0493-4100-9118-c5157152066c', 'XAU', 'Gold', 18, 'commodity', false, false, true, 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x45804880De22913dAFE09f4980848ECE6EcbAf78/logo.png', '0x45804880De22913dAFE09f4980848ECE6EcbAf78')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "assets"`);
    }
}