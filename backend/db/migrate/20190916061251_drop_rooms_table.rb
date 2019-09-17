class DropRoomsTable < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :room_users, :rooms
    drop_table :room_users
    drop_table :rooms
  end
end
