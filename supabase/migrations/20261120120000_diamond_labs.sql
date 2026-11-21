-- Widen diamond_stones.cert_lab for laboratories beyond GIA, IGI and HRD.
-- Idempotent. Safe when 20261118180000 was already applied with the narrower check.
-- Does not touch gold tables. Does not insert rows: re-run the seed after this
-- so AGS, GCAL, GSI and Other examples are upserted.
-- Apply order if the earlier files are not on the database yet:
--   1. 20261118180000_diamond_schema.sql
--   2. 20261120120000_diamond_labs.sql
--   3. 20261118180100_diamond_seed.sql
-- If schema and seed were already applied, apply this file, then re-run the seed.

do $$
declare r record;
begin
  for r in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'diamond_stones'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%cert_lab%'
  loop
    execute format('alter table public.diamond_stones drop constraint %I', r.conname);
  end loop;
end $$;

alter table public.diamond_stones
  add constraint diamond_stones_cert_lab_check
  check (cert_lab in ('GIA', 'IGI', 'HRD', 'AGS', 'GCAL', 'GSI', 'Other'));

comment on column public.diamond_stones.cert_lab is
  'Certificate laboratory: GIA, IGI, HRD, AGS, GCAL, GSI, or Other for any further recognised laboratory. No prices are stored.';
