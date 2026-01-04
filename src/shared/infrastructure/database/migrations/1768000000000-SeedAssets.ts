import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAssets1768000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO assets (symbol, name, decimals, type, is_deposit_enabled, is_trading_enabled, icon_url) VALUES
            ('BTC', 'Bitcoin', 8, 'crypto', true, true, 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/btc.png'),
            ('ETH', 'Ethereum', 18, 'crypto', true, true, 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png'),
            ('USDT', 'Tether', 6, 'stablecoin', true, true, 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdt.png'),
            ('USDC', 'USD Coin', 6, 'stablecoin', true, true, 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/usdc.png'),
            ('SOL', 'Solana', 9, 'crypto', true, true, 'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png')
            ON CONFLICT (symbol) DO UPDATE SET 
                name = EXCLUDED.name,
                decimals = EXCLUDED.decimals,
                type = EXCLUDED.type,
                icon_url = EXCLUDED.icon_url;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM assets WHERE symbol IN ('BTC', 'ETH', 'USDT', 'USDC', 'SOL')`);
    }
}