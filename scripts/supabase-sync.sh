#!/usr/bin/env bash
set -euo pipefail

# Sync local SQL schema files with Supabase using the CLI.
# Requires: supabase CLI installed and authenticated.

SUPABASE_PROJECT_REF=${SUPABASE_PROJECT_REF:-""}

if [[ -z "$SUPABASE_PROJECT_REF" ]]; then
  echo "SUPABASE_PROJECT_REF is not set. Example: SUPABASE_PROJECT_REF=abcd1234" >&2
  exit 1
fi

supabase link --project-ref "$SUPABASE_PROJECT_REF"

supabase db push
