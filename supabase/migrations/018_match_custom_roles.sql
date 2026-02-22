-- Fix article matching for users with only custom roles.
-- Previously, match_articles_for_user() required predefined enum roles to match.
-- Users with only custom roles (e.g. "HR Senior Associate") got zero results.
--
-- Changes:
-- 1. Add custom_role_words CTE to split custom role strings into keywords
-- 2. Bypass role filter for custom-role-only users (level filter still applies)
-- 3. Include custom role words in relevance scoring keyword pool

drop function if exists match_articles_for_user(uuid);

create or replace function match_articles_for_user(p_user_id uuid)
returns table (
  id uuid,
  title text,
  summary text,
  url text,
  level article_level,
  roles user_role[],
  keywords text[],
  source_name text,
  received_at timestamptz,
  relevance_score bigint
)
language sql
stable
as $$
  with user_profile as (
    select
      u.current_roles,
      u.target_roles,
      u.current_level,
      u.target_level,
      u.extracted_keywords,
      u.extracted_skills,
      u.custom_current_roles,
      u.custom_target_roles
    from users u
    where u.id = p_user_id
  ),
  custom_role_words as (
    select distinct lower(word) as word
    from user_profile up,
         lateral unnest(up.custom_current_roles || up.custom_target_roles) as role_text,
         lateral regexp_split_to_table(role_text, '\s+') as word
    where length(word) > 0
  ),
  already_sent as (
    select unnest(ns.article_ids) as article_id
    from newsletters_sent ns
    where ns.user_id = p_user_id
  )
  select
    a.id,
    a.title,
    a.summary,
    a.url,
    a.level,
    a.roles,
    a.keywords,
    a.source_name,
    a.received_at,
    coalesce(
      array_length(
        array(
          select kw from unnest(a.keywords) as kw
          where kw in (select unnest(up.extracted_keywords || up.extracted_skills))
             or kw in (select word from custom_role_words)
        ),
        1
      ),
      0
    )::bigint as relevance_score
  from articles a
  cross join user_profile up
  where
    (
      -- Predefined role overlap (existing behavior)
      a.roles && (up.current_roles || up.target_roles)
      OR
      -- User has only custom roles: skip role filter, let scoring handle relevance
      (
        cardinality(up.current_roles || up.target_roles) = 0
        AND cardinality(up.custom_current_roles || up.custom_target_roles) > 0
      )
    )
    and a.level in (up.current_level, up.target_level)
    and a.received_at > now() - interval '7 days'
    and a.processing_status = 'completed'
    and a.url is not null
    and a.id not in (select article_id from already_sent)
  order by relevance_score desc, a.received_at desc
  limit 15;
$$;
