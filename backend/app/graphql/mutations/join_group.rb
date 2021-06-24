module Mutations
	class JoinGroup < GraphQL::Schema::Mutation
		graphql_name "JoinGroup"

		argument :email, String, required: true
		argument :group_id, ID, required: true, loads: Group

		field :errors, [String], null: true

		def resolve(email:, group:)
			# group = Group.find(group_id).users
			group.users << User.find_by(email: email)

			if group.save!
				{
					errors: nil
				}
			else
				{
					errors: group.errors.full_messages
				}
			end
		end
		
		def load_group(id)
  			Group.find(id)
		end

		private

		def authorized?(email:, group:)
			group.users.include? context[:current_user]
		end

		
	end
end