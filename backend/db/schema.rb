# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_06_21_081928) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "chat_rooms", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
  end

  create_table "chat_rooms_and_users", force: :cascade do |t|
    t.integer "chat_room_id"
    t.integer "user_id"
    t.index ["chat_room_id", "user_id"], name: "index_chat_rooms_and_users_on_chat_room_id_and_user_id", unique: true
    t.index ["chat_room_id"], name: "index_chat_rooms_and_users_on_chat_room_id"
    t.index ["user_id"], name: "index_chat_rooms_and_users_on_user_id"
  end

  create_table "messages", id: :serial, force: :cascade do |t|
    t.string "text", limit: 255
    t.string "nickname", limit: 100, null: false
    t.datetime "created_at", null: false
    t.integer "user_id"
    t.integer "chat_room_id", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "nickname"
    t.string "client_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "online"
    t.string "email"
    t.string "password_digest"
    t.boolean "global_admin"
  end

end
