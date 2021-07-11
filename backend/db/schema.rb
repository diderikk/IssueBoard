# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_06_27_144151) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "groups", force: :cascade do |t|
    t.string "name", null: false
    t.string "logo"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "issue_boards", force: :cascade do |t|
    t.string "name"
    t.bigint "group_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["group_id"], name: "index_issue_boards_on_group_id"
  end

  create_table "issue_boards_users", id: false, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "issue_board_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["issue_board_id"], name: "index_issue_boards_users_on_issue_board_id"
    t.index ["user_id"], name: "index_issue_boards_users_on_user_id"
  end

  create_table "issue_labels", force: :cascade do |t|
    t.string "name", null: false
    t.string "color"
    t.integer "order", null: false
    t.bigint "issue_board_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["issue_board_id"], name: "index_issue_labels_on_issue_board_id"
    t.index ["name", "issue_board_id"], name: "index_issue_labels_on_name_and_issue_board_id", unique: true
  end

  create_table "issues", force: :cascade do |t|
    t.integer "issue_id", null: false
    t.string "title", null: false
    t.string "description"
    t.datetime "due_date"
    t.integer "order", null: false
    t.bigint "issue_label_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["issue_id", "issue_label_id"], name: "index_issues_on_issue_id_and_issue_label_id", unique: true
    t.index ["issue_label_id"], name: "index_issues_on_issue_label_id"
  end

  create_table "members", force: :cascade do |t|
    t.boolean "accepted"
    t.bigint "user_id"
    t.bigint "group_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["group_id"], name: "index_members_on_group_id"
    t.index ["user_id", "group_id"], name: "index_members_on_user_id_and_group_id", unique: true
    t.index ["user_id"], name: "index_members_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest"
    t.integer "token_version", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "issue_boards", "groups"
  add_foreign_key "issue_boards_users", "issue_boards"
  add_foreign_key "issue_boards_users", "users"
  add_foreign_key "issue_labels", "issue_boards"
  add_foreign_key "issues", "issue_labels"
end
