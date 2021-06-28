module Mutations
	class Delete::DeleteGroup < GraphQL::Schema::Mutation
		graphql_name "DeleteGroup"
		argument :group_id, ID, required: true

		field :success, Boolean, null: false

		def resolve(group_id:)
			if Group.destroy(group_id)
				{
					success: true
				}
			else
				{
					succes: false
				}
			end
		end

		private

		def authorized?(group_id:)
			Group.find(group_id).users.where(members: {accepted: true}).include? context[:current_user]
		end

	end
end