import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { citext } from '@electric-sql/pglite/contrib/citext';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgDump } from '@electric-sql/pglite-tools/pg_dump';
import fs from 'fs'; import path from 'path';
const dir='/tmp/ref/supabase/migrations';
const db = await PGlite.create({ extensions: { pgcrypto, uuid_ossp, citext, pg_trgm } });
const pre = `do $x$ begin
  begin create role anon; exception when others then null; end;
  begin create role authenticated; exception when others then null; end;
  begin create role service_role; exception when others then null; end;
  begin create role supabase_auth_admin; exception when others then null; end;
  begin create role supabase_admin; exception when others then null; end;
  begin create role authenticator; exception when others then null; end;
  begin create role postgres; exception when others then null; end;
end $x$;
create schema if not exists auth; create schema if not exists storage; create schema if not exists extensions; create schema if not exists graphql_public; create schema if not exists realtime; create schema if not exists vault;
create extension if not exists pgcrypto;
create table auth.users(id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb, raw_app_meta_data jsonb, encrypted_password text, created_at timestamptz default now(), updated_at timestamptz default now(), email_confirmed_at timestamptz, last_sign_in_at timestamptz, phone text, confirmed_at timestamptz, banned_until timestamptz, deleted_at timestamptz);
create table auth.identities(id uuid primary key default gen_random_uuid(), user_id uuid, provider text, identity_data jsonb, created_at timestamptz default now());
create or replace function auth.uid() returns uuid language sql stable as $$ select null::uuid $$;
create or replace function auth.role() returns text language sql stable as $$ select null::text $$;
create or replace function auth.jwt() returns jsonb language sql stable as $$ select '{}'::jsonb $$;
create table storage.buckets(id text primary key, name text, public boolean default false, created_at timestamptz default now(), updated_at timestamptz default now(), file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text, owner uuid, created_at timestamptz default now(), updated_at timestamptz default now(), last_accessed_at timestamptz, metadata jsonb, path_tokens text[]);
create or replace function storage.foldername(name text) returns text[] language sql as $$ select string_to_array(name,'/') $$;
create publication supabase_realtime;
create schema if not exists cron; create schema if not exists net;
`;
await db.exec(pre);
const files = fs.readdirSync(dir).filter(f=>f.endsWith('.sql')).sort();
function split(sql){
  const out=[]; let cur=''; let i=0; let tag=null;
  while(i<sql.length){
    const c=sql[i];
    if(tag){ if(sql.startsWith(tag,i)){ cur+=tag; i+=tag.length; tag=null; continue; } cur+=c; i++; continue; }
    if(c==='$'){ const m=/^\$[A-Za-z_0-9]*\$/.exec(sql.slice(i)); if(m){ tag=m[0]; cur+=tag; i+=tag.length; continue; } }
    if(c==="'"){ let j=i+1; while(j<sql.length){ if(sql[j]==="'"){ if(sql[j+1]==="'"){j+=2;continue;} break;} j++; } cur+=sql.slice(i,j+1); i=j+1; continue; }
    if(c==='-'&&sql[i+1]==='-'){ let j=sql.indexOf('\n',i); if(j<0)j=sql.length; cur+=sql.slice(i,j); i=j; continue; }
    if(c===';'){ out.push(cur); cur=''; i++; continue; }
    cur+=c; i++;
  }
  if(cur.trim())out.push(cur);
  return out.map(x=>x.trim()).filter(x=>x.length);
}
const fails=[];
let ok=0, bad=0;
for(const f of files){
  const sql = fs.readFileSync(path.join(dir,f),'utf8');
  for(const st of split(sql)){
    try { await db.exec(st); ok++; }
    catch(e){ bad++; fails.push({f, st: st.slice(0,120), err: String(e.message||e).slice(0,200)}); }
  }
}
console.log('statements ok', ok, 'bad', bad);
fs.writeFileSync('/tmp/replay/fails.json', JSON.stringify(fails,null,2));
const r = await db.query(`select count(*)::int c from pg_tables where schemaname='public'`);
console.log('tables:', r.rows[0].c, 'failed files:', fails.length, 'of', files.length);
console.log(fails.slice(0,10).map(x=>x.f+' :: '+x.err).join('\n---\n'));
const dump = await pgDump({ pg: db, args: ['--schema-only','--no-owner','--no-privileges','-n','public'] });
fs.writeFileSync('/tmp/replay/schema.sql', await dump.text());
await db.close();
