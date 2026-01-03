import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedAssets1768000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO assets (symbol, name, decimals, type, is_deposit_enabled, is_trading_enabled) VALUES
            ('BTC', 'Bitcoin', 8, 'crypto', true, true),
            ('ETH', 'Ethereum', 18, 'crypto', true, true),
            ('USDT', 'Tether', 6, 'stablecoin', true, true),
            ('USDC', 'USD Coin', 6, 'stablecoin', true, true),
            ('SOL', 'Solana', 9, 'crypto', true, true)
            ON CONFLICT (symbol) DO UPDATE SET 
                name = EXCLUDED.name,
                decimals = EXCLUDED.decimals,
                type = EXCLUDED.type;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM assets WHERE symbol IN ('BTC', 'ETH', 'USDT', 'USDC', 'SOL')`);
    }
}