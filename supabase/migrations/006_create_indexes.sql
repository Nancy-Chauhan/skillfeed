-- GIN indexes for fast array operations
create index idx_articles_roles on articles using gin (roles);
create index idx_articles_keywords on articles using gin (keywords);
create index idx_users_extracted_keywords on users using gin (extracted_keywords);
create index idx_users_extracted_skills on users using gin (extracted_skills);

-- B-tree indexes for common queries
create index idx_articles_received_at on articles (received_at desc);
create index idx_articles_processing_status on articles (processing_status);
create index idx_articles_level on articles (level);
create index idx_newsletters_sent_user_id on newsletters_sent (user_id, created_at desc);
create index idx_users_is_active on users (is_active) where is_active = true;
