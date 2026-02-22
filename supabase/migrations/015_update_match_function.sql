-- Add takeaway to the match_articles_for_user return type
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
  relevance_score bigint,
  takeaway text
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
      u.extracted_skills
    from users u
    where u.id = p_user_id
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
          select unnest(a.keywords)
          intersect
          select unnest(up.extracted_keywords || up.extracted_skills)
        ),
        1
      ),
      0
    )::bigint as relevance_score,
    a.takeaway
  from articles a
  cross join user_profile up
  where
    a.roles && (up.current_roles || up.target_roles)
    and a.level in (up.current_level, up.target_level)
    and a.received_at > now() - interval '7 days'
    and a.processing_status = 'completed'
    and a.url is not null
    and a.id not in (select article_id from already_sent)
  order by relevance_score desc, a.received_at desc
  limit 15;
$$;
