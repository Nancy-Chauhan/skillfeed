-- Remove articles that have no URL (they can't be linked in newsletters)
delete from articles where url is null;

-- Enforce NOT NULL on url so this can never happen again
alter table articles alter column url set not null;
