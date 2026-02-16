-- Match articles for a user based on role overlap, level compatibility, and keyword intersection
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
    -- Relevance score: count of keyword overlaps between article and user profile
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
    )::bigint as relevance_score
  from articles a
  cross join user_profile up
  where
    -- Article must have role overlap with user's current or target roles
    a.roles && (up.current_roles || up.target_roles)
    -- Article level matches user's current or target level
    and a.level in (up.current_level, up.target_level)
    -- Only articles from the last 7 days
    and a.received_at > now() - interval '7 days'
    -- Only fully processed articles
    and a.processing_status = 'completed'
    -- Exclude already-sent articles
    and a.id not in (select article_id from already_sent)
  order by relevance_score desc, a.received_at desc
  limit 15;
$$;
