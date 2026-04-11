-- ================================================================
-- Ghana Teacher Recruiting Platform — PostgreSQL Schema
-- ================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------
-- ENUMS
-- ----------------------------------------------------------------

CREATE TYPE user_role AS ENUM ('TEACHER', 'SCHOOL', 'ADMIN');

CREATE TYPE verification_status AS ENUM ('PENDING', 'IN_REVIEW', 'VERIFIED', 'FAILED');

CREATE TYPE application_status AS ENUM (
    'SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED',
    'INTERVIEW_REQUESTED', 'REJECTED', 'HIRED'
);

CREATE TYPE subscription_tier AS ENUM ('BASIC', 'STANDARD', 'ENTERPRISE');

CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

CREATE TYPE verification_type AS ENUM ('EDUCATION', 'CRIMINAL');

CREATE TYPE verification_provider AS ENUM ('ETX_NG', 'PREMBLY', 'MANUAL');

CREATE TYPE verification_result AS ENUM ('VERIFIED', 'UNVERIFIED', 'FLAGGED');

CREATE TYPE verification_in_progress_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- ----------------------------------------------------------------
-- TABLE: users
-- ----------------------------------------------------------------

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            user_role    NOT NULL,
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email    ON users (email);
CREATE INDEX idx_users_role     ON users (role);
CREATE INDEX idx_users_active   ON users (is_active);

-- ----------------------------------------------------------------
-- TABLE: teacher_profiles
-- ----------------------------------------------------------------

CREATE TABLE teacher_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name               VARCHAR(255),
    phone_number            VARCHAR(30),
    location                VARCHAR(255),
    subject_specialization  VARCHAR(255),
    years_of_experience     INTEGER      DEFAULT 0,
    resume_url              VARCHAR(512),
    photo_url               VARCHAR(512),
    video_url               VARCHAR(512),
    bio                     TEXT,
    date_of_birth           DATE,
    id_number               VARCHAR(100),
    verification_status     verification_status NOT NULL DEFAULT 'PENDING',
    is_visible_to_schools   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_teacher_profiles_user_id ON teacher_profiles (user_id);
CREATE INDEX idx_teacher_profiles_subject        ON teacher_profiles (subject_specialization);
CREATE INDEX idx_teacher_profiles_location       ON teacher_profiles (location);
CREATE INDEX idx_teacher_profiles_experience     ON teacher_profiles (years_of_experience);
CREATE INDEX idx_teacher_profiles_visible        ON teacher_profiles (is_visible_to_schools);
CREATE INDEX idx_teacher_profiles_ver_status     ON teacher_profiles (verification_status);

-- ----------------------------------------------------------------
-- TABLE: schools
-- ----------------------------------------------------------------

CREATE TABLE schools (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_name             VARCHAR(255),
    location                VARCHAR(255),
    contact_person          VARCHAR(255),
    phone_number            VARCHAR(30),
    subscription_tier       subscription_tier,
    subscription_start      TIMESTAMP,
    subscription_end        TIMESTAMP,
    is_subscription_active  BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_schools_user_id      ON schools (user_id);
CREATE INDEX idx_schools_subscription_active ON schools (is_subscription_active);
CREATE INDEX idx_schools_location            ON schools (location);

-- ----------------------------------------------------------------
-- TABLE: job_listings
-- ----------------------------------------------------------------

CREATE TABLE job_listings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id   UUID         NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    subject     VARCHAR(255) NOT NULL,
    location    VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    requirements TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMP
);

CREATE INDEX idx_job_listings_school_id  ON job_listings (school_id);
CREATE INDEX idx_job_listings_subject    ON job_listings (subject);
CREATE INDEX idx_job_listings_location   ON job_listings (location);
CREATE INDEX idx_job_listings_active     ON job_listings (is_active);
CREATE INDEX idx_job_listings_expires_at ON job_listings (expires_at);

-- ----------------------------------------------------------------
-- TABLE: screening_questions
-- ----------------------------------------------------------------

CREATE TABLE screening_questions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_listing_id  UUID    NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    question_text   TEXT    NOT NULL,
    question_order  INTEGER NOT NULL DEFAULT 0,
    is_required     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_screening_questions_job_id ON screening_questions (job_listing_id);

-- ----------------------------------------------------------------
-- TABLE: applications
-- ----------------------------------------------------------------

CREATE TABLE applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id      UUID             NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    job_listing_id  UUID             NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
    status          application_status NOT NULL DEFAULT 'SUBMITTED',
    applied_at      TIMESTAMP        NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP        NOT NULL DEFAULT NOW(),
    UNIQUE (teacher_id, job_listing_id)
);

CREATE INDEX idx_applications_teacher_id     ON applications (teacher_id);
CREATE INDEX idx_applications_job_listing_id ON applications (job_listing_id);
CREATE INDEX idx_applications_status         ON applications (status);
CREATE INDEX idx_applications_applied_at     ON applications (applied_at);

-- ----------------------------------------------------------------
-- TABLE: screening_answers
-- ----------------------------------------------------------------

CREATE TABLE screening_answers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id  UUID      NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    question_id     UUID      NOT NULL REFERENCES screening_questions(id) ON DELETE CASCADE,
    answer_text     TEXT      NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (application_id, question_id)
);

CREATE INDEX idx_screening_answers_application_id ON screening_answers (application_id);
CREATE INDEX idx_screening_answers_question_id    ON screening_answers (question_id);

-- ----------------------------------------------------------------
-- TABLE: verification_requests
-- ----------------------------------------------------------------

CREATE TABLE verification_requests (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id   UUID                            NOT NULL REFERENCES teacher_profiles(id) ON DELETE CASCADE,
    type         verification_type               NOT NULL,
    provider     verification_provider           NOT NULL,
    status       verification_in_progress_status NOT NULL DEFAULT 'PENDING',
    result       verification_result,
    notes        TEXT,
    requested_at TIMESTAMP                       NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_verification_requests_teacher_id ON verification_requests (teacher_id);
CREATE INDEX idx_verification_requests_type       ON verification_requests (type);
CREATE INDEX idx_verification_requests_status     ON verification_requests (status);

-- ----------------------------------------------------------------
-- TABLE: subscriptions
-- ----------------------------------------------------------------

CREATE TABLE subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id               UUID              NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    plan                    subscription_tier NOT NULL,
    amount                  DECIMAL(12, 2)    NOT NULL,
    currency                VARCHAR(10)       NOT NULL DEFAULT 'GHS',
    paystack_reference      VARCHAR(255),
    paystack_transaction_id VARCHAR(255),
    status                  subscription_status NOT NULL DEFAULT 'ACTIVE',
    start_date              TIMESTAMP         NOT NULL DEFAULT NOW(),
    end_date                TIMESTAMP         NOT NULL
);

CREATE INDEX idx_subscriptions_school_id  ON subscriptions (school_id);
CREATE INDEX idx_subscriptions_status     ON subscriptions (status);
CREATE INDEX idx_subscriptions_end_date   ON subscriptions (end_date);
CREATE INDEX idx_subscriptions_paystack   ON subscriptions (paystack_reference);

-- ----------------------------------------------------------------
-- TABLE: notifications
-- ----------------------------------------------------------------

CREATE TABLE notifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id  ON notifications (user_id);
CREATE INDEX idx_notifications_is_read  ON notifications (is_read);
CREATE INDEX idx_notifications_created  ON notifications (created_at);

-- ----------------------------------------------------------------
-- TRIGGERS: auto-update updated_at
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_teacher_profiles_updated_at
    BEFORE UPDATE ON teacher_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
