/*
  # Create audit logs table and security policies

  1. New Tables
    - `audit_logs`
      - `id` (uuid, primary key)
      - `action` (text)
      - `description` (text)
      - `category` (text)
      - `performed_by` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on audit_logs table
    - Add policies for authenticated users to:
      - Read their own audit logs
      - Create audit logs
*/

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  performed_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own audit logs
CREATE POLICY "Users can read own audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = performed_by);

-- Allow users to create audit logs for themselves
CREATE POLICY "Users can create own audit logs"
  ON audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = performed_by);