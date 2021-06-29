module Mutations
	class Delete::DeleteIssueBoard < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "DeleteIssueBoard"
		argument :issue_board_id, ID, required: true

		field :success, Boolean, null: false

		def resolve(issue_board_id:)
			if IssueBoard.destroy(issue_board_id)
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

		def authorized?(issue_board_id:)
			issue_board_authorized?(issue_board_id, context);
		end

	end
end