module Mutations
	class Create::CreateIssueBoard < GraphQL::Schema::Mutation
		graphql_name "CreateIssueBoard"
		argument :attributes, Types::Input::IssueBoardInputType, required: true

		field :issue_board, Types::IssueBoardType, null: true
		field :errors, [String], null: true

		def resolve(attributes:)
			issue_board = IssueBoard.new(name: attributes.name, group_id: attributes.group_id)
			
			if(!attributes.group_id)
				issue_board.users << context[:current_user]
			end

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

		private

		def authorized?(attributes:)
			if(attributes.group_id)
				return super && User.joins(:groups).where(groups: {id: attributes.group_id}, members: { accepted: true }).exists?(context[:current_user].id)
			end
			return true
		end
	end
end