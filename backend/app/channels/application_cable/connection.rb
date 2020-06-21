module ApplicationCable
    class Connection < ActionCable::Connection::Base
        identified_by :current_user

        def connect
            user = User.find_or_create_by_client_token cookies[:client_token]
            self.current_user = user
        end

        def disconnect
            if self.current_user
                self.current_user.online = false
                self.current_user.save
            end
        end
    end
end
