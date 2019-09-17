class RemoveForeignKeyRoomsFromMessages < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :messages, :rooms
  end
end
