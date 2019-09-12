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

ActiveRecord::Schema.define(version: 2019_08_07_165109) do

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
    t.integer "room_id", null: false
  end

  create_table "room_users", id: false, force: :cascade do |t|
    t.integer "room_id", null: false
    t.integer "user_id", null: false
    t.index ["room_id", "user_id"], name: "room_users_room_id_user_id_key", unique: true
  end

  create_table "rooms", id: :serial, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.datetime "created_at", null: false
    t.index ["name"], name: "rooms_name_key", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "nickname"
    t.string "client_token"
    t.boolean "registered"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "online"
  end

  add_foreign_key "messages", "rooms", name: "messages_room_id_fkey"
  add_foreign_key "room_users", "rooms", name: "room_users_room_id_fkey"
end
