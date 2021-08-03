require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Backend
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.1
    config.autoload_paths << "#{Rails.root}/lib" 
    Rails.autoloaders.main.ignore(Rails.root.join('//lib/x86_64-linux-gnu'))

    config.middleware.use ActionDispatch::Cookies
    config.api_only = true
    config.middleware.insert_before 0, Rack::Cors do
      allow do
         origins 'http://localhost:3000'
         resource '*', :headers => :any, :methods => [:get, :post, :options, :delete, :put, :patch], credentials: true
       end
    end 
  end
end
