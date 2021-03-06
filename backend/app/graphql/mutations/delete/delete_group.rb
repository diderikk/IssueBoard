module Mutations
	class Delete::DeleteGroup < GraphQL::Schema::Mutation
		include Authorize
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
			group_authorized?(nil, group_id, context);
		end

	end
end