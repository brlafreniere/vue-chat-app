Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'vue-chat-app.lizardgizzards.com', 'lab.lizardgizzards.com:4000'
	resource '*',
	  headers: :any,
	  methods: %i(get post put patch delete options head)
  end
end
