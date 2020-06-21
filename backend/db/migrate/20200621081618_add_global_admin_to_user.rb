class AddGlobalAdminToUser < ActiveRecord::Migration[5.2]
    def change
        add_column :users, :global_admin, :boolean
    end
end
