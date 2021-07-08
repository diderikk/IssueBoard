module Mutations
	class Login < GraphQL::Schema::Mutation
		include Authentication

		graphql_name "Login"

		argument :email, String, required: true
		argument :password, String, required: true

		field :access_token, String, null: true
		field :user, Types::UserType, null: true
		field :errors, [String], null: true

		def resolve(email:, password:)
			user_token = authenticate(email, password, context[:cookies])
			
			{
				access_token: user_token["access_token"],
				user: user_token["user"],
				errors: user_token["access_token"].nil? ? ["Email or password is wrong"] : nil
			}

		end
	end
end