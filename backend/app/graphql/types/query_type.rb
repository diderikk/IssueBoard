module Types
	class QueryType < GraphQL::Schema::Object
		include Authentication

		field :users, [Types::UserType], null:true
		field :login, String, null: false do
			description "Login user return tokens"

			argument :email, String, required: true
			argument :password, String, required: true
		end

		field :current_user, Types::UserType, null: true do
			description "Returns currently logged in user"
		end


		def users
			User.all
		end

		def current_user
			logged_in_user(context[:request])
		end

		def login(email:, password:)
			access_token = authenticate(email, password)
			return access_token unless access_token.nil?

			raise GraphQL::ExecutionError.new "Email or password wrong"
		end
	end
end