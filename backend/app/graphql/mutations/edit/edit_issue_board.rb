module Mutations
	class Edit::EditIssueBoard < GraphQL::Schema::Mutation
		include Authorize
		graphql_name "EditIssueBoard"
		argument :attributes, Types::Input::IssueBoardInputType, required: true
		argument :issue_board_id, ID, required: true, loads: IssueBoard

		field :issue_board, Types::IssueBoardType, null: true
		field :errors, [String], null: true

		def resolve(attributes:, issue_board:)
			(raise GraphQL::ExecutionError.new "No group with that id") if issue_board.nil?

			if issue_board.update(name: attributes.name)
				{
					issue_board: issue_board,
					errors: nil,
				}
			else
				{
					issue_board: nil,
					errors: issue_board.errors.full_messages,
				}
			end
		end

		def load_issue_board(id)
			IssueBoard.find(id)
		end

		private

		def authorized?(attributes:, issue_board:)
			issue_board_authorized?(issue_board.id, context);
		end
	end
end