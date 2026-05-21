const { Client } = require('pg');

const DATABASE_URL = "postgresql://postgres:oZsTCewmMfoYTzscxOZDXjtNVOkjqeYw@kodama.proxy.rlwy.net:12587/railway";

const SQL = `
CREATE TABLE IF NOT EXISTS leads (
    id                      SERIAL PRIMARY KEY,
    nome                    VARCHAR(255) NOT NULL,
    whatsapp                VARCHAR(20),
    status                  VARCHAR(50) DEFAULT 'novo',
    categoria               VARCHAR(100),
    data_cadastro           TIMESTAMP DEFAULT NOW(),
    data_ultimo_contato     TIMESTAMP,
    data_followup_3dias     TIMESTAMP,
    data_followup_5dias     TIMESTAMP,
    interesses              TEXT,
    historico_resumo        TEXT
);

CREATE TABLE IF NOT EXISTS conversas (
    id                  SERIAL PRIMARY KEY,
    lead_id             INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    mensagem            TEXT,
    tipo                VARCHAR(20) CHECK (tipo IN ('enviada', 'recebida')),
    data_hora           TIMESTAMP DEFAULT NOW(),
    transcricao_audio   TEXT
);

CREATE TABLE IF NOT EXISTS reunioes (
    id              SERIAL PRIMARY KEY,
    lead_id         INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    data_hora       TIMESTAMP,
    status          VARCHAR(50) DEFAULT 'agendada',
    link_meet       VARCHAR(500),
    observacoes     TEXT
);

CREATE TABLE IF NOT EXISTS configuracoes (
    id      SERIAL PRIMARY KEY,
    chave   VARCHAR(100) UNIQUE NOT NULL,
    valor   TEXT
);
`;

async function main() {
    const client = new Client({ connectionString: DATABASE_URL });

    console.log("Conectando ao banco de dados...");
    await client.connect();

    console.log("Criando tabelas...");
    await client.query(SQL);

    const res = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    `);

    await client.end();

    console.log("\nTabelas no banco:");
    res.rows.forEach(r => console.log(`  - ${r.table_name}`));
    console.log("\nSetup concluído com sucesso!");
}

main().catch(err => {
    console.error("Erro:", err.message);
    process.exit(1);
});
