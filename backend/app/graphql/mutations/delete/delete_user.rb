module Mutations
	class Delete::DeleteUser < GraphQL::Schema::Mutation
		graphql_name "DeleteUser"
		argument :user_id, ID, required: true

		field :success, Boolean, null: false

		def resolve(user_id:)
			if User.destroy(user_id)
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end

		private

		def authorized?(user_id:)
			user_id == context[:current_user].id.to_s
		end

	end
end