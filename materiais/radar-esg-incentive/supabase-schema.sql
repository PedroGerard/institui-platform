create extension if not exists pgcrypto;

create table if not exists empresas (
  id uuid primary key default gen_random_uuid(),
  data_inclusao date default current_date,
  razao_social text,
  nome_fantasia text,
  cnpj text,
  segmento text,
  porte text,
  cidade text,
  estado text,
  regiao text,
  site text,
  pagina_esg text,
  pagina_patrocinio text,
  possui_instituto_fundacao text default 'Nao identificado',
  utiliza_leis_incentivo text default 'Nao identificado',
  possui_programa_social text default 'Nao identificado',
  possui_edital_aberto text default 'Nao identificado',
  investe_educacao text default 'Nao identificado',
  investe_cultura text default 'Nao identificado',
  investe_inclusao_produtiva text default 'Nao identificado',
  areas_interesse text,
  evidencia_encontrada text,
  fonte_url text,
  contato_encontrado text default 'Nao identificado',
  score integer default 0,
  prioridade text default 'Baixa prioridade',
  status text default 'Novo Lead',
  proxima_acao text,
  responsavel text,
  observacoes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint empresas_score_range check (score between 0 and 100),
  constraint empresas_prioridade_check check (prioridade in ('Prioridade A', 'Prioridade B', 'Prioridade C', 'Baixa prioridade')),
  constraint empresas_status_check check (status in (
    'Novo Lead',
    'Qualificado',
    'Contato Realizado',
    'Reuniao Agendada',
    'Diagnostico',
    'Proposta Enviada',
    'Negociacao',
    'Parceria Firmada',
    'Pos-Parceria',
    'Descartado'
  ))
);

create unique index if not exists empresas_site_unique
  on empresas (lower(site))
  where site is not null and site <> '';

create index if not exists empresas_prioridade_idx on empresas (prioridade);
create index if not exists empresas_score_idx on empresas (score desc);
create index if not exists empresas_estado_idx on empresas (estado);
create index if not exists empresas_status_idx on empresas (status);

create table if not exists contatos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references empresas(id) on delete cascade,
  nome text,
  cargo text,
  departamento text,
  email text,
  telefone text,
  linkedin text,
  fonte_publica text,
  data_atualizacao date default current_date,
  status_contato text default 'Novo',
  observacoes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint contatos_status_check check (status_contato in ('Novo', 'Validado', 'Abordado', 'Respondeu', 'Sem retorno', 'Inativo'))
);

create index if not exists contatos_empresa_id_idx on contatos (empresa_id);

create table if not exists editais (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references empresas(id) on delete set null,
  nome_programa text,
  ano integer,
  area text,
  prazo_inscricao date,
  valor_maximo numeric(14,2),
  link text,
  situacao text default 'Monitorar',
  fonte text,
  observacoes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint editais_situacao_check check (situacao in ('Aberto', 'Previsto', 'Encerrado', 'Monitorar', 'Nao aderente'))
);

create index if not exists editais_empresa_id_idx on editais (empresa_id);
create index if not exists editais_prazo_idx on editais (prazo_inscricao);
create index if not exists editais_situacao_idx on editais (situacao);

create table if not exists historico_abordagens (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references empresas(id) on delete cascade,
  data date default current_date,
  tipo_acao text,
  canal text,
  responsavel text,
  resultado text,
  proxima_acao text,
  data_proxima_acao date,
  observacoes text,
  created_at timestamptz default now()
);

create index if not exists historico_empresa_id_idx on historico_abordagens (empresa_id);
create index if not exists historico_data_idx on historico_abordagens (data desc);

create table if not exists propostas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references empresas(id) on delete cascade,
  projeto text,
  valor_solicitado numeric(14,2),
  lei_incentivo text,
  data_envio date,
  status text default 'Rascunho',
  probabilidade numeric(5,4) default 0,
  valor_esperado numeric(14,2) generated always as (coalesce(valor_solicitado, 0) * coalesce(probabilidade, 0)) stored,
  prazo_retorno date,
  observacoes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint propostas_probabilidade_range check (probabilidade between 0 and 1),
  constraint propostas_status_check check (status in ('Rascunho', 'Enviada', 'Em analise', 'Aprovada', 'Negociacao', 'Recusada', 'Cancelada'))
);

create index if not exists propostas_empresa_id_idx on propostas (empresa_id);
create index if not exists propostas_status_idx on propostas (status);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists empresas_set_updated_at on empresas;
create trigger empresas_set_updated_at
before update on empresas
for each row execute function set_updated_at();

drop trigger if exists contatos_set_updated_at on contatos;
create trigger contatos_set_updated_at
before update on contatos
for each row execute function set_updated_at();

drop trigger if exists editais_set_updated_at on editais;
create trigger editais_set_updated_at
before update on editais
for each row execute function set_updated_at();

drop trigger if exists propostas_set_updated_at on propostas;
create trigger propostas_set_updated_at
before update on propostas
for each row execute function set_updated_at();
