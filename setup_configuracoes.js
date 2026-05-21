const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres:oZsTCewmMfoYTzscxOZDXjtNVOkjqeYw@kodama.proxy.rlwy.net:12587/railway";

const CONFIGURACOES = [
  { chave: 'whatsapp_dono', valor: 'SEU_NUMERO_AQUI' },
  { chave: 'nome_agencia', valor: 'Buildesign' },
  { chave: 'instance_evolution', valor: 'Buildesign' },
  { chave: 'horario_atendimento_inicio', valor: '09:00' },
  { chave: 'horario_atendimento_fim', valor: '18:00' },
  { chave: 'max_followups', valor: '2' },
  { chave: 'dias_reengajamento', valor: '180' }
];

async function main() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  console.log("Inserindo configurações iniciais...\n");

  for (const config of CONFIGURACOES) {
    await client.query(
      `INSERT INTO configuracoes (chave, valor)
       VALUES ($1, $2)
       ON CONFLICT (chave) DO UPDATE SET valor = $2`,
      [config.chave, config.valor]
    );
    console.log(`  ✓ ${config.chave} = ${config.valor}`);
  }

  console.log("\n⚠️  IMPORTANTE: Atualize 'whatsapp_dono' com o número real:");
  console.log("   UPDATE configuracoes SET valor = '5511999999999' WHERE chave = 'whatsapp_dono';");

  await client.end();
  console.log("\nConfiguracões inseridas com sucesso!");
}

main().catch(err => {
  console.error("Erro:", err.message);
  process.exit(1);
});
