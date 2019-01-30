const config = {
  pipeline_id: process.env.PIPELINE_ID || Date.now(),
  timeout: process.env.TIMEOUT,
  events: {
    success: {
      type: "slack",
      options: {
        channel: process.env.SLACK_CHANNEL,
        username: "Pipeline Report:",
        webhook: process.env.SLACK_WEBHOOK_URL
      }
    },
    error: {
      type: "slack",
      options: {
        channel: process.env.SLACK_CHANNEL,
        username: "Pipeline Report:",
        webhook: process.env.SLACK_WEBHOOK_URL
      }
    }
  },
  scheduler: {
    start: "01-08-2018",
    end: "02-07-3018",
    interval: 10
  },
  redis: {
    url: process.env.DATA_PIPELINE_REDIS_URL
  },
  fileStorage: {
    localFileDirectory: `${__dirname}/mytmp`,
    fileMode: process.env.DATA_PIPELINE_FILE_STORAGE_MODE,
    accessKeyId: process.env.DATA_PIPELINE_FILE_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.DATA_PIPELINE_FILE_STORAGE_SECRET_ACCESS_KEY,
    Bucket: process.env.DATA_PIPELINE_FILE_STORAGE_BUCKET,
    defaultPath: process.env.DATA_PIPELINE_FILE_STORAGE_DEFAULT_PATH
  },
  source: [{
    "type": process.env.DATA_PIPELINE_1_DATABASE_TYPE,
    "credentials": {
      "url": process.env.DATA_PIPELINE_1_DATABASE_URL,
    },
    "schema": [{
      "fields": [],
      "table": "admin",
      "destination_table_name": "admin",
      "primary_key": "id",
      "incremental_key": ["created_at"]
    },
    {
      "fields": [],
      "table": "admin_audit_trail",
      "destination_table_name": "admin_audit_trail",
      "primary_key": "id",
      "incremental_key": ["performed_at"]
    },
    {
      "fields": [],
      "table": "agent_pricing_models",
      "destination_table_name": "agent_pricing_models",
      "primary_key": "code"
    },
    {
      "fields": [],
      "table": "agent_settings",
      "destination_table_name": "agent_settings",
      "primary_key": "id",
      "incremental_key": ["added_at", "updated_at"]
    },
    {
      "fields": [],
      "table": "agents",
      "destination_table_name": "agents",
      "primary_key": "id",
      "incremental_key": ["created_at", "updated_at"]
    },
    {
      "fields": [],
      "table": "app_state",
      "destination_table_name": "app_state",
      "primary_key": "id"
    },
    {
      "fields": [],
      "table": "client_kyc_information",
      "destination_table_name": "client_kyc_information",
      "primary_key": "id",
      "incremental_key": ["added_at", "updated_at"]
    },
    {
      "fields": [],
      "table": "client_settings",
      "destination_table_name": "client_settings",
      "primary_key": "id",
      "incremental_key": ["added_at", "updated_at"]
    },
    {
      "fields": [],
      "table": "clients",
      "destination_table_name": "clients",
      "primary_key": "id",
      "incremental_key": ["added_at", "updated_at"]
    },
    {
      "fields": [],
      "table": "contact_list",
      "destination_table_name": "contact_list",
      "primary_key": "id",
      "incremental_key": ["added_at"]
    },
    {
      "fields": [],
      "table": "country_codes",
      "destination_table_name": "country_codes",
      "primary_key": "code"
    },
    {
      "fields": [],
      "table": "kyc_audit_trail",
      "destination_table_name": "kyc_audit_trail",
      "primary_key": "id",
      "incremental_key": ["added_at", "updated_at"]
    },
    {
      "fields": [],
      "table": "kyc_status",
      "destination_table_name": "kyc_status",
      "primary_key": "code"
    },
    {
      "fields": [],
      "table": "kyc_tiers",
      "destination_table_name": "kyc_tiers",
      "primary_key": "code"
    },
    {
      "fields": [],
      "table": "location_hierarchies",
      "destination_table_name": "location_hierarchies",
      "primary_key": "location_id"
    },
    {
      "fields": [],
      "table": "location_types",
      "destination_table_name": "location_types",
      "primary_key": "type"
    },
    {
      "fields": [],
      "table": "locations",
      "destination_table_name": "locations",
      "primary_key": "id"
    },
    {
      "fields": [],
      "table": "login_logs",
      "destination_table_name": "login_logs",
      "primary_key": "id",
      "incremental_key": ["logged_at"]
    },
    {
      "fields": [],
      "table": "pending_client_approval",
      "destination_table_name": "pending_client_approval",
      "primary_key": "id",
      "incremental_key": ["added_at", "updated_at"]
    },
    {
      "fields": [],
      "table": "roles",
      "destination_table_name": "roles",
      "primary_key": "code"
    },
    {
      "fields": [],
      "table": "user_address",
      "destination_table_name": "user_address",
      "primary_key": "id",
      "incremental_key": ["added_at", "updated_at"]
    },
    {
      "fields": [],
      "table": "user_info_update_tracking",
      "destination_table_name": "user_info_update_tracking",
      "primary_key": "id",
      "incremental_key": ["changed_at"]
    },
    {
      "fields": [],
      "table": "user_refresh_token",
      "destination_table_name": "user_refresh_token",
      "primary_key": "id",
      "incremental_key": ["created_at"]
    },
    {
      "fields": [],
      "table": "user_roles",
      "destination_table_name": "user_roles",
      "primary_key": "user_id",
      "incremental_key": ["created_at", "revoked_at"]
    },
    {
      "fields": ["id", "email", "phone_number", "first_name", "gender", "middle_name", "last_name", "date_of_birth", "address", "image_url", "is_verified", "is_active", "suspended_at", "address_id", "created_at", "updated_at"],
      "table": "users",
      "destination_table_name": "users",
      "primary_key": "id",
      "incremental_key": ["created_at", "updated_at"]
    }
    ]
  },
    {
      "type": process.env.DATA_PIPELINE_2_DATABASE_TYPE,
      "credentials": {
        "url": process.env.DATA_PIPELINE_2_DATABASE_URL,
      },
      "schema": [{
        "fields": [],
        "table": "account_groups",
        "destination_table_name": "account_groups",
        "primary_key": "name"
      },
      {
        "fields": [],
        "table": "account_users",
        "destination_table_name": "account_users",
        "primary_key": "account_number",
        "default_index": 1,
        "incremental_key": ["account_number"]
      },
      {
        "fields": [],
        "destination_table_name": "accounts",
        "table": "accounts",
        "primary_key": "number",
        "incremental_key": ["created_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "accounts_accounts",
        "destination_table_name": "accounts_accounts",
        "primary_key": "current_account_id",
        "default_index": 1,
        "incremental_key": ["current_account_id"]
      },
      {
        "fields": [],
        "table": "accounts_type",
        "destination_table_name": "accounts_type",
        "primary_key": "number"
      },
      {
        "fields": [],
        "table": "agent_deposit_for_client_monthly_tracking",
        "destination_table_name": "agent_deposit_for_client_monthly_tracking",
        "primary_key": "client_user_id",
        "incremental_key": ["added_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "atlas_pricing_charges",
        "destination_table_name": "atlas_pricing_charges",
        "primary_key": "percentage"
      },
      {
        "fields": [],
        "table": "bank_transactions",
        "destination_table_name": "bank_transactions",
        "primary_key": "id",
        "incremental_key": ["added_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "bank_withdrawal_requests",
        "destination_table_name": "bank_withdrawal_requests",
        "primary_key": "id",
        "incremental_key": ["requested_at"]
      },
      {
        "fields": [],
        "table": "client_deposit_credit_monthly_tracking",
        "destination_table_name": "client_deposit_credit_monthly_tracking",
        "primary_key": "id",
        "incremental_key": ["added_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "client_kyc_aml_tracking",
        "destination_table_name": "client_kyc_aml_tracking",
        "primary_key": "id",
        "incremental_key": ["added_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "client_onboarding_cut_off_date",
        "destination_table_name": "client_onboarding_cut_off_date",
        "primary_key": "location"
      },
      {
        "fields": [],
        "table": "currency_codes",
        "destination_table_name": "currency_codes",
        "primary_key": "code"
      },
      
      {
        "fields": [],
        "table": "financial_transactions",
        "destination_table_name": "financial_transactions",
        "primary_key": "id",
        "incremental_key": ["executed_at"],
        "limit": 500000
      },
      {
        "fields": [],
        "table": "ghana_flat_fee_pricing_tiers",
        "destination_table_name": "ghana_flat_fee_pricing_tiers",
        "primary_key": "tier_name"
      },
      {
        "fields": [],
        "table": "kyc_tier",
        "destination_table_name": "kyc_tier",
        "primary_key": "code"
      },
      {
        "fields": [],
        "table": "pending_client_withdrawals",
        "destination_table_name": "pending_client_withdrawals",
        "primary_key": "id",
        "incremental_key": ["added_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "senegal_flat_fee_pricing_tiers",
        "destination_table_name": "senegal_flat_fee_pricing_tiers",
        "primary_key": "tier_name"
      },
      {
        "fields": [],
        "table": "transaction_details",
        "destination_table_name": "transaction_details",
        "primary_key": "id",
        "limit": 500000,
        "incremental_key": ["added_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "transaction_types",
        "destination_table_name": "transaction_types",
        "primary_key": "code"
      }
      ]
    },
    {
      "type": process.env.DATA_PIPELINE_3_DATABASE_TYPE,
      "credentials": {
        "url": process.env.DATA_PIPELINE_3_DATABASE_URL,
      },
      "schema": [{
        "fields": [],
        "table": "audit_trail",
        "destination_table_name": "audit_trail",
        "primary_key": "id",
        "incremental_key": ["added_at"]
      },
      {
        "fields": [],
        "table": "failure_logs",
        "destination_table_name": "failure_logs",
        "primary_key": "id",
        "incremental_key": ["added_at"]
      },
      {
        "fields": [],
        "table": "pending_transactions",
        "destination_table_name": "pending_transactions",
        "primary_key": "id",
        "incremental_key": ["added_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "super_agent_admin_audit_trail",
        "destination_table_name": "super_agent_admin_audit_trail",
        "primary_key": "id",
        "incremental_key": ["added_at"]
      },
      {
        "fields": [],
        "table": "super_agent_audit_trail",
        "destination_table_name": "super_agent_audit_trail",
        "primary_key": "id",
        "incremental_key": ["added_at"]
      },
      {
        "fields": [],
        "table": "super_agents",
        "destination_table_name": "super_agents",
        "primary_key": "id",
        "incremental_key": ["added_at", "updated_at"]
      }]
    },
    {
      "type": process.env.DATA_PIPELINE_4_DATABASE_TYPE,
      "credentials": {
        "url": process.env.DATA_PIPELINE_4_DATABASE_URL,
      },
      "schema": [{
        "fields": [],
        "table": "agent_client_membership_transaction_record",
        "destination_table_name": "agent_client_membership_transaction_record",
        "primary_key": "id",
        "incremental_key": ["added_at"]
      },
      {
        "fields": [],
        "table": "agent_client_membership_transaction_tracking",
        "destination_table_name": "agent_client_membership_transaction_tracking",
        "primary_key": "id",
        "incremental_key": ["added_at",  "updated_at"]
      },
      {
        "fields": [],
        "table": "agent_payout_tracking_record",
        "destination_table_name": "agent_payout_tracking_record",
        "primary_key": "id",
        "incremental_key": ["added_at"]
      },
      {
        "fields": [],
        "table": "agent_pricing_payouts_model",
        "destination_table_name": "agent_pricing_payouts_model",
        "primary_key": "code"
      },
      {
        "fields": [],
        "table": "client_membership_insufficiency",
        "destination_table_name": "client_membership_insufficiency",
        "primary_key": "id",
        "incremental_key": ["added_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "client_membership_transaction_record",
        "destination_table_name": "client_membership_transaction_record",
        "primary_key": "id",
        "incremental_key": ["added_at", "updated_at"]
      },
      {
        "fields": [],
        "table": "client_membership_transaction_tracking",
        "destination_table_name": "client_membership_transaction_tracking",
        "primary_key": "id",
        "incremental_key": ["added_at", "updated_at"]
      },
        {
          "fields": [],
          "table": "client_withdrawal_charges_record",
          "destination_table_name": "client_withdrawal_charges_record",
          "primary_key": "id",
          "incremental_key": ["executed_at"]
        },
        {
          "fields": [],
          "table": "deposit_charges_baseline",
          "destination_table_name": "deposit_charges_baseline",
          "primary_key": "id",
          "incremental_key": ["added_at", "updated_at"]
        },
        {
          "fields": [],
          "table": "pricing_charges_model",
          "destination_table_name": "pricing_charges_model",
          "primary_key": "code",
        },
        {
          "fields": [],
          "table": "super_agent_agent_monthly_record",
          "destination_table_name": "super_agent_agent_monthly_record",
          "primary_key": "id",
          "incremental_key": ["added_at", "updated_at"]
        },
        {
          "fields": [],
          "table": "super_agent_payout_tracking_record",
          "destination_table_name": "super_agent_payout_tracking_record",
          "primary_key": "id",
          "incremental_key": ["added_at"]
        }, 
        {
          "fields": [],
          "table": "super_agent_pricing_payouts_model",
          "destination_table_name": "super_agent_pricing_payouts_model",
          "primary_key": "code",
        },
        {
          "fields": [],
          "table": "super_agent_transaction_record",
          "destination_table_name": "super_agent_transaction_record",
          "primary_key": "id",
          "incremental_key": ["added_at",]
        },
        {
          "fields": [],
          "table": "super_agent_transaction_tracking",
          "destination_table_name": "super_agent_transaction_tracking",
          "primary_key": "id",
          "incremental_key": ["added_at", "updated_at"]
        },
      ]
    }
  ],
  destination: {
    type: process.env.DATA_PIPELINE_DESTINATION_DATABASE_TYPE,
    projectId: process.env.DATA_PIPELINE_DESTINATION_DATABASE_PROJECT_ID,
    datasetId: process.env.DATA_PIPELINE_DESTINATION_DATABASE_DATASET_ID,
  }
};

module.exports = config;