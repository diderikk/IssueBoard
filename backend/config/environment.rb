# Load the Rails application.
require_relative "application"

env = File.join(Rails.root, 'config', 'config.properties.rb')
load(env) if File.exist?(env)

# Initialize the Rails application.
Rails.application.initialize!
