module Mutations
	class Delete::DeleteIssueBoard < GraphQL::Schema::Mutation
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
			if User.joins(groups: :issue_boards).where(issue_boards: { id: issue_board_id }, members: { accepted: true }).exists?(context[:current_user].id)
				super
			elsif User.joins(:issue_boards).where(issue_boards: {id: issue_board_id }).exists?(context[:current_user].id)
				super
			end
		end

	end
end