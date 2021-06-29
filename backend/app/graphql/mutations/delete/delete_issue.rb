module Mutations
	class Delete::DeleteIssue < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "DeleteIssue"
		argument :issue_id, ID, required: true

		field :success, Boolean, null: false

		def resolve(issue_id:)
			if Issue.destroy(issue_id)
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

		def authorized?(issue_id:)
			issue_authorized?(issue_id, context);
		end

	end
end