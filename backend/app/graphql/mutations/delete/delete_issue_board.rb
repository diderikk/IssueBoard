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
			IssueBoard.find(issue_board_id).owner == context[:current_user]
		end

	end
end