import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('instruments', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('symbol', 255).notNullable().unique();
    table.string('image', 50),
    table.decimal('current_price', 18, 2).notNullable(),
    table.decimal('market_cap', 25, 2),
    table.integer('market_cap_rank'),
    table.decimal('fully_diluted_valuation', 25, 2),
    table.decimal('total_volume', 25, 2),
    table.decimal('high_24h', 18, 2),
    table.decimal('low_24h', 18, 2),
    table.decimal('price_change_24h', 18, 2),
    table.decimal('price_change_percentage_24h', 18, 2),
    table.decimal('market_cap_change_24h', 25, 2),
    table.decimal('market_cap_change_percentage_24h', 18, 2),
    table.decimal('circulating_supply', 25, 2),
    table.decimal('total_supply', 25, 2),
    table.decimal('max_supply', 25, 2),
    table.decimal('ath', 18, 2),
    table.decimal('ath_change_percentage', 18, 2),
    table.datetime('ath_date'),
    table.decimal('atl', 18, 2),
    table.decimal('atl_change_percentage', 18, 2),
    table.datetime('atl_date'),
    table.decimal('roi', 18, 2),
    table.datetime('last_updated'),
    table.jsonb('sparkline_in_7d').nullable();
    table.decimal('price_change_percentage_24h_in_currency')
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('instruments');
}
