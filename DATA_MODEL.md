# Suggested Data Model

## users
- id
- email
- password_hash
- display_name
- role
- created_at
- updated_at
- email_verified_at

## projects
- id
- user_id
- name
- workspace_name
- framework
- language
- mode
- created_at
- updated_at

## project_files
- id
- project_id
- path
- content
- role
- created_at
- updated_at

## generations
- id
- user_id
- project_id
- prompt
- task
- framework
- language
- mode
- complexity
- style
- compare_enabled
- target_file
- provider
- model
- summary
- created_at

## generation_variants
- id
- generation_id
- label

## generation_variant_files
- id
- variant_id
- path
- content
- role

## uploads
- id
- user_id
- project_id
- name
- mime_type
- size_bytes
- storage_key
- created_at

## subscriptions
- id
- user_id
- provider
- provider_customer_id
- provider_subscription_id
- plan_code
- status
- renewal_at

## audit_events
- id
- user_id
- event_type
- metadata_json
- created_at
