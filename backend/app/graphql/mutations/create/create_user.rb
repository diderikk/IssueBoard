module Mutations
	class Create::CreateUser < GraphQL::Schema::Mutation
		graphql_name "CreateUser"
		argument :attributes, Types::Input::UserInputType, required: true

		field :user, Types::UserType, null: true
		field :access_token, String, null: true
		field :errors, [String], null: true

		def resolve(attributes:)
			user = User.new(name: attributes.name, email: attributes.email, password: attributes.password)
			if user.save!
				{
					user: user,
					access_token: nil,
					errors: nil,
				}
			else
				{
					user: nil,
					access_token: nil,
					errors: user.errors.full_messages,
				}
			end
		end
	end
end