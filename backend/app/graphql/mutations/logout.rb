module Mutations
	class Logout < GraphQL::Schema::Mutation
		include Authentication

		graphql_name "Logout"

		field :success, Boolean, null: false

		def resolve()
			logout(context[:cookies]);
			{
				success: true
			}

		end
	end
end