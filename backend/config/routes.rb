Rails.application.routes.draw do
  get '/user/:client_token', to: "users#by_client_token"
  post '/user/update_nickname', to: "users#update_nickname"

  # TODO update these to use GET
  get '/chat_room/:id/messages', to: "chat_room#messages"
  get '/chat_room/:id/users', to: "chat_room#users"
end
