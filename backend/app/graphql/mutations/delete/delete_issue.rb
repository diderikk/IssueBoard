module Mutations
	class Delete::DeleteIssue < GraphQL::Schema::Mutation
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
			issue_board = IssueBoard.joins(issue_labels: :issues).where(issues: {id: issue_id }).take
			super && Types::IssueBoardType.authorized?(issue_board, context)
		end

	end
end