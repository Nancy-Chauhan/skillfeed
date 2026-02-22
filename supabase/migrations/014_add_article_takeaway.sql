-- Add takeaway column for pre-computed "why this matters" text
alter table articles add column takeaway text;

-- Backfill existing articles: derive a simple takeaway from summary + primary role
update articles
set takeaway = summary || ' Relevant for ' || roles[1] || ' practitioners.'
where summary is not null
  and array_length(roles, 1) > 0;
