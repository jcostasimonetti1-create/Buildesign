import psycopg2

DATABASE_URL = "postgresql://postgres:oZsTCewmMfoYTzscxOZDXjtNVOkjqeYw@kodama.proxy.rlwy.net:12587/railway"

SQL = """
CREATE TABLE IF NOT EXISTS leads (
    id              SERIAL PRIMARY KEY,
    nome            VARCHAR(255) NOT NULL,
    whatsapp        VARCHAR(20),
    status          VARCHAR(50) DEFAULT 'novo',
    categoria       VARCHAR(100),
    data_cadastro          TIMESTAMP DEFAULT NOW(),
    data_ultimo_contato    TIMESTAMP,
    data_followup_3dias    TIMESTAMP,
    data_followup_5dias    TIMESTAMP,
    interesses      TEXT,
    historico_resumo TEXT
);

CREATE TABLE IF NOT EXISTS conversas (
    id              SERIAL PRIMARY KEY,
    lead_id         INTEGER REFERENCES leads(id) ON DELETE CASCADE,
    mensagem        TEXT,
    tipo            VARCHAR(20) CHECK (tipo IN ('enviada', 'recebida')),
    data_hora       TIMESTAMP DEFAULT NOW(),
    transcricao_audio TEXT
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
    id              SERIAL PRIMARY KEY,
    chave           VARCHAR(100) UNIQUE NOT NULL,
    valor           TEXT
);
"""

def main():
    print("Conectando ao banco de dados...")
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cur = conn.cursor()

    print("Criando tabelas...")
    cur.execute(SQL)

    # Verifica tabelas criadas
    cur.execute("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    tabelas = [row[0] for row in cur.fetchall()]

    cur.close()
    conn.close()

    print("\nTabelas no banco:")
    for t in tabelas:
        print(f"  - {t}")
    print("\nSetup concluído com sucesso!")

if __name__ == "__main__":
    main()
