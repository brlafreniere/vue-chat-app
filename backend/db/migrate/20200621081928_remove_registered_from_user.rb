class RemoveRegisteredFromUser < ActiveRecord::Migration[5.2]
    def change
        remove_column :users, :registered
    end
end
