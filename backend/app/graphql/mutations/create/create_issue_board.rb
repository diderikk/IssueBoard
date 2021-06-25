module Mutations
	class Create::CreateIssueBoard < GraphQL::Schema::Mutation
		graphql_name "CreateIssueBoard"
		argument :attributes, Types::Input::IssueBoardInputType, required: true

		field :issue_board, Types::IssueBoardType, null: true
		field :errors, [String], null: true

		def resolve(attributes:)
			issue_board = IssueBoard.new(name: attributes.name, group_id: attributes.group_id, user_id: attributes.user_id)

			if issue_board.save!
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
	end
end