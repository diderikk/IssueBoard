module Mutations
	class LeaveIssueBoard < GraphQL::Schema::Mutation
		graphql_name "LeaveIssueBoard"

		argument :issue_board_id, ID, required: true, loads: IssueBoard

		field :success, Boolean, null: false

		def resolve(issue_board:)
			return {success: false} if(issue_board.owner == context[:current_user] || !issue_board.group.nil?)
			issue_board.users.delete(context[:current_user])

			if issue_board.save!
				{
					success: true
				}
			else
				{
					success: false
				}
			end
		end
		
		def load_issue_board(id)
  			IssueBoard.joins(:users).find(id)
		end

		private

		def authorized?(issue_board:)
			issue_board.users.include? context[:current_user]
		end

		
	end
end